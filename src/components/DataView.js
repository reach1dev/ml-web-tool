import React from 'react'
import './DataView.css'
import { CSVLink, CSVDownload } from "react-csv";

export default function DataView({title, data, columns, showGraph}) {
  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <b>{title}</b>
        <span>
          <CSVLink data={data} filename={title + ".csv"} className="button">Download CSV</CSVLink>
          &nbsp;
          <input type='button' onClick={() => showGraph()} value='Show graph' />
        </span>
      </div>
      <div style={{height: 400, maxWidth: 550, overflow: 'scroll'}}>
        <table style={{backgroundColor: '#eee', width: '99%', marginTop: 10}}>
          <thead>
            {columns.map(c => (
              <th style={{textAlign: 'left'}}>{c}</th>
            ))}
          </thead>
          <tbody>
          {
            data.map(row => (
              <tr className='row'>
                {
                  columns.map(c => (
                    <td style={{minWidth: 50}}>{typeof row[c] === 'number' ? row[c].toFixed(4) : row[c]}</td>
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