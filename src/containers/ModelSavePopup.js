import React from 'react';

import InlineButton from '../components/InlineButton';
import SmallButton from '../components/SmallButton';
import Popup from '../components/Popup';
import Spinner from '../containers/Spinner';

export default function({open, setOpen, modelName, setModelName, models, modelLoaded, updateModel, createModel, loadModelList, saveModelToPC}) {
  return (
    <Popup open={open} close={() => setOpen(false)} position='77%' title='Where do you want to save?'>
      <div style={{display: 'flex', flexDirection: 'row', marginBottom: modelLoaded > 0 ? 10 : 0}}>
        <span className='Label-Center'>Model name: </span>
        <input type='text' className='TextField-Class' placeholder='Type model name' 
          value={modelName} onChange={(e) => setModelName(e.target.value)}></input>
      </div>
      { modelLoaded > 0 && <div style={{display: 'flex', flexDirection: 'column'}}>
        <span className='Label-Center' style={{marginBottom: 10}}>=== Your models saved on cloud ===</span>
        {  models.map((model) => (
          <div className='Model-Item'>
            <span className='Label-Center'>{model.model_name}</span>
            <InlineButton noTopMargin={true} onClick={() => { updateModel(model.model_id); setOpen(false) } } value='Save here'></InlineButton>
          </div>
        ))}
        <Spinner type='simple' loading={modelLoaded === 1}></Spinner>
      </div> }
      <div style={{display: 'flex', flexDirection: 'row', marginTop: 20, justifyContent: 'space-between'}}>
        <InlineButton onClick={() => { saveModelToPC(); setOpen(false) }} value='Save to PC'></InlineButton>
        <SmallButton onClick={() => !modelLoaded ? loadModelList() : createModel()} value='Save to Cloud'></SmallButton>
      </div>
    </Popup>
  )
}