import React, { useEffect } from 'react'
import './GraphBoard.css'
import Graph from './Graph'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as TransformAction from '../actions/TransformAction'

function GraphBoard({transforms, transform, parentTransform, chartTop, chartBottom, loading, width, transformAction}) {

  useEffect(() => {
    if (transform) {
      //transformAction.getTransformData(transforms, transform.id)
    }
  }, [transforms, transform, parentTransform, transformAction])

  const inParams = parentTransform ? parentTransform.outputParameters.filter((p, idx) => transform.inputParameters[idx]).slice(2) : []

  return (
    <div className='GraphBoard'>
      { !loading && chartTop && chartTop.data && chartTop.data.length > 0 ? 
        <Graph 
          title='Input data graph' 
          inputParameterLabels={inParams}
          inputData={chartTop.data} 
          dataMin={chartTop.dataMin} 
          dataMax={chartTop.dataMax} 
          width={width}></Graph> : null }

      { !loading && chartBottom && chartBottom.data && chartBottom.data.length > 0 ? 
        <Graph 
          title='Output data graph'
          inputParameterLabels={transform && transform.outputParameters ? transform.outputParameters : inParams}
          inputData={chartBottom.data} 
          dataMin={chartBottom.dataMin} 
          dataMax={chartBottom.dataMax} 
          width={width}></Graph> : null }
      { loading ? <div>Loading input and output data</div> : null}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    transforms: state.transforms.transforms,
    chartTop: state.transforms.inputData || {data: []},
    chartBottom: state.transforms.outputData || {data: []},
    loading: state.transforms.getTransformLoading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    transformAction: bindActionCreators(TransformAction, dispatch)
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(GraphBoard)