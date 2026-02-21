import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import db from './config/db.js';


const app = express();
dotenv.config();

// Logger
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cors Middleware
// Modify the CORS options as needed - 

// const corsOptions = {
//   origin: [process.env.FRONTEND_URL, process.env.FRONTEND_URL2].filter(Boolean),
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
//   optionsSuccessStatus: 200
// };
// app.use(cors(corsOptions));

app.use(cors());

// Rate Limiter
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: process.env.RATE_LIMIT_PERMINUTE || 500, // Limit each IP to 500 requests per `window` (here, per 1 minute).
  message: "Too many requests from this IP",
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
});
app.use(limiter);




// Error handler
app.use((err, req, res, next) => {
  console.error(err);
});


// Basic routes
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    environment: process.env.NODE_ENV || "development",
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
