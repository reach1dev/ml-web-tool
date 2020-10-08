import React from 'react';

import InlineButton from '../components/InlineButton';
import SmallButton from '../components/SmallButton';
import Popup from '../components/Popup';
import Spinner from './Spinner';

export default function({open, setOpen, models, modelLoaded, loadModelList, loadTransformations, onModelSelected}) {
  return (
    <Popup open={open} close={() => setOpen(false)} position='74%' title='Where do you want to load?'>
      { modelLoaded > 0 && <div style={{display: 'flex', flexDirection: 'column'}}>
        <span className='Label-Center' style={{marginBottom: 5}}>=== Your models saved on cloud ===</span>
        {  models.map((model) => (
          <div className='Model-Item'>
            <span className='Label-Center'>{model.model_name}</span>
            <InlineButton noTopMargin={true} onClick={() => { onModelSelected(model.model_id); setOpen(false) }} value='Load'></InlineButton>
          </div>
        ))}
        <Spinner type='simple' loading={modelLoaded === 1}></Spinner>
      </div> }
      <div style={{display: 'flex', flexDirection: 'row', marginTop: modelLoaded > 0 ? 10 : 0, justifyContent: 'space-between'}}>
        <InlineButton onClick={() => { loadTransformations(); setOpen(false) }} value='Load from PC'></InlineButton>
        <SmallButton onClick={() => loadModelList()} value='Load from Cloud'></SmallButton>
      </div>
    </Popup>
  )
}