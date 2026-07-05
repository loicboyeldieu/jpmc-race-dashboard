export function formatSecondsToMMSS(seconds) {
  const totalSeconds = Number(seconds) || 0
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const remainder = String(Math.floor(totalSeconds % 60)).padStart(2, '0')

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${remainder}`
  }

  return `${minutes}:${remainder}`
}
