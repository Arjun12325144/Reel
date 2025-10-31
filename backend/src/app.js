
const express = require("express");
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes')
const foodRoutes = require('./routes/food.routes')
const foodPartnerRoutes = require('./routes/food-partner.routes')
const cors = require('cors')
const app = express(); 

// define allowed origins you want to explicitly whitelist
// const allowedOrigins = [
//   'http://localhost:5173',
//   'http://127.0.0.1:5173',
//   // explicit production backend or frontend names are optional
//   'https://reel-s73t.vercel.app'
// ]

// // cors options factory
// const corsOptions = {
//   origin: function (origin, callback) {
//     // allow requests with no origin (like curl, mobile apps, server-to-server)
//     if (!origin) return callback(null, true)

//     // allow listed origins OR any vercel.app subdomain
//     if (allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
//       return callback(null, true)
//     }

//     return callback(new Error('Not allowed by CORS: ' + origin))
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
// }

// // apply CORS globally
// app.use(cors(corsOptions))

// // make sure preflight (OPTIONS) requests are handled
// app.options('*', cors(corsOptions))

// // Add extra headers so responses expose cookie header and credentials
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Credentials', 'true')
//   res.header('Access-Control-Expose-Headers', 'Set-Cookie')
//   next()
// })
// Allow local dev origins (Vite may use 5173 or fallback to 5174).
// Use a dynamic origin function so the Access-Control-Allow-Origin header mirrors
// the requesting origin when allowed. Also accept any vercel.app subdomain.
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://reel-fqhx.vercel.app',
  'https://reel-s73t.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (curl, mobile apps, server-to-server)
    if (!origin) return callback(null, true);

    // allow explicit whitelist OR any vercel.app subdomain
    if (allowedOrigins.includes(origin) || /(^https?:\/\/.*\.vercel\.app$)/i.test(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS: ' + origin));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
};

// apply CORS globally with the options above
app.use(cors(corsOptions));

// The global CORS middleware above handles preflight OPTIONS requests.
// Avoid registering a catch-all OPTIONS route with a wildcard path string
// which can trigger path-to-regexp parsing errors in some environments.

// Add security headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Expose-Headers', 'Set-Cookie');
  next();
});

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