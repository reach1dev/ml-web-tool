import React from 'react'
import './DragNode.scss'
import { ItemTypes } from '../constants/ItemTypes'
import { useDrag } from 'react-dnd'
import Colors from '../constants/Colors'


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
  
  const backgroundColor = props.inToolbox ? 'transparent' : props.isInOut ? (props.selected ? Colors.primary : Colors.secondary) : props.selected ? Colors.primary : Colors.inactive;
  const fontColor = props.inToolbox ? 'black' : 'white';
  return (
    <div
      className={(props.inToolbox ? '' : 'DragHover ') + (props.className ? 'Drag ' + props.className : 'Drag')}
      style={{backgroundColor: backgroundColor, color: fontColor}}
      onClick={() => props.data && props.onClick(props.data.id)}
      ref={props.fixed===false ? drag : null}
    >
      {children || props.component}
    </div>
  )
}