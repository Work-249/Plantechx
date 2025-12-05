# Server Restart Instructions

The coding submission route exists but the server needs to be restarted.

## Steps:

1. **Stop the current server** (if running):
   - Press `Ctrl+C` in the terminal where the server is running

2. **Start the server**:
   ```bash
   cd server
   npm start
   ```
   OR if using development mode:
   ```bash
   cd server
   npm run dev
   ```

3. **Verify the server is running**:
   - You should see: "✅ MongoDB Connected Successfully"
   - Server should be listening on port 8080

4. **Test the route**:
   Open browser console and run:
   ```javascript
   fetch('http://localhost:8080/api/coding/submit', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' }
   }).then(r => r.json()).then(console.log)
   ```

   You should see an authentication error (not "Route not found")

## The Route Configuration:
- Route Path: `/api/coding/submit`
- Method: `POST`
- Location: `server/routes/coding.js:192`
- Registered in: `server/server.js:147`

## If Still Not Working:

1. Check if MongoDB is running
2. Check server logs for any errors during startup
3. Verify port 8080 is not already in use
4. Check if all dependencies are installed: `cd server && npm install`
