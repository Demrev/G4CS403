const isText = (value, maxLength = Infinity) =>
    typeof value === "string" && value.trim().length > 0 &&
    !value.includes("\0") && [...value].length <= maxLength;

// ponytail: basic email syntax only; verify ownership by email if needed later.
const isEmail = (value) =>
    isText(value, 150) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isPassword = (value) =>
    isText(value) && Buffer.byteLength(value, "utf8") <= 72;

// PostgreSQL SERIAL is a positive 32-bit integer.
const isStudentId = (value) =>
    /^[0-9]+$/.test(value) && Number(value) > 0 && Number(value) <= 2147483647;

module.exports = { isText, isEmail, isPassword, isStudentId };
