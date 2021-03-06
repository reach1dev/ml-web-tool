import React, { useEffect, useState } from 'react';
import { savePredictModel } from '../dbapis/PredictModel';
import { removePredictModel, updatePredictModel } from '../dbapis/PredictModel';
import { getPredictModels } from '../dbapis/PredictModel';
import Button from '../components/Button';
import TextField from '../components/TextField';
import SaveButton from '../components/SaveButton';
import InlineButton from '../components/InlineButton';
import { Env } from '../config';
import ModelSavePopup from '../containers/ModelSavePopup';
import ModelLoadPopup from '../containers/ModelLoadPopup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {isMobile, isTablet, isSmartTV} from 'react-device-detect';
import { bindActionCreators } from 'redux';
import * as TransformAction from '../actions/TransformAction';
import * as TrainerAction from '../actions/TrainerAction';
import { connect } from 'react-redux';
import { useAuth } from '../context/auth';
import AccountPopup from './AccountPopup';
import LoginPopup from './LoginPopup';
import SignupPopup from './SignupPopup';
import MyAccountPopup from './MyAccountPopup';
import CreateModelPopup from './CreateModelPopup';
import { loginService, signupService, updateAccountService, updateAlertSettingsService, uploadUsersFile } from '../service/AuthService';
import SmallButton from '../components/SmallButton';
import AlertSettingsPopup from './AlertSettingsPopup';

