import React, { useState } from 'react';
import './App.scss';
import Board from './containers/Board';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as TransformAction from './actions/TransformAction';
import * as TrainerAction from './actions/TrainerAction';
import { savePredictModel } from './dbapis/PredictModel';
import { removePredictModel, updatePredictModel } from './dbapis/PredictModel';
import { getPredictModels } from './dbapis/PredictModel';
import Colors from './constants/Colors';
import Button from './components/Button';
import TextField from './components/TextField';
import SaveButton from './components/SaveButton';
import InlineButton from './components/InlineButton';

function App({transforms, trainOptions, transformAction, trainerAction}) {


  const linkRef = React.createRef();
  const uploadFileRef = React.createRef();
  const JsonFileHeader = "text/json;charset=utf-8,";

  const [showModelName, setShowModelName] = useState(false)
  const [modelName, setModelName] = useState("")

  const [models, setModels] = useState([])
  const [selectedModelId, setSelectedModelId] = useState(0)

  const saveTransformations = () => {
    const href = JsonFileHeader + encodeURIComponent(JSON.stringify(transforms));
    const a = linkRef.current;
    a.download = 'transformations.json';
    a.href = 'data:' + href;
    a.click();
    a.href = '';
  }

  const loadTransformations = () => {
    uploadFileRef.current.click();
  }

  const loadFile = (file) => {
    if (file) {
      let reader = new FileReader();
  
      reader.onloadend = () => {
        const res = atob(decodeURIComponent(reader.result.split(',')[1]))
        transformAction.loadTransforms(JSON.parse(res))
      }
  
      reader.readAsDataURL(file);
    }
  }

  const saveModel = () => {
    if (showModelName) {
      if (modelName !== '') {
        transformAction.clearTransforms()
        savePredictModel(modelName, transforms, trainOptions)
        setShowModelName(false)
      } else {
        window.alert('Please input model name.')
      }
    } else {
      setShowModelName(true)
    }
  }

  const cancelSave = () => {
    setShowModelName(false)
  }

  const removeModel = () => {
      removePredictModel(selectedModelId)
  }

  const updateModel = () => {
      updatePredictModel(selectedModelId, transforms, trainOptions)
  }

  const loadModelList = () => {
    getPredictModels().then((res) => {
      if (res.success) {
        setModels(res.models)
        window.alert('Loaded models successfully, select model to load.')
      } else {
        window.alert('Loaded models failed.')
      }
    })
  }

  const onModelSelected = (modelId) => {
    console.log('model id = ' + modelId)
    const models1 = models.filter((m) => (""+m.model_id) === modelId)
    if (models1.length > 0) {
      const option = JSON.parse(models1[0].model_options)
      try {
        console.log('transforms = ' + JSON.stringify(option.transforms))
        console.log('parameters = ' + JSON.stringify(option.parameters))
        transformAction.loadTransforms(option.transforms)
        trainerAction.saveTrainerSettings(option.parameters)
        setSelectedModelId(modelId)      
      } catch (error) {
        console.log(error)        
      }
    } else {
      console.log('No model found.')
    }
  }

  return (
    <div className="App">
      <div className="Header">
        <h2 className="Title">Machine Learning Tool</h2>

        <div className="MenuContainer">
          <a ref={linkRef} style={{display: 'none'}}>Download transformations</a>
          
          <InlineButton onClick={() => saveTransformations()}>Save transformation</InlineButton>

          <input type="file" onChange={(e) => loadFile(e.target.files[0])} id="file" ref={uploadFileRef} style={{display: "none"}}/>
          <InlineButton onClick={() => loadTransformations()}>Load transformation</InlineButton>

          <InlineButton onClick={() => loadModelList()}>Load all models</InlineButton>

          { showModelName && 
          <TextField placeholder='Type model name' value={modelName} onChange={(e)=>setModelName(e.target.value)} ></TextField> }
          
          { !showModelName && <Button onClick={() => saveModel()}>Create new model</Button> }
          { showModelName && <SaveButton onSave={() => saveModel()} onCancel={() => cancelSave()} /> }

          {models.length > 0 && <select className='Menu' onChange={(e) => onModelSelected(e.target.value)}>
            <option>Select model</option>
            { models.map((model) => (
              <option value={model.model_id}>{model.model_name}</option>
            )) }
          </select> }

          { (models.length > 0 && selectedModelId > 0) && <button className='Menu' onClick={() => updateModel()} value='Save'>Update current model</button> }
          { (models.length > 0 && selectedModelId > 0) && <button className='Menu' onClick={() => removeModel()} value='Remove'>Remove current model</button> }
        </div>
      </div>
      <Board/>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    transforms: state.transforms.transforms,
    trainOptions: state.trainer.options,
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    transformAction: bindActionCreators(TransformAction, dispatch),
    trainerAction: bindActionCreators(TrainerAction, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
