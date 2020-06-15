import React, { useState, useEffect } from 'react'
import './GraphBoard.css'
import { ComposedChart, AreaChart,defs, Area, XAxis, YAxis, Tooltip, CartesianGrid, Line, ReferenceArea } from 'recharts'
import moment from 'moment'

const LineColors = ['#ffa600','#f95d6a', '#a05195', '#ff7c43', '#003f5c', '#665191']
const AreaColors = LineColors

const round = x => Math.round((x + Number.EPSILON) * 100) / 100

export default function({title, chart, width, hides}) {
  const [dotHide, setDotHide] = useState(true)
  const [columns] = useState(chart.data && chart.data.length > 0 ? Object.keys(chart.data[0]).filter((k) => k!=='undefined' && k!=='Date' && k !== 'Time') : [])
  const [showDate, setShowDate] = useState(columns[0] === 'Date' ? true : false)
  const [hideArray] = useState(columns.map((col) => hides(col)))
  const [showZoomOut, setShowZoomOut] = useState(false)
  const [yAxisName, setYAxisName] = useState(columns[0] ? columns[0].startsWith('C-') ? '' : columns[0] :'')
  const [yAxisName2, setYAxisName2] = useState(columns[columns.length-1] ? columns[columns.length-1].startsWith('C-') ? '' : columns[columns.length-1] : '')

  const getAxisYDomain = () => {
    var ranges = [];
    columns.forEach((col, idx) => {
      if (!hideArray[idx]) {
        if (!chart.maxes) {
          return [0, 0, [ ]]
        }
        ranges.push([col, chart.maxes[col] - chart.mins[col]]);
      }
    })
    ranges.sort(function(a, b) {
      return b[1] - a[1];
    })
    let axis = {}
    for(var i=0; i<ranges.length-1; i++) {
      const rate = ranges[i][1]/ranges[i+1][1]
      axis[ranges[i][0]] = 1;
      if (!columns[0].startsWith('C-') && rate>2) {
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
  const [ bottom, top ] = [chart.mins[firstCol], chart.maxes[firstCol]]
  const [ bottom2, top2 ] = [chart.mins[secondCol], chart.maxes[secondCol]]
  
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

  const zoom = () => {
    let { refAreaLeft, refAreaRight, data } = state;

		if ( refAreaLeft === refAreaRight || refAreaRight === '' ) {
    	setState( () => ({
        ...state,
      	refAreaLeft : '',
        refAreaRight : ''
      }) );
      //setShowZoomOut(false)
    	return;
    }
    setShowZoomOut(true)

		// xAxis domain
	  if ( refAreaLeft > refAreaRight ) 
    		[ refAreaLeft, refAreaRight ] = [ refAreaRight, refAreaLeft ];

    // yAxis domain
    const [ bottom, top ] = getAxisYDomain( refAreaLeft, refAreaRight, yAxisName, 1 );
    const [ bottom2, top2 ] = getAxisYDomain( refAreaLeft, refAreaRight, yAxisName2, 1 );
    
    setState( () => ({
      ...state,
      refAreaLeft : '',
      refAreaRight : '',
    	data : data.slice(),
      left : refAreaLeft,
      right : refAreaRight,
      bottom, top,
      bottom2, top2
    } ) );
  }

  const zoomOut = () => {
    const [ firstCol, secondCol, yAxis4Cols ] = getAxisYDomain()
    const [ bottom, top ] = [chart.mins[firstCol], chart.maxes[firstCol]]
    const [ bottom2, top2 ] = [chart.mins[secondCol], chart.maxes[secondCol]] 
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
    return moment(time).format('MM/DD/YYYY')
  }

  return (
    <div className='Graph' style={{marginBottom: 4, height: 'fit-content', alignItems: 'stretch'}}>
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12}}>
        <b>{title}</b>
        { (showZoomOut) ? <input type='button' onClick={() => zoomOut()} value='Zoom out' /> : null }
      </div>
      <ComposedChart
        width={width || 360}
        height={390 - (Math.ceil(columns.length/7))*24}
        data={state.data}
        style={{backgroundColor: 'white'}}
        //onMouseDown={e => e && setState({ ...state, refAreaLeft: e.activeLabel })}
        //onMouseMove={e => e && state.refAreaLeft && setState({ ...state,  refAreaRight: e.activeLabel })}
        //onMouseUp={e => e && zoom()}
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
          allowDataOverflow={true}
          dataKey={showDate ? "Date" : "Time"}
          tickFormatter={showDate ? formatXAxis : null}
          domain={[state.left, state.right]}
          type="number"
        />
        <YAxis
          allowDataOverflow={true}
          domain={[round(state.bottom), round(state.top)]}
          type="number"
          yAxisId="1"
        />
        <YAxis
          allowDataOverflow={true}
          orientation='right'
          domain={[round(state.bottom2), round(state.top2)]}
          type="number"
          yAxisId="2"
        />
        <Tooltip />
        { columns.map((col, idx) => (
          <Line key={idx} type="monotone" 
            dataKey={columns[idx]} 
            hide={hideArray[idx]} 
            dot={!dotHide}
            fill={'url(#' + col +')'}
            stroke={LineColors[idx%LineColors.length]}
            yAxisId={columns[idx].startsWith('C-') ? 1 : (yAxis4Cols[col] ? 1 : 2)}></Line>
        )) }
        { (state.refAreaLeft && state.refAreaRight) ? (
            <ReferenceArea yAxisId="1" x1={state.refAreaLeft} x2={state.refAreaRight} stopColor="blue" strokeOpacity={0.3} /> ) : null
        }
      </ComposedChart>
      { Array.from(Array(Math.ceil(columns.length/7)).keys()).map((idx) => {
        const cols = columns.slice(idx*7, (idx+1)*7)
        return (
          <div key={idx} style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8}}>
            {idx === 0 && columns[0] === 'Date'? <span>
            <input type='checkbox' readOnly onClick={() => setShowDate(!showDate)} checked={showDate} />Show Date </span> : null } &nbsp;
            {idx === 0 ? <span>
            <input type='checkbox' readOnly onClick={() => setDotHide(!dotHide)} checked={!dotHide} />Dot </span> : null } &nbsp;
            { cols.map((col, j) => (
              <span key={j}>
                <input type='checkbox' readOnly onClick={() => changeHide(idx*7+j)} checked={!hideArray[idx*7+j]} /> 
                {cols[j]} &nbsp;
              </span>
            )) }
          </div>
        )
      })}
      
    </div>
  )
}