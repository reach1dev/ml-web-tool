import React, { useState, useEffect } from 'react'
import {Line} from 'react-chartjs-2'

const LineColors = ['#ffa600','#aaf95d6a', '#aaa05195', '#ff7c43', '#aa003f5c', '#aa665191']

export default function({chart, title = 'Chart', width}) {
  const columns = chart.data.slice(2).map(d => d.col)
  const [hides, setHides] = useState(columns.map((col) => false))

  const getRanges = () => {
    var ranges = [];
    columns.forEach((col, idx) => {
      if (!hides[idx]) {
        ranges.push([chart.maxes[col] - chart.mins[col], chart.mins[col], chart.maxes[col]]);
      }
    })
    ranges.sort().reverse()
    
    for(var i=0; i<ranges.length-1; i++) {
      const rate = ranges[i][0]/ranges[i+1][0]
      if (columns[0].startsWith('C-') || rate>2) {
        return [ranges[0], ranges[i+1]]
      }
    }
    return [ranges[0]]
  }

  const getState = (h) => {
    const ranges = getRanges()
    return {
      labels: chart.data[0].data,
      datasets: chart.data.slice(2).filter((d, idx) => !h[idx]).map((d, idx) => {
        const range = chart.maxes[columns[idx]] - chart.mins[columns[idx]]
        const yAxis = (ranges.length > 1 && range < ranges[1][0]*2) ? 'y_1' : 'y_0'
        return {
          label: d.col,
          borderColor: LineColors[idx%LineColors.length],
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
          lineTension: 0.5,
          data: d.data,
          yAxisId: yAxis
      }})
    }
  }

  const [state, setState] = useState(getState(hides))

  useEffect(() => {
    setState(getState(hides))
  }, [width])

  const changeHide = (idx, h) => {
    if (h || hides.filter(h=>!h).length > 1) {
      const nh = hides.map((h0, i) => (i===idx ? !h : h0))
      setHides(nh)
      setState(getState(nh))
    }
  }

  const _renderHides = () => {
    let alignedCols = []
    let length = 4
    let cols = []
    columns.forEach((col, idx) => {
      cols.push({name: col, idx: idx})
      length += col.length + 4
      if (length > 60) {
        alignedCols.push(cols)
        cols = []
        length = 0
      }
    })
    alignedCols.push(cols)
    return alignedCols.map((cols, idx) => {
      return (
        <div key={idx} style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8}}>
          { cols.map((col, j) => (
            <span key={j}>
              <input type='checkbox' readOnly onChange={(e) => changeHide(col.idx, e.target.checked)} checked={!hides[col.idx]} /> 
              {col.name} &nbsp;
            </span>
          )) }
        </div>
      )
    })
  }

  const _renderChart = () => {
    const ranges = getRanges()
    return (
      <Line
        data={state}
        width={width}
        height={width*0.5}
        options={{
          title:{
            display:true,
            text: title,
            fontSize:20
          },
          legend:{
            display:true,
            position:'right'
          },
          maintainAspectRatio: false,
          responsive: true,
          scales: {
            xAxes: [{
              ticks: {
                maxTicksLimit: 6,
                maxRotation: 0,
                minRotation: 0
              }
            }],
            yAxes: ranges.map((r, idx) => {
              return {
                id: 'y_' + idx,
                type: 'linear',
                position: (idx === 0 ? 'left' : 'right'),
                ticks: {
                  min: r[1],
                  max: r[2]
                }
              }
            })
          }
        }}
      />
    )
  }

  return (
    <div style={{width: width, height: width*0.5 + 100}}>
      { _renderChart() }
      { _renderHides() }
    </div>
  )
}