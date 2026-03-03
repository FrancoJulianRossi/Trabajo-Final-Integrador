import app from "./app";
import { connectDB } from "./config/database";

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
});
