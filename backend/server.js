require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");

const app = express();

// MIDDLEWARE //

app.use(cors({
  origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: "subtrack_secret",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// PASSPORT CONFIG //

require("./config/passport");

// ROUTES //

const authRoutes = require("./routes/auth");
const subscriptionRoutes = require("./routes/subscriptions");

app.use("/api/auth", authRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

// OAUTH ROUTES //

// GOOGLE
app.get("/api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/api/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/api/auth/login" }),
  (req, res) => {
const user = req.user;

res.redirect(
  `http://127.0.0.1:5500/frontend/index.html?email=${encodeURIComponent(user.email)}&username=${encodeURIComponent(user.username)}`
);
  }
);

// GITHUB
app.get("/api/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

app.get("/api/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/api/auth/login" }),
  (req, res) => {
const user = req.user;

res.redirect(
  `http://127.0.0.1:5500/frontend/index.html?email=${encodeURIComponent(user.email)}&username=${encodeURIComponent(user.username)}`
);
  }
);

// ROOT //

app.get("/", (req, res) => {
  res.json({
    message: "SubTrack API is running",
    version: "2.0.0",
    database: "MongoDB Atlas"
  });
});

// DB CONNECTION //

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ SubTrack API running on port 5000");
    console.log("👉 http://localhost:5000");
    console.log("📦 Database connected (MongoDB Atlas)");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// START SERVER //

app.listen(5000, () => {
  console.log("🚀 Server started on port 5000");
});