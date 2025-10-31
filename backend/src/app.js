const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const foodPartnerRoutes = require('./routes/food-partner.routes');

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://reel-liart.vercel.app",
  "https://reel-git-main-arjuns-projects-edf07b04.vercel.app",
  "https://reel-pgui4ezff-arjuns-projects-edf07b04.vercel.app",
  "https://reel-s73t.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("CORS origin:", origin);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🟢 Apply CORS before routes
// app.use(cors(corsOptions));
// app.options('*', cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// 🟢 Add headers manually (optional but helps)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Expose-Headers', 'Set-Cookie');
  next();
});

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
