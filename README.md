# X-Clone

A full-stack social media application inspired by X (formerly Twitter), built with React (Vite, Tailwind CSS) for the frontend and Node.js (Express, MongoDB, JWT) for the backend.

---

## Features

- User authentication (JWT, HTTP-only cookies)
- User profile management (update info, profile/cover images)
- Follow/unfollow users
- Create, delete, like, and comment on posts (with image upload via Cloudinary)
- Notifications for follows, likes, and comments
- Suggested users to follow
- Feed of posts from followed users
- Responsive frontend with React and Tailwind CSS

---

## Project Structure

```
client/      # React frontend (Vite, Tailwind CSS)
server/      # Express backend (MongoDB, JWT, Cloudinary)
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB database
- Cloudinary account (for image uploads)

### Environment Variables

Create a `.env` file in the `server/` directory with the following:

```
MONGO_DB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=5000
NODE_ENV=development
```

---

### Backend Setup

```sh
cd server
npm install
npm run dev
```

The backend will start on the port specified in your `.env` file (default: 5000).

---

### Frontend Setup

```sh
cd client
npm install
npm run dev
```

The frontend will start on [http://localhost:5173](http://localhost:5173) by default.

---

## API Endpoints

### Auth

- `POST /api/auth/signup` — Register a new user
- `POST /api/auth/login` — Login
- `POST /api/auth/logout` — Logout
- `GET /api/auth/me` — Get current user info

### User

- `GET /api/user/suggested` — Get suggested users
- `GET /api/user/:username` — Get user profile
- `POST /api/user/follow/:id` — Follow/unfollow user
- `POST /api/user/update` — Update user profile

### Post

- `GET /api/post/allPosts` — Get all posts
- `GET /api/post/FollowingPosts` — Get posts from followed users
- `GET /api/post/user/:username` — Get posts by user
- `GET /api/post/likedPosts/:id` — Get liked posts
- `POST /api/post/create` — Create a post
- `DELETE /api/post/delete/:id` — Delete a post
- `POST /api/post/comment/:id` — Comment on a post
- `POST /api/post/like/:id` — Like/unlike a post

### Notification

- `GET /api/post/get` — Get notifications
- `DELETE /api/post/delete` — Delete notifications

---

## Development Notes

- Backend uses JWT for authentication and stores tokens in HTTP-only cookies.
- Image uploads are handled via Cloudinary.
- MongoDB is used for data storage with Mongoose ODM.
- Frontend is scaffolded with Vite and styled using Tailwind CSS.

---

## License

This project is licensed under the MIT