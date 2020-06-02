import React, { useState, useEffect } from 'react'
import './PropertyWidget.css'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as InputDataAction from '../actions/InputDataAction'
import * as TransformAction from '../actions/TransformAction'
import { IDS } from './ItemTypes'
import { TransformParameters } from './TransformParameters'

function PropertyWidget({hide, setHide, inputFile, transforms, transform, parentTransform, inputDataAction, transformAction}) {

  const [file, setFile] = useState(null)
  const [error, setError] = useState(false)
  const [inputFilters, setInputFilters] = useState(transform ? transform.inputFilters || [] : [])
  const [filterChanged, setFilterChanged] = useState(1)
  const [parameters, setParameters] = useState(transform ? transform.parameters : [])
  const [parameterTypes, setParameterTypes] = useState([])
  const [algorithmType, setAlgorithmType] = useState(0)
  
  useEffect(() => {
    setInputFilters(transform ? transform.inputFilters || [] : [])
    setParameters(transform ? transform.parameters : [])
    setParameterTypes(transform ? TransformParameters[transform.tool.id] : [])
  }, [transform])

  useEffect(() => {
    setParameters([])
  }, [algorithmType])

  const uploadFile = () => {
    if (file === null) {
      setError(true)
    } else {
      inputDataAction.uploadInputData(file)
    }
  }

  const changeInputFilter = (idx) => {
    inputFilters[idx] = !inputFilters[idx]
    setInputFilters(inputFilters)
    setFilterChanged(filterChanged+1)
  }

  const removeNode = () => {
    if (window.confirm('Are you sure to remove this transform?')) {
      transformAction.removeTransform(transform.id)      
    }
  }

  const trainAndTest = () => {
    transformAction.trainAndTest(transforms, parameters)
  }

  const drawGraph = () => {
    transformAction.getTransformData(transforms, transform.id)
  }

  const applyFilters = () => {
    const outParams = transform.inputParameters.filter((param, idx) => inputFilters[idx])
    const settings = {
      outputParameters: outParams,
      inputFilters: inputFilters,
      parameters: parameters
    }
    transformAction.applySettings(transform.id, settings)
  }

  const saveMLAlgorithm = () => {
    transformAction.applySettings(transform.id, {
      inputFilters: inputFilters,
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
          <b>Input Parameters: {inputFile} </b> 
          {/* <input type='button' onClick={applyFilters} value='Apply' /> */}
        </p>
        { (inputParameters?inputParameters:outputParameters).map((param, idx) => (
          <div><input type='checkbox' checked={filterChanged>0 && inputFilters[idx]} onClick={()=>changeInputFilter(idx)} /> {param} </div>
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
          <select onChange={(e) => setAlgorithmType(e.target.value)} value={algorithmType}>
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
      parameters[name] = parseFloat(value)
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
        <div style={{display: 'flex', alignItems: 'stretch', flexDirection: 'column'}}>
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

  const _render = () => {
    const type = transform.tool.id
    let items = []
    if (type === IDS.InputData) {
      items = [_renderInputData()]
    } else if (type === IDS.MLAlgorithm) {
      items = [
        _renderMLParameters(),
        _renderInputParams()
      ]
    } else {
      items = [
        _renderDetails(),
        _renderTransformParameters(),
        _renderInputParams()
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