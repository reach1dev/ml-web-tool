import React from 'react'
import './DataView.css'
import { CSVLink, CSVDownload } from "react-csv";
import moment from 'moment'

export default function DataView({title, data, columns, showGraph}) {
  const newData = data.map((d, idx) => {
    let k = {...d}
    if (typeof d['Date'] !== 'undefined') {
      k['Date'] = moment(d['Date']).format('MM/DD/YYYY')
    }
    if (columns[0] === 'No.') {
      k['No.'] = (idx+1)
    }
    return k
  })
  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <b>{title}</b>
        <span>
          <CSVLink data={newData} filename={title + ".csv"} className="button">Download CSV</CSVLink>
          &nbsp;
          <input type='button' onClick={() => showGraph()} value='Show graph' />
        </span>
      </div>
      <div style={{height: 400, maxWidth: 550, overflow: 'scroll', margin: 'auto'}}>
        <table style={{backgroundColor: '#eee', width: '99%', marginTop: 10}}>
          <thead>
            {columns.map(c => (
              <th style={{textAlign: 'left'}}>{c}</th>
            ))}
          </thead>
          <tbody>
          {
            newData.map(row => (
              <tr className='row'>
                {
                  columns.map(c => (
                    <td style={{minWidth: c === 'No.' ? 30 : 50}}>{c === 'No.' ? row[c] : typeof row[c] === 'number' ? row[c].toFixed(4) : row[c]}</td>
                  ))
                }
              </tr>
            ))
          }
          </tbody>
        </table>
      </div>
    </div>
  )
}