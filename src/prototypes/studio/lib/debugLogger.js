export const debugLogger = {
  log (...args) {
    if (this.isEnabled()) console.log(...args)
  },
  warn (...args) {
    if (this.isEnabled()) console.warn(...args)
  },
  info (...args) {
    if (this.isEnabled()) console.info(...args)
  },
  error (...args) {
    console.error(...args)
  },
  isEnabled () {
    return typeof window !== 'undefined' && window.DS_DEBUG === true
  },
}
