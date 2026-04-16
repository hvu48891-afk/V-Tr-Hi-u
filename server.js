import app from "./api/index.js";
import { createServer as createViteServer } from "vite";

const PORT = 3000;

async function startServer() {
  // In development, use Vite's middleware
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
