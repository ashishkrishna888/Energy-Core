# How to Clear Today's Energy Chart Data in MongoDB Atlas

This guide shows you **3 ways** to clear today's energy data from your MongoDB Atlas database.

---

## 🚀 Method 1: Using the Script (Easiest)

I've created a script that automatically clears today's energy logs.

### Steps:
1. **Navigate to the server directory:**
   ```bash
   cd server
   ```

2. **Run the script:**
   ```bash
   npm run clear:today-energy
   ```

3. **You'll see output like:**
   ```
   🗑️  Clearing energy logs for today: 2025-12-20
   ✅ Deleted 15 energy log entries for today (2025-12-20)
   ✅ Today's energy chart data cleared for your@email.com
   ```

**That's it!** The script will:
- Connect to your MongoDB Atlas database
- Find today's date (YYYY-MM-DD format)
- Delete all energy logs with today's date
- Keep all other days' data intact

---

## 🖥️ Method 2: Using MongoDB Atlas UI (Visual Method)

### Steps:

1. **Log in to MongoDB Atlas:**
   - Go to https://cloud.mongodb.com
   - Sign in to your account

2. **Navigate to your database:**
   - Click on your cluster
   - Click "Browse Collections"
   - Find and click on the `energylogs` collection

3. **Filter for today's data:**
   - Click the "Filter" button
   - In the filter box, enter:
     ```json
     { "day": "2025-12-20" }
     ```
     *(Replace `2025-12-20` with today's date in YYYY-MM-DD format)*

4. **Delete the filtered documents:**
   - Select all the filtered documents (check the box at the top)
   - Click the "Delete" button
   - Confirm the deletion

**Note:** To find today's date in YYYY-MM-DD format:
- Today is: **2025-12-20** (example)
- You can check today's date by running: `node -e "console.log(new Date().toISOString().split('T')[0])"`

---

## 💻 Method 3: Using MongoDB Shell (Advanced)

If you have MongoDB Shell installed or want to use MongoDB Atlas's built-in shell:

### Steps:

1. **Open MongoDB Shell in Atlas:**
   - Go to MongoDB Atlas
   - Click "Database Access" → "Connect" → "Connect with MongoDB Shell"
   - Or use your local MongoDB Shell

2. **Connect to your database:**
   ```javascript
   use your-database-name
   ```

3. **Delete today's energy logs:**
   ```javascript
   // Get today's date in YYYY-MM-DD format
   const today = new Date().toISOString().split('T')[0];
   
   // Delete all energy logs for today
   db.energylogs.deleteMany({ 
     day: today 
   });
   ```

4. **Check the result:**
   ```javascript
   // Verify deletion
   db.energylogs.countDocuments({ day: today });
   // Should return 0
   ```

---

## 📋 Quick Reference

### Script Commands:
```bash
# Clear ALL energy history
npm run clear:history

# Clear ONLY today's energy data
npm run clear:today-energy

# Seed sample history data
npm run seed:history
```

### Today's Date Format:
- Format: `YYYY-MM-DD`
- Example: `2025-12-20`
- The `day` field in EnergyLog uses this exact format

### What Gets Deleted:
- ✅ Only energy logs with today's date in the `day` field
- ✅ Only for the logged-in user (if using the script)
- ❌ Other days' data remains untouched
- ❌ Water logs are NOT affected
- ❌ Devices are NOT affected

---

## 🔍 Verify the Deletion

After clearing, verify in your app:
1. Open your Energy Core dashboard
2. Check the Energy Usage Chart
3. Today's bar should be at 0 or empty
4. Other days should still show their data

---

## ⚠️ Important Notes

1. **This action cannot be undone** - Once deleted, today's energy logs are gone
2. **Only affects today** - Other days' data remains safe
3. **User-specific** - The script only clears data for the first user found
4. **Requires server connection** - Make sure your `.env` file has the correct `MONGO_URI`

---

## 🆘 Troubleshooting

### Script fails with "No user found":
- Make sure you have at least one user registered
- Register a user first through the app

### Script fails to connect:
- Check your `.env` file has `MONGO_URI` set correctly
- Verify your MongoDB Atlas IP whitelist includes your current IP
- Check your MongoDB Atlas connection string

### Today's data still shows in chart:
- Refresh the browser page
- Clear browser cache if needed
- Check that the `day` field format matches exactly (YYYY-MM-DD)

---

**Need to clear water logs too?** Check `clearHistory.js` or modify the script to include WaterLog.

