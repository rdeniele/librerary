# Librerary identity

`librerary-icon.png`: original transparent square glass document-stack icon, generated with the built-in Imagegen tool on 2026-10-17. Exact generation prompt: `librerary-icon.prompt.txt`. No competitor artwork or Apple marks were supplied or copied. This is a visual identity asset, not an AI feature in the application.

The Tauri CLI converts the master into Windows ICO, macOS ICNS and platform PNG sizes:

```powershell
node node_modules/@tauri-apps/cli/tauri.js icon assets/brand/librerary-icon.png --output apps/launcher/src-tauri/icons
```

The web app uses the generated 256px PNG and 32px favicon in `apps/launcher/public/brand`. Preserve alpha when exporting. Typography uses the operating system font: SF Pro through the Apple system font on Apple devices, native Segoe UI on Windows. SF Pro is not bundled; see [Apple font guidance](https://developer.apple.com/documentation/technologyoverviews/fonts).
