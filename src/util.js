export function twoDigits (n) {
  return n < 10 ? `0${n}` : `${n}`
}

export function formatHours (hours, mode) {
  const isPm = hours >= 12
  if (mode === '24h') {
    return { hours, isPm }
  } else if (hours === 0 || hours === 12) {
    return { hours: 12, isPm }
  } else if (hours < 12) {
    return { hours, isPm }
  } else {
    return { hours: hours - 12, isPm }
  }
}
