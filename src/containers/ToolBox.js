import React from 'react'
import './ToolBox.scss'
import DragNode from './DragNode'
import InlineButton from '../components/InlineButton'
import ReactTooltip from 'react-tooltip'
import InfoIcon from '@material-ui/icons/Info'

export default function renderToolBox({tools, toolSelector, showProperties}) {
  return (
    <div className='ToolBox'>
      <ReactTooltip className='ToolTip-Custom' multiline={true} backgroundColor='white' arrowColor='white' textColor='black' />
      <div className='ToolBox-Header'>
        <b className='SubTitle'>Toolbox</b>
        <InfoIcon color='action' data-tip="- Drag any transformation to the main area to add to your ML pipeline.<br/>- Please note it is suggested to select your data first by clicking on the 'Input Data' button in the main area." />
      </div>
      <div>
        <div className='ToolBox-Container'>
          { tools.map((tool, idx) => tool.transform && (
            <DragNode
              key={tool.id}
              id={tool.id}
              className='ToolItem'
              fixed={false}
              inToolbox={true}
              dragHandler={(id) => toolSelector(tool)}
            >
              <InlineButton>{tool.name}</InlineButton>
            </DragNode>
          ))}
        </div>
      </div>
    </div>
  )
}