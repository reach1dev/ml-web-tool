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
import { Env } from './config';
import ModelSavePopup from './containers/ModelSavePopup';
import ModelLoadPopup from './containers/ModelLoadPopup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App({transforms, trainOptions, transformAction, trainerAction}) {


  const linkRef = React.createRef();
  const uploadFileRef = React.createRef();
  const JsonFileHeader = "text/json;charset=utf-8,";

  const [showModelName, setShowModelName] = useState(false)
  const [modelName, setModelName] = useState("transformations")

  const [models, setModels] = useState([])
  const [selectedModelId, setSelectedModelId] = useState(0)

  const [openSaveDialog, setOpenSaveDialog] = useState(false)
  const [openLoadDialog, setOpenLoadDialog] = useState(false)
  const [modelLoaded, setModelLoaded] = useState(0)

  const saveTransformations = () => {
    const href = JsonFileHeader + encodeURIComponent(JSON.stringify(transforms));
    const a = linkRef.current;
    a.download = modelName + '.json';
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
    if (modelName !== '') {
      savePredictModel(modelName, transforms, trainOptions, toast)
    } else {
      window.alert('Please input model name.')
    }
  }

  const cancelSave = () => {
    setShowModelName(false)
  }

  const removeModel = () => {
      removePredictModel(selectedModelId)
  }

  const updateModel = () => {
      updatePredictModel(selectedModelId, transforms, trainOptions, toast)
  }

  const loadModelList = () => {
    if (Env.mode ===  'debug') {
      setModelLoaded(1)
      setTimeout(() => {
        setModels([{
          model_id: 1,
          model_name: 'transformations1',
          model_options: ''
        }])
        setModelLoaded(2)
      }, 1000);
      return
    }
    
    setModelLoaded(1)
    getPredictModels().then((res) => {
      if (res.success) {
        setModels(res.models)
      } else {
        window.alert('Loaded models failed.')
      }
      setModelLoaded(2)
    })
  }

  const onModelSelected = (modelId) => {
    console.log('model id = ' + modelId)
    const models1 = models.filter((m) => m.model_id === modelId)
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
          <ToastContainer></ToastContainer>
          <a ref={linkRef} style={{display: 'none'}}>Download transformations</a>          

          <input type="file" onChange={(e) => loadFile(e.target.files[0])} id="file" ref={uploadFileRef} style={{display: "none"}}/>
          <InlineButton onClick={() => {setOpenLoadDialog(true); setModelLoaded(0)}}>Load Model</InlineButton>
          <ModelLoadPopup
            open={openLoadDialog}
            setOpen={setOpenLoadDialog}
            modelName={modelName}
            setModelName={setModelName}
            models={models}
            modelLoaded={modelLoaded}
            loadModelList={loadModelList}
            loadTransformations={loadTransformations}
            onModelSelected={(id) => onModelSelected(id)}
          ></ModelLoadPopup>

          <InlineButton onClick={() => {setOpenSaveDialog(true); setModelLoaded(0)}}>Save Model</InlineButton>
          <ModelSavePopup
            open={openSaveDialog}
            setOpen={setOpenSaveDialog}
            modelName={modelName}
            setModelName={setModelName}
            models={models}
            modelLoaded={modelLoaded}
            updateModel={updateModel}
            createModel={saveModel}
            loadModelList={loadModelList}
            saveModelToPC={saveTransformations}
          ></ModelSavePopup>

          { !showModelName && <Button onClick={() => transformAction.clearTransforms()}>Create Model</Button> }

          { showModelName && 
          <TextField className='MenuInside' placeholder='Database model name' value={modelName} onChange={(e)=>setModelName(e.target.value)} ></TextField> }
          { showModelName && <SaveButton className='MenuInside' onSave={() => saveModel()} onCancel={() => cancelSave()} /> }
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
