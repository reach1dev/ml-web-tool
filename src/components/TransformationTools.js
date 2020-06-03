export const TR_IDS = {
  Normalization: 101,
  Standardization: 102,
  Fisher: 103,
  SubtractMedium: 104,
  SubtractAverage: 105,
  FirstDiff: 106,
  PercentRet: 107,
  LogReturn: 108,
  Windsorizing: 109,
  TurnC2CD: 110,
  TurnRanking: 111,
  TurnPercentiles: 112,
  PowerFunctions: 113,
  MLAlgorithm: 10000
}

export const TransformationTools = [{
  id: 100,
  shortName: 'Input Data',
  transform: false
}, {
  id: TR_IDS.MLAlgorithm,
  shortName: 'ML Algorithm',
  transform: false,
  plusIcon: false,
}, {
  id: TR_IDS.Normalization,
  shortName: 'Normalization',
  name: 'Normalization',
  transform: true
}, {
  id: TR_IDS.Standardization,
  shortName: 'Standardization',
  name: 'Standardization',
  transform: true
},{
  id: 103,
  shortName: 'Fisher',
  name: 'Fisher Transform',
  transform: true
}, {
  id: 104,
  shortName: 'SR Median',
  name: 'Subtract Rolling Median',
  transform: true
},{
  id: 105,
  shortName: 'SR Average',
  name: 'Subtract Rolling Average',
  transform: true
}, {
  id: 106,
  shortName: 'First Difference',
  name: 'First Difference',
  transform: true
},{
  id: 107,
  shortName: 'Percent Return',
  name: 'Percent Return',
  transform: true
}, {
  id: 108,
  shortName: 'Log Return',
  name: 'Log Return',
  transform: true
},{
  id: 109,
  shortName: 'Windsorizing',
  name: 'Windsorizing',
  transform: true
}, {
  id: 110,
  shortName: 'Turn C2C',
  name: 'Turn Column into Categorical Data',
  transform: true
},{
  id: 111,
  shortName: 'Turn Rankings',
  name: 'Turn Rankings',
  transform: true
}, {
  id: 112,
  shortName: 'Turn Percentiles',
  name: 'Turn Percentiles',
  transform: true
}, {
  id: 113,
  shortName: 'Power',
  name: 'Power Functions',
  transform: true
}]
