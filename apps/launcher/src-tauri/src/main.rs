#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use librerary_core::{
    instance::InstanceGuard,
    packages::{self, ContentPackage, PackageStore},
    State, Store,
};
use std::{
    path::PathBuf,
    sync::{Arc, Mutex},
};
use tauri::Manager;

struct Workspace {
    store: Arc<Mutex<Store>>,
    packages: Arc<Mutex<PackageStore>>,
    _guard: InstanceGuard,
}

#[tauri::command]
async fn load_workspace(workspace: tauri::State<'_, Workspace>) -> Result<State, String> {
    let store = workspace.store.clone();
    tauri::async_runtime::spawn_blocking(move || {
        store
            .lock()
            .map_err(|_| "Workspace lock unavailable".to_string())?
            .load()
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
async fn save_workspace(
    state: State,
    workspace: tauri::State<'_, Workspace>,
) -> Result<(), String> {
    let store = workspace.store.clone();
    tauri::async_runtime::spawn_blocking(move || {
        store
            .lock()
            .map_err(|_| "Workspace lock unavailable".to_string())?
            .save(&state)
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
async fn list_content_packages(
    workspace: tauri::State<'_, Workspace>,
) -> Result<Vec<ContentPackage>, String> {
    let store = workspace.packages.clone();
    tauri::async_runtime::spawn_blocking(move || {
        store
            .lock()
            .map_err(|_| "Package lock unavailable".to_string())?
            .list()
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
async fn install_starter_package(
    workspace: tauri::State<'_, Workspace>,
) -> Result<Vec<ContentPackage>, String> {
    let store = workspace.packages.clone();
    tauri::async_runtime::spawn_blocking(move || {
        store
            .lock()
            .map_err(|_| "Package lock unavailable".to_string())?
            .install(packages::BUILTIN)
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
async fn install_package_file(
    app: tauri::AppHandle,
    workspace: tauri::State<'_, Workspace>,
) -> Result<Option<Vec<ContentPackage>>, String> {
    use tauri_plugin_dialog::DialogExt;
    let path = app
        .dialog()
        .file()
        .add_filter("Librerary content package", &["json"])
        .blocking_pick_file();
    let Some(path) = path else {
        return Ok(None);
    };
    let path = path.into_path().map_err(|e| e.to_string())?;
    let store = workspace.packages.clone();
    tauri::async_runtime::spawn_blocking(move || {
        let bytes = packages::read_bounded(&path)?;
        store
            .lock()
            .map_err(|_| "Package lock unavailable".to_string())?
            .install(&bytes)
            .map(Some)
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
async fn remove_content_package(
    id: String,
    workspace: tauri::State<'_, Workspace>,
) -> Result<Vec<ContentPackage>, String> {
    let store = workspace.packages.clone();
    tauri::async_runtime::spawn_blocking(move || {
        store
            .lock()
            .map_err(|_| "Package lock unavailable".to_string())?
            .uninstall(&id)
    })
    .await
    .map_err(|e| e.to_string())?
}

fn write_export(path: PathBuf, content: String) -> Result<(), String> {
    use std::io::Write;
    let parent = path.parent().ok_or("Invalid destination")?;
    let mut file = tempfile::NamedTempFile::new_in(parent).map_err(|e| e.to_string())?;
    file.write_all(content.as_bytes())
        .map_err(|e| e.to_string())?;
    file.as_file().sync_all().map_err(|e| e.to_string())?;
    file.persist(&path).map_err(|e| e.to_string())?;
    Ok(())
}

// The path comes from a native save dialog in Rust, never a webview path argument.
#[tauri::command]
async fn export_text(app: tauri::AppHandle, content: String) -> Result<bool, String> {
    use tauri_plugin_dialog::DialogExt;
    if content.len() > 2 * 1024 * 1024 {
        return Err("Text exceeds the 2 MB foundation limit".into());
    }
    let path = app
        .dialog()
        .file()
        .add_filter("Plain text", &["txt"])
        .set_file_name("Untitled.txt")
        .blocking_save_file();
    let Some(path) = path else {
        return Ok(false);
    };
    let path = path.into_path().map_err(|e| e.to_string())?;
    tauri::async_runtime::spawn_blocking(move || write_export(path, content))
        .await
        .map_err(|e| e.to_string())??;
    Ok(true)
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            let root = std::env::var_os("LIBRERARY_DATA_DIR")
                .map(std::path::PathBuf::from)
                .unwrap_or(app.path().app_local_data_dir()?);
            let guard = match InstanceGuard::acquire(&root) {
                Ok(guard) => guard,
                Err(error) => {
                    use tauri_plugin_dialog::DialogExt;
                    app.dialog()
                        .message(&error)
                        .title("Librerary workspace in use")
                        .blocking_show();
                    return Err(error.into());
                }
            };
            app.manage(Workspace {
                store: Arc::new(Mutex::new(Store::new(root.clone()))),
                packages: Arc::new(Mutex::new(PackageStore::new(root))),
                _guard: guard,
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            load_workspace,
            save_workspace,
            export_text,
            list_content_packages,
            install_starter_package,
            install_package_file,
            remove_content_package
        ])
        .run(tauri::generate_context!())
        .expect("Unable to start Librerary");
}
