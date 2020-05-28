import React, { useEffect, useState } from 'react'
import './Board.css'
import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'
import GraphBoard from './GraphBoard'
import PropertyWidget from './PropertyWidget'
import DragNode from './DragNode'
import DropNode from './DropNode'
import ToolBox from './ToolBox'
import { IDS } from './ItemTypes'
import { SteppedLineTo } from 'react-lineto'
import MaterialIcon from 'material-icons-react'
import { TransformationTools } from './TransformationTools'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as TransformAction from '../actions/TransformAction'
import * as InputDataAction from '../actions/InputDataAction'
import { TransformParameters } from './TransformParameters'

let width = 12
let height = Math.floor((window.innerHeight-200)/50)


function renderGridItem(i, dragItems, moveDragNode, setDragNode, checkDraggable, setSelectedDrag, selectedDrag) {
  const x = i % width
  const y = Math.floor(i / width)
  let dragItem = null

  for (var j=0; j<dragItems.length; j++) {
    if (dragItems[j].x === x && dragItems[j].y === y) {
      if (dragItems[j].visible) {
        dragItem = dragItems[j]
        break
      }      
    }
  }

  return (
    <div key={i}>
      <DropNode moveDragNode={moveDragNode} checkDraggable={checkDraggable} x={x} y={y}>
        {dragItem ? 
          <DragNode id={dragItem.index} 
            data={dragItem} 
            onClick={() => setSelectedDrag(dragItem.index)} 
            selected={selectedDrag===dragItem.id} 
            fixed={dragItem.fixed} 
            dragHandler={(id) => setDragNode(id)} 
            component={getComponent({...dragItem.tool}, dragItem.id)} 
          /> : null}
      </DropNode>
    </div>
  )
}

function getComponent({shortName, plusIcon}, id) {
  return () => (
    <div className={'Component'} style={{width: 108}}>
      <span className={'comp_start_' + id} style={{marginTop: 12, marginLeft: 4}}>
      </span>
      { (plusIcon!==undefined ? !plusIcon:false) && 
        <span style={{marginTop: 4, marginRight: 4}}><MaterialIcon icon='add_circle_outline' size={14} color='white' ></MaterialIcon></span>
      }
      <span>{shortName}</span>
      <span className={'comp_end_' + id} style={{display: 'flex', marginTop: 8, marginLeft: 4}}>
        { (plusIcon!==undefined ? plusIcon:true) && <MaterialIcon icon='add_circle_outline' size={15} color='white' ></MaterialIcon> }
      </span>
    </div>
  )
}

function Board({transforms, getTransformLoading, transformAction, selectedTransform}) {
  const [status, setStatus] = useState(0)
  let dragNodeIdx = -1
  let selectedTool = null
  const [propertiesHide, setPropertiesHide] = useState(false)
  const [graphWidth, setGraphWidth] = useState(370)

  const forceUpdate = () => {
    setStatus(status+1)

    setTimeout(() => {
      setStatus(status-1)
    }, 100)
  }

  const setDragNode = (idx) => {
    dragNodeIdx = idx
  }

  const isEmpty = (x, y) => {
    for (let i=0; i<transforms.length; i++) {
      const item = transforms[i]
      if (item.x === x && item.y === y) {
        return i
      }
    }
    return -1
  }

  const findEmpty = (x, y) => {
    for(let k=0; k<height; k++) {
      const ey = Math.floor(y+(k%2===1?(k/2+1):(-k/2)))
      let empty = true
      for (let i=0; i<transforms.length; i++) {
        const item = transforms[i]
        if (item.x === x && item.y === ey) {
          empty = false
          break
        }
      }
      if (empty) {
        return ey
      }
    }
    return 0
  }

  const checkDraggable = (x, y) => {
    const lastItem = isEmpty(x, y)
    if (dragNodeIdx >= 0) {
      if (lastItem === 1) {
        return true
      }
      if (lastItem >= 0) {
        return false
      }
      return true
    }
    if (selectTool !== null && lastItem < 0) {
      return false
    }
    return true

  }

  const moveDragNode = (x, y) => {
    const lastItem = isEmpty(x, y)
    const newPos = {x: x, y: y}
    if (lastItem >= 0) {
      newPos.x = x + 1
      newPos.y = findEmpty(x + 1, y)
    }
    if (dragNodeIdx >= 0) {
      if (lastItem < 0) {
        transformAction.moveTransform(dragNodeIdx, newPos.x, newPos.y)
        forceUpdate()
      } else if (lastItem === 1) {
        transformAction.addTransformToMLA(dragNodeIdx)
        forceUpdate()
      }
    } else if (selectedTool != null) {
      if (lastItem < 0) {
        return
      }
      const tool = {
        ...selectedTool,
        id: IDS.InputData + transforms.length
      }
      const parameters = {}
      const defaultParams = TransformParameters[selectedTool.id]
      for(let i=0; i<defaultParams.length; i++) {
        parameters[defaultParams[i].name] = defaultParams[i].default
      }
      transformAction.addTransform({
        id: tool.id,
        tool: selectedTool,
        index: transforms.length,
        inputParameters: transforms[lastItem].outputParameters.map((param) => param),
        inputFilters: transforms[lastItem].outputParameters.map((param) => true),
        outputParameters: transforms[lastItem].outputParameters.map((param) => param),
        parameters: parameters,
        parentId: transforms[lastItem].id,
        x: newPos.x,
        y: newPos.y,
        visible: true,
        fixed: false,
        target: false
      })
      selectedTool = null
    }
  }

  const hideProperties = (hide) => {
    setGraphWidth(hide ? 640 : 400)
    setPropertiesHide(hide)
  }

  const selectTool = (tool) => {
    selectedTool = tool
  }

  
  const grid = []
  for (let i=0; i<height; i++) {
    const gridRow = []
    for (let j=0; j<width; j++) {
      gridRow.push(renderGridItem(
        i*width+j, transforms, 
        moveDragNode, setDragNode, checkDraggable, (idx) => 
          transformAction.selectTransform(
          idx, 
          transforms[idx].id),  //transforms[idx].inputData === null && transforms[idx].outputData === null ? 
          selectedTransform>=0 ? transforms[selectedTransform].id : -1)
      )
    }
    grid.push(gridRow)
  }

  const tools = TransformationTools

  const [chartTop, setChartTop] = useState({data: [], dataMin: 0, dataMax: 0})
  const [chartBottom, setChartBottom] = useState({data: [], dataMin: 0, dataMax: 0})
  
  useEffect(() => {
    // transformAction.clearTransforms()
    forceUpdate()
  }, [transforms])

  useEffect(() => {
    if (selectedTransform < 0) {
      return
    }
    setChartTop(transforms[selectedTransform].inputData || {data: []})
    setChartBottom(transforms[selectedTransform].outputData || {data: []})
  }, [transforms, selectedTransform, getTransformLoading])

  let lines = []
  for(let i=0; i<transforms.length; i++ ){
    if (transforms[i].id !== IDS.InputData && transforms[i].id !== IDS.MLAlgorithm) {
      const line = {to: transforms[i].id, 'from': transforms[i].parentId}
      lines.push(line)   
    }
    if (transforms[i].target === true) {
      const line = {to: IDS.MLAlgorithm, 'from': transforms[i].id}
      lines.push(line)
    }
  }

  const selTransform = selectedTransform>=0?transforms[selectedTransform]:null
  const selParentTransforms = selTransform?transforms.filter((t) => t.id === transforms[selectedTransform].parentId):[]
  const selParentTransform = selParentTransforms.length > 0 ? selParentTransforms[0] : null

  return (
    <div className='Board'>
      <DndProvider backend={Backend}>
        <div className='Board-Left'>
          <ToolBox tools={tools} toolSelector={selectTool} showProperties={() => hideProperties(!propertiesHide)}></ToolBox>
          <div 
            className='Board-Scroll' onScroll={forceUpdate}>
            <div className='Board-Col'>
              { grid.map((gridRow, idx) => (
                <div key={idx} className='Board-Row'>
                  {gridRow}
                </div>
              )) }
              {
                lines.map((line, idx) => (
                  <SteppedLineTo 
                    key={idx}
                    idx={idx}
                    within='App'
                    from={'comp_end_' + line.from} 
                    to={'comp_start_' + line.to} 
                    orientation='h' 
                    borderWidth={2}
                    borderColor='gray' >
                  </SteppedLineTo>
                ))
              }
            </div>
          </div>
        </div>
      </DndProvider>
      <PropertyWidget hide={propertiesHide} setHide={hideProperties}></PropertyWidget>
      <GraphBoard 
        transform={selTransform}
        parentTransform={selParentTransform}
        loading={getTransformLoading} 
        chartTop={chartTop} 
        chartBottom={chartBottom} 
        width={graphWidth}></GraphBoard>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    transforms: state.transforms.transforms,
    selectedTransform: state.transforms.selectedTransform,
    getTransformLoading: state.transforms.getTransformLoading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    inputDataAction: bindActionCreators(InputDataAction, dispatch),
    transformAction: bindActionCreators(TransformAction, dispatch)
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Board)