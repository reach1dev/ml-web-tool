import React, { useState } from 'react';
import './App.css';
import Board from './components/Board';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as TransformAction from './actions/TransformAction';
import * as TrainerAction from './actions/TrainerAction';
import { savePredictModel } from './dbapis/PredictModel';
import { getPredictModels } from './dbapis/PredictModel';

function App({transforms, trainOptions, transformAction, trainerAction}) {


  const linkRef = React.createRef();
  const uploadFileRef = React.createRef();
  const JsonFileHeader = "text/json;charset=utf-8,";

  const [showModelName, setShowModelName] = useState(false)
  const [modelName, setModelName] = useState("")

  const [models, setModels] = useState([])

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
      savePredictModel(modelName, transforms, trainOptions)
      setShowModelName(false)
    } else {
      setShowModelName(true)
    }
  }

  const loadModelList = () => {
    getPredictModels().then((res) => {
      setModels(res)
      window.alert('Loaded models successfully, select model to load.')
    })
  }

  const onModelSelected = (modelId) => {
    const m = models.filter((m) => m.model_id === modelId)
    if (m.length > 0) {
      const option = JSON.parse(m[0].model_options)
      transformAction.loadTransforms(option.transforms)
      trainerAction.saveTrainerSettings(option.parameters)
    }
  }

  return (
    <div className="App">
      <div className="Header">
        <h2>Machine Learning Tool</h2>

        <a ref={linkRef} style={{display: 'none'}}>Download transformations</a>
        <button className='Menu' onClick={() => saveTransformations()} >Save transformations</button>

        <input type="file" onChange={(e) => loadFile(e.target.files[0])} id="file" ref={uploadFileRef} style={{display: "none"}}/>
        <button className='Menu' onClick={() => loadTransformations()} value='Save'>Load transformations</button>

        { showModelName && <input className='Menu' placeholder='Type model name' value={modelName} onChange={(e)=>setModelName(e.target.value)} ></input>}
        <button className='Menu' onClick={() => saveModel()} value='Save'>Save model</button>

        <button className='Menu' onClick={() => loadModelList()} value='Save'>Load models</button>

        {models.length > 0 && <select className='Menu' onChange={(e) => onModelSelected(e.target.value)}>
          <option>Select model</option>
          { models.map((model) => (
            <option value={model.model_id}>{model.model_name}</option>
          )) }
        </select> }
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
    transformAction: bindActionCreators(TransformAction, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
