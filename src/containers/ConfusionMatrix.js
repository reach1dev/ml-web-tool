import React from 'react'
import './ConfusionMatrix.scss'

export default function ConfusionMatrix({title, confusion, labels}) {
  const cmColors = ['#444', '#666', '#777', '#888', '#999', '#aaa']
  const cmColors1 = ['#44a', '#66a', '#77a', '#88a', '#99c', '#aae']

  return (
    <div className="confusion-matrix">
      <b className="SmallTitle">{title}</b>
      <table>
        <thead>
          <th style={{width: 60}}>Labels</th>
          { labels.map((x, i) => (
            <th>{x}</th>
          )) }
        </thead>
        <tbody>
        { labels.map((x, i) => (
          <tr>
            <th>{x}</th>
            { confusion[i] && labels.map((y, j) => (
              <td style={{backgroundColor: i===j ? cmColors1[i%cmColors1.length] : cmColors[(i+j)%cmColors.length]}}>{confusion[i][j]}</td>
            ))}
          </tr>
        )) }
        </tbody>
      </table>
    </div>
  )
}