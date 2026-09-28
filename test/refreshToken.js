const assert = require("node:assert/strict");
const { generateRefreshToken, verifyRefreshToken, hashToken } = require("../src/services/tokenService");

// Standalone check: no .env or database connection is needed.
process.env.JWT_REFRESH_SECRET = "refresh-token-test-secret";
process.env.JWT_REFRESH_EXPIRES = "7d";
const originalNow = Date.now;
Date.now = () => 1800000000000;

try {
    const first = generateRefreshToken({ id: 1 });
    const second = generateRefreshToken({ id: 1 });
    const firstPayload = verifyRefreshToken(first);
    const secondPayload = verifyRefreshToken(second);

    assert.equal(firstPayload.iat, secondPayload.iat);
    assert.notEqual(first, second, "Same-second refresh tokens must differ");
    assert.notEqual(hashToken(first), hashToken(second));
    assert.equal(typeof firstPayload.jti, "string");
    assert.notEqual(firstPayload.jti, secondPayload.jti);
    assert.equal(firstPayload.sub, 1);
    assert.equal(secondPayload.sub, 1);
    assert.equal(firstPayload.exp - firstPayload.iat, 7 * 24 * 60 * 60);
    assert.equal(secondPayload.exp - secondPayload.iat, 7 * 24 * 60 * 60);
    console.log("PASS: same-second refresh tokens and hashes differ; signatures, student ID, and expiry are valid.");
} finally {
    Date.now = originalNow;
}
