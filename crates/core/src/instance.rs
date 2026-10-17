use std::{
    fs::{self, File, OpenOptions},
    path::Path,
};

/// Keep this guard alive for the full workspace session. OS releases it on crash.
pub struct InstanceGuard {
    _file: File,
}
impl InstanceGuard {
    pub fn acquire(root: &Path) -> Result<Self, String> {
        fs::create_dir_all(root).map_err(|e| e.to_string())?;
        let file = OpenOptions::new()
            .read(true)
            .write(true)
            .create(true)
            .truncate(false)
            .open(root.join("workspace.lock"))
            .map_err(|e| e.to_string())?;
        file.try_lock().map_err(|_| {
            "This workspace is already open in another Librerary instance".to_string()
        })?;
        Ok(Self { _file: file })
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn duplicate_writer_is_refused_and_lock_released_on_drop() {
        let root = tempfile::tempdir().unwrap();
        let first = InstanceGuard::acquire(root.path()).unwrap();
        assert!(InstanceGuard::acquire(root.path()).is_err());
        drop(first);
        assert!(InstanceGuard::acquire(root.path()).is_ok());
    }
    #[test]
    fn independent_workspaces_do_not_block_each_other() {
        let a = tempfile::tempdir().unwrap();
        let b = tempfile::tempdir().unwrap();
        let _a = InstanceGuard::acquire(a.path()).unwrap();
        let _b = InstanceGuard::acquire(b.path()).unwrap();
    }
}
