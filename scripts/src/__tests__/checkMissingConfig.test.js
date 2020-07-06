const checkMissingConfig = require("../checkMissingConfig");

describe("checkMissingConfig", () => {
  const projectId = "dummy";
  const apiKey = "dummy";
  const authDomain = "dummy";
  const email = "dummy";
  const password = "dummy";

  it("returns a successful status if everything is defined", () => {
    const response = checkMissingConfig(
      projectId,
      apiKey,
      authDomain,
      email,
      password
    );
    expect(response.status).toEqual("SUCCESS");
    expect(response.isSuccessful()).toBe(true);
  });

  it("returns MISSING_ENV_VAR if projectId is missing", () => {
    const response = checkMissingConfig(
      null,
      apiKey,
      authDomain,
      email,
      password
    );
    expect(response.status).toEqual("MISSING_ENV_VAR");
    expect(response.isSuccessful()).toBe(false);
  });

  it("returns MISSING_ENV_VAR if apiKey is missing", () => {
    const response = checkMissingConfig(
      projectId,
      null,
      authDomain,
      email,
      password
    );
    expect(response.status).toEqual("MISSING_ENV_VAR");
    expect(response.isSuccessful()).toBe(false);
  });

  it("returns MISSING_ENV_VAR if authDomain is missing", () => {
    const response = checkMissingConfig(
      projectId,
      apiKey,
      null,
      email,
      password
    );
    expect(response.status).toEqual("MISSING_ENV_VAR");
    expect(response.isSuccessful()).toBe(false);
  });

  it("returns MISSING_ENV_VAR if email is missing", () => {
    const response = checkMissingConfig(
      projectId,
      apiKey,
      authDomain,
      null,
      password
    );
    expect(response.status).toEqual("MISSING_ENV_VAR");
    expect(response.isSuccessful()).toBe(false);
  });

  it("returns MISSING_ENV_VAR if password is missing", () => {
    const response = checkMissingConfig(
      projectId,
      apiKey,
      authDomain,
      email,
      null
    );
    expect(response.status).toEqual("MISSING_ENV_VAR");
    expect(response.isSuccessful()).toBe(false);
  });
});
