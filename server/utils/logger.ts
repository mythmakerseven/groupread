// In production, this function should be the only log to console in the entire application.
// This ensures that there's no accidental debug logging in production.
const info = (...params: unknown[]): void => {
  console.log(...params)
}

const error = (...params: unknown[]): void => {
  console.error(...params)
}

export default {
  info,
  error
}