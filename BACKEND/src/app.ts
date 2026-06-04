import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { MulterError } from "multer";

import productRoutes from "./routes/product.routes";
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import imageRoutes from "./routes/image.routes";
import orderRoutes from "./routes/order.routes";
import feedRoutes from "./routes/feed.routes";
import { getPublicSettings } from "./controller/settings.controller";

dotenv.config();

const app = express();

const uploadsPath = path.join(__dirname, "../../public/uploads");

app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));
app.use("/uploads", express.static(uploadsPath));

app.use("/api/img", imageRoutes);
app.use("/feeds", feedRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.get("/api/settings/public", getPublicSettings);

app.get("/", (_req, res) => {
    res.json({
        success: true,
        message: "Backend API Running Successfully"
    });
});

app.use((err: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "Image must be 5MB or smaller" });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err instanceof Error && err.message.includes("image")) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

export default app;