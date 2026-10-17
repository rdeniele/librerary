use serde::{Deserialize, Serialize};
pub mod instance;
pub mod packages;
use std::{
    collections::HashSet,
    fs,
    io::{Read, Write},
    path::{Path, PathBuf},
};

pub const STATE_VERSION: u32 = 1;
pub const MAX_DOCUMENTS: usize = 1000;
pub const MAX_CONTENT_BYTES: usize = 2 * 1024 * 1024;
pub const MAX_STATE_BYTES: u64 = 32 * 1024 * 1024;

#[derive(Debug, Clone, Serialize)]
pub struct Module {
    pub id: &'static str,
    pub name: &'static str,
    pub description: &'static str,
    pub available: bool,
}
pub fn catalog() -> Vec<Module> {
    [
        ("writer", "Writer", "Local text projects"),
        ("sheets", "Sheets", "Spreadsheets"),
        ("slides", "Slides", "Presentations"),
        ("pdf", "PDF", "PDF tools"),
        ("design", "Design", "Visual design"),
        ("photo", "Photo", "Photo editing"),
        ("vector", "Vector", "Vector graphics"),
        ("studio", "Studio", "Music production"),
        ("video", "Video", "Video editing"),
        ("motion", "Motion", "Animation"),
        ("audio", "Audio", "Audio editing"),
        ("publish", "Publish", "Page publishing"),
        ("3d", "3D", "Optional 3D creation"),
    ]
    .into_iter()
    .map(|(id, name, description)| Module {
        id,
        name,
        description,
        available: id == "writer",
    })
    .collect()
}
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(deny_unknown_fields)]
pub struct Settings {
    pub theme: String,
    pub pinned: Vec<String>,
}
impl Default for Settings {
    fn default() -> Self {
        Self {
            theme: "system".into(),
            pinned: vec!["writer".into()],
        }
    }
}
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(deny_unknown_fields)]
pub struct Document {
    pub id: String,
    pub title: String,
    pub content: String,
    pub updated_at: u64,
}
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Default)]
#[serde(deny_unknown_fields)]
pub struct State {
    pub settings: Settings,
    pub documents: Vec<Document>,
}
#[derive(Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
struct Envelope {
    version: u32,
    state: State,
}
impl State {
    pub fn validate(&self) -> Result<(), String> {
        if !["system", "light", "dark"].contains(&self.settings.theme.as_str()) {
            return Err("Unsupported theme".into());
        }
        let modules = catalog();
        let mut pins = HashSet::new();
        if self.settings.pinned.len() > modules.len() {
            return Err("Too many pinned modules".into());
        }
        for pin in &self.settings.pinned {
            if !modules.iter().any(|m| m.id == pin) || !pins.insert(pin) {
                return Err("Invalid or duplicate pinned module".into());
            }
        }
        if self.documents.len() > MAX_DOCUMENTS {
            return Err("Too many documents".into());
        }
        let mut ids = HashSet::new();
        for doc in &self.documents {
            if doc.id.is_empty()
                || doc.id.len() > 80
                || !doc
                    .id
                    .bytes()
                    .all(|b| b.is_ascii_alphanumeric() || b == b'-' || b == b'_')
                || !ids.insert(&doc.id)
            {
                return Err("Invalid or duplicate document ID".into());
            }
            if doc.title.trim().is_empty()
                || doc.title.len() > 512
                || doc.title.chars().any(char::is_control)
            {
                return Err("Invalid document title".into());
            }
            if doc.content.len() > MAX_CONTENT_BYTES {
                return Err("Document content exceeds limit".into());
            }
        }
        Ok(())
    }
}

