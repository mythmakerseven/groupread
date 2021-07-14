import chalk from 'chalk'

// In production, this function should be the only log to console in the entire application.
// This ensures that there's no accidental debug logging in production.
const info = (text: string): void => {
  console.log(chalk.green(text))
}

const error = (text: string): void => {
  console.error(chalk.red(text))
}

export default {
  info,
  error
}