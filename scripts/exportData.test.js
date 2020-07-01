const { exportData } = require("./exportData");

describe("script", () => {
  beforeEach(() => {
    delete process.env.PROJECT_ID;
    delete process.env.API_KEY;
    delete process.env.AUTH_DOMAIN;
    delete process.env.EMAIL;
    delete process.env.PASSWORD;
    delete process.argv[2];
    delete process.argv[3];
  });

  describe("Check environment variables", () => {
    it("should throw error if environment variables are not set", async () => {
      process.argv[2] = "2020-01-10";
      process.argv[3] = "10/02/2020";

      await expect(exportData).rejects.toThrow(/missing env variable/i);
    });
  });

  describe("Check script arguments", () => {
    beforeEach(() => {
      process.env.PROJECT_ID = "project-id";
      process.env.API_KEY = "api-key";
      process.env.AUTH_DOMAIN = "auth-domain";
      process.env.EMAIL = "test";
      process.env.PASSWORD = "test";
    });

    it("should throw error if arguments are not set", async () => {
      await expect(exportData).rejects.toThrow(/missing script argument/i);
    });

    it("should throw error if dates in arguments are in the wrong format", async () => {
      process.argv[2] = "2020-01-10";
      process.argv[3] = "10/02/2020";

      await expect(exportData).rejects.toThrow(
        /dates must be in format dd\/mm\/yyyy/i
      );
    });

    it("should throw error if end date is before start date", async () => {
      process.argv[2] = "10/02/2020";
      process.argv[3] = "10/01/2020";

      await expect(exportData).rejects.toThrow(
        /end date must be after start date/i
      );
    });
  });
});
