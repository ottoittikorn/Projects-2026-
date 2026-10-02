# Jam Match

An app that helps musicians find people nearby to jam with or form a band,
matched by instrument, level, genre, favourite artists and distance.

Built with [Expo](https://expo.dev) (React Native), so one codebase runs on iPhone and Android.
See [V1_PLAN.md](V1_PLAN.md) for what's in the first version and [ROADMAP.md](ROADMAP.md) for the build steps.

## Step 1: run the app on your phone

### 1. Install these on your computer (once)

- **Node.js** (the "LTS" version): https://nodejs.org
- **Git**: https://git-scm.com/downloads
- **VS Code** (code editor): https://code.visualstudio.com

### 2. Install on your phone

- **Expo Go** from the App Store or Google Play.
- Create a free account at https://expo.dev/signup and **sign in inside Expo Go**.
  Expo Go now refuses to open projects unless you're signed in on both the phone and the computer.

### 3. Get the code and start it

Open a terminal (in VS Code: *Terminal → New Terminal*) and run:

```bash
git clone https://github.com/ottoittikorn/Projects-2026-.git
cd Projects-2026-
git checkout claude/musician-matching-app-98s5ue
cd jam-match
npm install
npx expo login
npx expo start
```

A QR code appears in the terminal.

- **iPhone:** scan it with the Camera app.
- **Android:** scan it from inside Expo Go.

Your phone and computer need to be on the same Wi-Fi. If it won't connect,
stop it with `Ctrl + C` and run `npx expo start --tunnel` instead.

If Expo Go says the project is **incompatible** with its version, Expo Go has moved
to a newer SDK. Run `npx expo install expo@latest --fix` and try again.

### 4. Make your first change

Open `App.js`, change the text `Jam Match` to something else and save.
The app on your phone updates within a second or two.

## Project layout

| File | What it is |
|---|---|
| `App.js` | The app's code. Right now: the welcome screen. |
| `app.json` | App settings: name, icon, colours. |
| `assets/` | Icons and splash image. |
| `package.json` | The list of libraries the app uses. |
