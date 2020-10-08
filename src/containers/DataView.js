import React from 'react'
import './DataView.scss'
import { CSVLink, CSVDownload } from "react-csv";
import moment from 'moment'
import SmallButton from '../components/SmallButton';

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
    <div className='DataView'>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <b className='SmallTitle'>{title}</b>
        <div style={{display: 'flex'}}>
          <CSVLink data={newData} filename={title + ".csv"} className="InlineButton-Small">Download CSV</CSVLink>
          &nbsp;
          <SmallButton type='button' onClick={() => showGraph()} value='Show graph' />
        </div>
      </div>
      <div className='TableContainer'>
        <table style={{marginTop: 10}}>
          <thead>
            {columns.map(c => (
              <th>{c}</th>
            ))}
          </thead>
          <tbody style={{display: 'block', margin: 'auto'}}>
          {
            newData.map(row => (
              <tr className='row'>
                {
                  columns.map(c => (
                    <td style={{minWidth: c === 'No.' ? 30 : 30}}>{c === 'No.' ? row[c] : typeof row[c] === 'number' ? row[c].toFixed(1) : row[c]}</td>
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