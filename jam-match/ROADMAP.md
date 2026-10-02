# Jam Match roadmap: from first screen to friends testing it

About 10 hours a week. Each phase ends with something you can see on your phone.

| Phase | What you build | Time | Done when… |
|---|---|---|---|
| ✅ 0. Setup | Mac, Expo, app running on iPhone | done | You see the welcome screen |
| 1. Basics | Learn components, state and styles by editing the welcome screen | 1 week | You can add a button that changes something on screen |
| 2. Clickable app with fake data | Navigation and every v1 screen: sign-up steps, profile, preferences, swipe cards, match, chat. Data is made up and lives in the app. | 2–3 weeks | You can tap through the whole app like the design canvas |
| 3. Real accounts & profiles | Supabase (free backend): login, date of birth with 18+ check, save profile, upload a photo | 2–3 weeks | You sign up on your phone, close the app, and your profile is still there |
| 4. Matching | Filter by distance, age, level and genre both ways; "Let's jam" likes; mutual like = match | 2 weeks | Two test accounts match each other |
| 5. Chat | Real-time messages, the 3 icebreaker openers, notifications for new matches and messages | 2 weeks | Two phones can chat |
| 6. Safety & polish | Block and report, privacy policy, hide profiles after 30 days inactive, app icon, empty screens | 1–2 weeks | You'd be comfortable handing it to a stranger |
| 7. Share with friends | Build the app with EAS and send it through TestFlight (iPhone) or an install link (Android) | 1 week | 10–20 musician friends in your city have it installed |

**Total: about 3–4 months.**

## Shortcut: show friends early

After phase 2 you can already send friends a **web link** (Expo apps can also run in a browser) or
show them on your own phone. Their reaction to the clickable version tells you what to change
before you spend weeks on the backend.

## Costs

| What | Cost |
|---|---|
| Expo, Expo Go | Free |
| Supabase (database, login, chat) | Free tier is enough for testing |
| Apple Developer Program (needed for TestFlight) | $99 / year, only needed in phase 7 |
| Google Play (only for the public store) | $25 once, not needed for friend testing |

## What you need from friends in phase 7

- Do they finish sign-up? Where do they give up?
- Do matches turn into chats, and chats into real jams?
- "Would you use this again?" and "What's missing?"
