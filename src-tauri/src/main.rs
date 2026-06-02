// Markdown Studio X - Tauri 2 Backend
// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use std::path::PathBuf;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct FileEntry {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
    pub size: u64,
    pub modified: u64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct WorkspaceConfig {
    pub name: String,
    pub path: String,
    pub enable_git: bool,
    pub enable_ai: bool,
}

/// Read file contents
#[tauri::command]
fn read_file(path: String) -> Result<String, String> {
    fs::read_to_string(&path).map_err(|e| format!("Failed to read file: {}", e))
}

/// Write file contents
#[tauri::command]
fn write_file(path: String, content: String) -> Result<(), String> {
    fs::write(&path, content).map_err(|e| format!("Failed to write file: {}", e))
}

/// List directory contents
#[tauri::command]
fn list_directory(path: String) -> Result<Vec<FileEntry>, String> {
    let dir = PathBuf::from(&path);
    if !dir.is_dir() {
        return Err(format!("Not a directory: {}", path));
    }

    let entries = fs::read_dir(&dir)
        .map_err(|e| format!("Failed to read directory: {}", e))?
        .filter_map(|entry| entry.ok())
        .filter_map(|entry| {
            let metadata = entry.metadata().ok()?;
            let name = entry.file_name().to_string_lossy().to_string();
            // Skip hidden files and .studio
            if name.starts_with('.') {
                return None;
            }
            Some(FileEntry {
                name,
                path: entry.path().to_string_lossy().to_string(),
                is_dir: metadata.is_dir(),
                size: metadata.len(),
                modified: metadata
                    .modified()
                    .ok()
                    .and_then(|t| t.duration_since(std::time::UNIX_EPOCH).ok())
                    .map(|d| d.as_secs())
                    .unwrap_or(0),
            })
        })
        .collect();

    Ok(entries)
}

/// Create a new file
#[tauri::command]
fn create_file(path: String, content: Option<String>) -> Result<(), String> {
    let content = content.unwrap_or_default();
    // Ensure parent directory exists
    if let Some(parent) = PathBuf::from(&path).parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("Failed to create parent directory: {}", e))?;
    }
    fs::write(&path, content).map_err(|e| format!("Failed to create file: {}", e))
}

/// Create a new directory
#[tauri::command]
fn create_directory(path: String) -> Result<(), String> {
    fs::create_dir_all(&path).map_err(|e| format!("Failed to create directory: {}", e))
}

/// Delete a file or directory
#[tauri::command]
fn delete_path(path: String) -> Result<(), String> {
    let p = PathBuf::from(&path);
    if p.is_dir() {
        fs::remove_dir_all(&path).map_err(|e| format!("Failed to remove directory: {}", e))
    } else {
        fs::remove_file(&path).map_err(|e| format!("Failed to remove file: {}", e))
    }
}

/// Rename a file or directory
#[tauri::command]
fn rename_path(old_path: String, new_path: String) -> Result<(), String> {
    fs::rename(&old_path, &new_path).map_err(|e| format!("Failed to rename: {}", e))
}

/// Check if a path exists
#[tauri::command]
fn path_exists(path: String) -> bool {
    PathBuf::from(&path).exists()
}

/// Get workspace statistics
#[tauri::command]
fn get_workspace_stats(path: String) -> Result<serde_json::Value, String> {
    let dir = PathBuf::from(&path);
    if !dir.is_dir() {
        return Err(format!("Not a directory: {}", path));
    }

    let mut file_count: u64 = 0;
    let mut dir_count: u64 = 0;
    let mut total_size: u64 = 0;
    let mut md_count: u64 = 0;

    fn walk_dir(
        path: &PathBuf,
        file_count: &mut u64,
        dir_count: &mut u64,
        total_size: &mut u64,
        md_count: &mut u64,
    ) -> Result<(), String> {
        if let Ok(entries) = fs::read_dir(path) {
            for entry in entries.flatten() {
                let metadata = entry.metadata()
                    .map_err(|e| format!("Metadata error: {}", e))?;
                if metadata.is_dir() {
                    *dir_count += 1;
                    walk_dir(&entry.path(), file_count, dir_count, total_size, md_count)?;
                } else {
                    *file_count += 1;
                    *total_size += metadata.len();
                    if entry.path().extension().map_or(false, |ext| ext == "md") {
                        *md_count += 1;
                    }
                }
            }
        }
        Ok(())
    }

    walk_dir(&dir, &mut file_count, &mut dir_count, &mut total_size, &mut md_count)?;

    Ok(serde_json::json!({
        "files": file_count,
        "directories": dir_count,
        "markdown_files": md_count,
        "total_size": total_size,
    }))
}

/// Initialize workspace structure
#[tauri::command]
fn init_workspace(path: String) -> Result<(), String> {
    let dirs = ["docs", "notes", "projects", "diagrams", "assets", "templates", "snippets", "scripts", ".studio"];
    for dir in dirs {
        let full_path = PathBuf::from(&path).join(dir);
        fs::create_dir_all(&full_path)
            .map_err(|e| format!("Failed to create {}: {}", dir, e))?;
    }

    // Create default config
    let config_path = PathBuf::from(&path).join(".studio").join("config.json");
    let config = serde_json::json!({
        "name": PathBuf::from(&path).file_name().unwrap_or_default().to_string_lossy(),
        "version": "1.0.0",
        "enable_git": true,
        "enable_ai": false,
        "ai_provider": "ollama",
        "theme": "dark",
        "editor": {
            "font_size": 14,
            "font_family": "JetBrains Mono, Consolas, monospace",
            "line_height": 1.6,
            "word_wrap": true,
            "line_numbers": true,
            "auto_save": true,
            "auto_save_delay": 1000
        }
    });
    fs::write(&config_path, serde_json::to_string_pretty(&config).unwrap())
        .map_err(|e| format!("Failed to write config: {}", e))?;

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            read_file,
            write_file,
            list_directory,
            create_file,
            create_directory,
            delete_path,
            rename_path,
            path_exists,
            get_workspace_stats,
            init_workspace,
        ])
        .run(tauri::generate_context!())
        .expect("error while running Markdown Studio X");
}