# Jam Mate

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

### 4. Getting updates

When new code is pushed to GitHub, run this inside `jam-match`:

```bash
git pull
npm install
npx expo start
```

## The prototype (phase 2)

A clickable version of every v1 screen, with made-up musicians:

- **Welcome** → **Get started** runs the 3-step sign-up, or **Try the demo profile** skips it.
- **Sign up:** name, date of birth (18+ only), city, instruments with a level each, genres →
  who you want to play with → top 5 artists ("Connect Apple Music" fills in demo data).
- **Discover:** one musician at a time, filtered both ways by distance, age, level and genre.
  Shared genres and artists are highlighted. Maya, Leo, Kenji and Tom have already liked you,
  so "Let's jam" on them makes a match.
- **Matches & chat:** three icebreaker openers, and a pretend reply.
- **Profile:** your details, with buttons to edit each sign-up step.

Nothing is saved yet: closing the app resets it. Saving comes in phase 3.

## Project layout

| Path | What it is |
|---|---|
| `src/app/` | The screens. Every file here is a screen (Expo Router). |
| `src/app/signup/` | The 3 sign-up steps. |
| `src/app/(tabs)/` | Discover, Matches and Profile tabs. |
| `src/app/chat/[id].js` | A chat with one match. |
| `src/components/` | Reusable pieces: buttons, chips, cards. |
| `src/data/` | Made-up musicians and the lists of instruments and genres. |
| `src/lib/matching.js` | The matching rules. |
| `src/state/AppContext.js` | What the app remembers while it's open. |
| `src/theme.js` | App name, colours and spacing in one place. |
| `app.json` | App settings: name, icon. |
