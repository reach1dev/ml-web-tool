import React, { useState, useEffect } from 'react'
import './GraphBoard.css'
import { LineChart, XAxis, YAxis, Tooltip, CartesianGrid, Line, ReferenceArea } from 'recharts'

const LineColors = ['#3d93ca', '#acfc7f', '#f4a4c1', '#c4a573', '#7a5892', '#009ab2']

export default function({title, inputData, dataMin, dataMax, width}) {
  const [dotHide, setDotHide] = useState(true)
  let inputType = inputData && inputData.length > 0 ? Object.keys(inputData[0]).filter((k) => k!=='undefined' && k!=='Date' && k !== 'Time') : {}
  const [hideArray] = useState(inputType.map((i) => false))
  const [showZoomOut, setShowZoomOut] = useState(false)

  const getAxisYDomain = (from, to, ref, offset) => {
    const refData = (from === '' && to === '') ? inputData : inputData.slice(from, to);
    let [ bottom, top ] = [ refData[0][ref], refData[0][ref] ];
    refData.forEach( d => {
      if ( d[ref] > top ) top = d[ref];
      if ( d[ref] < bottom ) bottom = d[ref];
    });
    return [ Math.floor((bottom)), Math.ceil(top) ]
  }

  const [ bottom, top ] = getAxisYDomain( '', '', 'High', 1 );
  const [ bottom2, top2 ] = getAxisYDomain( '', '', 'Vol', 1 );
  
  const initialState = {
    data: inputData,
    left: 'dataMin',
    right: 'dataMax',
    refAreaLeft: '',
    refAreaRight: '',
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
    const [ bottom, top ] = getAxisYDomain( refAreaLeft, refAreaRight, 'High', 1 );
    const [ bottom2, top2 ] = getAxisYDomain( refAreaLeft, refAreaRight, 'Vol', 1 );
    
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
    const [ bottom, top ] = getAxisYDomain( '', '', 'High', 1 );
    const [ bottom2, top2 ] = getAxisYDomain( '', '', 'Vol', 1 );
    setState({
      ...initialState,
      bottom, top,
      bottom2, top2
    });
    setShowZoomOut(false)
  }

  const changeHide = (idx) => {
    hideArray[idx] = !hideArray[idx]
    zoomOut()
  }

  return (
    <div className='Graph' style={{marginBottom: 4, height: 'fit-content', alignItems: 'stretch'}}>
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12}}>
        <b>{title}</b>
        { (showZoomOut) ? <input type='button' onClick={() => zoomOut()} value='Zoom out' /> : null }
      </div>
      <LineChart
        width={width || 360}
        height={330}
        data={state.data}
        style={{backgroundColor: 'white'}}
        onMouseDown={e => e && setState({ ...state, refAreaLeft: e.activeLabel })}
        onMouseMove={e => e && state.refAreaLeft && setState({ ...state,  refAreaRight: e.activeLabel })}
        onMouseUp={e => e && zoom()}
        margin={{ top: 25, right: 20, left: 5, bottom: 5 }}
      >
        <CartesianGrid stroke="#C5C5f5" />
        <XAxis 
          allowDataOverflow={true}
          dataKey="Time"
          domain={[state.left, state.right]}
          type="number"
        />
        <YAxis
          allowDataOverflow={true}
          domain={[state.bottom, state.top]}
          type="number"
          yAxisId="1"
        />
        <YAxis
          allowDataOverflow={true}
          orientation='right'
          domain={[state.bottom2, state.top2]}
          type="number"
          yAxisId="2"
        />
        <Tooltip />
        { inputType.map((inputValue, idx) => (
          <Line type="monotone" 
            dataKey={inputType[idx]} 
            hide={hideArray[idx]} 
            dot={!dotHide}
            stroke={LineColors[idx]} 
            yAxisId={inputType[idx] !== 'Vol' && inputType[idx] !== 'OI' ? 1 : 2}></Line>
        )) }
        { (state.refAreaLeft && state.refAreaRight) ? (
            <ReferenceArea yAxisId="1" x1={state.refAreaLeft} x2={state.refAreaRight} stopColor="blue" strokeOpacity={0.3} /> ) : null
        }
      </LineChart>
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8}}>
        <input type='checkbox' readOnly onClick={() => setDotHide(!dotHide)} checked={!dotHide} />Dot &nbsp;
        { inputType.map((inputValue, idx) => (
          <span>
            <input type='checkbox' readOnly onClick={() => changeHide(idx)} checked={!hideArray[idx]} /> 
            {inputType[idx]} &nbsp;
          </span>
        )) }
      </div>
    </div>
  )
}