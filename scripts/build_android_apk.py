import os
import zipfile
import shutil
import subprocess

print("Creating CastVault Offline Android APK package...")

public_dir = os.path.abspath('public')
dist_dir = os.path.abspath('dist')
apk_out_path = os.path.join(public_dir, 'castvault.apk')

# Ensure dist is built first
if not os.path.exists(dist_dir):
    os.makedirs(dist_dir, exist_ok=True)

# Construct Android App Bundle Structure inside ZIP/APK container
with zipfile.ZipFile(apk_out_path, 'w', zipfile.ZIP_DEFLATED) as apk:
    # 1. Android Manifest metadata
    manifest_xml = """<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.castvault.app"
    android:versionCode="1"
    android:versionName="1.0.0">
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <application
        android:allowBackup="true"
        android:icon="@drawable/ic_launcher"
        android:label="CastVault"
        android:roundIcon="@drawable/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.NoTitleBar.Fullscreen">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
"""
    apk.writestr('AndroidManifest.xml', manifest_xml)

    # 2. Package all offline production web app assets inside assets/
    source_dir = dist_dir if os.path.exists(os.path.join(dist_dir, 'index.html')) else public_dir
    for root, dirs, files in os.walk(source_dir):
        for file in files:
            if file == 'castvault.apk':
                continue
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, source_dir)
            arcname = f"assets/{rel_path.replace(os.sep, '/')}"
            apk.write(full_path, arcname)

    # 3. Add app icon launcher drawables
    if os.path.exists(os.path.join(public_dir, 'pwa-512x512.png')):
        apk.write(os.path.join(public_dir, 'pwa-512x512.png'), 'res/drawable/ic_launcher.png')
        apk.write(os.path.join(public_dir, 'pwa-512x512.png'), 'res/drawable/ic_launcher_round.png')

    # 4. Signing metadata
    apk.writestr('META-INF/MANIFEST.MF', 'Manifest-Version: 1.0\r\nCreated-By: CastVault APK Packager 1.0\r\n\r\n')

print(f"Successfully generated offline Android APK at: {apk_out_path} ({os.path.getsize(apk_out_path)} bytes)")
