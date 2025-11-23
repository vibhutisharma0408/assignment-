
# 🎯 Request Management System

A complete **full-stack application** for submitting and managing requests — powered by **React Native (Expo)**, **Node.js/Express**, **MongoDB**, and a **React.js Web Dashboard**.

## 🚀 Live Demo

| Module               | Link                                                                                     |
| -------------------- | ---------------------------------------------------------------------------------------- |
| **Backend API**      | [https://eduzap-backend.onrender.com](https://eduzap-backend.onrender.com)               |
| **Web Dashboard**    | [https://assignment-d8jj.onrender.com](https://assignment-d8jj.onrender.com)             |
| **Mobile App (APK)** | [Download & Install](https://expo.dev/accounts/vibhuti_sharma/projects/mobile/builds/f6ee9f52-0117-4fd2-861f-bc1b31ef10d1) |
| **API Health Check** | [https://eduzap-backend.onrender.com/health](https://eduzap-backend.onrender.com/health) |

### 📱 Mobile App Installation

**Shareable Download Link (Anyone can use this!):**
```
https://expo.dev/accounts/vibhuti_sharma/projects/mobile/builds/f6ee9f52-0117-4fd2-861f-bc1b31ef10d1
```

**Installation Steps:**
1. Open the link above on Android phone
2. Click "Download" button on the page
3. Install APK (enable "Install from unknown sources" in Settings → Security if needed)
4. Open the app and start using!

**Features:**
- ✅ Direct download link
- ✅ Works on any Android device
- ✅ No app store required
- ✅ Share with recruiters/friends easily

---

## 📁 Project Structure

```
assignment/
├── backend/          # Node.js + Express REST API
├── mobile/           # React Native (Expo)
└── web/              # React.js Dashboard
```

---

## 🌟 Features

### 📱 Mobile App (React Native + Expo)

* Add requests with **name, phone, title & image**
* Image Picker (Expo)
* Beautiful UI
* Success/Error feedback
* Automatic timestamps
* Fully responsive & smooth UX

---

### 🖥️ Web Dashboard (React.js)

* Display all requests in a table
* Search (with debounce)
* A–Z / Z–A sorting
* Request statistics
* Highlight recent (last 1 hour) requests
* Client-side pagination (5 per page)
* Delete requests
* Real-time updates (Socket.IO ready)
* Clean & responsive UI

---

### 🔥 Backend API (Node.js + Express)

* `POST /request` – Create a request
* `GET /requests` – Fetch all
* `GET /requests/sorted` – Alphabetical sorting
* `GET /requests/search?title=` – Search by title
* `DELETE /request/:id` – Delete
* MongoDB + Mongoose integration
* Socket.IO real-time events
* LRU Cache for performance
* Input validation

---

## 🧪 API Endpoints

### ➕ Create Request

`POST /request`

```json
{
  "name": "John Doe",
  "phone": "9876543210",
  "title": "RS Agrawal Book",
  "image": "data:image/jpeg;base64,...",
  "timestamp": "2025-01-31T10:30:00Z"
}
```

### 📄 Get All Requests

`GET /requests`

### 🔤 Sorted Requests

`GET /requests/sorted?order=asc|desc`

### 🔍 Search

`GET /requests/search?title=Book`

### ❌ Delete Request

`DELETE /request/:id`

---

## ⚡ Socket.IO Events

| Event            | Description               |
| ---------------- | ------------------------- |
| `newRequest`     | When a request is added   |
| `requestDeleted` | When a request is deleted |

---

## 🛠️ Installation & Setup

### 1️⃣ Backend

```bash
cd backend
npm install
echo "PORT=5000" > .env
echo "MONGO_URI=mongodb://localhost:27017/requestapp" >> .env
npm start
```

Backend → `http://localhost:5000`

---

### 2️⃣ Mobile App (Expo)

```bash
cd mobile
npm install
echo "EXPO_PUBLIC_API_URL=http://localhost:5000" > .env
npm start
```

---

### 3️⃣ Web App

```bash
cd web
npm install
echo "REACT_APP_API_URL=http://localhost:5000" > .env
npm start
```

Web Dashboard → `http://localhost:3000`

---

## 🔧 Environment Variables

### Backend

```
PORT=5000
MONGO_URI=your_mongodb_uri
```

### Mobile

```
EXPO_PUBLIC_API_URL=http://localhost:5000
```

### Web

```
REACT_APP_API_URL=http://localhost:5000
```

---

## 🧠 Thinking Capability (Interview-Ready)

### 1️⃣ How to handle **100,000+ records efficiently**?

* Database indexing (title, name, timestamp)
* Pagination (server-side)
* Redis caching (future enhancement)
* LRU cache (already implemented)
* Aggregation pipelines
* Query optimization with projections

---

### 2️⃣ Best data structures?

| Requirement                | Data Structure                |
| -------------------------- | ----------------------------- |
| Fast insert & search       | Hash Map, Trie, MongoDB Index |
| Efficient sorted retrieval | B-Tree, AVL Tree, Skip List   |

---

### 3️⃣ Real-time Updates (Socket.IO)

**Backend emits:**

```js
io.emit('newRequest', newReq);
io.emit('requestDeleted', id);
```

**Frontend listens:**

```js
socket.on("newRequest", data => setRequests(prev => [data, ...prev]));
```

---

### 4️⃣ Why LRU Cache?

* O(1) get/set
* Perfect for frequently accessed searches
* Prevents memory overflow
* Simple & predictable eviction

---

## 🧰 Tech Stack

| Layer                 | Technologies              |
| --------------------- | ------------------------- |
| **Frontend (Mobile)** | React Native, Expo, Axios |
| **Frontend (Web)**    | React.js, CSS3            |
| **Backend**           | Node.js, Express.js       |
| **Database**          | MongoDB, Mongoose         |
| **Real-time**         | Socket.IO                 |
| **Caching**           | Custom LRU Cache          |

---

## 👨‍💻 Author

**EDUZAP LLP**

