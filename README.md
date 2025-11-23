# Request Management System - Full Stack Application

A complete full-stack application for submitting and managing requests, built with React Native (Expo), Node.js/Express, and React.js.

## 🚀 Live Demo

- **Backend API:** [https://eduzap-backend.onrender.com](https://eduzap-backend.onrender.com)
- **Web Dashboard:** [https://assignment-d8jj.onrender.com](https://assignment-d8jj.onrender.com)
- **Mobile App APK:** [Download from Expo](https://expo.dev/artifacts/eas/k3iLcepZM2LDUdv3t1wbMj.aab)
- **API Health Check:** [https://eduzap-backend.onrender.com/health](https://eduzap-backend.onrender.com/health)

## Project Structure

```
assignment/
├── backend/          # Node.js + Express API
├── mobile/           # React Native Expo Mobile App
└── web/              # React.js Web Dashboard
```

## Features

### Mobile App (React Native Expo)
- ✅ Form with Name, Phone, Request Title, and Image upload
- ✅ Image picker integration
- ✅ Success/Error message handling
- ✅ Beautiful, modern UI
- ✅ Timestamp included in requests

### Backend API (Node.js + Express)
- ✅ POST /request - Create new request
- ✅ GET /requests - Fetch all requests
- ✅ GET /requests/sorted - Get requests sorted alphabetically
- ✅ GET /requests/search?title=... - Search requests by title
- ✅ DELETE /request/:id - Delete a request
- ✅ Socket.IO real-time updates
- ✅ MongoDB integration
- ✅ LRU Cache for frequently fetched data
- ✅ Input validation

### Web Dashboard (React.js)
- ✅ Display all requests in a table
- ✅ Search bar with 300ms debounce
- ✅ Sort toggle (A-Z / Z-A)
- ✅ Request count widget (Total & Today's requests)
- ✅ Client-side pagination (5 requests per page)
- ✅ Highlight recent requests (last 1 hour)
- ✅ Request title statistics (duplicate counts)
- ✅ Clear search button
- ✅ Loading indicators
- ✅ Error handling
- ✅ Modern, responsive UI

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn
- Expo CLI (for mobile app)

## Installation & Setup

### 1. Backend Setup

```bash
cd backend
npm install

# Create .env file
echo "PORT=5000" > .env
echo "MONGO_URI=mongodb://localhost:27017/requestapp" >> .env

# Start MongoDB (if running locally)
# For Windows: Make sure MongoDB service is running
# For Mac/Linux: mongod

# Start the server
npm start
```

The backend will run on `http://localhost:5000`

### 2. Mobile App Setup

```bash
cd mobile
npm install

# Create .env file (optional, for custom API URL)
echo "EXPO_PUBLIC_API_URL=http://localhost:5000" > .env

# Start Expo
npm start
```

Then:
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Scan QR code with Expo Go app on your phone

**Note:** For physical device testing, replace `localhost` with your computer's IP address in the API URL.

### 3. Web App Setup

```bash
cd web
npm install

# Create .env file (optional, for custom API URL)
echo "REACT_APP_API_URL=http://localhost:5000" > .env

# Start development server
npm start
```

The web app will run on `http://localhost:3000`

## API Endpoints

### POST /request
Create a new request.

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "9876543210",
  "title": "RS Agrawal Maths Book",
  "image": "data:image/jpeg;base64,...",
  "timestamp": "2025-01-31T10:30:00Z"
}
```

**Response:**
```json
{
  "_id": "...",
  "name": "John Doe",
  "phone": "9876543210",
  "title": "RS Agrawal Maths Book",
  "image": "...",
  "timestamp": "2025-01-31T10:30:00Z"
}
```

### GET /requests
Get all requests (sorted by timestamp, newest first).

### GET /requests/sorted?order=asc|desc
Get requests sorted alphabetically by title.

### GET /requests/search?title=Book
Search requests by title (case-insensitive).

### DELETE /request/:id
Delete a request by ID.

## Socket.IO Events

The backend emits real-time events:

- `newRequest` - Emitted when a new request is created
- `requestDeleted` - Emitted when a request is deleted

## Deployment Guide

### Option 1: Deploy Everything on Render (Recommended - All Free)

Render offers free hosting for both backend and web app. Here's how to deploy everything:

### Step 1: Backend Deployment on Render

#### Deploy Backend on Render:

1. **Create Render Account:**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub (recommended) or email

2. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing your code

3. **Configure Backend Service:**
   - **Name:** `request-backend` (or your choice)
   - **Region:** Choose closest to you
   - **Branch:** `main` (or your default branch)
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

4. **Add Environment Variables:**
   Click "Add Environment Variable" and add:
   - **Key:** `MONGO_URI`
   - **Value:** Your MongoDB Atlas connection string
   - **Key:** `PORT`
   - **Value:** `5000` (optional, Render sets this automatically)

5. **Deploy:**
   - Click "Create Web Service"
   - Render will automatically build and deploy
   - Wait 5-10 minutes for first deployment
   - Your backend URL will be: `https://request-backend.onrender.com` (or your chosen name)

6. **Test Backend:**
   - Visit: `https://your-backend-name.onrender.com/health`
   - Should return: `{"status":"ok",...}`

### Step 2: Web App Deployment on Render

1. **Create New Static Site:**
   - In Render dashboard, click "New +" → "Static Site"
   - Connect same GitHub repository

2. **Configure Static Site:**
   - **Name:** `request-web` (or your choice)
   - **Branch:** `main`
   - **Root Directory:** `web`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`

3. **Add Environment Variable:**
   - Click "Environment" tab
   - Add: `REACT_APP_API_URL` = `https://your-backend-name.onrender.com`
   - **Important:** Use your actual backend URL from Step 1

4. **Deploy:**
   - Click "Create Static Site"
   - Render will build and deploy automatically
   - Your web app URL: `https://request-web.onrender.com`

5. **Update CORS in Backend:**
   Edit `backend/server.js`:
   ```javascript
   const io = new Server(server, {
     cors: {
       origin: [
         "https://request-web.onrender.com",
         "http://localhost:3000"
       ],
       methods: ["GET", "POST", "DELETE"]
     }
   });
   ```
   Then redeploy backend (push to GitHub, Render auto-deploys)

### Step 3: Mobile App (Still Use EAS/Expo)

Mobile apps can't be deployed to Render. Use Expo EAS Build:

1. **Update API URL:**
   Create `mobile/.env`:
   ```
   EXPO_PUBLIC_API_URL=https://your-backend-name.onrender.com
   ```

2. **Build with EAS:**
   ```bash
   cd mobile
   npm install -g eas-cli
   eas login
   eas build:android --profile production
   ```

3. **Download APK** from EAS dashboard

---

### Option 2: Alternative Platforms (If Needed)

#### Heroku (Alternative):

1. **Install Heroku CLI** and login:
```bash
heroku login
```

2. **Create Heroku app:**
```bash
cd backend
heroku create your-backend-app-name
```

3. **Set environment variables:**
```bash
heroku config:set MONGO_URI=your_mongodb_connection_string
```

4. **Deploy:**
```bash
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

#### Railway (Alternative):

1. Go to [railway.app](https://railway.app) and create account
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your backend folder
4. Add environment variables:
   - `MONGO_URI`: Your MongoDB connection string
5. Deploy automatically

**Important:** Update CORS in `backend/server.js` to allow your frontend domain:
```javascript
const io = new Server(server, {
  cors: {
    origin: ["https://your-web-app.netlify.app", "http://localhost:3000"],
    methods: ["GET", "POST", "DELETE"]
  }
});
```

### Step 2: MongoDB Setup (MongoDB Atlas - Free)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a free cluster
4. Click "Connect" → "Connect your application"
5. Copy connection string
6. Replace `<password>` with your database password
7. Use this in your backend `MONGO_URI` environment variable

### Web App Deployment (If Not Using Render)

#### Option A: Netlify (Recommended)

1. **Build the app:**
```bash
cd web
npm run build
```

2. **Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

3. **Deploy:**
```bash
netlify login
netlify deploy --prod --dir=build
```

4. **Set environment variable:**
   - Go to Netlify dashboard → Site settings → Environment variables
   - Add: `REACT_APP_API_URL` = `https://your-backend.herokuapp.com`

#### Option B: Vercel

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
cd web
vercel
```

3. **Set environment variable:**
   - Go to Vercel dashboard → Project settings → Environment variables
   - Add: `REACT_APP_API_URL` = `https://your-backend.herokuapp.com`

4. **Rebuild** after setting environment variable

#### Option C: GitHub Pages

1. **Install gh-pages:**
```bash
cd web
npm install --save-dev gh-pages
```

2. **Update package.json:**
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  },
  "homepage": "https://yourusername.github.io/assignment"
}
```

3. **Deploy:**
```bash
npm run deploy
```

### Step 4: Mobile App Deployment

1. **Update API URL:**
   - Create `mobile/.env` file:
   ```
   EXPO_PUBLIC_API_URL=https://your-backend.herokuapp.com
   ```

2. **Build for production:**
```bash
cd mobile
npx expo build:android  # For Android
# OR
npx expo build:ios      # For iOS
```

3. **Alternative: EAS Build (Recommended)**
```bash
npm install -g eas-cli
eas login
eas build:android
```

4. **Download APK/IPA** and distribute or submit to stores

### Step 5: Update Environment Variables

After deployment, update:

1. **Web App:** Set `REACT_APP_API_URL` to your deployed backend URL
2. **Mobile App:** Update `EXPO_PUBLIC_API_URL` in `.env` file
3. **Backend:** Ensure `MONGO_URI` points to your MongoDB Atlas cluster

### Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] MongoDB Atlas cluster created and connected
- [ ] Web app deployed with correct API URL
- [ ] Mobile app built with correct API URL
- [ ] CORS settings updated for production domains
- [ ] All environment variables set
- [ ] Test all endpoints work
- [ ] Test mobile app can submit requests
- [ ] Test web dashboard displays requests

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/requestapp
```

### Mobile (.env)
```
EXPO_PUBLIC_API_URL=http://localhost:5000
```

### Web (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

## Thinking Capability Questions & Answers

### 1. How would you handle 100,000 requests efficiently if we used a database?

**Answer:**

For handling 100,000+ requests efficiently, I would implement:

1. **Database Indexing:**
   - Create indexes on frequently queried fields (`title`, `timestamp`, `name`)
   - Compound indexes for complex queries
   - Example: `db.requests.createIndex({ title: 1, timestamp: -1 })`

2. **Pagination:**
   - Implement server-side pagination instead of fetching all records
   - Use `skip()` and `limit()` with cursor-based pagination for better performance
   - Example: `GET /requests?page=1&limit=20`

3. **Caching Strategy:**
   - Use Redis for frequently accessed data
   - Cache popular searches and sorted results
   - Implement cache invalidation on writes
   - TTL (Time-To-Live) for cache entries

4. **Database Optimization:**
   - Use MongoDB aggregation pipeline for complex queries
   - Implement read replicas for scaling reads
   - Use connection pooling
   - Archive old requests to a separate collection

5. **Query Optimization:**
   - Use projection to fetch only required fields
   - Avoid `$regex` without indexes (use text search indexes instead)
   - Implement query result caching

6. **Architecture:**
   - Consider microservices for high traffic
   - Use message queues for async processing
   - Implement database sharding if needed

### 2. Which data structure would you use for:
   - **Fast insertion and search**
   - **Efficient sorted retrieval**

**Answer:**

1. **Fast Insertion and Search:**
   - **Hash Map (JavaScript Object/Map):** O(1) average case for both insertion and lookup
   - **Trie (Prefix Tree):** Excellent for prefix-based searches (e.g., autocomplete)
   - **B-Tree (MongoDB default):** Balanced tree structure, good for range queries
   - **Inverted Index:** For full-text search scenarios

2. **Efficient Sorted Retrieval:**
   - **Balanced Binary Search Tree (AVL/Red-Black):** O(log n) insertion, O(log n) search, O(n) sorted traversal
   - **B-Tree/B+ Tree:** Used by databases, excellent for disk-based sorted storage
   - **Skip List:** Probabilistic data structure, O(log n) operations
   - **Sorted Array with Binary Search:** O(log n) search, but O(n) insertion

**For this application:**
- **In-memory:** JavaScript `Map` for O(1) lookups, `Array.sort()` for sorted retrieval
- **Database:** MongoDB's B-Tree indexes provide efficient sorted queries
- **Cache:** LRU Cache (implemented) uses `Map` for O(1) operations

### 3. How would you implement real-time updates using Socket.IO?

**Answer:**

**Current Implementation:**
The backend already emits Socket.IO events on create/delete operations.

**Complete Implementation Steps:**

1. **Backend (Already Implemented):**
```javascript
// server.js
const io = new Server(server, { cors: { origin: "*" } });

// routes/requests.js
io.emit('newRequest', newRequest);  // On create
io.emit('requestDeleted', id);      // On delete
```

2. **Frontend (Web App) - To Add:**
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

socket.on('newRequest', (request) => {
  setRequests(prev => [request, ...prev]);
});

socket.on('requestDeleted', (id) => {
  setRequests(prev => prev.filter(r => r._id !== id));
});
```

3. **Mobile App - To Add:**
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

socket.on('connect', () => {
  console.log('Connected to server');
});
```

**Benefits:**
- Real-time updates without polling
- Reduced server load
- Better user experience
- Instant feedback on actions

**Optimization:**
- Use rooms for targeted updates
- Implement reconnection logic
- Add authentication for Socket.IO connections
- Use namespaces for different features

### 4. What cache algorithm would you use for frequently requested data and why?

**Answer:**

**LRU (Least Recently Used) Cache - Currently Implemented**

**Why LRU?**
1. **Temporal Locality:** Recently accessed data is likely to be accessed again soon
2. **Simple Implementation:** Easy to understand and maintain
3. **Good Performance:** O(1) operations using HashMap + Doubly Linked List
4. **Memory Efficient:** Automatically evicts least used items when cache is full
5. **Predictable Behavior:** Clear eviction policy

**Implementation Details:**
- Uses JavaScript `Map` which maintains insertion order
- When item is accessed, it's moved to end (most recently used)
- When cache is full, first item (least recently used) is removed
- Cache size: 100 entries (configurable)

**Alternative Algorithms:**

1. **LFU (Least Frequently Used):**
   - Better for data with access frequency patterns
   - More complex implementation
   - Use case: Popular items that are accessed many times

2. **FIFO (First In First Out):**
   - Simpler than LRU
   - Doesn't consider access patterns
   - Use case: When recency doesn't matter

3. **TTL (Time To Live) Cache:**
   - Items expire after fixed time
   - Good for time-sensitive data
   - Use case: Data that becomes stale after certain time

4. **Redis with LRU:**
   - Distributed caching
   - Persistence options
   - Use case: Multi-server deployments

**For This Application:**
LRU is ideal because:
- Most users view recent requests
- Search results are frequently repeated
- Sorted lists are accessed often
- Memory footprint is manageable

**Future Enhancements:**
- Implement Redis for distributed caching
- Add TTL for automatic cache invalidation
- Use cache warming for popular queries
- Implement cache statistics and monitoring

## Technologies Used

- **Backend:** Node.js, Express.js, MongoDB, Mongoose, Socket.IO
- **Mobile:** React Native, Expo, Axios
- **Web:** React.js, Axios, CSS3
- **Database:** MongoDB
- **Caching:** Custom LRU Cache implementation

## License

ISC

## Author

EDUZAP L LP

