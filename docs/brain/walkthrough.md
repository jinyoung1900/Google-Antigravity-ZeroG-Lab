# Walkthrough: Professional Power Features

Chronos Tracker has evolved from a simple logger into a sophisticated productivity suite.

## Major Additions

- **Multi-Timer Support**: You can now track multiple activities simultaneously (e.g., "Deep Work" and "Listening to Music").
- **Daily Goals**:
  - Set a target duration (in minutes) for each activity in the **Settings Drawer**.
  - Monitor your progress in the new **GOALS** tab with high-contrast progress bars.
- **Insights Tab**:
  - **Efficiency Trends**: See how your focus today compares to your historical average.
  - **Weekly Heatmap**: A visual grid showing your total activity intensity over the last 7 days.
- **Collapsible History**: The history tab now stays clean by only showing your 5 most recent logs. You can expand to see the full list if needed.
- **Secret Mascot Easter Egg**: Try clicking the **CHRONOS** title 5 times for a surprise! 🐶✨
- **PWA (Mobile App)**:
  - **Standalone Mode**: Install Chronos on your phone for a native app experience.
  - **Local Storage**: All data is saved on your device—offline tracking is fully supported.
  - **Custom Icon**: Look for the glowing blue icon on your homescreen!
- **Pomodoro Mode**:
  - Enable **Pomodoro Focus** in the Tracker tab.
  - Automated 25-minute focus cycles followed by 5-minute break alerts.

## Showcase

````carousel
![Main Tracker in Action](../showcase/demo.webp)
<!-- slide -->
![Daily Goals Progress](../showcase/goals.png)
<!-- slide -->
![Weekly Activity Heatmap](../showcase/heatmap.png)
<!-- slide -->
![Mascot Easter Egg Modal](../showcase/mascot.png)
````

### Mobile App Experience
![Chronos Mobile View](../showcase/mobile.png)

### App Icon
![Chronos App Icon](../showcase/app_icon.png)

### How to use your new features:
1.  **Install the App**: 
    -   Connect your phone to the same Wi-Fi as your dev machine.
    -   Open `http://YOUR_LOCAL_IP:5173` in your phone's browser.
    -   Tap 'Share' or the 'Menu' button, and select **Add to Home Screen**.
2.  **App Icon**: You'll find a professional blue icon on your homescreen!
3.  **Set Goals**: Go to **Settings** (Gear icon ⚙️) to set your daily goals.
4.  **Pomodoro**: Enable **Pomodoro** on the **Tracker** tab if you have a big task to tackle.
5.  **Insights**: Check the **Insights** tab at the end of the day to see your heatmap glow!

### Production & Sharing
The production-ready code is located in the `dist` folder.

#### How to Share with Others
1.  **Host it online (Recommended)**: 
    -   Go to [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
    -   Drag and drop the `dist` folder onto their dashboard.
2.  **Native App Stores (Apple & Google)**: 
    -   I've initialized **Capacitor** in your project!
    -   You now have `android/` and `ios/` folders in your project root.
    -   Open the `android` folder in Android Studio or `ios/App` in Xcode to build your store-ready apps.

> [!NOTE]
> Whenever you make a change to the code, run `npm run build` and then `npx cap sync` to update the native projects!
