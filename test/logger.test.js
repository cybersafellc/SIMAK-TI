import { logger } from "../src/app/logging.js";

describe("testing logger", () => {
  it("error", async () => {
    logger.error("Testing error");
  });
  it("info", async () => {
    logger.info("Testing info");
  });
  it("warn", async () => {
    logger.warn("Testing warn");
  });
});
