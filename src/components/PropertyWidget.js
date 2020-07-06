import React, { useState, useEffect } from 'react'
import './PropertyWidget.css'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as TransformAction from '../actions/TransformAction'
import * as TrainerAction from '../actions/TrainerAction'
import * as OptimizerAction from '../actions/OptimizerAction'
import { IDS } from './ItemTypes'
import { TransformParameters, AlgorithmTypes, Classification, Regression, Clustering } from './TransformParameters'
import OptimizeWidget from './OptimizeWidget'
import Spinner from './Spinner'
import { TR_IDS } from './TransformationTools'

function PropertyWidget({sampleCount, hide, setHide, uploading, inputFile, inputFileId, transforms, transform, 
  algParams, 
  TransformAction, TrainerAction, OptimizerAction}) {

  const [file, setFile] = useState(null)
  const [error, setError] = useState(false)
  const [inputFilters, setInputFilters] = useState(transform ? transform.inputFilters || [] : [])
  const [features, setFeatures] = useState(transform ? transform.features || {} : {})
  const [targetColumn, setTargetColumn] = useState(transform ? transform.targetColumn || '' : '')
  const [filterChanged, setFilterChanged] = useState(1)
  const [parameters, setParameters] = useState({})
  const [parameterTypes, setParameterTypes] = useState([])
  const [algorithmType, setAlgorithmType] = useState(0)
  const [trainLabel, setTrainLabel] = useState('')
  const [testShift, setTestShift] = useState(1)
  const [trainSampleCount, setTrainSampleCount] = useState(1)
  const [randomSelect, setRandomSelect] = useState(false)
  const [kFoldCV, setKFoldCV] = useState(false)
  const [kFold, setKFold] = useState(2)
  const [optimizeStatus, setOptimizeStatus] = useState(0)

  const [tripleUp, setTripleUp] = useState(10)
  const [tripleDown, setTripleDown] = useState(10)
  const [tripleMaxHold, setTripleMaxHold] = useState(10)
  
  useEffect(() => {
    if (transform && transform.id !== IDS.MLAlgorithm) {
      setParameters(transform ? transform.parameters: {} )
      setParameterTypes(transform ? TransformParameters[transform.tool.id] : [])
      setTargetColumn(transform && transform.targetColumn ? transform.targetColumn : '')
      setFeatures(transform && transform.features ? transform.features : {})
    }
  }, [transform])

  useEffect(() => {
    if (transform && transform.id === IDS.MLAlgorithm) {
      setAlgorithmType(algParams.type)
      setInputFilters(transform.inputFilters || [])
      setTrainLabel(algParams.trainLabel || '')
      setTestShift(algParams.testShift || 1)
      setTrainSampleCount(algParams.trainSampleCount || Math.floor(sampleCount*0.7))
      setParameters(algParams.parameters || {} )
      setParameterTypes(TransformParameters[transform.tool.id] || [])
    }
  }, [transform, algParams, sampleCount])


  const changeAlgorithmType = (type) => {
    setAlgorithmType(type)
    if (parameterTypes && parameterTypes[type] && parameterTypes[type].parameters) {
      const params = {}
      parameterTypes[type].parameters.map((p) => {
        params[p.name] = p.default
      })
      setParameters(params)
    }    
  }

  const uploadFile = () => {
    if (file === null) {
      setError(true)
    } else {
      TransformAction.uploadInputData(file)
    }
  }

  const removeNode = () => {
    if (window.confirm('Are you sure to remove this transform?')) {
      TransformAction.removeTransform(transform.id)      
    }
  }

  const startOptimize = (optParams) => {
    if (trainLabel === '' && 
      (AlgorithmTypes[algorithmType] === Classification || 
        (AlgorithmTypes[algorithmType] === Regression && parameters['multiple']))) {
      window.alert('Please select target.')
      return
    }
    if (inputFileId) {
      const params = optParams
      const allParams = {
        ...params,
        algorithmType: algorithmType,
        trainLabel: trainLabel,
        testShift: testShift,
        trainSampleCount: trainSampleCount,
        randomSelect: randomSelect
      }
      setParameters(allParams)
      TransformAction.trainAndTest(inputFileId, transforms, allParams, true)
    } else {
      window.alert('Please upload input file.')
    }
  }

  const trainAndTest = () => {
    if (trainLabel === '' && (algorithmType !== 0 && algorithmType !== 5 && (algorithmType !== 2 || !parameters['multiple']))) {
      window.alert('Please select target.')
      return
    }
    if (inputFileId) {
      const params = parameters
      for (let paramName in parameters) {
        const paramType = parameterTypes[algorithmType].parameters.filter(p => p.name === paramName)[0]
        if (paramType && paramType.type === 'number') {
          params[paramName] = parseFloat(parameters[paramName])
        }
      }
      
      let curParams = getCurrentParams()
      if (transform.inputParameters.length === 0) {
        alert('No features selected, please confirm to save in transformations.')
        return
      }
      delete(curParams['parameters'])
      const allParams = {
        ...params,
        ...curParams
      }

      setParameters(allParams)
      TrainerAction.startTrainer(inputFileId, transforms, allParams)
    } else {
      window.alert('Please upload input file.')
    }
  }

  const drawGraph = () => {
    if (inputFileId) {
      TransformAction.getTransformData(inputFileId, transforms, transform.id)
    } else{
      window.alert('Please upload input file')
    }
  }

  const saveTransformation = () => {
    const params = parameters
    for (let paramName in parameters) {
      const paramType = parameterTypes.find(p => p.name === paramName)
      if (paramType && paramType.type === 'number') {
        params[paramName] = parseFloat(params[paramName])
      }
      setParameters(params)
    }
    const tc = Object.values(transform.outputParameters).indexOf(targetColumn) >= 0 ? targetColumn : ''
    const settings = {
      outputParameters: transform.outputParameters,
      parameters: params,
      features: features,
      target: Object.keys(features).filter(p => features[p]).length > 0 || tc !== '',
      targetColumn: tc
    }
    TransformAction.applySettings(transform.id, settings)
  }

  const getCurrentParams = () => {
    return {
      type: algorithmType,
      inputFilters: inputFilters,
      features: transform.inputParameters,
      trainLabel: AlgorithmTypes[algorithmType] !== Clustering ? trainLabel : '',
      tripleOptions: {
        up: tripleUp,
        down: tripleDown,
        maxHold: tripleMaxHold
      },
      testShift: testShift,
      trainSampleCount: trainSampleCount,
      randomSelect: randomSelect,
      parameters: parameters,
      kFold: kFoldCV ? kFold : 0
    }
  }

  const saveMLAlgorithm = () => {
    TrainerAction.saveTrainerSettings(getCurrentParams())
  }

  const changeOutputParam = (inputParam, outputParam) => {
    transform.outputParameters[inputParam] = outputParam
    Object.keys(features).forEach(f => {
      if (Object.values(transform.outputParameters).filter(p => p === f) === 0){
        delete(features[f])
      }
    })
    features[outputParam] = false
    setFilterChanged(filterChanged+1)
  }

  const addOrRemoveOutputParam = (inputParam) => {
    if (transform.outputParameters[inputParam] === undefined) {
      transform.outputParameters[inputParam] = transform.tool.functionName + (transform.id-IDS.InputData) + '_' + inputParam
    } else {
      delete(transform.outputParameters[inputParam]);
    }
    setFilterChanged(filterChanged+1)
  }

  const changeInputFilter = (idx) => {
    if (transform.inputParameters[idx] === 'Date' || transform.inputParameters[idx] === 'Time') {
      return
    }
    inputFilters[idx] = !inputFilters[idx]
    setInputFilters(inputFilters)
    setFilterChanged(filterChanged+1)
  }

  const changeFeature = (param) => {
    if (features[param]) {
      delete(features[param])
    } else {
      features[param] = true
    }
    if (Object.keys(features).length > 0) {
      if (!transform.target) {
        setTarget()
      }
    }
    setFilterChanged(filterChanged+1)
  }

  const changeParameter = (name, value, type) => {
    if (type === 'number') {
      parameters[name] = value //parseFloat(value)
    } else {
      parameters[name] = value
    }
    setParameters(parameters)
    setFilterChanged(filterChanged+1)

    if (transform.tool.id === TR_IDS.MathOperators && (name === 'name' || name === 'expression')) {
      if (parameters['name'] !== '' && parameters['expression'] !== '') {
        transform.outputParameters = {[parameters['expression']]: parameters['name']}
      } else {
        transform.outputParameters = {}
      }
    }
  }

  const setTarget = () => {
    if (transform.target) {
      TransformAction.removeTransformFromMLA(transform.id)
      setFeatures({})
    } else {
      TransformAction.addTransformToMLA(transform.id)
    }
    transform.target = !transform.target
    setFilterChanged(filterChanged+1)
  }

  const _renderFeatureSelect = () => {
    const inputParameters = transform.inputParameters
    return (
      <div className='Property-Item-Container columns' key={1}>
        <p className='Property-Item-Header'>
          <b>Select features</b> 
          {/* <input type='button' onClick={applyFilters} value='Apply' /> */}
        </p>
        { (inputParameters).map((param, idx) => (
          <div key={idx}><input type='checkbox' checked={filterChanged>0 && inputFilters[idx]} onChange={(e) => changeInputFilter(idx)} /> {param} </div>
        ))}
      </div>
    )
  }

  const _renderFeatures = () => {
    const params = Object.values(transform.outputParameters)
    return (
      <div className='Property-Item-Container columns' key={1}>      
        {/* <p className='Property-Item-Header'>
          <b>Add as Target</b> 
          <select value={targetColumn} onChange={e => setTargetColumn(e.target.value)}>
            <option value=''>No selection</option>
          { (params).map((param, idx) => (
            <option key={idx} value={param}>{param}</option>
          ))}
          </select>
        </p> */}
        <p className='Property-Item-Header'>
          <b>Add as feature or target</b> 
          {/* <input type='button' onClick={applyFilters} value='Apply' /> */}
        </p>
        <div>
        { (params).map((param, idx) => (
          <div key={idx}><input type='checkbox' checked={filterChanged>0 && features[param]} onChange={(e) => changeFeature(param)} /> {param} </div>
        ))}
        </div>
      </div>
    )
  }

  const _renderInputData = () => {
    return (
      <div className='Property-Item-Container' key={0}>
        <p style={{display: 'flex', justifyContent: 'space-between'}}><b>Input Data: {uploading ? 'uploading...' : inputFile} </b> <input type='button' onClick={uploadFile} value='Upload' /></p>
        <input id='files' type='file' onChange={(e) => setFile(e.target.files[0])} />
        <p style={{color: 'red'}}>{error && !file ? 'Please select file' : ''}</p>
      </div>
    )
  }

  const _renderColumns2Transform = () => {
    const inputParameters = transform.inputParameters.filter((p, i) => p !== 'Date' && p !== 'Time')
    return (
      <div className='Property-Item-Container columns' key={5}>
        <p className='Property-Item-Header'>
          <b>Columns to transform</b>
        </p>
        { inputParameters.map((param, idx) => (
          <p className='Property-Item-Row' style={param.length > 6 ? {flexDirection: 'column'} : {flexDirection: 'row'}}>
            <div style={{paddingBottom: 4}}>
              <input type='checkbox' checked={filterChanged>0 && transform.outputParameters[param] !== undefined} onClick={()=>addOrRemoveOutputParam(param)} /> {param} 
            </div>
            { transform.outputParameters[param] !== undefined ? 
              <input type="text" className={param.length > 6 ? 'input-right' : 'input-normal'} value={transform.outputParameters[param]} 
                onChange={(e)=>changeOutputParam(param, e.target.value)}  /> : null}
          </p>
        ))}
      </div>
    )
  }

  const getMLParams = () => {
    if (parameters && parameterTypes && parameterTypes[algorithmType] && parameterTypes[algorithmType].parameters) {
      const params = parameterTypes[algorithmType].parameters
      return params.map((param, idx) => (
        <div key={idx} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8}}>
          <label style={{marginRight: 10}}>{param.name}{param.desc ? ' (' + param.desc + ')' : ''}</label>
          <input type={param.type==='boolean' ? 'checkbox' : 'text'} style={param.type==='boolean' ? {} : {width: '100%', maxWidth: 180}} value={parameters[param.name]} onChange={(e)=> changeParameter(param.name, param.type==='boolean' ? e.target.checked : e.target.value, param.type)}></input>
        </div>
      ))
    }
    return null
  }

  const _renderMLParameters = () => {
    return (
      <div className='Property-Item-Container' key={2}>
        <p className='Property-Item-Header'>
          <b>ML Algorithm Parameters</b> 
          {/* <input type='button' onClick={applyFilters} value='Apply' /> */}
        </p>
        <p className='Property-Item-Header'>
          <b>Algorithm</b> 
          <select onChange={(e) => changeAlgorithmType(parseInt(e.target.value))} value={algorithmType}>
            { TransformParameters[IDS.MLAlgorithm].map(p => (
              <option value={p.type}>{p.name}</option>
            )) }
          </select>
        </p>
        <div style={{display: 'flex', alignItems: 'stretch', flexDirection: 'column'}}>
          { getMLParams() }
        </div>
        { algorithmType !== 2 && algorithmType < 5 && 
        <OptimizeWidget 
          algorithmType={algorithmType}
          parameters={parameters && parameterTypes && parameterTypes[algorithmType] && 
            parameterTypes[algorithmType].parameters? parameterTypes[algorithmType].parameters : []} 
          openOptimizer={() => setOptimizeStatus(1)}
          optimizeStatus={optimizeStatus}
          getParams={()=> {
            saveMLAlgorithm()
            return {
              kFold: kFoldCV ? kFold : 0
            }
          }}  /> }
      </div>
    )
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
              <input style={{width: '100%', maxWidth: 180}} value={parameters[param.name]} placeholder={param.placeholder} onChange={(e)=> changeParameter(param.name, e.target.value, param.type)}></input>
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

  const _renderTrainTargetSplit = () => {
    return (
      <div className='Property-Item-Container' key={6}>
        <p className='Property-Item-Header'>
          <b>Train/target split</b> 
        </p>
        <p className='Property-Item-Row'>
          <span>Sample count: </span><b>{sampleCount}</b>
        </p>
        <p className='Property-Item-Row'>
          <span>Train sample count: </span>
          <input style={{width: 50}} value={trainSampleCount} onChange={(e) => {
            const val = parseInt(e.target.value)
            if (val > 0 && val < sampleCount) {
              setTrainSampleCount(val)
            }
          }} />
        </p>
        <p className='Property-Item-Row'>
          <span>Choose samples randomly: </span>
          <input type="checkbox" checked={randomSelect} onChange={(e) => {
            setKFoldCV(e.target.checked ? false: kFoldCV)
            setRandomSelect(e.target.checked)
          }} />
        </p>
        <p className='Property-Item-Row'>
          <span>kFold CV: </span>
          <input type="checkbox" checked={kFoldCV} onChange={(e) => {
            setRandomSelect(e.target.checked ? false : randomSelect)
            setKFoldCV(e.target.checked)
          }} />
        </p>
        { kFoldCV && 
          <p className='Property-Item-Row'>
            <span>kFold CV n_splits: </span>
            <input style={{width: 50}} value={kFold} onChange={(e) => setKFold(e.target.value)} />
          </p>
        }
      </div>
    )
  }

  const _renderTripleBarrierOptions = () => {
    return (
      <div style={{marginLeft: 10}}>
        <p className='Property-Item-Row'><span>up: </span> <input style={{width: 110}} value={tripleUp} onChange={(e) => setTripleUp(parseInt(e.target.value))} /></p>
        <p className='Property-Item-Row'><span>down: </span> <input style={{width: 110}} value={tripleDown} onChange={(e) => setTripleDown(parseInt(e.target.value))} /></p>
        <p className='Property-Item-Row'><span>maxhold: </span><input style={{width: 110}} value={tripleMaxHold} onChange={(e) => setTripleMaxHold(parseInt(e.target.value))} /></p>
      </div>
    )
  }

  const _renderTargetParam = () => {
    return (
      <div className='Property-Item-Container' key={3}>
        <p className='Property-Item-Header'>
          <b>Select Target</b> 
        </p>
        <p className='Property-Item-Row'>
          <span>Target column: </span>
          <select style={{width: 120}} value={trainLabel} onChange={(e) => setTrainLabel(e.target.value)}>
            <option key={0} value='triple_barrier'>Triple Barrier</option>
            { transform.inputParameters && transform.inputParameters.map((p, idx) => (
              <option key={idx} value={p} style={{width: 120}}>&nbsp;{p}&nbsp;</option>
            ))}
          </select>
        </p>
        { trainLabel === 'triple_barrier' ? _renderTripleBarrierOptions() : (
          <p className='Property-Item-Row'>
            <span>Test shift: </span>
            <input style={{width: 110}} value={testShift} onChange={(e) => setTestShift(parseInt(e.target.value))} />
          </p>
        )}
      </div>
    )
  }

  const _render = () => {
    const type = transform.tool.id
    let items = []
    if (type === IDS.InputData) {
      items = [_renderInputData()]
    } else if (type === IDS.MLAlgorithm) {
      const type = AlgorithmTypes[algorithmType]
      const showTarget = (type === Classification || (type === Regression && parameters && !parameters['multiple']))
      items = [
        _renderMLParameters(),
        _renderFeatureSelect(),
        _renderTrainTargetSplit(),
        showTarget ? _renderTargetParam() : null
      ]
    } else {
      items = [
        _renderDetails(),
        _renderTransformParameters(),
        _renderColumns2Transform(),
        _renderFeatures(),
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
            { transform.id > IDS.InputData && transform.id < IDS.MLAlgorithm && <input type='button' onClick={saveTransformation} value='Save' /> }
            { transform.id === IDS.MLAlgorithm && <input type='button' onClick={saveMLAlgorithm} value='Save' /> }
            <span style={{width: 10}}></span>
            { transform.id >= IDS.InputData && transform.id < IDS.MLAlgorithm && <input type='button' onClick={drawGraph} value='Draw' /> }
            { transform.id === IDS.MLAlgorithm && <input type='button' onClick={() => trainAndTest(false)} value='Train & Test' /> }
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
    uploading: state.transforms.uploading,
    parentTransform: parentTransform,
    transform: state.transforms.selectedTransform,
    transforms: state.transforms.transforms,
    sampleCount: state.transforms.sampleCount,
    algParams: state.trainer.options
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    TransformAction: bindActionCreators(TransformAction, dispatch),
    TrainerAction: bindActionCreators(TrainerAction, dispatch),
    OptimizerAction: bindActionCreators(OptimizerAction, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertyWidget)