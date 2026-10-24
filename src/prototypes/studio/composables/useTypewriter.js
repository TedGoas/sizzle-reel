export function useTypewriter() {
  function typewriterEffect(text, callback, speed = 30) {
    let index = 0
    const interval = setInterval(() => {
      if (index < text.length) {
        callback(text.substring(0, index + 1))
        index++
      } else {
        clearInterval(interval)
      }
    }, speed)
    return interval
  }

  return { typewriterEffect }
}
