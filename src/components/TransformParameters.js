import { TR_IDS } from "./TransformationTools";


export const TransformParameters = {
  [TR_IDS.MLAlgorithm]: [{
    type: 0,
    parameters: [{
      name: 'n_clusters',
      type: 'number',
      default: 8
    }
  ]}, {
    type: 1,
    parameters: [{
      name: 'n_neighbors',
      type: 'number',
      default: 8
    }]
  }, {
    type: 2,
    parameters: [{
      name: 'n_neighbors',
      type: 'number',
      default: 8
    }]
  }],

  [TR_IDS.Normalization]: [{
    name: 'rolling',
    type: 'number',
    default: 20
  }, {
    name: 'min',
    type: 'number',
    default: 0
  }, {
    name: 'max',
    type: 'number',
    default: 1
  }],

  [TR_IDS.Standardization]: [{
    name: 'rolling',
    type: 'number',
    default: 20
  }],

  [TR_IDS.Fisher]: [],

  [TR_IDS.SubtractMedium]: [{
    name: 'rolling',
    type: 'number',
    default: 20
  }],

  [TR_IDS.SubtractAverage]: [{
    name: 'rolling',
    type: 'number',
    default: 20
  }],

  [TR_IDS.FirstDiff]: [{
    name: 'shift',
    type: 'number',
    default: 1
  }],

  [TR_IDS.PercentRet]: [{
    name: 'shift',
    type: 'number',
    default: 1
  }],

  [TR_IDS.LogReturn]: [{
    name: 'shift',
    type: 'number',
    default: 1
  }],

  [TR_IDS.Windsorizing]: [{
    name: 'min',
    type: 'number',
    default: -1
  }, {
    name: 'max',
    type: 'number',
    default: 1
  }, {
    name: 'scale',
    type: 'number',
    default: 1
  }],

  [TR_IDS.TurnC2CD]: [],

  [TR_IDS.TurnRanking]: [],

  [TR_IDS.TurnPercentiles]: [{
    name: 'rolling',
    type: 'number',
    default: 0
  }],

  [TR_IDS.PowerFunctions]: [{
    name: 'power',
    type: 'number',
    default: 2
  }]
}
