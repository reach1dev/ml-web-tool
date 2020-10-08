import React, { useEffect, useState } from 'react'
import './Board.css'
import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'
import GraphBoard from './GraphBoard'
import PropertyWidget from './PropertyWidget'
import DragNode from './DragNode'
import DropNode from './DropNode'
import ToolBox from './ToolBox'
import { IDS } from '../constants/ItemTypes'
import { SteppedLineTo } from 'react-lineto'
import MaterialIcon from 'material-icons-react'
import { TransformationTools } from './TransformationTools'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as TransformAction from '../actions/TransformAction'
import { TransformParameters } from '../constants/TransformParameters'

let width = 6
let height = Math.floor((window.innerHeight-200)/60)


function min(a,b) {
  return (a<b) ? a : b
}

function renderGridItem(i, dragItems, moveDragNode, setDragNode, checkDraggable, setSelectedDrag, selectedDrag) {
  const x = i % width
  const y = Math.floor(i / width)
  let dragItem = null

  for (var j=0; j<dragItems.length; j++) {
    if (dragItems[j] && min(dragItems[j].x, width-1) === x && dragItems[j].y === y) {
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
          <DragNode id={dragItem.id} 
            data={dragItem} 
            isInOut={dragItem.index<=1}
            onClick={() => setSelectedDrag(dragItem.id)} 
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
    <div className={'Component'}>
      <span className={'comp_start comp_start_' + id}>
      </span>
      { (plusIcon!==undefined ? !plusIcon:false) && 
        <span style={{marginTop: 4, marginRight: 4}}><MaterialIcon icon='add_circle_outline' size={11} color='white' ></MaterialIcon></span>
      }
      <span>{shortName}</span>
      <span className={'comp_end comp_end_' + id}>
        { (plusIcon!==undefined ? plusIcon:true) && <MaterialIcon icon='add_circle_outline' size={12} color='white' ></MaterialIcon> }
      </span>
    </div>
  )
}

function Board({fileId, transforms, getTransformLoading, transformAction, selectedTransform}) {
  const [status, setStatus] = useState(0)
  let dragNodeId = -1
  let selectedTool = null
  const [propertiesHide, setPropertiesHide] = useState(false)
  const [chartHide, setChartHide] = useState(true)
  const [graphWidth, setGraphWidth] = useState(window.innerWidth * 0.3)
  const [graphHeight, setGraphHeight] = useState(window.innerHeight * 0.23)


  useEffect(() => {
    window.addEventListener('resize', () => {
      setGraphWidth(window.innerWidth*(propertiesHide ? 0.3 : 0.3 ))
      setGraphHeight(window.innerHeight*0.23)
    })
  }, [propertiesHide])
  

  const forceUpdate = () => {
    setStatus(status+1)

    setTimeout(() => {
      setStatus(status-1)
    }, 100)
  }

  const setDragNode = (id) => {
    dragNodeId = id
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
    return getDraggable(x, y) > 0
  }

  const getDraggable = (x, y, _lastItem) => {
    const lastItem = _lastItem || isEmpty(x, y)
    if (dragNodeId >= 0) {
      const transform = transforms.filter(t=>t.id === dragNodeId)[0]
      if (lastItem === 1) {
        // target is MLA
        return 1
      } else if (lastItem > 1) {
        //target has node
        if (transforms[lastItem].id === transform.parentId) {
          //target is parent
          return 0
        }
        const parentId = transforms[lastItem].parentId // the parent of target node
        if (transforms[lastItem].id === dragNodeId) {
          // target is myself
          return 0
        }
        if (parentId < 0) {
          //target node has no parent, will add me to his parent
          return 2
        } else {
          const parents = transforms.filter(t => t.id === parentId)
          const children = transforms.filter(t => t.parentId === dragNodeId)
          if (parents.length > 0 && children.length === 0) {
            //target has parent and drag node has no child, will add me in between of target node and his parent.
            return 3
          }
        }
      }
      if (lastItem >= 0) {
        return 0
      }
      
      if (transform.parentId > 0) {
        const parents = transforms.filter(t => t.id === transform.parentId)
        if (parents.length > 0 && parents[0]) {
          if (parents[0].x >= x) {
            //target position is behind of my parent position
            return 0
          }
        }
      }
      return 4
    }
    if (selectTool !== null && lastItem < 0) {
      return false
    }
    return 5

  }

  const moveDragNode = (x, y) => {
    const lastItem = isEmpty(x, y)
    const dragStatus = getDraggable(x, y, lastItem)
    const newPos = {x: x, y: y}
    if (lastItem >= 0) {
      newPos.x = x + 1
      newPos.y = findEmpty(x + 1, y)
    }
    if (dragStatus === 1) {
      transformAction.addTransformToMLA(dragNodeId)
    } else if (dragStatus === 2) {
      transformAction.applySettings(transforms[lastItem].id, {
        parentId: dragNodeId
      })
    } else if (dragStatus === 3) {
      const parentId = transforms[lastItem].parentId
      const parents = transforms.filter(t => t.id === parentId)
      if (parents.length > 0) {
        const children = transforms.filter(t => t.parentId === dragNodeId)
        if (children.length === 0) {
          transformAction.applySettings(transforms[lastItem].id, {
            parentId: dragNodeId
          })
          transformAction.applySettings(dragNodeId, {
            parentId: parentId
          })
        }
      }
    } else if (dragStatus === 4) {
      transformAction.moveTransform(dragNodeId, newPos.x, newPos.y)
    } else if (dragStatus === 5) {
      if (lastItem < 0) {
        return
      }
      if (!fileId) {
        window.alert('Please upload input file')
        return
      }
      const tool = {
        ...selectedTool,
        id: transforms[transforms.length===2?0:(transforms.length-1)].id + 1
      }
      const parameters = {}
      const defaultParams = TransformParameters[selectedTool.id]
      for(let i=0; i<defaultParams.length; i++) {
        parameters[defaultParams[i].name] = defaultParams[i].default
      }
      const inputParams = transforms[lastItem].inputParameters.concat(Object.values(transforms[lastItem].outputParameters))
      transformAction.addTransform({
        id: tool.id,
        tool: selectedTool,
        inputParameters: inputParams,
        outputParameters: {},
        features: {},
        parameters: parameters,
        parentId: transforms[lastItem].id,
        x: newPos.x,
        y: newPos.y,
        visible: true,
        fixed: false,
        targetColumn: {},
        target: 'false'
      })
      selectedTool = null
    }
  }

  const hideProperties = (hide) => {
    //setGraphWidth(hide ? 600 : 400)
    setGraphWidth(window.innerWidth*(hide ? 0.5 : 0.5 ))
    setPropertiesHide(hide)
  }

  const selectTool = (tool) => {
    selectedTool = tool
  }

  const selectTransform = (id) => {
    transformAction.selectTransform(id)
    setChartHide(true)
  }

  
  const grid = []
  for (let i=0; i<height; i++) {
    const gridRow = []
    for (let j=0; j<width; j++) {
      gridRow.push(renderGridItem(
        i*width+j, transforms, 
        moveDragNode, setDragNode, checkDraggable, 
        (id) => selectTransform(id),
        selectedTransform ? selectedTransform.id : -1),
      )
    }
    grid.push(gridRow)
  }

  const tools = TransformationTools
  
  useEffect(() => {
    // transformAction.clearTransforms()
    forceUpdate()
  }, [transforms, chartHide])


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

  const selParentTransforms = selectedTransform?transforms.filter((t) => t.id === selectedTransform.parentId):[]
  const selParentTransform = selParentTransforms.length > 0 ? selParentTransforms[0] : null

  return (
    <div className='Board' >
      <DndProvider backend={Backend}>
        <div className={chartHide ? 'Board-Left Board-Left-Max' : 'Board-Left'}>
          <ToolBox tools={tools} toolSelector={selectTool} showProperties={() => hideProperties(!propertiesHide)}></ToolBox>
          <div 
            className={!chartHide ? 'Board-Scroll' : 'Board-Scroll Board-Padding' } onScroll={forceUpdate}>
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
                    color='black'
                    borderColor='gray' >
                  </SteppedLineTo>
                ))
              }
            </div>
          </div>
        </div>
      </DndProvider>

      { !chartHide && <GraphBoard
        hideMe={() => setChartHide(true)}
        transform={selectedTransform}
        parentTransform={selParentTransform}
        loading={getTransformLoading} 
        height={graphHeight}
        width={graphWidth}></GraphBoard>}
      
      { chartHide && <PropertyWidget onDrawClicked={() => setChartHide(false)} hide={propertiesHide} setHide={hideProperties}></PropertyWidget> }
      
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    fileId: state.transforms.fileId,
    transforms: state.transforms.transforms,
    hasChart: state.chart.charts.length > 0,
    selectedTransform: state.transforms.selectedTransform,
    getTransformLoading: state.transforms.getTransformLoading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    transformAction: bindActionCreators(TransformAction, dispatch)
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Board)