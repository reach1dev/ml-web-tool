import React, { useEffect } from 'react'
import './GraphBoard.css'
import Graph from './Graph'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as TransformAction from '../actions/TransformAction'

function GraphBoard({transforms, transform, parentTransform, chartTop, chartBottom, trainMetrics, loading, width, transformAction}) {

  useEffect(() => {
    if (transform) {
      //transformAction.getTransformData(transforms, transform.id)
    }
  }, [transforms, transform, parentTransform, transformAction])

  const inParams = parentTransform ? parentTransform.outputParameters.filter((p, idx) => transform.inputParameters ? transform.inputParameters[idx] : false).slice(2) : []

  const _renderMetrics = () => {
    if (loading || trainMetrics === null) {
      return null
    }

    return (
      <div className='Graph'>
        <p><b>Train Metrics</b></p>
        <div>
          <div className='Table-Row'>
            <span className='Table-Cell'>Cluster</span>
            <span className='Table-Cell'>Train</span>
            <span className='Table-Cell'>Test</span>
          </div>

          { trainMetrics.map((tr, idx) => (
            <div className='Table-Row'>
              <span className='Table-Cell'>{'C-' + (idx+1)}</span>
              { tr.map((td) => (
                <span className='Table-Cell'>{td}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='GraphBoard'>
      { !loading && chartTop ? 
        <Graph 
          title='Input data graph' 
          inputParameterLabels={inParams}
          inputData={chartTop}
          width={width}></Graph> : null }

      { !loading && chartBottom ? 
        <Graph 
          title='Output data graph'
          inputParameterLabels={transform && transform.outputParameters ? transform.outputParameters : inParams}
          inputData={chartBottom} 
          width={width}></Graph> : null }
      { loading ? <div>Loading input and output data</div> : null}

      { _renderMetrics() }
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    transforms: state.transforms.transforms,
    chartTop: state.transforms.inputData || null,
    chartBottom: state.transforms.outputData || null,
    trainMetrics: state.transforms.trainMetrics || null,
    loading: state.transforms.getTransformLoading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    transformAction: bindActionCreators(TransformAction, dispatch)
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(GraphBoard)