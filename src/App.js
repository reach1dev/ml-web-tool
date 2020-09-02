import React, { useState } from 'react';
import './App.css';
import Board from './components/Board';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as TransformAction from './actions/TransformAction';
import { savePredictModel } from './dbapis/PredictModel';

function App({transforms, trainOptions, transformAction}) {


  const linkRef = React.createRef();
  const uploadFileRef = React.createRef();
  const JsonFileHeader = "text/json;charset=utf-8,";

  const [showModelName, setShowModelName] = useState(false)
  const [modelName, setModelName] = useState("")

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
