# Cat Element — mobile app

Pearl, Miley, Quincy, Lexus and Cookie, ready to install on a phone.

```
cat-element-app/
├── www/                     ← the game itself (this is the app)
│   ├── index.html           the full game
│   ├── manifest.webmanifest app name, icon, full-screen settings
│   ├── sw.js                makes the game work offline
│   └── icons/               app icons (home screen, Android, iPhone)
├── capacitor.config.json    settings for building Android / iPhone apps
├── package.json
└── README.md                this guide
```

---

## Option 1 — Install it on your phone (about 5 minutes, free)

The game is a **Progressive Web App**: once it is online, your phone can install it
like a normal app with its own icon. It opens full screen and works offline.

**Step 1. Put the `www` folder online (free)**

1. On a computer, go to **https://app.netlify.com/drop**
2. Unzip this package, then drag the **`www`** folder onto that page.
3. Netlify gives you a link like `https://something-cat.netlify.app`.
   (Make a free account if you want the link to stay online permanently.)

**Step 2. Install it on your phone**

- **Android (Chrome):** open the link → tap the **⋮** menu → **Install app**
  (or **Add to Home screen**).
- **iPhone (Safari):** open the link → tap the **Share** button → **Add to Home Screen**.

Tap the **Cat Element** icon on your home screen to play. After the first launch it
works without internet.

> Sound tip: turn the volume up. On iPhone, switch off silent mode.

---

## Option 2 — Build a real Android app (APK) you can install or put on Google Play

You need a computer with:
- **Node.js** (https://nodejs.org, the LTS version)
- **Android Studio** (https://developer.android.com/studio)

In a terminal, inside this folder:

```bash
npm install
npx cap add android
npm run android
```

Android Studio opens the project. Connect your Android phone with a USB cable
(turn on *Developer options → USB debugging* on the phone) and press the green
**Run ▶** button. The game installs on your phone as a real app.

To publish on Google Play later: in Android Studio use
**Build → Generate Signed App Bundle**, then upload it in the
Google Play Console (one-time developer fee).

---

## Option 3 — Build an iPhone app

You need a **Mac** with **Xcode** (free from the App Store).

```bash
npm install
npx cap add ios
npm run ios
```

Xcode opens the project. Plug in your iPhone, pick it as the target, set your
Apple ID under *Signing & Capabilities*, and press **Run ▶**.
Publishing on the App Store needs an Apple Developer account (yearly fee).

---

## Updating the game

When the game changes, replace `www/index.html` with the new version, then:

- **Option 1:** drag the `www` folder onto Netlify Drop again (or onto your site's
  *Deploys* page). Also change `cat-element-v1` to `cat-element-v2` at the top of
  `www/sw.js` so phones fetch the new version.
- **Options 2 and 3:** run `npx cap sync` and build again.

## App details

| Setting      | Value                 |
|--------------|-----------------------|
| App name     | Cat Element           |
| App ID       | com.catelement.game   |
| Orientation  | Portrait or landscape |
| Theme colour | #231b3d               |

Change the App ID in `capacitor.config.json` to something unique to you
(for example `com.yourname.catelement`) before publishing to a store.
