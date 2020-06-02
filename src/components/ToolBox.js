import React from 'react'
import './ToolBox.css'
import DragNode from './DragNode'

export default function renderToolBox({tools, toolSelector, showProperties}) {
  return (
    <div className='ToolBox'>
      <div className='ToolBox-Header'>
        <b>ToolBox</b>
        { showProperties !== null && <b style={{cursor: 'pointer'}} onClick={()=>showProperties()}>Show Properties</b> }
      </div>
      <div className='ToolBox-ScrollView'>
        <div className='ToolBox-Container'>
          { tools.map((tool, idx) => idx<=9 && tool.transform && (
            <DragNode
              key={tool.id}
              id={tool.id}
              className='ToolItem'
              fixed={false}
              dragHandler={(id) => toolSelector(tool)}
            >
              <span style={{fontSize: 12}}>{tool.name}</span>
            </DragNode>
          ))}
        </div>

        <div className='ToolBox-Container'>
          { tools.map((tool, idx) => idx>9 && tool.transform && (
            <DragNode
              key={tool.id}
              id={tool.id}
              className='ToolItem'
              fixed={false}
              dragHandler={(id) => toolSelector(tool)}
            >
              <span style={{fontSize: 12}}>{tool.name}</span>
            </DragNode>
          ))}
        </div>
      </div>
    </div>
  )
}