function Header({transforms, trainOptions, transformAction, trainerAction, inputFileId}) {

  const {authTokens, setAuthTokens} = useAuth();
  const [openAccountPopup, setOpenAccountPopup] = useState(false);
  const [openMyAccountPopup, setOpenMyAccountPopup] = useState(false);
  const [openLoginPopup, setOpenLoginPopup] = useState(false);
  const [openSignupPopup, setOpenSignupPopup] = useState(false);
  
  const linkRef = React.createRef();
  const uploadFileRef = React.createRef();
  const JsonFileHeader = "text/json;charset=utf-8,";

  const [showModelName, setShowModelName] = useState(false)
  const [modelName, setModelName] = useState("transformations")

  const [models, setModels] = useState([])
  const [selectedModelId, setSelectedModelId] = useState(0)

  const [openSaveDialog, setOpenSaveDialog] = useState(false)
  const [openLoadDialog, setOpenLoadDialog] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [openAlertSettings, setOpenAlertSettings] = useState(false)
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

  const onSessionExpired = () => {
    setAuthTokens(null)
    toast('Session is expired, please login again', {
      type: 'error'
    })
  }

  const saveModel = () => {
    if (modelName !== '') {
      savePredictModel(authTokens.token, modelName, inputFileId, transforms, trainOptions, toast).then((res) => {
        if (res) {
          toast('The Model \"' + modelName + '\" has been saved to the cloud.')
        } else {
          onSessionExpired()
        }
      })
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

  const updateModel = (modelId) => {
      updatePredictModel(authTokens.token, modelId, inputFileId, transforms, trainOptions, toast).then((res) => {
        if (res) {
          toast('The Model has been updated to the cloud.')
        } else {
          onSessionExpired()
        }
      })
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
    getPredictModels(authTokens.token).then((res) => {
      if (res.success) {
        setModels(res.models)
      } else {
        toast('Loading models failed.', {type: 'error'})
      }
      setModelLoaded(2)
    }).catch((err) => {
      console.log(err)
      setOpenSaveDialog(false)
      setOpenLoadDialog(false)
      onSessionExpired()
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
        transformAction.selectServerFile('TSData_' + models1[0].symbol + '_' + models1[0].frequency + '_' + models1[0].start_date, authTokens.token)
      } catch (error) {
        console.log(error)        
      }
    } else {
      console.log('No model found.')
    }
  }

  useEffect(() => {
    if (isMobile || isTablet || isSmartTV) {
      toast('The application is not 100% supported on this device yet', {
        type: "error"
      })
    } 
  })

  const login = async (username, password) => {
    
    return loginService(username, password).then((res) => {
      if (res && res.success) {
        console.log(res.token)
        setAuthTokens({
          username: username,
          fullName: res.fullName,
          email: res.email,
          webAlerts: res.webAlerts,
          emailAlerts: res.emailAlerts,
          token: res.token,
          tsDataAvailable: false
        })
        return {
          type: 'success',
          token: res.token
        }
      } else {
        return {type: 'error', reason: res.reason}
      }
    }).catch((err) => {
      return {type: 'error', reason: 'server_error'}
    })
  }

  const signup = async (username, email, fullName, password) => {
    return signupService(username, password, email, fullName).then((res) => {
      if (res && res.success) {        
        setAuthTokens({
          username: username,
          fullName: fullName,
          email: email,
          webAlerts: true,
          emailAlerts: true,
          token: res.token,
          tsDataAvailable: false
        })
        setOpenSignupPopup(false)
        return 'success'
      } else {
        return res.reason
      }
    }).catch((err) => {
      return 'server_error'
    })
  }

  const logout = () => {
    setAuthTokens(null)
  }

  const updateAccount = (email, fullName) => {
    updateAccountService(authTokens.token, email, fullName).then((res) => {
      if (res && res.success) {        
        setAuthTokens({
          ...authTokens,
          fullName: fullName,
          email: email, 
        })
      } else {
        toast(res ? ('Login failed, ' + res.reason) : 'Login failed, server error')
      }
    }).catch((err) => {
      setAuthTokens(null)
    })
  }

  const getStartChar = (name) => {
    const names = name.split(' ')
    if (names.length > 1) {
      return (names[0].substr(0, 1) + names[1].substr(0, 1)).toUpperCase()
    }
    return names[0].toUpperCase().substr(0, 2)
  }

  const onSelectUsersFile = (file) => {
    uploadUsersFile(authTokens.token, file).then((res) => {
      if (res.success) {
        toast(`${res.added_users} users are added/updated.`)
      } else {
        toast('Upload failed.', {type: 'error'})
      }
      document.getElementById('users_file').value = ""
    }).catch((err) => {
      console.log(err)
      onSessionExpired()
    })
  }

  const saveAlertSettings = (webAlerts, emailAlerts) => {
    updateAlertSettingsService(authTokens.token, webAlerts, emailAlerts).then((res) => {
      if (res && res.success) {        
        setAuthTokens({
          ...authTokens,
          webAlerts: webAlerts,
          emailAlerts: emailAlerts, 
        })
      } else {
        toast('Update alert settings failed', {type: 'error'})
      }
    }).catch((err) => {
      onSessionExpired()
    })
  }

  return (
    <div className="Header">
      <div className="Header-Left">
        <span className="Title" >Machine Learning Tool</span>
        { (authTokens && authTokens.username === 'admin' ) && <div className='SelectFile' style={{marginLeft: 20}}>
          <input id='users_file' type='file' onChange={(e) => onSelectUsersFile(e.target.files[0])} />
          <span>Upload customer csv file</span>
        </div> }
        
      </div>
      <AccountPopup open={openAccountPopup} setOpen={setOpenAccountPopup} 
        onAlertSettings={() => {setOpenAccountPopup(false); setOpenAlertSettings(true)}}
        onViewProfile={() => {setOpenAccountPopup(false); setOpenMyAccountPopup(true)}}
        onLogout={() => {logout(); setOpenAccountPopup(false)}} ></AccountPopup>
      { authTokens && <AlertSettingsPopup open={openAlertSettings} setOpen={setOpenAlertSettings}
        onSave={(webAlerts, emailAlerts) => saveAlertSettings(webAlerts, emailAlerts)}
        emailAlertsInit={authTokens.emailAlerts}
        webAlertsInit={authTokens.webAlerts}
      ></AlertSettingsPopup> }
      { authTokens && <MyAccountPopup open={openMyAccountPopup} setOpen={setOpenMyAccountPopup} 
        username={authTokens.username}
        emailOriginal={authTokens.email}
        fullNameOriginal={authTokens.fullName}
        onUpdate={(email, fullName) => { updateAccount(email, fullName);  setOpenMyAccountPopup(false) }}></MyAccountPopup> }

      { authTokens ? <div className="MenuContainer">
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

        <CreateModelPopup 
          open={openConfirmDialog}
          setOpen={setOpenConfirmDialog}
          onYes={() => transformAction.clearTransforms()}
        ></CreateModelPopup>

        { !showModelName && <Button onClick={() => setOpenConfirmDialog(true)}>Create Model</Button> }

        { showModelName && 
        <TextField className='MenuInside' placeholder='Database model name' value={modelName} onChange={(e)=>setModelName(e.target.value)} ></TextField> }
        { showModelName && <SaveButton className='MenuInside' onSave={() => saveModel()} onCancel={() => cancelSave()} /> }

        <div className='OrangeAvatar' style={{display: 'inline-grid'}} onClick={() => setOpenAccountPopup(true)}>{ getStartChar(authTokens.fullName || authTokens.username) }</div> 
      </div> : (
      <div className="MenuContainer">
        <InlineButton onClick={() => setOpenLoginPopup(true) }>Login</InlineButton>
        <Button onClick={() => setOpenSignupPopup(true) } >Signup</Button>

        
      </div>
    )}
    <LoginPopup open={openLoginPopup} setOpen={setOpenLoginPopup} onLogin={(username, password) => login(username, password)}></LoginPopup>
        <SignupPopup open={openSignupPopup} setOpen={setOpenSignupPopup} onSignup={(username, email, fullName, password) => signup(username, email, fullName, password)}></SignupPopup>
    </div>
  )
}


const mapStateToProps = (state) => {
  return {
    transforms: state.transforms.transforms,
    trainOptions: state.trainer.options,
    inputFileId: state.transforms.fileId,
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    transformAction: bindActionCreators(TransformAction, dispatch),
    trainerAction: bindActionCreators(TrainerAction, dispatch),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Header)