import React, { useState } from 'react'
import { ComposedChart, Scatter, XAxis, YAxis, ZAxis, ReferenceArea, Legend, Rectangle, Tooltip, Label } from 'recharts'

export default function({contours, features, showGraph, columns, colors, width, height, targets, targetColumn, showData}) {
  const [showTrain, setShowTrain] = useState(true)
  const [showTest, setShowTest] = useState(true)

  const labels = ['x', 'y']
  const data = features.map((feature) => {
    return feature[0].map((f, idx) => {
      return {
        [labels[0]]: feature[0][idx],
        [labels[1]]: feature[1][idx],
      }
    })
  }).filter((f, idx) => contours.length !== 2 || ((showTrain || idx!==0) && (showTest || idx!==1)))
  
  const data1 = contours.reduce((all_contours, contour, k) => {
    if (!showTrain && k === 0) {
      return all_contours
    }
    if (!showTest && k === 1) {
      return all_contours
    }
    return all_contours.concat(contour[0].map((f, idx) => {
      return {
        [labels[0]]: contour[0][idx],
        [labels[1]]: contour[1][idx],
      }
    }))
  }, [])
  
  const data2 = contours.map((feature) => {
    return feature[0].map((f, idx) => {
      return {
        [labels[0]]: feature[0][idx],
        [labels[1]]: feature[1][idx],
      }
    })
  })

  return (
    <div>
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12}}>
        <b>Decision boundaries</b>
        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <input type='button' onClick={() => showGraph()} value='Show target graph' />
          <span style={{width: 10}}></span>
          <input type='button' onClick={() => showData()} value='Show values' />
        </div>
      </div>

      <ComposedChart
        style={{backgroundColor: 'white', paddingTop: 20, paddingRight: 20, margin: 'auto'}}
         width={width} height={height}
      >
        {/* <ReferenceArea x1={0} x2={1} y1={0} y2={1} style={{backgroundColor: 'blue'}} /> */}
        <XAxis 
          dataKey={labels[0]} 
          type='number'
          name={labels[0]} >
          <Label value={columns[0]} offset={0} position="insideBottomRight" />
        </XAxis>
        <YAxis 
          dataKey={labels[1]} 
          type='number'
          name={labels[1]} >          
          <Label value={columns[1] || targetColumn} offset={0} angle={90} position="topLeft" />
        </YAxis>

        { contours.length === 2 &&  (
          <Scatter 
            line={true}
            strokeWidth='2'
            data={data1} 
            fill={colors[2]}
            shape={<div></div>}>

          </Scatter>
        )}

        { data2.map((features, idx) => (
          <Scatter
            line={true}
            strokeWidth='2'
            data={features} 
            fill={colors[2]}
            shape={<div></div>}></Scatter>
        ))}

        { data.map((features, idx) => (
          <Scatter
            name={targets ? ('' + Object.keys(targets).sort()[idx]) : ('' + (idx+1))}
            fill={colors[(!showTrain && contours.length === 2 ? 1 : idx)%colors.length]}
            data={features}
            shape='circle'
          ></Scatter>
        ))}
        
        <Tooltip></Tooltip>
      </ComposedChart>
      { contours.length === 2 && <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 8, marginRight: 16}}>
        <input type='checkbox' onChange={(e) => setShowTrain(showTest ? e.target.checked : true)} checked={showTrain} />
        <span>Show train</span>
        <span style={{width: 10}}></span>
        <input type='checkbox' onChange={(e) => setShowTest(showTrain ? e.target.checked : true)} checked={showTest} />
        <span>Show test</span>
      </div> }
    </div>
  )
}

