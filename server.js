import express from "express";
import { createServer as createViteServer } from "vite";
import { OAuth2Client } from "google-auth-library";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

// Mock Database
const usersDB = [];

app.use(cors());
app.use(express.json());

// API Routes
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
      // Fallback for implicit flow (access token) where frontend already fetched user info
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

    // Simulate database lookup/creation
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
      console.log("New user created in mock DB:", user);
    } else {
      console.log("Existing user logged in:", user);
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

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
