import { TR_IDS } from "./TransformationTools";

export const TransformParameters = {
  [TR_IDS.MLAlgorithm]: [{
    type: 0,
    parameters: [{
      name: 'n_clusters',
      type: 'number',
      default: 8
    }
    // , {
    //   name: 'n_init',
    //   type: 'number',
    //   default: 10
    // }, {
    //   name: 'tol',
    //   type: 'number',
    //   default: 0.0001
    // }, {
    //   name: 'precompute_distances',
    //   type: 'boolean',
    //   default: 'auto'
    // }, {
    //   name: 'algorithm',
    //   type: 'string',
    //   default: 'auto'
    // }
  ]
  }, {
    type: 1,
    parameters: [{
      name: 'n_clusters',
      type: 'number',
      default: 8
    }, {
      name: 'n_init',
      type: 'number',
      default: 10
    }, {
      name: 'tol',
      type: 'number',
      default: 0.0001
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

  [TR_IDS.PercentRet]: [],

  [TR_IDS.LogReturn]: [{
    name: 'shift',
    type: 'number',
    default: 1
  }],

  [TR_IDS.Windsorizing]: [{
    name: 'min',
    type: 'number',
    default: 0
  }, {
    name: 'max',
    type: 'number',
    default: 0
  }, {
    name: 'min_value',
    type: 'number',
    default: 0
  }, {
    name: 'max_value',
    type: 'number',
    default: 2.5
  }],

  [TR_IDS.TurnC2CD]: [],

  [TR_IDS.TurnRanking]: [],

  [TR_IDS.TurnPercentiles]: [],

  [TR_IDS.PowerFunctions]: [{
    name: 'function',
    type: 'string',
    default: 'square'
  }]
}
