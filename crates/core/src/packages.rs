//! Data-only offline packages. Trust is pinned to exact release bytes in this build.
//! No scripts, executables, archive extraction or package-supplied paths are accepted.
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::{
    collections::HashSet,
    fs,
    io::{Read, Write},
    path::{Path, PathBuf},
};

pub const MAX_PACKAGE_BYTES: u64 = 256 * 1024;
pub const BUILTIN: &[u8] =
    include_bytes!("../../../packages/offline/writer-starters.librerary.json");
const TRUST: &str = include_str!("../../../packages/offline/trusted.json");

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(deny_unknown_fields)]
pub struct Template {
    pub id: String,
    pub title: String,
    pub description: String,
    pub content: String,
}
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(deny_unknown_fields)]
pub struct Dependency {
    pub id: String,
    pub requirement: String,
}
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(deny_unknown_fields)]
pub struct ContentPackage {
    pub schema: u32,
    pub id: String,
    pub name: String,
    pub version: String,
    pub kind: String,
    pub host_api: u32,
    pub platform: String,
    pub dependencies: Vec<Dependency>,
    pub templates: Vec<Template>,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct TrustedRelease {
    pub id: String,
    pub version: String,
    pub sha256: String,
}

pub fn trusted_releases() -> Vec<TrustedRelease> {
    serde_json::from_str(TRUST).expect("build-time trust catalog")
}
pub fn digest(bytes: &[u8]) -> String {
    format!("{:x}", Sha256::digest(bytes))
}
fn valid_id(id: &str) -> bool {
    !id.is_empty()
        && id.len() <= 64
        && id
            .bytes()
            .all(|b| b.is_ascii_lowercase() || b.is_ascii_digit() || b == b'-')
}

pub fn verify(bytes: &[u8], trusted: &[TrustedRelease]) -> Result<ContentPackage, String> {
    if bytes.len() as u64 > MAX_PACKAGE_BYTES {
        return Err("Package exceeds 256 KB".into());
    }
    // Verify exact package bytes before interpreting the manifest or content.
    let hash = digest(bytes);
    let release = trusted
        .iter()
        .find(|r| r.sha256 == hash)
        .ok_or("Package is unknown or modified; no trusted release matches its SHA-256")?;
    let package: ContentPackage =
        serde_json::from_slice(bytes).map_err(|e| format!("Invalid package: {e}"))?;
    if package.id != release.id || package.version != release.version || !valid_id(&package.id) {
        return Err("Package identity does not match trusted release".into());
    }
    if package.schema != 1
        || package.host_api != 1
        || package.kind != "writer-templates"
        || package.platform != "any"
    {
        return Err("Unsupported package schema, API, kind or platform".into());
    }
    semver::Version::parse(&package.version).map_err(|_| "Invalid package version")?;
    if package.name.trim().is_empty()
        || package.name.len() > 120
        || package.templates.is_empty()
        || package.templates.len() > 32
    {
        return Err("Invalid package name or template count".into());
    }
    let mut deps = HashSet::new();
    for dep in &package.dependencies {
        let requirement = semver::VersionReq::parse(&dep.requirement)
            .map_err(|_| "Invalid dependency requirement")?;
        if dep.id != "writer-text"
            || !deps.insert(&dep.id)
            || !requirement.matches(&semver::Version::new(0, 1, 0))
        {
            return Err("Package dependency is not satisfied by this launcher".into());
        }
    }
    if !deps.contains(&"writer-text".to_string()) {
        return Err("Writer template packages must declare writer-text dependency".into());
    }
    let mut ids = HashSet::new();
    for template in &package.templates {
        if !valid_id(&template.id)
            || !ids.insert(&template.id)
            || template.title.trim().is_empty()
            || template.title.len() > 512
            || template.title.chars().any(char::is_control)
            || template.description.len() > 300
            || template.content.len() > 64 * 1024
        {
            return Err("Invalid or duplicate template".into());
        }
    }
    Ok(package)
}

pub struct PackageStore {
    root: PathBuf,
}

fn reject_link(path: &Path) -> Result<(), String> {
    let metadata = fs::symlink_metadata(path).map_err(|e| e.to_string())?;
    if metadata.file_type().is_symlink() {
        return Err("Package paths must not be symlinks".into());
    }
    #[cfg(windows)]
    {
        use std::os::windows::fs::MetadataExt;
        if metadata.file_attributes() & 0x400 != 0 {
            return Err("Package paths must not be reparse points".into());
        }
    }
    Ok(())
}
impl PackageStore {
    pub fn new(root: PathBuf) -> Self {
        Self {
            root: root.join("content-packages"),
        }
    }
    fn ensure_root(&self) -> Result<(), String> {
        fs::create_dir_all(&self.root).map_err(|e| e.to_string())?;
        reject_link(&self.root)
    }
    pub fn list(&self) -> Result<Vec<ContentPackage>, String> {
        if !self.root.try_exists().map_err(|e| e.to_string())? {
            return Ok(vec![]);
        }
        self.ensure_root()?;
        let mut packages = vec![];
        for release in trusted_releases() {
            let path = self.root.join(format!("{}.json", release.id));
            if !path.try_exists().map_err(|e| e.to_string())? {
                continue;
            }
            let bytes = read_bounded(&path)?;
            let package = verify(&bytes, &trusted_releases())?;
            if package.id != release.id {
                return Err("Installed package identity does not match its slot".into());
            }
            if !packages.iter().any(|p: &ContentPackage| p.id == package.id) {
                packages.push(package);
            }
        }
        packages.sort_by(|a, b| a.id.cmp(&b.id));
        Ok(packages)
    }
    pub fn install(&self, bytes: &[u8]) -> Result<Vec<ContentPackage>, String> {
        let package = verify(bytes, &trusted_releases())?;
        self.ensure_root()?;
        let destination = self.root.join(format!("{}.json", package.id));
        // One verified file = one transaction. Old installed bytes survive every pre-commit failure.
        let mut stage = tempfile::NamedTempFile::new_in(&self.root).map_err(|e| e.to_string())?;
        stage.write_all(bytes).map_err(|e| e.to_string())?;
        stage.as_file().sync_all().map_err(|e| e.to_string())?;
        stage.persist(&destination).map_err(|e| e.to_string())?;
        self.list()
    }
    pub fn uninstall(&self, id: &str) -> Result<Vec<ContentPackage>, String> {
        if !valid_id(id) || !trusted_releases().iter().any(|r| r.id == id) {
            return Err("Unknown package ID".into());
        }
        if !self.root.try_exists().map_err(|e| e.to_string())? {
            return Ok(vec![]);
        }
        self.ensure_root()?;
        let path = self.root.join(format!("{id}.json"));
        if path.try_exists().map_err(|e| e.to_string())? {
            fs::remove_file(path).map_err(|e| e.to_string())?;
        }
        // No code path in this store references workspace state or exported documents.
        self.list()
    }
}

pub fn read_bounded(path: &Path) -> Result<Vec<u8>, String> {
    reject_link(path)?;
    let file = fs::File::open(path).map_err(|e| e.to_string())?;
    if !file.metadata().map_err(|e| e.to_string())?.is_file() {
        return Err("Package must be a regular file".into());
    }
    let mut bytes = vec![];
    file.take(MAX_PACKAGE_BYTES + 1)
        .read_to_end(&mut bytes)
        .map_err(|e| e.to_string())?;
    if bytes.len() as u64 > MAX_PACKAGE_BYTES {
        return Err("Package exceeds 256 KB".into());
    }
    Ok(bytes)
}

#[cfg(test)]
mod tests {
    use super::*;
    fn test_trust(package: &ContentPackage) -> (Vec<u8>, Vec<TrustedRelease>) {
        let bytes = serde_json::to_vec(package).unwrap();
        let trust = vec![TrustedRelease {
            id: package.id.clone(),
            version: package.version.clone(),
            sha256: digest(&bytes),
        }];
        (bytes, trust)
    }
    #[test]
    fn builtin_hash_and_templates_are_valid() {
        let p = verify(BUILTIN, &trusted_releases()).unwrap();
        assert_eq!(p.templates.len(), 3);
    }
    #[test]
    fn tampering_is_refused_before_install_and_previous_pack_survives() {
        let temp = tempfile::tempdir().unwrap();
        let store = PackageStore::new(temp.path().into());
        store.install(BUILTIN).unwrap();
        let mut altered = BUILTIN.to_vec();
        altered.push(b' ');
        assert!(store.install(&altered).is_err());
        assert_eq!(store.list().unwrap().len(), 1);
        assert!(verify(b"{}", &trusted_releases()).is_err());
    }
    #[test]
    fn uninstall_preserves_unicode_projects_and_exports() {
        let temp = tempfile::tempdir().unwrap();
        let store = PackageStore::new(temp.path().into());
        let mut state = crate::State::default();
        state.documents.push(crate::Document {
            id: "keep".into(),
            title: "Keep".into(),
            content: "音楽".into(),
            updated_at: 1,
        });
        let workspace = crate::Store::new(temp.path().into());
        workspace.save(&state).unwrap();
        let external = temp.path().join("export.txt");
        fs::write(&external, "preserve").unwrap();
        store.install(BUILTIN).unwrap();
        assert_eq!(
            PackageStore::new(temp.path().into()).list().unwrap().len(),
            1
        );
        assert!(store.uninstall("writer-starters").unwrap().is_empty());
        assert_eq!(workspace.load().unwrap(), state);
        assert_eq!(fs::read_to_string(external).unwrap(), "preserve");
    }
    #[test]
    fn path_ids_and_unknown_uninstall_are_refused() {
        let temp = tempfile::tempdir().unwrap();
        let store = PackageStore::new(temp.path().into());
        for id in [
            "../state",
            "writer-starters/../../state",
            "C:\\test",
            "unknown",
        ] {
            assert!(store.uninstall(id).is_err());
        }
    }
    #[test]
    fn compatibility_dependencies_and_schema_rejected_even_when_hash_is_trusted() {
        let p = verify(BUILTIN, &trusted_releases()).unwrap();
        for variant in 0..7 {
            let mut changed = p.clone();
            match variant {
                0 => changed.host_api = 2,
                1 => changed.schema = 99,
                2 => changed.kind = "executable".into(),
                3 => changed.platform = "unsupported".into(),
                4 => changed.dependencies[0].requirement = ">=9.0.0".into(),
                5 => changed.dependencies.clear(),
                _ => changed.templates[0].id = "../escape".into(),
            };
            let (bytes, trust) = test_trust(&changed);
            assert!(verify(&bytes, &trust).is_err());
        }
    }
    #[test]
    fn duplicate_templates_and_large_packages_are_refused() {
        let mut p = verify(BUILTIN, &trusted_releases()).unwrap();
        p.templates.push(p.templates[0].clone());
        let (bytes, trust) = test_trust(&p);
        assert!(verify(&bytes, &trust).is_err());
        assert!(verify(
            &vec![0; MAX_PACKAGE_BYTES as usize + 1],
            &trusted_releases()
        )
        .is_err());
    }
    #[test]
    fn corrupted_installed_pack_is_not_loaded_as_valid_templates() {
        let temp = tempfile::tempdir().unwrap();
        let store = PackageStore::new(temp.path().into());
        store.install(BUILTIN).unwrap();
        fs::write(
            temp.path().join("content-packages/writer-starters.json"),
            "broken",
        )
        .unwrap();
        assert!(store.list().is_err());
        store.install(BUILTIN).unwrap();
        assert_eq!(store.list().unwrap().len(), 1);
    }
}
