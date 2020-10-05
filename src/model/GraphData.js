import { Env } from "../config"
import { AlgorithmTypes, Analyse } from "../constants/TransformParameters"

export const parseGraphList = (algType, list, columns, indexColumn = 'Date', extra = {}) => {
  let data = []
  let mins = {}
  let maxes = {}
  if (list !== null) {
    let k = 0
    let maxLength = list.reduce((k, l) => (k === null || k<l.length)?l.length:k, null)
    for(let i=0; i<maxLength; i++) {
      // if (Env.mode === 'debug' && AlgorithmTypes[algType] !== Analyse && i%10 !== 0) {
      //   continue
      // }
      let row = {'Time': ++k}

      for(let j=0; j<list.length; j++) {
        let label =  columns[j]
        if (columns[j] === indexColumn) {
          if (indexColumn === 'Date') {
            row[label] = Date.parse(list[j][i])
          } else {
            row[label] = list[j][i]
          }          
          continue
        }
        row[label] = list[j][i]
        if (mins[label] === undefined || list[j][i] < mins[label]) {
          mins[label] = list[j][i]
        }
        if (maxes[label] === undefined || list[j][i] > maxes[label]) {
          maxes[label] = list[j][i]
        }
      }
      data.push(row)
    }
  }
  
  return {
    title: 'Train & test comparison',
    data: data,
    mins: mins,
    maxes: maxes,
    meta: algType===0 ? {
      columns:  ['Vol', 'Rng', 'Tar'],
      'n_clusters': parseInt(extra['n_clusters'])
    } : {
      columns: columns,
      targetColumn: extra['trainLabel']
    }
  }
}

export const getColumns = (algType, featureColumns, colIdx, extra = false) => {
  if (algType === 1) {
    return (colIdx === 0 ? 'Target' : 'Prediction')
  } else if (algType === 5) {
    return (colIdx === 0 ? 'explained_variance_ratio' : 'singular_values')
  } else if (algType === 6) {
    return 'F-' + colIdx
  } else if(algType !== 0) {
    if (algType === 2 && extra['multiple']) {
      return (colIdx %2 === 0 ? featureColumns[colIdx/2] + '-T' : featureColumns[Math.floor(colIdx/2)] + '-P')
    } else {
      return (colIdx === 0 ? 'Target' : 'Prediction')
    }
  } else if (algType === 0) {
    return 'C-' + (colIdx+1)
  }
}


export const parseSimpleGraph = (graph, columns) => {
  let data = []
  let mins = {}
  let maxes = {}
  for (let i=0; i<graph.length; i++) {
    let row = {'Time': graph[i][0]}
    let k = 0
    columns.forEach(c => {
      if (mins[c] === undefined || graph[i][k] < mins[c]) {
        mins[c] = graph[i][k]
      }
      if (maxes[c] === undefined || graph[i][k] > maxes[c]) {
        maxes[c] = graph[i][k]
      }
      row[c] = graph[i][k++]
    })
    data.push(row)
  }
  return {
    title: 'Score graph',
    data: data,
    mins: mins,
    maxes: maxes,
    meta: {
      columns: columns
    }
  }
}