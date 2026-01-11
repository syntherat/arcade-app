# 🎟️ Insights Club Staff App

An internal **Android application** built for **Insights Club** to manage on-ground event operations such as **entry verification, QR scanning, and game counter handling**.

This app is intended **only for authorized staff and volunteers** during official Insights Club event.

---

## ✨ Features

- 🔐 Secure staff authentication
- 🧾 QR code scanning for participant / wallet verification
- 🚪 Gate check-in management
- 🎮 Game counter operations
- 🌙 Minimal dark UI for fast on-ground usage
- 📱 Android APK distribution via GitHub Releases

---

## 📦 Android Build (APK)

This project uses EAS Build for Android releases.

### Build APK for internal distribution
```
eas build -p android --profile preview
```
Expo will generate a downloadable APK link.

---

## 📤 Distribution

APK files are distributed via GitHub Releases.

Each release:
- Uses semantic versioning (v1.0.0, v1.0.1, etc.)
- Includes a downloadable APK
- Contains release notes describing changes

---

## ⚠️ Intended Use
This application is not a public app.

It is designed exclusively for:
- Insights Club core team members
- Event volunteers
- Gate and game counter staff

Unauthorized use is not supported.

---

## 📄 License
Maintained by Insights Club
This project is released under a proprietary internal-use license.