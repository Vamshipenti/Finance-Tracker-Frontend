📱 Personal Finance Tracker - React Native Frontend
This is the mobile frontend of the Personal Finance Tracker App developed using React Native. It enables users to manage their income, expenses, and budgets on the go.

✨ Features
🔐 User Registration & Login (JWT-based authentication)

💸 Add, Edit, and Delete Transactions (Income & Expenses)

📊 Budget Management

📈 Graphs to visualize Income vs. Expenses

📱 Android APK Build Available

⚙️ Tech Stack
React Native

Axios – For API requests

React Navigation

React Native Chart Kit

Android SDK

🛠️ Getting Started
1. Clone the repository
bash
Copy
Edit
git clone https://github.com/vamshipenti/finance-tracker-frontend.git
cd finance-tracker-frontend
2. Install dependencies
bash
Copy
Edit
npm install
3. Run the app
Android:
bash
Copy
Edit
npm run android
iOS:
bash
Copy
Edit
npm run ios
Note: For iOS, ensure you have Xcode and CocoaPods installed, and run cd ios && pod install before starting.

📦 APK Build Instructions (Android)
bash
Copy
Edit
cd android
./gradlew assembleRelease
👉 The release APK will be located at:

swift
Copy
Edit
android/app/build/outputs/apk/release/app-release.apk
🔗 Backend API
This app connects to a Node.js + Express + MongoDB backend.

👉 Check out the backend repository: Finance Tracker Backend

📸 Screenshots
Add screenshots in a docs/ folder and embed them here once available!

📄 License
This project is licensed under the MIT License.

