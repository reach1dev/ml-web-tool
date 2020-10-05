import React, { useState, useEffect } from 'react'
import './PropertyWidget.scss'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as OptimizerAction from '../actions/OptimizerAction'
import { AlgorithmTypes, Classification } from '../constants/TransformParameters'

const OptimizeWidget = ({OptimizerAction, inputFileId, transforms, algorithmType, algParams, parameters, optimizeOpened, getParams}) => {
  const [optParams, setOptParams] = useState({})
  const [resParams, setResParams] = useState({})
  const [status, setStatus] = useState(0)

  useEffect(() => {
    const params = {}
    const res = {}
    parameters.forEach(p => {
      if (p.defaultRange) {
        params[p.name] = p.defaultRange
        res[p.name] = splitParamValue(p, p.defaultRange)
      }
    })
    setOptParams(params)
    setResParams(res)
  }, [parameters])

  const splitParamValue = (param, value) => {
    const parts = value.split(',')
    let values = []
    for(let i=0; i<parts.length; i++) {
      const str = parts[i]
      const part = str.split('~')
      if (part.length === 2 && param.type === 'number') {
        for(let i=parseInt(part[0]); i<parseInt(part[1]); i++) {
          values.push(i)
        }
      }
      if (part.length === 1 && param.type === 'number') {
        values.push(parseFloat(part[0]))
      }
      if (part.length === 1 && param.type === 'string') {
        values.push(part[0])
      }
    }
    return values
  }

  const changeParam = (param, value) => {
    if (param.type === 'boolean') {
      resParams[param.name] = value
      return
    }
    optParams[param.name] = value
    resParams[param.name] = splitParamValue(param, value)
    setResParams(resParams)
    setOptParams(optParams)
    setStatus(status+1)
  }

  const startOptimizer = () => {
    let params = {...algParams, ...resParams, type: algorithmType}
    if (getParams) {
      params = {
        ...params,
        ...getParams()
      }
    }
    console.log(JSON.stringify(params))
    if (params['trainLabel'] === '' && AlgorithmTypes[params['type']] === Classification)  {
      window.alert('Please save before optimizing')
      return
    }
    OptimizerAction.startOptimizer(inputFileId, transforms, params)
  }

  const _renderOptimizer = () => {
    return (
      <div style={{display: 'flex', alignItems: 'stretch', flexDirection: 'column'}}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <button 
            onClick={() => startOptimizer()} 
            style={{marginTop: 8, marginBottom: 6, flex: 1}} >Start optimize</button>
          <span style={{width: 20}} />
          <button 
            onClick={() => OptimizerAction.cancelOptimizer()} 
            style={{marginTop: 8, marginBottom: 6}} >Cancel</button>
        </div>
        { parameters.map((param, idx) => (
          <div key={idx} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8}}>
            <label style={{marginRight: 10}}>{param.name}{param.desc ? ' (' + param.desc + ')' : ''}</label>
            <input 
              type={param.type==='boolean' ? 'checkbox' : 'text'} 
              style={param.type==='boolean' ? {} : {width: '100%', maxWidth: 180}} 
              value={status >= 0 && optParams[param.name]} 
              onChange={(e)=> changeParam(param, param.type==='boolean' ? e.target.checked : e.target.value, param.type)}>
            </input>
          </div>
        )) }
      </div>
    )
  }

  return (
    <div className='Property-Item-Header' style={{justifyContent: 'flex-end'}}>
      { optimizeOpened ? _renderOptimizer() : (
        <button onClick={() => OptimizerAction.openOptimizer(algParams.type)} >Optimize parameters</button>
      ) }
    </div>
  )
}

const mapStateToProps = (state) => {
  console.log("mapStateToProps " + JSON.stringify(state.trainer.options))
  return {
    inputFileId: state.transforms.fileId,
    transforms: state.transforms.transforms,
    algParams: state.trainer.options,
    optimizeOpened: state.optimizer.opened
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    OptimizerAction: bindActionCreators(OptimizerAction, dispatch)
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(OptimizeWidget)