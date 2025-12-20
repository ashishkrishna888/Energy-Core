# Server Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## Installation Steps

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Set Up Environment Variables

**IMPORTANT**: Create a `.env` file in the `server/` directory. This file is required for the server to work!

Create the file manually or use this template:

**Create `server/.env` file with the following content:**

```env
# MongoDB Connection String
# For local MongoDB: mongodb://localhost:27017/energy-core
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/energy-core?retryWrites=true&w=majority
MONGO_URI=mongodb://localhost:27017/energy-core

# JWT Secret Key (Change this to a secure random string)
# Generate one using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=supersecretjwtkey_change_this

# Server Port (optional, defaults to 5000)
PORT=5000

# Node Environment (optional)
NODE_ENV=development
```

Then edit `.env` and update the following:

#### MongoDB Connection
- **Local MongoDB**: `mongodb://localhost:27017/energy-core`
- **MongoDB Atlas**: Get your connection string from Atlas dashboard

#### JWT Secret
Generate a secure random key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output and paste it as `JWT_SECRET` in your `.env` file.

### 3. Start MongoDB

**Local MongoDB:**
- Windows: Start MongoDB service from Services
- Mac/Linux: `sudo systemctl start mongod` or `brew services start mongodb-community`

**MongoDB Atlas:**
- No local setup needed, just use your connection string

### 4. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server should start on `http://localhost:5000` (or the port you specified).

### 5. Verify Setup

Check if the server is running:
```bash
curl http://localhost:5000/api/health
```

You should see:
```json
{"status":"ok","message":"Smart Energy API is running"}
```

## Troubleshooting

### Error: "MongoDB connection error"
- Make sure MongoDB is running
- Check your `MONGO_URI` in `.env` is correct
- For Atlas: Verify your IP is whitelisted and credentials are correct

### Error: "JWT_SECRET is not defined"
- Make sure `.env` file exists in `server/` directory
- Check that `JWT_SECRET` is set in `.env`
- Restart the server after creating/updating `.env`

### Error: "Request failed with status code 500"
- Check server console logs for detailed error messages
- Verify all environment variables are set correctly
- Ensure MongoDB is connected and accessible
- Check that all required models exist in the database

## Common Issues

1. **Port already in use**: Change `PORT` in `.env` to a different port
2. **Module not found**: Run `npm install` again
3. **Database connection timeout**: Check firewall settings and MongoDB service status

