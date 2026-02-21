# Express + MongoDB Starter Template

A minimal, production-ready starter template for building REST APIs with Express.js and MongoDB.

## 🚀 What's Included

- **Express.js** - Fast, minimal web framework
- **MongoDB** - No-SQL database with Mongoose
- **Environment Configuration** - dotenv for environment management
- **Repsonse Handling** - Global response handling Util
- **CORS Support** - Pre-configured CORS middleware

## 📁 Project Structure

```
myapp/
├── config/
│   └── db.js              # MongoDB connection setup
├── utils/
│   └── responseHandler.js    # Global error handling middleware
├── .env.example           # Environment variables template
├── index.js               # Application entry point
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## 🛠️ Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (Compass or Atlas)
- **npm** or **yarn**

## ⚙️ Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env`:

```bash
copy .env.example .env
```

Update `.env` with your MongoDB credentials:

```env
MONGO_URI= #your MongoDB connection string
```


### 3. Run the Application

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server runs on `http://localhost:3000`

## 📝 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload

## 🔌 Default Endpoint

### Health Check
```http
GET /
```
**Response:**
```json
{
  "status": "ok",
  "environment": "development"
}
```


## 🔌 API Response Format

### Using Response Helpers

Import the helpers in your routes:

```javascript
import { sendSuccess, sendError } from './utils/responseHandler.js';

app.get('/api/profile', async (req, res) => {
  try {
    const result = { 'username': 'john', 'email': 'john@mail.com'}
    sendSuccess(res, result, 'Profile fetched successfully');
  } catch (error) {
    sendError(res, 500, error.message);
  }
});
```

### Success Response
```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": [ /* your data */ ]
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message here",
  "details": "detailed Dev message" // only in devlopment
}
```

## 🛡️ Built-in Features

### Rate Limiting
- Default: 500 requests per minute per IP
- Configurable via `RATE_LIMIT_PERMINUTE` environment variable

### CORS
- Default: All origins allowed
- Uncomment and modify `corsOptions` in `index.js` for custom configuration

### Logging
- Morgan logger in development mode
- Logs all HTTP requests to console


## 📦 Installed Packages

**Production:**
- `express` - Web framework
- `mongoose` - MongoDb ODM
- `dotenv` - Environment variables
- `cors` - Cross-origin resource sharing
- `morgan` - HTTP request logger
- `express-rate-limit` - Rate limiting middleware

**Development:**
- `nodemon` - Auto-restart on file changes


## 📚 What to Add Next

This is a minimal template. Consider adding:

- Routes & Controllers
- Data Models
- Input Validation (express-validator)
- Authentication (JWT/sessions)
- Logging (Winston/Morgan)
- Testing (Jest)
- Database Migrations

## 📄 License

MIT License - Feel free to use this template for any project.

---

**Ready to build? Start coding! 🚀**