pub struct Store {
    root: PathBuf,
}
impl Store {
    pub fn new(root: PathBuf) -> Self {
        Self { root }
    }
    pub fn load(&self) -> Result<State, String> {
        let primary = self.root.join("state.json");
        let backup = self.root.join("state.json.bak");
        if !primary.try_exists().map_err(|e| e.to_string())?
            && !backup.try_exists().map_err(|e| e.to_string())?
        {
            return Ok(State::default());
        }
        match read_state(&primary) {
            Ok(state) => Ok(state),
            Err(primary_error) => {
                // Future versions must never be replaced by an older backup.
                if primary_error.starts_with("Unsupported state version") {
                    return Err(primary_error);
                }
                read_state(&backup).map_err(|backup_error| format!("State could not be loaded: {primary_error}; backup: {backup_error}. Existing files preserved."))
            }
        }
    }
    pub fn save(&self, state: &State) -> Result<(), String> {
        state.validate()?;
        let bytes = serde_json::to_vec_pretty(&Envelope {
            version: STATE_VERSION,
            state: state.clone(),
        })
        .map_err(|e| e.to_string())?;
        if bytes.len() as u64 > MAX_STATE_BYTES {
            return Err("State exceeds storage limit".into());
        }
        fs::create_dir_all(&self.root).map_err(|e| e.to_string())?;
        let primary = self.root.join("state.json");
        if primary.try_exists().map_err(|e| e.to_string())? {
            match read_state(&primary) {
                Ok(previous) => {
                    let backup_bytes = serde_json::to_vec_pretty(&Envelope {
                        version: STATE_VERSION,
                        state: previous,
                    })
                    .map_err(|e| e.to_string())?;
                    atomic_write(&self.root, &self.root.join("state.json.bak"), &backup_bytes)?;
                }
                Err(error) if error.starts_with("Unsupported state version") => return Err(error),
                Err(error) => {
                    // Only repair a corrupt primary when a verified backup exists.
                    read_state(&self.root.join("state.json.bak"))
                        .map_err(|_| format!("Refusing to overwrite corrupt state: {error}"))?;
                }
            }
        } else if self
            .root
            .join("state.json.bak")
            .try_exists()
            .map_err(|e| e.to_string())?
        {
            read_state(&self.root.join("state.json.bak"))?;
        }
        atomic_write(&self.root, &primary, &bytes)
    }
}
fn read_state(path: &Path) -> Result<State, String> {
    let file = fs::File::open(path).map_err(|e| e.to_string())?;
    if file.metadata().map_err(|e| e.to_string())?.len() > MAX_STATE_BYTES {
        return Err("State exceeds storage limit".into());
    }
    let mut bytes = Vec::new();
    file.take(MAX_STATE_BYTES + 1)
        .read_to_end(&mut bytes)
        .map_err(|e| e.to_string())?;
    if bytes.len() as u64 > MAX_STATE_BYTES {
        return Err("State exceeds storage limit".into());
    }
    let value: serde_json::Value = serde_json::from_slice(&bytes).map_err(|e| e.to_string())?;
    if let Some(version) = value.get("version").and_then(|v| v.as_u64()) {
        if version != u64::from(STATE_VERSION) {
            return Err(format!("Unsupported state version {version}"));
        }
    }
    let envelope: Envelope = serde_json::from_value(value).map_err(|e| e.to_string())?;
    if envelope.version != STATE_VERSION {
        return Err(format!("Unsupported state version {}", envelope.version));
    }
    envelope.state.validate()?;
    Ok(envelope.state)
}
fn atomic_write(root: &Path, destination: &Path, bytes: &[u8]) -> Result<(), String> {
    let mut temporary = tempfile::NamedTempFile::new_in(root).map_err(|e| e.to_string())?;
    temporary.write_all(bytes).map_err(|e| e.to_string())?;
    temporary.as_file().sync_all().map_err(|e| e.to_string())?;
    temporary.persist(destination).map_err(|e| e.to_string())?;
    #[cfg(unix)]
    fs::File::open(root)
        .and_then(|dir| dir.sync_all())
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    fn example() -> State {
        State {
            documents: vec![Document {
                id: "doc-1".into(),
                title: "你好 · Café".into(),
                content: "Line 1\n🎵 Ελληνικά".into(),
                updated_at: 42,
            }],
            ..State::default()
        }
    }
    #[test]
    fn fresh_and_unicode_roundtrip() {
        let dir = tempfile::tempdir().unwrap();
        let store = Store::new(dir.path().into());
        assert_eq!(store.load().unwrap(), State::default());
        let state = example();
        store.save(&state).unwrap();
        assert_eq!(Store::new(dir.path().into()).load().unwrap(), state);
    }
    #[test]
    fn corrupt_primary_recovers_previous_save() {
        let dir = tempfile::tempdir().unwrap();
        let store = Store::new(dir.path().into());
        let original = example();
        store.save(&original).unwrap();
        store.save(&State::default()).unwrap();
        fs::write(dir.path().join("state.json"), "broken").unwrap();
        assert_eq!(store.load().unwrap(), original);
        store.save(&original).unwrap();
        assert_eq!(store.load().unwrap(), original);
    }
    #[test]
    fn unrecoverable_corruption_is_preserved() {
        let dir = tempfile::tempdir().unwrap();
        let store = Store::new(dir.path().into());
        fs::write(dir.path().join("state.json"), "broken").unwrap();
        assert!(store.load().is_err());
        assert!(store.save(&example()).is_err());
        assert_eq!(
            fs::read_to_string(dir.path().join("state.json")).unwrap(),
            "broken"
        );
    }
    #[test]
    fn backup_recovers_missing_primary() {
        let dir = tempfile::tempdir().unwrap();
        let store = Store::new(dir.path().into());
        store.save(&example()).unwrap();
        store.save(&State::default()).unwrap();
        fs::remove_file(dir.path().join("state.json")).unwrap();
        assert_eq!(store.load().unwrap(), example());
    }
    #[test]
    fn unknown_version_refuses_backup_and_save() {
        let dir = tempfile::tempdir().unwrap();
        let store = Store::new(dir.path().into());
        store.save(&example()).unwrap();
        store.save(&State::default()).unwrap();
        let bytes = serde_json::to_vec(&Envelope {
            version: 99,
            state: State::default(),
        })
        .unwrap();
        fs::write(dir.path().join("state.json"), &bytes).unwrap();
        assert!(store.load().unwrap_err().contains("version 99"));
        assert!(store.save(&example()).is_err());
        assert_eq!(fs::read(dir.path().join("state.json")).unwrap(), bytes);
    }
    #[test]
    fn ids_titles_and_duplicate_ids_are_validated() {
        for id in ["../escape", "a/b", "a\\b", "", "."] {
            let mut state = example();
            state.documents[0].id = id.into();
            assert!(state.validate().is_err());
        }
        let mut state = example();
        state.documents.push(state.documents[0].clone());
        assert!(state.validate().is_err());
        for title in [" ", "bad\nname"] {
            let mut state = example();
            state.documents[0].title = title.into();
            assert!(state.validate().is_err());
        }
    }
    #[test]
    fn limits_and_settings_are_validated() {
        let mut state = example();
        state.documents[0].content = "x".repeat(MAX_CONTENT_BYTES + 1);
        assert!(state.validate().is_err());
        let mut state = example();
        state.settings.theme = "unexpected".into();
        assert!(state.validate().is_err());
        state.settings.theme = "dark".into();
        state.settings.pinned = vec!["writer".into(), "writer".into()];
        assert!(state.validate().is_err());
        state.settings.pinned = vec!["missing".into()];
        assert!(state.validate().is_err());
        state.settings.pinned = vec!["studio".into()];
        assert!(state.validate().is_ok());
    }
    #[test]
    fn catalog_has_thirteen_unique_modules_only_writer_available() {
        let modules = catalog();
        assert_eq!(modules.len(), 13);
        assert_eq!(
            modules.iter().map(|m| m.id).collect::<HashSet<_>>().len(),
            13
        );
        assert_eq!(
            modules
                .iter()
                .filter(|m| m.available)
                .map(|m| m.id)
                .collect::<Vec<_>>(),
            vec!["writer"]
        );
    }
}
