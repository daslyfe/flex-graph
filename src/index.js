import React from 'react'
import styles from './styles.module.css'

export const canvasOptions = ({
  canvasHeight,
  canvasWidth,
  maintainAspectRatio,
  canvasColor
}) => {
  const heightMultiplier = maintainAspectRatio
    ? parseFloat(canvasWidth) / parseFloat(canvasHeight)
    : 1
  return {
    canvasWidth: canvasWidth || '50vw',
    canvasHeight: canvasHeight || '50vw',
    heightMultiplier: heightMultiplier,
    canvasColor: canvasColor
  }
}
export const Canvas = (props) => {
  const { children } = props
  const { canvasWidth, canvasHeight, heightMultiplier, canvasColor } =
    props.options || {}
  const viewBox = `0 0 100 ${(100 / (heightMultiplier || 1)).toString()}`

  return (
    <svg
      style={{
        width: canvasWidth || '50vw',
        height: canvasHeight || '50vw',
        background: canvasColor || 'beige'
      }}
      viewBox={viewBox}
      {...props}
    >
      {children}
    </svg>
  )
}

export function Path({ points, options }) {
  const { color, strokeWidth, smoothing, dashSize, fill } = options || {}
  const heightMultiplier = options.heightMultiplier || 1

  const svgPath = (points, command) => {
    // build the d attributes by looping over the points
    const d = points.reduce(
      (acc, point, i, a) =>
        i === 0
          ? // if first point
            `M ${point[0]},${point[1] / heightMultiplier}`
          : // else
            `${acc} ${command(point, i, a)}`,
      ''
    )
    return (
      <path
        style={{ width: 7, strokeDasharray: dashSize || 0 }}
        d={d}
        fill={fill || 'none'}
        stroke={color || 'black'}
        strokeWidth={strokeWidth || 0.5}
      />
    )
  }
  let controlPoint = null
  if (smoothing) {
    const line = (pointA, pointB) => {
      const lengthX = pointB[0] - pointA[0]
      const lengthY = pointB[1] - pointA[1]
      return {
        length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
        angle: Math.atan2(lengthY, lengthX)
      }
    }
    controlPoint = (current, previous, next, reverse) => {
      // When 'current' is the first or last point of the array
      // 'previous' or 'next' don't exist.
      // Replace with 'current'
      const p = previous || current
      const n = next || current
      // The smoothing ratio

      // Properties of the opposed-line
      const o = line(p, n)
      // If is end-control-point, add PI to the angle to go backward
      const angle = o.angle + (reverse ? Math.PI : 0)
      const length = o.length * smoothing
      // The control point position is relative to the current point
      const x = current[0] + Math.cos(angle) * length
      const y = current[1] + Math.sin(angle) * length
      return [x, y / heightMultiplier]
    }
  }
  const lineCommand = (point, i, a) => {
    if (smoothing) {
      // start control point
      const [cpsX, cpsY] = controlPoint(a[i - 1], a[i - 2], point)

      // end control point
      const [cpeX, cpeY] = controlPoint(point, a[i - 1], a[i + 1], true)
      return `C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point[0]},${
        point[1] / heightMultiplier
      }`
    } else {
      return `L ${point[0]} ${point[1] / heightMultiplier}`
    }
  }

  return svgPath(points, lineCommand)
}

export const Circle = (props) => {
  const { strokeColor, fillColor, strokeWidth } = props.options || {}
  const heightMultiplier = props.options.heightMultiplier || 1
  const radius = props.options.radius || 5
  const yRadius = (props.options.yRadius || radius) * heightMultiplier
  const origin = props.options.origin || 'center'
  const offset =
    origin === 'center'
      ? [0, 0]
      : origin === 'topLeft'
      ? [radius, yRadius]
      : origin === 'topRight'
      ? [-radius, yRadius]
      : origin === 'bottomRight'
      ? [-radius, -yRadius]
      : origin === 'bottomLeft'
      ? [radius, -yRadius]
      : [0, 0]

  const { point } = props

  return (
    <ellipse
      cx={`${(point[0] || 50) + offset[0]}%`}
      cy={`${(point[1] || 50) + offset[1]}%`}
      rx={`${radius}%`}
      ry={`${yRadius}%`}
      fill={fillColor || 'green'}
      stroke={strokeColor || 'black'}
      strokeWidth={strokeWidth || 0.5}
      {...props}
    />
  )
}

export const Rectangle = (props) => {
  const { point } = props
  const { fillColor, strokeColor, strokeWidth, radius, origin, rotate } =
    props.options || {}
  const heightMultiplier = props.options.heightMultiplier || 1
  const width = props.options.width || 3
  const height = (props.options.height || width) * heightMultiplier

  const offset =
    origin === 'center'
      ? [-width / 2, -height / 2]
      : origin === 'topLeft'
      ? [0, 0]
      : origin === 'topRight'
      ? [-width, 0]
      : origin === 'bottomRight'
      ? [-width, -height]
      : origin === 'bottomLeft'
      ? [0, -height]
      : [-width / 2, -height / 2]

  return (
    <rect
      transform={`rotate(${rotate || 0})`}
      transform-origin='center'
      x={`${(point ? point[0] : 50) + offset[0]}%`}
      y={`${(point ? point[1] : 50) + offset[1]}%`}
      width={`${width}%`}
      height={`${height}%`}
      fill={fillColor || 'yellow'}
      stroke={strokeColor || 'black'}
      strokeWidth={`${strokeWidth || 0.5}%`}
      rx={`${radius || 0}%`}
      {...props}
    />
  )
}

export const Text = (props) => {
  const { children, options, point, fontSize, fontWeight } = props
  const { color, fillColor } = options || {}
  const heightMultiplier = options.heightMultiplier || 1

  return (
    <text
      fill={color || 'black'}
      x={point ? point[0] : 50}
      y={(point ? point[1] : 50) / heightMultiplier}
      style={{
        fontSize: fontSize || 2,
        fontWeight: fontWeight
      }}
      {...props}
    >
      {children}
    </text>
  )
}
