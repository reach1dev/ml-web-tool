import React, { useState, useEffect } from 'react'
import './PropertyWidget.css'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as InputDataAction from '../actions/InputDataAction'
import * as TransformAction from '../actions/TransformAction'
import { IDS } from './ItemTypes'
import { TransformParameters } from './TransformParameters'

function PropertyWidget({hide, setHide, inputFile, transforms, transformIndex, transform, parentTransform, inputDataAction, transformAction}) {

  const [file, setFile] = useState(null)
  const [error, setError] = useState(false)
  const [inputFilters, setInputFilters] = useState(transform ? transform.inputFilters || [] : [])
  const [filterChanged, setFilterChanged] = useState(1)
  const [parameters, setParameters] = useState(transform ? transform.parameters : [])
  const [parameterTypes, setParameterTypes] = useState([])
  
  useEffect(() => {
    setInputFilters(transform ? transform.inputFilters || [] : [])
    setParameters(transform ? transform.parameters : [])
    setParameterTypes(transform ? TransformParameters[transform.tool.id] : [])
  }, [transform, transformIndex])

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

  const applyFilters = () => {
    const outParams = transform.inputParameters.filter((param, idx) => inputFilters[idx])
    transformAction.applySettings(transformIndex, {
      outputParameters: outParams,
      inputFilters: inputFilters,
      parameters: parameters
    })
    setTimeout(() => {
      transformAction.getTransformData(transforms, transform.id)
    }, 300)
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
    const outputParameters = parentTransform.outputParameters
    const inputParameters = transform.inputParameters
    return (
      <div className='Property-Item-Container' key={1}>
        <p className='Property-Item-Header'>
          <b>Input Parameters: {inputFile} </b> 
          {/* <input type='button' onClick={applyFilters} value='Apply' /> */}
        </p>
        { outputParameters && inputParameters ? outputParameters.map((param, idx) => (
          <div><input type='checkbox' checked={filterChanged>0 && inputFilters[idx]} onClick={()=>changeInputFilter(idx)} /> {param} </div>
        )) : null}
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
          <b>Transform Parameters </b> 
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

  const _render = () => {
    const type = transform.tool.id
    let items = []
    if (type === IDS.InputData) {
      items = [_renderInputData()]
    } else if (type === IDS.MLAlgorithm) {
      items = [_renderTransformParameters()]
    } else {
      items = [
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
        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <input type='button' onClick={applyFilters} value='Save settings and draw graph' />
        </div>
        { transform ? _render() : null }
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  const transform = state.transforms.selectedTransform >= 0 ? state.transforms.transforms[state.transforms.selectedTransform] : null
  const parentTransforms = transform ? state.transforms.transforms.filter((t) => t.id === transform.parentId) : []
  const parentTransform = parentTransforms.length > 0 ? parentTransforms[0] : null
  
  return {
    inputFile: state.inputData.file,
    parentTransform: parentTransform,
    transformIndex: state.transforms.selectedTransform,
    transform: transform,
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