import React from 'react'
import { ComposedChart, Scatter, XAxis, YAxis, ZAxis, ReferenceArea } from 'recharts'

export default function({contours, features, showGraph, width, height}) {

  const labels = ['x', 'y']
  const data = features.map((feature) => {
    return feature[0].map((f, idx) => {
      return {
        [labels[0]]: feature[0][idx],
        [labels[1]]: feature[1][idx],
      }
    })
  })
  // const data2 = contours.map((feature) => {
  //   return feature[0].map((f, idx) => {
  //     return {
  //       [labels[0]]: feature[0][idx],
  //       [labels[1]]: feature[1][idx],
  //     }
  //   })
  // })
  const colors = ['red', 'blue', 'green']
  const points = contours.map((c) => {
    return c.map((xy) => {
      return [xy[1]*(width-60)/100+65, -xy[0]*(height-30)/100+height-35]
    })
  })

  return (
    <div>
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12}}>
        <b>Decision boundaries</b>
        <input type='button' onClick={() => showGraph()} value='Show graph' />
      </div>

      <ComposedChart
        style={{backgroundColor: '#eee', paddingTop: 20, paddingRight: 20}}
         width={width} height={height}
      >
        {/* <ReferenceArea x1={0} x2={1} y1={0} y2={1} style={{backgroundColor: 'blue'}} /> */}
        <XAxis 
          dataKey={labels[0]} 
          type='number'
          name={labels[0]} />
        <YAxis 
          dataKey={labels[1]} 
          type='number'
          name={labels[1]} />

        { points.map((pts, idx) => (
          <polygon 
            points={pts} 
            fillOpacity={0.5}
            fill={colors[0]}>

          </polygon>
        ))}

        { data.map((features, idx) => (
          <Scatter
            name={'' + idx}
            fill={colors[idx%colors.length]}
            data={features}
          ></Scatter>
        ))}
      </ComposedChart>
    </div>
  )
}

