# Leaderboard Application

A full-stack leaderboard application built with Node.js, Express, MongoDB, and React.

## Features

- **User Management**: Add new users to the system
- **Point Claiming**: Users can claim random points (1-10)
- **Real-time Rankings**: Dynamic leaderboard updates
- **Point History**: Track all point claims in the database
- **Responsive UI**: Clean and modern interface using Material-UI

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- CORS for cross-origin requests

### Frontend

- React with Vite
- Material-UI for components
- Axios for API calls

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

## Installation & Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd leaderboard
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
MONGODB_URI=mongodb://localhost:27017/leaderboard
PORT=5000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

## Running the Application

### Start the Backend Server

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5000`

### Start the Frontend Server

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

- `GET /api/users` - Get all users with rankings
- `POST /api/users` - Add a new user
- `POST /api/users/:userId/claim` - Claim points for a user
- `GET /api/users/:userId/history` - Get point history for a user

## Database Collections

### Users Collection

```javascript
{
  _id: ObjectId,
  name: String (required, unique),
  totalPoints: Number (default: 0),
  rank: Number (default: 0)
}
```

### Point History Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  points: Number (required),
  timestamp: Date (default: Date.now)
}
```

## Usage

1. Open the application in your browser (`http://localhost:5173`)
2. Add users using the "Add New User" button
3. Select a user from the dropdown
4. Click "Claim Points" to award random points
5. Watch the leaderboard update automatically

## Features Implemented

✅ User selection dropdown  
✅ Add new users functionality  
✅ Random point generation (1-10)  
✅ Real-time leaderboard updates  
✅ Point history tracking  
✅ Responsive UI design  
✅ Error handling  
✅ Loading states

## Development

- Backend uses nodemon for automatic restarts during development
- Frontend uses Vite for fast development server and hot module replacement
- Both servers can run simultaneously during development

## Production Build

### Frontend

```bash
cd frontend
npm run build
```

### Backend

```bash
cd backend
npm start
```
