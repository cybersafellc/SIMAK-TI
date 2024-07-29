import { web } from "./app/web.js";
import http from "http";
import dotenv from "dotenv";
import { logger } from "./app/logging.js";
dotenv.config();
const port = process.env.PORT || 3001;
const server = http.createServer(web);
server.listen(port, () => {
  logger.info("Server Running on Port : " + port);
});
