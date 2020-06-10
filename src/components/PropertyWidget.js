import React, { useState, useEffect } from 'react'
import './PropertyWidget.css'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as TransformAction from '../actions/TransformAction'
import { IDS } from './ItemTypes'
import { TransformParameters } from './TransformParameters'

function PropertyWidget({hide, setHide, inputFile, inputFileId, transforms, transform, transformAction}) {

  const [file, setFile] = useState(null)
  const [error, setError] = useState(false)
  const [inputFilters, setInputFilters] = useState(transform ? transform.inputFilters || [] : [])
  const [filterChanged, setFilterChanged] = useState(1)
  const [parameters, setParameters] = useState(transform ? transform.parameters: {})
  const [parameterTypes, setParameterTypes] = useState([])
  const [algorithmType, setAlgorithmType] = useState(0)
  const [trainLabel, setTrainLabel] = useState('')
  const [testShift, setTestShift] = useState(1)
  
  useEffect(() => {
    setInputFilters(transform ? transform.inputFilters || [] : [])
    setParameters(transform ? transform.parameters: {} )
    setParameterTypes(transform ? TransformParameters[transform.tool.id] : [])
    setAlgorithmType(transform && transform.parameters ? transform.parameters['algorithmType'] || 0 : 0)
    setTrainLabel(transform && transform.parameters ? transform.parameters['trainLabel'] || '' : '')
    setTestShift(transform && transform.parameters ? transform.parameters['testShift'] || 1 : 1)
  }, [transform])

  const uploadFile = () => {
    if (file === null) {
      setError(true)
    } else {
      transformAction.uploadInputData(file)
    }
  }

  const removeNode = () => {
    if (window.confirm('Are you sure to remove this transform?')) {
      transformAction.removeTransform(transform.id)      
    }
  }

  const trainAndTest = () => {
    if (inputFileId) {
      const params = parameters
      for (let paramName in parameters) {
        const paramType = parameterTypes[algorithmType].parameters.filter(p => p.name === paramName)[0]
        if (paramType && paramType.type === 'number') {
          params[paramName] = parseFloat(parameters[paramName])
        }
      }
      const allParams = {
        ...params,
        algorithmType: algorithmType,
        trainLabel: trainLabel,
        testShift: testShift
      }
      setParameters(allParams)
      transformAction.trainAndTest(inputFileId, transforms, allParams)
    } else {
      window.alert('Please upload input file.')
    }
  }

  const drawGraph = () => {
    if (inputFileId) {
      transformAction.getTransformData(inputFileId, transforms, transform.id)
    } else{
      window.alert('Please upload input file')
    }
  }

  const applyFilters = () => {
    const params = parameters
    for (let paramName in parameters) {
      const paramType = parameterTypes.find(p => p.name === paramName)
      if (paramType.type === 'number') {
        params[paramName] = parseFloat(params[paramName])
      }
      setParameters(params)
    }
    const settings = {
      outputParameters: transform.outputParameters,
      parameters: params
    }
    transformAction.applySettings(transform.id, settings)
  }

  const saveMLAlgorithm = () => {
    transformAction.applySettings(transform.id, {
      algorithmType: algorithmType,
      inputFilters: inputFilters,
      trainLabel: trainLabel,
      parameters: {
        ...parameters,
        algorithmType: algorithmType,
        trainLabel: trainLabel,
        testShift: testShift
      }
    })
  }

  const changeOutputParam = (inputParam, outputParam) => {
    transform.outputParameters[inputParam] = outputParam
    setFilterChanged(filterChanged+1)
  }

  const addOrRemoveOutputParam = (inputParam) => {
    if (transform.outputParameters[inputParam] === undefined) {
      transform.outputParameters[inputParam] = transform.tool.functionName + '(' + inputParam + ')'
    } else {
      delete(transform.outputParameters[inputParam]);
    }
    setFilterChanged(filterChanged+1)
  }

  const _renderInputData = () => {
    return (
      <div className='Property-Item-Container' key={0}>
        <p style={{display: 'flex', justifyContent: 'space-between'}}><b>Input Data: {inputFile} </b> <input type='button' onClick={uploadFile} value='Upload' /></p>
        <input id='files' type='file' onChange={(e) => setFile(e.target.files[0])} />
        <p style={{color: 'red'}}>{error && !file ? 'Please select file' : ''}</p>
      </div>
    )
  }

  const changeInputFilter = (idx) => {
    if (transform.inputParameters[idx] === 'Date' || transform.inputParameters[idx] === 'Time') {
      return
    }
    inputFilters[idx] = !inputFilters[idx]
    setInputFilters(inputFilters)
    setFilterChanged(filterChanged+1)
  }

  const _renderInputParams = () => {
    const inputParameters = transform.inputParameters
    return (
      <div className='Property-Item-Container' style={{maxHeight: 600, overflowY: 'scroll'}} key={1}>
        <p className='Property-Item-Header'>
          <b>Train & Test Columns</b> 
          {/* <input type='button' onClick={applyFilters} value='Apply' /> */}
        </p>
        { (inputParameters).map((param, idx) => (
          <div><input type='checkbox' checked={filterChanged>0 && inputFilters[idx]} onClick={()=>changeInputFilter(idx)} /> {param} </div>
        ))}
      </div>
    )
  }

  const _renderOutputParams = () => {
    const inputParameters = transform.inputParameters.filter((p, i) => p !== 'Date' && p !== 'Time')
    return (
      <div className='Property-Item-Container' style={{maxHeight: 600, overflowY: 'scroll'}} key={5}>
        <p className='Property-Item-Header'>
          <b>Columns to transform</b>
        </p>
        { inputParameters.map((param, idx) => (
          <p className='Property-Item-Row' style={param.length > 6 ? {flexDirection: 'column'} : {flexDirection: 'row'}}>
            <div style={{paddingBottom: 4}}>
              <input type='checkbox' checked={filterChanged>0 && transform.outputParameters[param] !== undefined} onClick={()=>addOrRemoveOutputParam(param)} /> {param} 
            </div>
            { transform.outputParameters[param] !== undefined ? 
              <input type="text" style={param.length > 6 ? {textAlign: "right", marginLeft: 20} : {width: 120}} value={transform.outputParameters[param]} 
                onChange={(e)=>changeOutputParam(param, e.target.value)}  /> : null}
          </p>
        ))}
      </div>
    )
  }

  const _renderMLParameters = () => {
    return (
      <div className='Property-Item-Container' key={2}>
        <p className='Property-Item-Header'>
          <b>ML Algorithm Parameters</b> 
          {/* <input type='button' onClick={applyFilters} value='Apply' /> */}
        </p>
        <p className='Property-Item-Header'>
          <b>Algorithm Type</b> 
          <select onChange={(e) => setAlgorithmType(parseInt(e.target.value))} value={algorithmType}>
            <option value={0}>k-Mean</option>
            <option value={1}>k-NN</option>
          </select>
        </p>
        <div style={{display: 'flex', alignItems: 'stretch', flexDirection: 'column'}}>
          { parameters && parameterTypes && parameterTypes[algorithmType] && parameterTypes[algorithmType].parameters? parameterTypes[algorithmType].parameters.map((param) => (
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8}}>
              <label style={{marginRight: 10}}>{param.name}</label>
              <input style={{width: '100%', maxWidth: 180}} value={parameters[param.name]} onChange={(e)=> changeParameter(param.name, e.target.value, param.type)}></input>
            </div>
          )) : null }
        </div>
      </div>
    )
  }

  const changeParameter = (name, value, type) => {
    if (type === 'number') {
      parameters[name] = value //parseFloat(value)
    } else {
      parameters[name] = value
    }
    setParameters(parameters)
    setFilterChanged(filterChanged+1)
  }

  const setTarget = () => {
    if (transform.target) {
      transformAction.removeTransformFromMLA(transform.id)
    } else {
      transformAction.addTransformToMLA(transform.id)
    }
  }

  const _renderTransformParameters = () => {
    return (
      <div className='Property-Item-Container' key={2}>
        <p className='Property-Item-Header'>
          <b>Transform Parameters</b> 
          {/* <input type='button' onClick={applyFilters} value='Apply' /> */}
        </p>
        <div className='Property-Item'>
          { parameters && parameterTypes ? parameterTypes.map((param) => (
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8}}>
              <label style={{marginRight: 10}}>{param.name}</label>
              <input style={{width: '100%', maxWidth: 180}} value={parameters[param.name]} onChange={(e)=> changeParameter(param.name, e.target.value, param.type)}></input>
            </div>
          )) : null }
        </div>
      </div>
    )
  }

  const _renderDetails = () => {
    return (
      <div className='Property-Item-Container' key={3}>
        <p className='Property-Item-Header'>
          <b>ID: #{transform.id}</b> 
        </p>
        <p>
          <b>Is target column ? </b> 
          <input type="checkbox" checked={transform.target} onClick={() => setTarget()} />
        </p>
      </div>
    )
  }

  const _renderTargetParam = () => {
    return (
      <div className='Property-Item-Container' key={3}>
        <p className='Property-Item-Header'>
          <b>Select Train Label & Test Shift</b> 
        </p>
        <p className='Property-Item-Row'>
          <span>Train label: </span>
          <select style={{width: 120}} value={trainLabel} onChange={(e) => setTrainLabel(e.target.value)}>
            { transform.inputParameters.filter((p, idx) => idx >= 2).map((p, idx) => (
              <option value={p} style={{width: 120}}>&nbsp;{p}&nbsp;</option>
            ))}
          </select>
        </p>
        <p className='Property-Item-Row'>
          <span>Test shift: </span>
          <input style={{width: 110}} value={testShift} onChange={(e) => setTestShift(parseInt(e.target.value))} />
        </p>
      </div>
    )
  }

  const _render = () => {
    const type = transform.tool.id
    let items = []
    if (type === IDS.InputData) {
      items = [_renderInputData()]
    } else if (type === IDS.MLAlgorithm) {
      items = [
        _renderMLParameters(),
        _renderInputParams(),
        _renderTargetParam()
      ]
    } else {
      items = [
        _renderDetails(),
        _renderTransformParameters(),
        _renderOutputParams()
      ]
    }
    return items
  }

  if (hide) {
    return null
  }

  return (
    <div className='PropertyWidget'>
      <div className='PropertyWidget-Inner'>
        <div className='PropertyWidget-Header'>
          <b>Properties {transform ? ' of ' + transform.tool.shortName : ''}</b>
          <b style={{cursor: 'pointer'}} onClick={() => setHide(true)}>Hide</b>
        </div>
        <div className='Properties-Container'>
        {
          transform ?
          <div style={{display: 'flex', justifyContent: 'flex-end'}}>
            { transform.id > IDS.InputData && transform.id < IDS.MLAlgorithm && <input type='button' onClick={removeNode} value='Remove' /> }
            <span style={{width: 10}}></span>
            { transform.id > IDS.InputData && transform.id < IDS.MLAlgorithm && <input type='button' onClick={applyFilters} value='Save' /> }
            { transform.id === IDS.MLAlgorithm && <input type='button' onClick={saveMLAlgorithm} value='Save' /> }
            <span style={{width: 10}}></span>
            { transform.id >= IDS.InputData && transform.id < IDS.MLAlgorithm && <input type='button' onClick={drawGraph} value='Draw' /> }
            { transform.id === IDS.MLAlgorithm && <input type='button' onClick={trainAndTest} value='Train & Test' /> }
          </div> : null
        }
        
        { transform ? _render() : null }
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  const transform = state.transforms.selectedTransform
  const parentTransforms = transform ? state.transforms.transforms.filter((t) => t.id === transform.parentId) : []
  const parentTransform = parentTransforms.length > 0 ? parentTransforms[0] : null
  
  return {
    inputFileId: state.transforms.fileId,
    inputFile: state.transforms.file,
    parentTransform: parentTransform,
    transform: state.transforms.selectedTransform,
    transforms: state.transforms.transforms
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    transformAction: bindActionCreators(TransformAction, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertyWidget)