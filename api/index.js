import express from "express";
import { OAuth2Client } from "google-auth-library";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

// Mock Database (Note: In serverless environments like Vercel, this will reset frequently)
const usersDB = [];

app.use(cors());
app.use(express.json());

// Add Security Headers for Google OAuth
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", environment: process.env.NODE_ENV });
});

app.post("/api/auth/google", async (req, res) => {
  const { credential, mockUser } = req.body;

  if (!client && credential) {
    return res.status(500).json({ error: "Google Auth not configured on server" });
  }

  try {
    let payload;

    if (credential) {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } else if (mockUser) {
      payload = {
        sub: mockUser.sub,
        email: mockUser.email,
        name: mockUser.name,
        picture: mockUser.picture,
      };
    }

    if (!payload) {
      return res.status(400).json({ error: "Invalid token or user data" });
    }

    const { sub, email, name, picture } = payload;

    let user = usersDB.find((u) => u.googleId === sub);

    if (!user) {
      user = {
        id: usersDB.length + 1,
        googleId: sub,
        email,
        name,
        picture,
        createdAt: new Date(),
      };
      usersDB.push(user);
    }

    res.json({
      message: "Authentication successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ error: "Authentication failed" });
  }
});

export default app;
