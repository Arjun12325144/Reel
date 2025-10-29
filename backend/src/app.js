
const express = require("express");
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes')
const foodRoutes = require('./routes/food.routes')
const foodPartnerRoutes = require('./routes/food-partner.routes')
const cors = require('cors')
const app = express();
// Allow local dev origins (Vite may use 5173 or fallback to 5174).
// Use a dynamic origin function during development so the Access-Control-Allow-Origin
// header reflects the requesting origin and matches the frontend.
// app.use(cors({
//     credentials: true
// }))
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://reel-s73t.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      /^https:\/\/.*\.vercel\.app$/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed for this origin: ' + origin));
    }
  },
  credentials: true
}));

app.use(express.json()) // ya middleware req.body me data lakr dega
app.use(cookieParser());


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
app.use("/api/auth",authRoutes);
app.use("/api/food",foodRoutes);
app.use("/api/food-partner",foodPartnerRoutes )
module.exports = app;