function hexToRgb(hex: string) {
  const normalized = hex.replace('#', '')
  const value = normalized.length === 3
    ? normalized.split('').map((c) => c + c).join('')
    : normalized

  const num = Number.parseInt(value, 16)
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  }
}

function luminance(channel: number) {
  const v = channel / 255
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}

export function contrastRatio(fg: string, bg: string) {
  const fgRgb = hexToRgb(fg)
  const bgRgb = hexToRgb(bg)

  const l1 = 0.2126 * luminance(fgRgb.r) + 0.7152 * luminance(fgRgb.g) + 0.0722 * luminance(fgRgb.b)
  const l2 = 0.2126 * luminance(bgRgb.r) + 0.7152 * luminance(bgRgb.g) + 0.0722 * luminance(bgRgb.b)

  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}
