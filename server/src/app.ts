import express, { Application, Request, Response } from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import cookieParser from "cookie-parser";
import { authLimiter, apiLimiter } from "./middlewares/rateLimit.middleware.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import blockedIpRoutes from "./routes/blockedIp.routes.js";
import sliderRoutes from "./routes/slider.routes.js";
import storeLocationRoutes from "./routes/storeLocation.routes.js";
import aboutSectionRoutes from "./routes/aboutSection.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import termsRoutes from "./routes/terms.routes.js";
import faqRoutes from "./routes/faq.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import userRoutes from "./routes/user.route.js";
import logsRoutes from "./routes/logs.routes.js";
import authRoutes from "./routes/auth.route.js";
import seoRoutes from "./routes/seo.routes.js";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Application = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5001",
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/v1/auth", authLimiter, authRoutes);
app.use("/api/v1", apiLimiter);

app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/customers", customerRoutes);
app.use("/api/v1/blocked-ips", blockedIpRoutes);
app.use("/api/v1/sliders", sliderRoutes);
app.use("/api/v1/locations", storeLocationRoutes);
app.use("/api/v1/about-section", aboutSectionRoutes);
app.use("/api/v1/settings", settingsRoutes);
app.use("/api/v1/terms", termsRoutes);
app.use("/api/v1/faq", faqRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/logs", logsRoutes);
// SEO Routes (/sitemap.xml, /robots.txt)
app.use("/", seoRoutes);

const frontendDistPath = path.resolve(__dirname, "../../frontend/dist");

if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  app.use((req: Request, res: Response, next) => {
    if (
      req.method !== "GET" ||
      req.originalUrl.startsWith("/api") ||
      req.originalUrl.startsWith("/uploads") ||
      req.originalUrl === "/sitemap.xml" ||
      req.originalUrl === "/robots.txt"
    ) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
} else {
  app.get("/", (_req: Request, res: Response) => {
    res.send("Welcome to Twelve Clothing API Server!");
  });
}

app.use(globalErrorHandler);

export default app;


