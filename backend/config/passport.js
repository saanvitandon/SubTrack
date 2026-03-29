const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// =========================
// 🔴 GOOGLE STRATEGY
// =========================

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback"
},
(accessToken, refreshToken, profile, done) => {

  const user = {
    email: profile.emails?.[0]?.value,
    username: profile.displayName
  };

  return done(null, user);
}
));

// =========================
// ⚫ GITHUB STRATEGY
// =========================

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "/api/auth/github/callback"
},
(accessToken, refreshToken, profile, done) => {

  const user = {
    email: profile.emails?.[0]?.value || "no-email@github.com",
    username: profile.username
  };

  return done(null, user);
}
));

module.exports = passport;