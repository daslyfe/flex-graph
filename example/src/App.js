import React from 'react'

import { Canvas } from 'flex-graph'
import { Path, Circle, Rectangle, Text, canvasOptions } from 'flex-graph'

import 'flex-graph/dist/index.css'

const canv = canvasOptions({
  canvasWidth: '100vh',
  canvasHeight: '100vh',
  maintainAspectRatio: true,
  canvasColor: 'beige'
})

const App = () => {
  return (
    <div>
      <Canvas options={{ ...canv }}>
        <Path
          points={[
            [0, 0],
            [10, 80],
            [60, 30]
          ]}
          options={{ smoothing: 0.2, ...canv }}
        />
        <Rectangle 
          options={{ origin: 'center', height: 10, width: 10, rotate: 45, ...canv }}
        />
        <Circle point={[50, 50]} options={{ origin: 'center', ...canv }} />
        {/* <Circle point={[50, 50]} options={{fillColor: 'orange', origin: "center", ...canv }} /> */}
        {/* <Text point={[20,80]} options={{ ...canv }}>
          Jade Rose
        </Text> */}
      </Canvas>
    </div>
  )
}

export default App
