import React from 'react'
import './DragNode.css'
import { ItemTypes } from './ItemTypes'
import { useDrag } from 'react-dnd'


export default function DragNode(props) {
  const children = props.children || (props.component !== null ? props.component() : 'DragNode')
  const [{isDragging}, drag] = useDrag({
    item: { type: ItemTypes.DragNode},
    collect: monitor => {
      if (props.dragHandler !== null && monitor.isDragging()) {
        props.dragHandler(props.id)
      }
      return {
        isDragging: !!monitor.isDragging()
      }
    },
  })
  
  return (
    <div
      className={props.className ? 'Drag ' + props.className : 'Drag'}
      style={props.selected ? {border: 'solid 3px white'} : null}
      onClick={() => props.data && props.onClick(props.data.id)}
      ref={props.fixed===false ? drag : null}
    >
      {children || props.component}
    </div>
  )
}