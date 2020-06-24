import React, { useEffect } from 'react'
import './GraphBoard.css'
import Chart from './Chart'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as TransformAction from '../actions/TransformAction'
import Spinner from './Spinner'
import Graph from './Graph'

function GraphBoard({charts, metrics, loading, width}) {

  const _renderMetrics = () => {
    if (metrics === undefined || metrics.length === 0) {
      return null
    }
    const {data, meta} = metrics[0]
    if (data === undefined || meta === undefined) {
      return null
    }
    return (
      <div className='Graph' key={charts ? (charts.length + 1) : 0}>
        <p><b>Train Metrics</b></p>
        <div>
          <div className='Table-Row'>
            <span className='Table-Cell'>{ meta !== null ? meta.main : (data.length === 1 ? 'Metric Type' : 'Cluster')}</span>
            <span className='Table-Cell'>{ meta !== null ? meta.columns[0] : 'Train' }</span>
            <span className='Table-Cell'>{ meta !== null ? meta.columns[1] : 'Test' }</span>
          </div>

          { Array.isArray(data) && data.map((tr, idx) => (
            <div key={idx} className='Table-Row'>
              <span className='Table-Cell'>{meta !== null ? meta.rows[idx] : data.length === 1 ? 'Score' : 'C-' + (idx+1)}</span>
              { Array.isArray(tr) && tr.map((td, j) => (
                <span key={j} className='Table-Cell'>{parseFloat(td).toFixed(4)}</span>
              ))}
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
      _renderMetrics()
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