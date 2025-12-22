[1mdiff --git a/CLEAR_TODAY_ENERGY_GUIDE.md b/CLEAR_TODAY_ENERGY_GUIDE.md[m
[1mdeleted file mode 100644[m
[1mindex a36d1e2..0000000[m
[1m--- a/CLEAR_TODAY_ENERGY_GUIDE.md[m
[1m+++ /dev/null[m
[36m@@ -1,171 +0,0 @@[m
[31m-# How to Clear Today's Energy Chart Data in MongoDB Atlas[m
[31m-[m
[31m-This guide shows you **3 ways** to clear today's energy data from your MongoDB Atlas database.[m
[31m-[m
[31m----[m
[31m-[m
[31m-## 🚀 Method 1: Using the Script (Easiest)[m
[31m-[m
[31m-I've created a script that automatically clears today's energy logs.[m
[31m-[m
[31m-### Steps:[m
[31m-1. **Navigate to the server directory:**[m
[31m-   ```bash[m
[31m-   cd server[m
[31m-   ```[m
[31m-[m
[31m-2. **Run the script:**[m
[31m-   ```bash[m
[31m-   npm run clear:today-energy[m
[31m-   ```[m
[31m-[m
[31m-3. **You'll see output like:**[m
[31m-   ```[m
[31m-   🗑️  Clearing energy logs for today: 2025-12-20[m
[31m-   ✅ Deleted 15 energy log entries for today (2025-12-20)[m
[31m-   ✅ Today's energy chart data cleared for your@email.com[m
[31m-   ```[m
[31m-[m
[31m-**That's it!** The script will:[m
[31m-- Connect to your MongoDB Atlas database[m
[31m-- Find today's date (YYYY-MM-DD format)[m
[31m-- Delete all energy logs with today's date[m
[31m-- Keep all other days' data intact[m
[31m-[m
[31m----[m
[31m-[m
[31m-## 🖥️ Method 2: Using MongoDB Atlas UI (Visual Method)[m
[31m-[m
[31m-### Steps:[m
[31m-[m
[31m-1. **Log in to MongoDB Atlas:**[m
[31m-   - Go to https://cloud.mongodb.com[m
[31m-   - Sign in to your account[m
[31m-[m
[31m-2. **Navigate to your database:**[m
[31m-   - Click on your cluster[m
[31m-   - Click "Browse Collections"[m
[31m-   - Find and click on the `energylogs` collection[m
[31m-[m
[31m-3. **Filter for today's data:**[m
[31m-   - Click the "Filter" button[m
[31m-   - In the filter box, enter:[m
[31m-     ```json[m
[31m-     { "day": "2025-12-20" }[m
[31m-     ```[m
[31m-     *(Replace `2025-12-20` with today's date in YYYY-MM-DD format)*[m
[31m-[m
[31m-4. **Delete the filtered documents:**[m
[31m-   - Select all the filtered documents (check the box at the top)[m
[31m-   - Click the "Delete" button[m
[31m-   - Confirm the deletion[m
[31m-[m
[31m-**Note:** To find today's date in YYYY-MM-DD format:[m
[31m-- Today is: **2025-12-20** (example)[m
[31m-- You can check today's date by running: `node -e "console.log(new Date().toISOString().split('T')[0])"`[m
[31m-[m
[31m----[m
[31m-[m
[31m-## 💻 Method 3: Using MongoDB Shell (Advanced)[m
[31m-[m
[31m-If you have MongoDB Shell installed or want to use MongoDB Atlas's built-in shell:[m
[31m-[m
[31m-### Steps:[m
[31m-[m
[31m-1. **Open MongoDB Shell in Atlas:**[m
[31m-   - Go to MongoDB Atlas[m
[31m-   - Click "Database Access" → "Connect" → "Connect with MongoDB Shell"[m
[31m-   - Or use your local MongoDB Shell[m
[31m-[m
[31m-2. **Connect to your database:**[m
[31m-   ```javascript[m
[31m-   use your-database-name[m
[31m-   ```[m
[31m-[m
[31m-3. **Delete today's energy logs:**[m
[31m-   ```javascript[m
[31m-   // Get today's date in YYYY-MM-DD format[m
[31m-   const today = new Date().toISOString().split('T')[0];[m
[31m-   [m
[31m-   // Delete all energy logs for today[m
[31m-   db.energylogs.deleteMany({ [m
[31m-     day: today [m
[31m-   });[m
[31m-   ```[m
[31m-[m
[31m-4. **Check the result:**[m
[31m-   ```javascript[m
[31m-   // Verify deletion[m
[31m-   db.energylogs.countDocuments({ day: today });[m
[31m-   // Should return 0[m
[31m-   ```[m
[31m-[m
[31m----[m
[31m-[m
[31m-## 📋 Quick Reference[m
[31m-[m
[31m-### Script Commands:[m
[31m-```bash[m
[31m-# Clear ALL energy history[m
[31m-npm run clear:history[m
[31m-[m
[31m-# Clear ONLY today's energy data[m
[31m-npm run clear:today-energy[m
[31m-[m
[31m-# Seed sample history data[m
[31m-npm run seed:history[m
[31m-```[m
[31m-[m
[31m-### Today's Date Format:[m
[31m-- Format: `YYYY-MM-DD`[m
[31m-- Example: `2025-12-20`[m
[31m-- The `day` field in EnergyLog uses this exact format[m
[31m-[m
[31m-### What Gets Deleted:[m
[31m-- ✅ Only energy logs with today's date in the `day` field[m
[31m-- ✅ Only for the logged-in user (if using the script)[m
[31m-- ❌ Other days' data remains untouched[m
[31m-- ❌ Water logs are NOT affected[m
[31m-- ❌ Devices are NOT affected[m
[31m-[m
[31m----[m
[31m-[m
[31m-## 🔍 Verify the Deletion[m
[31m-[m
[31m-After clearing, verify in your app:[m
[31m-1. Open your Energy Core dashboard[m
[31m-2. Check the Energy Usage Chart[m
[31m-3. Today's bar should be at 0 or empty[m
[31m-4. Other days should still show their data[m
[31m-[m
[31m----[m
[31m-[m
[31m-## ⚠️ Important Notes[m
[31m-[m
[31m-1. **This action cannot be undone** - Once deleted, today's energy logs are gone[m
[31m-2. **Only affects today** - Other days' data remains safe[m
[31m-3. **User-specific** - The script only clears data for the first user found[m
[31m-4. **Requires server connection** - Make sure your `.env` file has the correct `MONGO_URI`[m
[31m-[m
[31m----[m
[31m-[m
[31m-## 🆘 Troubleshooting[m
[31m-[m
[31m-### Script fails with "No user found":[m
[31m-- Make sure you have at least one user registered[m
[31m-- Register a user first through the app[m
[31m-[m
[31m-### Script fails to connect:[m
[31m-- Check your `.env` file has `MONGO_URI` set correctly[m
[31m-- Verify your MongoDB Atlas IP whitelist includes your current IP[m
[31m-- Check your MongoDB Atlas connection string[m
[31m-[m
[31m-### Today's data still shows in chart:[m
[31m-- Refresh the browser page[m
[31m-- Clear browser cache if needed[m
[31m-- Check that the `day` field format matches exactly (YYYY-MM-DD)[m
[31m-[m
[31m----[m
[31m-[m
[31m-**Need to clear water logs too?** Check `clearHistory.js` or modify the script to include WaterLog.[m
[31m-[m
[1mdiff --git a/LINKEDIN_VIDEO_SCRIPT.md b/LINKEDIN_VIDEO_SCRIPT.md[m
[1mdeleted file mode 100644[m
[1mindex d03d006..0000000[m
[1m--- a/LINKEDIN_VIDEO_SCRIPT.md[m
[1m+++ /dev/null[m
[36m@@ -1,134 +0,0 @@[m
[31m-# LinkedIn Video Presentation Script: Energy Core[m
[31m-**Duration:** 2-3 minutes  [m
[31m-**Presenter:** Mohammad Hadi Shukoor  [m
[31m-**Project:** Energy Core - Smart Home Energy & Water Monitoring Dashboard[m
[31m-[m
[31m----[m
[31m-[m
[31m-## 📹 SCRIPT BREAKDOWN[m
[31m-[m
[31m-### **THE HOOK** (0:00 - 0:30)[m
[31m-[m
[31m-| **VISUAL** | **AUDIO** |[m
[31m-|------------|-----------|[m
[31m-| *Screen: Show the login page* | "Hi, I'm Mohammad Hadi Shukoor, and I built Energy Core—a full-stack smart home monitoring system." |[m
[31m-| *Click "Login" button* | "Most of us waste energy because we can't see it in real-time. I wanted to solve that problem." |[m
[31m-| *Dashboard loads, show the main view with charts* | "So I built a dashboard that tracks your energy and water usage, live from your database." |[m
[31m-[m
[31m----[m
[31m-[m
[31m-### **THE SOLUTION** (0:30 - 1:30)[m
[31m-[m
[31m-| **VISUAL** | **AUDIO** |[m
[31m-|------------|-----------|[m
[31m-| *Point to the Energy Chart (top left)* | "This is the Energy Usage Chart. It shows daily consumption over the last week." |[m
[31m-| *Hover over different data points on the chart* | "Every bar represents real data pulled from MongoDB—not mock data, but actual usage logs." |[m
[31m-| *Point to the Water Chart (top right)* | "And here's the Water Usage Chart, tracking liters consumed per day." |[m
[31m-| *Point to the Daily Cost Estimate (if visible on dashboard)* | "The system also calculates and displays the estimated daily cost based on your energy consumption, helping users understand the financial impact." |[m
[31m-| *Scroll down slightly to show device cards* | "Below, you can see all your smart devices—AC units, lights, water heaters—each with their own status." |[m
[31m-| *Point to the Settings tab/button* | "Users can access the Settings tab to set custom energy and water limits, and the system tracks everything automatically." |[m
[31m-[m
[31m----[m
[31m-[m
[31m-### **THE DEMO** (1:30 - 2:20)[m
[31m-[m
[31m-| **VISUAL** | **AUDIO** |[m
[31m-|------------|-----------|[m
[31m-| *Click the "Toggle ON" button on a device (e.g., "Living Room AC")* | "Watch this—when I turn on a device, the system immediately logs the usage." |[m
[31m-| *Show the device status change from OFF to ON* | "The button sends a request to my Express.js backend, which updates MongoDB in real-time." |[m
[31m-| *Point to the Daily Cost Estimate updating* | "Notice how the daily cost estimate updates automatically as consumption changes." |[m
[31m-| *Click on the "Add Device" tab/button, show the form* | "Let me show you the Add Device feature. I can add new devices with custom names, types, and consumption rates—this demonstrates full CRUD operations." |[m
[31m-| *Fill out the form and show the device being added* | "When I submit this form, it creates a new device in the database and immediately appears in the device list." |[m
[31m-| *Click on the "Settings" tab, show the sliders* | "In the Settings tab, users can adjust their energy and water limits using these sliders, and the system saves these preferences to the database." |[m
[31m-| *Show the leak simulation button (if available)* | "There's even a leak simulation feature that demonstrates how the system tracks water anomalies in real-time." |[m
[31m-[m
[31m----[m
[31m-[m
[31m-### **THE TECH** (2:20 - 2:50)[m
[31m-[m
[31m-| **VISUAL** | **AUDIO** |[m
[31m-|------------|-----------|[m
[31m-| *Show the full dashboard UI* | "This entire application is built with the MERN stack—MongoDB for the database, Express.js for the backend API, React for this frontend interface, and Node.js as the runtime environment." |[m
[31m-| *Point to the login page (if still visible or navigate back)* | "I implemented secure authentication using JWT tokens, which means each user's data is completely protected and isolated." |[m
[31m-| *Point to the charts and cost estimate* | "These charts are powered by Recharts, a React library, and all the data comes from MongoDB using aggregation pipelines that calculate daily and weekly totals efficiently. The cost calculations happen on the backend." |[m
[31m-| *Show the Settings tab and Add Device form* | "The Settings and Add Device tabs demonstrate full CRUD operations—Create, Read, Update, Delete—all connected to the MongoDB database through RESTful API endpoints." |[m
[31m-| *Show the device cards and buttons* | "Every button click, every toggle, every action you see here communicates with my Express.js backend, which then updates the MongoDB database in real-time." |[m
[31m-[m
[31m----[m
[31m-[m
[31m-### **THE OUTRO** (2:50 - 3:00)[m
[31m-[m
[31m-| **VISUAL** | **AUDIO** |[m
[31m-|------------|-----------|[m
[31m-| *Return to the dashboard, show the full screen* | "This project demonstrates my ability to build end-to-end full-stack applications—from database design to user interface." |[m
[31m-| *Show GitHub logo or repository link on screen* | "If you want to see the code or try it yourself, check out the GitHub link in the description below." |[m
[31m-| *End screen: Show your name and "Energy Core" text* | "Thanks for watching, and feel free to connect if you're interested in discussing full-stack development!" |[m
[31m-[m
[31m----[m
[31m-[m
[31m-## 🎬 PRODUCTION TIPS[m
[31m-[m
[31m-### **Before Recording:**[m
[31m-1. **Test Everything:** Make sure all features work smoothly before recording.[m
[31m-2. **Clean UI:** Close unnecessary tabs, use a clean browser theme.[m
[31m-3. **Audio Check:** Use a good microphone, record in a quiet space.[m
[31m-4. **Screen Resolution:** Record in 1080p or higher for LinkedIn.[m
[31m-[m
[31m-### **During Recording:**[m
[31m-1. **Speak Clearly:** Don't rush—pause between sections.[m
[31m-2. **Show, Don't Tell:** Let the visuals do the work. Point with your cursor.[m
[31m-3. **Natural Flow:** If you make a small mistake, keep going—you can edit it out.[m
[31m-4. **Energy:** Sound enthusiastic but professional.[m
[31m-[m
[31m-### **Key Visual Moments:**[m
[31m-- ✅ **0:30** - Dashboard first appears (make it look impressive)[m
[31m-- ✅ **1:00** - Hover over chart data points (show interactivity)[m
[31m-- ✅ **1:30** - Device toggle animation (the "wow" moment)[m
[31m-- ✅ **2:15** - Tech stack explanation while showing the UI (shows technical depth)[m
[31m-[m
[31m----[m
[31m-[m
[31m-## 📝 ALTERNATIVE SHORTER VERSION (If you need to cut to 2 minutes)[m
[31m-[m
[31m-**Skip or shorten:**[m
[31m-- Reduce "The Solution" section by 15 seconds[m
[31m-- Make "The Tech" section more concise (30 seconds instead of 30 seconds, but faster)[m
[31m-- Cut the leak simulation demo if time is tight[m
[31m-[m
[31m----[m
[31m-[m
[31m-## 🎯 KEY MESSAGES TO HIT[m
[31m-[m
[31m-1. ✅ **Full Stack Capability:** "I built both frontend and backend"[m
[31m-2. ✅ **Real Data:** "This uses a real database, not mock data"[m
[31m-3. ✅ **Security:** "JWT authentication protects user data"[m
[31m-4. ✅ **Modern Stack:** "MERN stack—industry standard"[m
[31m-5. ✅ **Problem-Solving:** "I solved a real-world problem"[m
[31m-6. ✅ **Complete Features:** "Daily cost estimates, Settings management, and full device CRUD operations"[m
[31m-[m
[31m----[m
[31m-[m
[31m-## 💡 BONUS: Post-Video LinkedIn Caption Template[m
[31m-[m
[31m-```[m
[31m-🚀 Just built Energy Core—a full-stack smart home monitoring dashboard![m
[31m-[m
[31m-Built with the MERN stack (MongoDB, Express, React, Node.js), this project demonstrates:[m
[31m-✅ Real-time data visualization with Recharts[m
[31m-✅ Daily cost estimation and tracking[m
[31m-✅ Secure JWT authentication[m
[31m-✅ Full CRUD operations (Add/Edit/Delete devices)[m
[31m-✅ Settings management with user preferences[m
[31m-✅ MongoDB aggregation for analytics[m
[31m-[m
[31m-Check out the live demo in the video above, and feel free to explore the code on GitHub![m
[31m-[m
[31m-#FullStackDeveloper #MERNStack #WebDevelopment #ReactJS #NodeJS #MongoDB #SoftwareEngineering #Coding #TechProjects[m
[31m-[m
[31m-[GitHub Link: https://github.com/ashishkrishna888/Energy-Core][m
[31m-```[m
[31m-[m
[31m----[m
[31m-[m
[31m-**Good luck with your video! 🎥✨**[m
[31m-[m
