import express, { Request, Response, NextFunction } from "express";
import router from "./routes/reservation.route";

const app = express();

// middleware
app.use(express.json());

// simple healthcheck
app.get("/", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// mount reservation routes
app.use("/", router);

// basic error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // tslint:disable-next-line:no-console
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
