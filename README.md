# Coach Mobile App 

A premium fitness coaching app built with React Native (Expo) and Supabase.

## Quick Start

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Configure Environment**
    Ensure you have a `.env` file in this directory with your API keys:
    ```bash
    EXPO_PUBLIC_OPENAI_API_KEY=sk-...
    EXPO_PUBLIC_SUPABASE_URL=https://...
    EXPO_PUBLIC_SUPABASE_ANON_KEY=...
    ```

3.  **Run the App**
    ```bash
    npx expo start
    ```
    - Press `i` to open in iOS Simulator (requires Xcode).
    - Press `a` to open in Android Emulator (requires Android Studio).
    - Scan the QR code with the **Expo Go** app on your physical device.

## 🛠️ Troubleshooting

### "Command not found: npx" or "npm"
-   Ensure you have [Node.js](https://nodejs.org/) installed on your machine.
-   Try restarting your terminal.

### "CocoaPods not installed" (iOS)
-   If running on a Mac with the Simulator, you might need to run:
    ```bash
    npx expo run:ios
    ```
    This will prompt to install necessary native dependencies.

### "Network request failed" (Supabase/OpenAI)
-   Check your `.env` file keys.
-   Ensure your device has internet access.
-   If using Supabase Local, make sure it's running.

## 📱 Features

-   **Onboarding Flow**: Collects user stats, goals, and equipment.
-   **Workout Generation**: Uses OpenAI (GPT-4) to create personalized plans.
-   **Workout Display**: Renders plans with interactive checkboxes.
-   **Persistence**: Saves profiles and workouts to Supabase.
