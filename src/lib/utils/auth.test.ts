import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT, validateJWT, hashPassword, checkPasswordHash } from "./auth";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../../api/handler_middleware";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });
});

describe("Password hashing", () => {
  it("hashPassword should return a hash different from the original password", async () => {
    const password = "super-secret";

    const hash = await hashPassword(password);

    expect(hash).toBeTypeOf("string");
    expect(hash).not.toBe(password);
  });

  it("checkPasswordHash should return true for a valid password", async () => {
    const password = "correct-password";
    const hash = await hashPassword(password);

    const result = await checkPasswordHash(password, hash);

    expect(result).toBe(true);
  });

  it("checkPasswordHash should return false for an invalid password", async () => {
    const password = "correct-password";
    const hash = await hashPassword(password);

    const result = await checkPasswordHash("wrong-password", hash);

    expect(result).toBe(false);
  });
});

describe("JWT utilities", () => {
  const secret = "test-secret";
  const userId = "user-123";
  const expiresIn = 60; // seconds

  it("makeJWT should create a valid JWT", () => {
    const token = makeJWT(userId, expiresIn, secret);

    expect(token).toBeTypeOf("string");

    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

    expect(decoded.iss).toBe("chirpy");
    expect(decoded.sub).toBe("user-123"); // matches your implementation
    expect(decoded.iat).toBeTypeOf("number");
    expect(decoded.exp).toBeTypeOf("number");
  });

  it("validateJWT should return the subject for a valid token", () => {
    const token = makeJWT(userId, expiresIn, secret);

    const subject = validateJWT(token, secret);

    expect(subject).toBe(userId);
  });

  it("validateJWT should throw UnauthorizedError if token has no sub", () => {
    const tokenWithoutSub = jwt.sign(
      {
        iss: "chirpy",
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60,
      },
      secret
    );

    expect(() => validateJWT(tokenWithoutSub, secret)).toThrow(
      UnauthorizedError
    );
  });

  it("validateJWT should throw if token is signed with wrong secret", () => {
    const token = makeJWT(userId, expiresIn, secret);

    expect(() => validateJWT(token, "wrong-secret")).toThrow();
  });
});
