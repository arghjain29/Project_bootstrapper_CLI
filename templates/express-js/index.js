import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
const app = express();
dotenv.config();


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

// Logger
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
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
