// src/design-system/components/Badge.jsx
import { colors, radius, typography } from "../tokens"

const VARIANTS = {
  follicular: { bg: colors.follicularLt, color: colors.sageDk },
  ovulation:  { bg: colors.ovulationLt,  color: "#8B4050" },
  luteal:     { bg: colors.lutealLt,     color: "#7A4A28" },
  menstrual:  { bg: colors.menstrualLt,  color: "#3A5070" },
  default:    { bg: colors.creamDeep,    color: colors.cocoa },
}

export function Badge({ label, variant = "default", size = "md" }) {
  const { bg, color } = VARIANTS[variant] ?? VARIANTS.default
  const fontSize = size === "sm" ? typography.sizeXs : typography.sizeSm

  return (
    <span style={{
      display:      "inline-block",
      background:   bg,
      color:        color,
      fontSize:     fontSize,
      fontFamily:   typography.fontBody,
      fontWeight:   500,
      padding:      "3px 10px",
      borderRadius: radius.full,
      letterSpacing: ".02em",
    }}>
      {label}
    </span>
  )
}