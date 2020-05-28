import React from 'react'
import './DropNode.css'
import { ItemTypes } from './ItemTypes'
import { useDrop } from 'react-dnd'

export default function DropNode({ x, y, moveDragNode, checkDraggable, children}) {
  const [{isOver}, drop] = useDrop({
    accept: ItemTypes.DragNode,
    drop: () => moveDragNode(x, y),
    collect: monitor => ({
      isOver: checkDraggable(x, y) &&!!monitor.isOver()
    })
  })


  return (
    <div
      className='Drop'
      ref={drop}
      style={{backgroundColor: isOver?'#77eeeeee':'lightgray'}}
    >
      {children}
    </div>
  )
}