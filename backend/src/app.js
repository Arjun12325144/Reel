const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const foodPartnerRoutes = require('./routes/food-partner.routes');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://reel-fqhx.vercel.app',
  'https://reel-s73t.vercel.app',
  'https://reel-liart.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log('CORS origin:', origin);
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || /\.vercel\.app$/i.test(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
};

// 🟢 CORS and JSON middleware FIRST
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// 🟢 Handle OPTIONS preflight globally
app.options('*', cors(corsOptions));

// 🟢 Add headers manually (optional)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Expose-Headers', 'Set-Cookie');
  next();
});

// 🟢 Then routes
app.get("/", (req, res) => {
  res.json({
    message: "Backend API is running",
    endpoints: {
      auth: "/api/auth/*",
      food: "/api/food/*",
      foodPartner: "/api/food-partner/*"
    }
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/food-partner", foodPartnerRoutes);

module.exports = app;
