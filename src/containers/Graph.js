import React, { useState, useEffect } from 'react'
import './GraphBoard.scss'
import { ComposedChart, Scatter, XAxis, YAxis, Tooltip, CartesianGrid, Line, ReferenceArea, ScatterChart } from 'recharts'
import moment, { min } from 'moment'
import DataView from './DataView'
import ContoursGraph from './ContoursGraph'
import SmallButton from '../components/SmallButton'

const LineColors = ['#ffa600','#f95d6a', '#a05195', '#ff7c43', '#003f5c', '#665191']
const AreaColors = LineColors

const round = x => Math.round((x + Number.EPSILON) * 100) / 100
const GRAPH_COL = 6

export default function({title, chart, indexColumn, width, height}) {

  if (chart === null) {
    return null
  }

  const [dotHide, setDotHide] = useState(true)
  const [columns] = useState(chart.data && chart.data.length > 0 ? Object.keys(chart.data[0]).filter((k) => k!=='undefined' && k!==indexColumn && k !== 'Time' && k !== 'Main Parameter') : [])
  const [showDate, setShowDate] = useState(chart.data.length > 0 && Object.keys(chart.data[0]).indexOf('Date') >= 0 ? true : false)
  const [hideArray] = useState(columns.map((col) => false))
  const [showZoomOut, setShowZoomOut] = useState(false)
  
  const [showData, setShowData] = useState(false)
  const [showContours, setShowContours] = useState(chart.contours && chart.contours.length === 2)

  const getAxisYDomain = () => {
    if (columns.length === 0) {
      return ['', '', []]
    }
    if (columns[0].startsWith('C-') || columns[0].startsWith('Target')) {
      return ['', '' , []]
    }
    var ranges = [];
    columns.forEach((col, idx) => {
      if (!hideArray[idx]) {
        if (!chart.maxes) {
          return [0, 0, [ ]]
        }
        let delta = chart.maxes[col] - chart.mins[col]
        delta = Math.log2(chart.maxes[col]) * delta
        delta = delta > 0 ? delta : -delta
        ranges.push([col, delta > 0 ? delta : -delta]);
      }
    })
    ranges.sort(function(a, b) {
      return b[1] - a[1];
    })
    let axis = {}
    for(var i=0; i<ranges.length-1; i++) {
      const rate = ranges[i][1]/ranges[i+1][1]
      axis[ranges[i][0]] = 1;
      if (columns[0].startsWith('C-') || rate>1.2) {
        return [ranges[0][0], ranges[i+1][0], axis]
      }
    }
    if (ranges.length > 0) {
      return [ranges[0][0], ranges[0][0], axis]
    }
    console.log('bug ')
    return [0, 0, []]
  }

  const [firstCol, secondCol, yAxis4Cols] = getAxisYDomain()
  if (firstCol === 0) { return null }
  const [ bottom, top ] = firstCol === '' ? [
    Object.keys(chart.mins).reduce((m, k) => (m === null || m>chart.mins[k])?chart.mins[k]:m, null), 
    Object.keys(chart.maxes).reduce((m, k) => m === null || m<chart.maxes[k]?chart.maxes[k]:m, null)
  ] : [chart.mins[firstCol], chart.maxes[firstCol]]
  const [ bottom2, top2 ] = secondCol === '' ? [0, 0] : [chart.mins[secondCol], chart.maxes[secondCol]]
  
  const initialState = {
    data: chart.data,
    left: 'dataMin',
    right: 'dataMax',
    refAreaLeft: '',
    refAreaRight: '',
    firstCol,
    secondCol,
    yAxis4Cols,
    bottom, top,
    bottom2, top2,
    animation: true,
  }
  const [state, setState] = useState(initialState)
  

  const zoomOut = () => {
    const [ firstCol, secondCol, yAxis4Cols ] = getAxisYDomain()
    const [ bottom, top ] = firstCol === '' ? [
      Object.keys(chart.mins).reduce((m, k) => (m === null || m>chart.mins[k])?chart.mins[k]:m, null), 
      Object.keys(chart.maxes).reduce((m, k) => m === null || m<chart.maxes[k]?chart.maxes[k]:m, null)
    ] : [chart.mins[firstCol], chart.maxes[firstCol]]
    const [ bottom2, top2 ] = secondCol === '' ? [0, 0] : [chart.mins[secondCol], chart.maxes[secondCol]]
    setState({
      ...initialState,
      yAxis4Cols,
      bottom, top,
      bottom2, top2,
      firstCol, secondCol
    });
    setShowZoomOut(false)
  }

  const changeHide = (idx) => {
    if (hideArray.filter(h => !h).length === 1 && !hideArray[idx]) {
      return
    }
    hideArray[idx] = !hideArray[idx]
    zoomOut()
  }

  const formatXAxis = (time) => {
    const mt = moment(time)
    return mt.isValid() ? mt.format('MM/DD/YYYY hh/mm/ss') : 'Next'
  }

  const showValues = () => {
    setShowData(true)
  }

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

  const deltaMul = 0.0
  const delta = (state.top - state.bottom) * deltaMul
  const delta2 = (state.top2 - state.bottom2) * deltaMul
  const shCols = columns.filter((c, idx) => !hideArray[idx])
  console.log(JSON.stringify(shCols))

  if (showData) {
    let newCols = columns
    if (Object.keys(chart.data[0]).indexOf('Date') >= 0) {
      if (Object.keys(chart.data[0]).indexOf('Time') >= 0 && chart.data[0]['Time'] !== 1) {
        newCols = ['Date', 'Time', ...columns]
      } else {
        newCols = ['Date', ...columns]
      }
    } else if (Object.keys(chart.data[0]).indexOf('Main Parameter') >= 0) {
      newCols = ['Main Parameter', ...columns]
    } else {
      newCols = ['No.', ...columns]
    }
    return (
      <div className='Graph' style={{marginBottom: 4, height: 'fit-content', alignItems: 'stretch', flex: 1}}>
        <DataView 
          title={title}
          data={chart.data}
          columns={newCols}
          showGraph={() => setShowData(false)}
        ></DataView>
      </div>
    )
  }

  const getTargets = () => {
    if (columns[0] === 'Target') {
      let counts = {}
      state.data.forEach(d => {
        const t = d['Target']
        if (typeof counts[t] === 'undefined') {
          counts[t] = 1
        } else {
          counts[t] = counts[t] + 1
        }
      })
      if (Object.keys(counts).length > 4) {
        return null
      }
      return counts
    }
    return null
  }

  const _showTargetValues = () => {
    if (columns[0] === 'Target') {
      let counts = {}
      state.data.forEach(d => {
        const t = d['Target']
        if (typeof counts[t] === 'undefined') {
          counts[t] = 1
        } else {
          counts[t] = counts[t] + 1
        }
      })
      if (Object.keys(counts).length > 4) {
        return null
      }
      return Object.keys(counts).map((val, idx) => (
        <span style={{marginRight: 20, marginLeft: 20}}>{val} - {(counts[val] / state.data.length * 100).toFixed(2)}%</span>
      ))
    }
    return null
  }

  if (showContours) {
    const targets = getTargets()
    return (
      <div className='Graph' style={{marginBottom: 4, height: 'fit-content', alignItems: 'stretch', flex: 1}}>
        <div style={{paddingBottom: 10}}>
          <b>Target values :</b>
          { targets && Object.keys(targets).map((val, idx) => (
            <span style={{marginRight: 20, marginLeft: 20}}>{val} - {(targets[val] / state.data.length * 100).toFixed(2)}%</span>
          )) }
        </div>
        <ContoursGraph
          targets={targets}
          width={width-10}
          colors={LineColors}
          columns={chart.columns || ['x', 'y']}
          targetColumn={chart.meta.targetColumn}
          height={height*1.4}
          contours={chart.contours}
          features={chart.features}
          showGraph={() => setShowContours(false)}
          showData={() => setShowData(true)}
        ></ContoursGraph>
      </div>
    )
  }

  return (
    <div className='Graph' style={{marginBottom: 4, height: 'fit-content', alignItems: 'stretch', flex: 1}}>
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12}}>
        <b className='SmallTitle'>{chart.title || title}</b>
        { (showZoomOut) ? <SmallButton type='button' onClick={() => zoomOut()} value='Zoom out' /> : null }
        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <SmallButton type='button' onClick={() => showValues()} value='Show values' />
          { chart.features && chart.features.length > 0 &&
            <SmallButton style={{marginLeft: 10}} type='button' onClick={() => setShowContours(true)} value='Show scatters'  /> }
        </div>
      </div>
      <div style={{paddingBottom: 10}}>
        <b>Target values :</b>
        { _showTargetValues() }
      </div>

      <ComposedChart
        width={width || 360}
        height={height+90 - (Math.ceil(columns.length/GRAPH_COL))*24}
        data={state.data}
        style={{backgroundColor: 'white', margin: 'auto'}}
        margin={{ top: 25, right: 20, left: 5, bottom: 5 }}
      >
        <defs>
          { columns.map((col, idx) => (
            <linearGradient key={idx} id={col} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={AreaColors[idx%AreaColors.length]} stopOpacity={0.4}/>
              <stop offset="95%" stopColor={AreaColors[idx%AreaColors.length]} stopOpacity={0}/>
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid stroke="#C5C5f5" />
        <XAxis 
          //allowDataOverflow={true}
          dataKey={showDate && indexColumn === "Date" ? "Date" : (indexColumn === 'Date' ? 'Time' : indexColumn)}
          tickFormatter={showDate && indexColumn === "Date" ? formatXAxis : null}
          domain={[state.left, state.right]}
          interval='preserveStartEnd'
          type={'category'} //indexColumn === 'Date' || indexColumn === 'Time ' ? 'number' : 
        />
        <YAxis
          allowDataOverflow={true}
          domain={[round(state.bottom-delta), round(state.top+delta)]}
          type="number"
          yAxisId="1"
        />
        {state.bottom2 !== state.top2 && <YAxis
          allowDataOverflow={true}
          orientation='right'
          domain={[round(state.bottom2-delta2), round(state.top2+delta2)]}
          type="number"
          yAxisId="2"
        /> }
        <Tooltip labelFormatter={showDate ? formatXAxis : null} />
        { columns.map((col, idx) => (
          <Line key={idx} type="monotone" 
            dataKey={columns[idx]} 
            hide={hideArray[idx]} 
            dot={!dotHide}
            fill={'url(#' + col +')'}
            stroke={LineColors[idx%LineColors.length]}
            yAxisId={(columns[idx].startsWith('C-') || columns[0].startsWith('Target') || state.bottom2 === state.top2)  ? 1 : (state.firstCol === state.secondCol || yAxis4Cols[col] ? 1 : 2)}></Line>
        )) }
        { (state.refAreaLeft && state.refAreaRight) ? (
            <ReferenceArea yAxisId="1" x1={state.refAreaLeft} x2={state.refAreaRight} stopColor="blue" strokeOpacity={0.3} /> ) : null
        }
      </ComposedChart>
      
      { alignedCols.map((cols, idx) => {
        return (
          <div key={idx} style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8}}>
            {idx === 0 && chart.data.length > 0 && Object.keys(chart.data[0]).indexOf('Date') >= 0? <span>
            <input type='checkbox' readOnly onClick={() => setShowDate(!showDate)} checked={showDate} />Show Date </span> : null } &nbsp;
            {/* {idx === 0  ? <span>
            <input type='checkbox' readOnly onClick={() => setShowScatter(!showScatter)} checked={showScatter} />Show Scatter </span> : null } &nbsp; */}
            {idx === 0 ? <span>
            <input type='checkbox' readOnly onClick={() => setDotHide(!dotHide)} checked={!dotHide} />Dot </span> : null } &nbsp;
            { cols.map((col, j) => (
              <span key={j}>
                <input type='checkbox' readOnly onClick={() => changeHide(col.idx)} checked={!hideArray[col.idx]} /> 
                {col.name} &nbsp;
              </span>
            )) }
          </div>
        )
      })}
      
    </div>
  )
}