import React, { useState, useEffect } from 'react'
import './PropertyWidget.css'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as InputDataAction from '../actions/InputDataAction'
import * as TransformAction from '../actions/TransformAction'
import { IDS } from './ItemTypes'
import { TransformParameters, getDefaultParameters } from './TransformParameters'

function PropertyWidget({hide, setHide, inputFile, inputFileId, transforms, transform, parentTransform, inputDataAction, transformAction}) {

  const [file, setFile] = useState(null)
  const [error, setError] = useState(false)
  const [inputFilters, setInputFilters] = useState(transform ? transform.inputFilters || [] : [])
  const [outputFilters, setOutputFilters] = useState(transform ? transform.outputFilters || [] : [])
  const [filterChanged, setFilterChanged] = useState(1)
  const [parameters, setParameters] = useState(transform ? transform.parameters: {})
  const [parameterTypes, setParameterTypes] = useState([])
  const [algorithmType, setAlgorithmType] = useState(0)
  const [trainLabel, setTrainLabel] = useState('')
  const [testShift, setTestShift] = useState(1)
  
  useEffect(() => {
    setInputFilters(transform ? transform.inputFilters || [] : [])
    setOutputFilters(transform ? transform.outputFilters || [] : [])
    setParameters(transform ? transform.parameters: {} )
    setParameterTypes(transform ? TransformParameters[transform.tool.id] : [])
    setAlgorithmType(transform && transform.parameters ? transform.parameters['algorithmType'] || 0 : 0)
    setTrainLabel(transform && transform.parameters ? transform.parameters['trainLabel'] || '' : '')
    setTestShift(transform && transform.parameters ? transform.parameters['testShift'] || 1 : 1)
  }, [transform])

  // useEffect(() => {
  //   setParameters([])
  // }, [algorithmType])

  const uploadFile = () => {
    if (file === null) {
      setError(true)
    } else {
      inputDataAction.uploadInputData(file)
    }
  }

  const changeInputFilter = (idx) => {
    if (transform.inputParameters[idx] === 'Date' || transform.inputParameters[idx] === 'Time') {
      return
    }
    inputFilters[idx] = !inputFilters[idx]
    setOutputFilters(transform.inputParameters.filter((p, i) => inputFilters[i]).map((p) => true))
    setInputFilters(inputFilters)
    setFilterChanged(filterChanged+1)
  }

  const changeOutputFilter = (idx) => {
    if (transform.outputParameters[idx] === 'Date' || transform.outputParameters[idx] === 'Time') {
      return
    }
    outputFilters[idx] = !outputFilters[idx]
    setOutputFilters(outputFilters)
    setFilterChanged(filterChanged+1)
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
    const outParams = transform.inputParameters.filter((param, idx) => inputFilters[idx])
    const params = parameters
    for (let paramName in parameters) {
      const paramType = parameterTypes.find(p => p.name === paramName)
      if (paramType.type === 'number') {
        params[paramName] = parseFloat(params[paramName])
      }
      setParameters(params)
    }
    const settings = {
      outputParameters: outParams,
      inputFilters: inputFilters,
      outputFilters: outputFilters,
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

  const _renderInputData = () => {
    return (
      <div className='Property-Item-Container' key={0}>
        <p style={{display: 'flex', justifyContent: 'space-between'}}><b>Input Data: {inputFile} </b> <input type='button' onClick={uploadFile} value='Upload' /></p>
        <input id='files' type='file' onChange={(e) => setFile(e.target.files[0])} />
        <p style={{color: 'red'}}>{error && !file ? 'Please select file' : ''}</p>
      </div>
    )
  }

  const _renderInputParams = () => {
    const outputParameters = parentTransform ? parentTransform.outputParameters : null
    const inputParameters = transform.inputParameters
    return (
      <div className='Property-Item-Container' key={1}>
        <p className='Property-Item-Header'>
          <b>Input Parameters</b> 
          {/* <input type='button' onClick={applyFilters} value='Apply' /> */}
        </p>
        { (inputParameters?inputParameters:outputParameters).map((param, idx) => (
          <div><input type='checkbox' checked={filterChanged>0 && inputFilters[idx]} onClick={()=>changeInputFilter(idx)} /> {param} </div>
        ))}
      </div>
    )
  }

  const _renderOutputParams = () => {
    const outputParameters = transform.inputParameters.filter((p, i) => transform.inputFilters[i])
    return (
      <div className='Property-Item-Container' key={5}>
        <p className='Property-Item-Header'>
          <b>Output Parameters to apply transform</b> 
          {/* <input type='button' onClick={applyFilters} value='Apply' /> */}
        </p>
        { outputParameters.map((param, idx) => (
          <div><input type='checkbox' checked={filterChanged>0 && outputFilters[idx]} onClick={()=>changeOutputFilter(idx)} /> {param} </div>
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
        _renderInputParams(),
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
    inputFileId: state.inputData.fileId,
    inputFile: state.inputData.file,
    parentTransform: parentTransform,
    transform: state.transforms.selectedTransform,
    transforms: state.transforms.transforms
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    inputDataAction: bindActionCreators(InputDataAction, dispatch),
    transformAction: bindActionCreators(TransformAction, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertyWidget)