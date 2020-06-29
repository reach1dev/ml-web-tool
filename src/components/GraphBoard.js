import React, { useEffect, useState } from 'react'
import './GraphBoard.css'
import Chart from './Chart'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as TransformAction from '../actions/TransformAction'
import Spinner from './Spinner'
import Graph from './Graph'

function GraphBoard({charts, metrics, loading, width}) {

  const [selectedGraph, setSelectedGraph] = useState(0)

  useEffect(() => {
    setSelectedGraph(0)
  }, [loading])

  const _renderMetricRow = (meta, idx) => {
    if (meta) {
      if (meta.columns.length > 1) {
        return meta.columns.map(c => <span className='Table-Cell'>{c}</span>)
      }
    }
    return [0,1].map((idx) => <span className='Table-Cell'>{ idx === 0 ? 'Train' : 'Test'}</span>)
  }

  const _renderMetrics = () => {
    if (metrics === undefined || metrics.length === 0) {
      return null
    }
    const {data, meta} = metrics[selectedGraph]
    if (data === undefined || meta === undefined) {
      return null
    }
    return (
      <div className='Graph' key={charts ? (charts.length + 1) : 0}>
        <p><b>{ meta && meta.title ? meta.title : 'Train Metrics'}</b></p>
        <div style={{overflowX: 'scroll', minWidth: 560, backgroundColor: 'gray'}}>
          <div className='Table-Row'>
            <span className='Table-Head'>{ meta ? meta.main : (data.length === 1 ? 'Metric Type' : 'Cluster')}</span>
            { _renderMetricRow(meta) }
          </div>

          { Array.isArray(data) && data.map((tr, idx) => (
            <div key={idx} className='Table-Row'>
              <span className='Table-Head'>{meta !== null ? meta.rows[idx] : data.length === 1 ? 'Score' : 'C-' + (idx+1)}</span>
              { Array.isArray(tr) && tr.map((td, j) => (
                <span key={j} className='Table-Cell'>{parseFloat(td).toFixed(4)}</span>
              ))}
              { meta && meta.columns.length === 1 ? <span className='Table-Cell' /> : null}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const _renderCharts = () => {
    if (!Array.isArray(charts)) {
      return null
    }
    if (metrics && metrics.length > 0) {
      return (
        <div>
          <Graph
            key={selectedGraph}
            title={'Train & test comparison'}
            chart={selectedGraph >= 0 && charts[selectedGraph]}
            width={width}
          />
          { charts.length > 1 ? (
            <div style={{display: 'flex', justifyContent: 'center', padding: 5, overflowX: 'scroll' }}>
            <div style={{display: 'flex',  width: 'fit-content', paddingLeft: 20, paddingRight: 10}}>{
              charts.map((c, idx) => (
                <input type='button' style={{marginLeft: 10, marginRight: 10}} 
                  onClick={() => setSelectedGraph(idx%charts.length)} value={'kFold-' + (idx+1)} />
              ))
            }</div>
          </div>
          ) : null}
        </div>
      )
    }
    return charts.map((chart, idx) => (
      <Graph
        key={idx}
        title={idx === 0 ? 'Input data' : 'Transformed data'}
        chart={chart}
        width={width}
      />
    ))
  }

  const _render = () => {
    if (loading) {
      return <div style={{margin: 'auto'}}>
        <Spinner loading={loading}></Spinner>
      </div>
    }
    return [
      _renderCharts(),
      selectedGraph >= 0 && _renderMetrics()
    ]
  }

  return (
    <div className='GraphBoard'>
      { _render() }
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    charts: state.chart.charts,
    metrics: state.metric.metrics,
    loading: state.chart.loading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    TransformAction: bindActionCreators(TransformAction, dispatch)
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(GraphBoard)