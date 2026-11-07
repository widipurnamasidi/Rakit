import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { env } from "./utils/env";
import { swaggerDocument } from "./docs/swagger";
import router from "./routes/api";

/** Memasang middleware dan rute ke app. app dibuat di index.ts agar Vercel mengenali express di berkas entri. */
export function mountApp(app: Express, ensureDb: () => Promise<void>) {
  // 1. CORS dengan penanganan fallback port frontend
  app.use(
    cors({
      origin: env.CLIENT_HOST || "http://localhost:3001",
      credentials: true,
    }),
  );

  // 2. Parser JSON dengan limit 10MB (mencegah error 'PayloadTooLarge' saat upload data/foto)
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // 3. Health check & Swagger Docs (Cepat tanpa hambatan DB)
  app.get("/", (_req, res) =>
    res.json({ message: "Server is running", data: null }),
  );
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // 4. Middleware Database & API Router
  app.use(
    "/api",
    async (_req: Request, res: Response, next: NextFunction) => {
      try {
        await ensureDb();
        next();
      } catch (e) {
        console.error("DB Connection Error:", e);
        res
          .status(503)
          .json({
            meta: { status: 503, message: "database unavailable" },
            data: null,
          });
      }
    },
    router,
  );

  return app;
}
