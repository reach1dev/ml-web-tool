import React from 'react'
import './ToolBox.scss'
import DragNode from './DragNode'
import InlineButton from '../components/InlineButton'

export default function renderToolBox({tools, toolSelector, showProperties}) {
  return (
    <div className='ToolBox'>
      <div className='ToolBox-Header'>
        <b className='SubTitle'>Toolbox</b>
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