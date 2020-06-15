import { TR_IDS } from "./TransformationTools";

export const Clustering = 0
export const Classification = 1
export const Regression = 2
export const Analyse = 3

export const AlgorithmTypes = [Clustering, Classification, Regression, Regression, Classification, Classification, Analyse]

export const TransformParameters = {
  [TR_IDS.MLAlgorithm]: [{
    type: 0,
    name: 'k-Mean',
    parameters: [{
      name: 'n_clusters',
      type: 'number',
      default: 8
    }
  ]}, {
    type: 1,
    name: 'k-NN',
    parameters: [{
      name: 'n_neighbors',
      type: 'number',
      default: 8
    }]
  }, {
    type: 2,
    name: 'Linear Regression',
    parameters: [{
      name: 'multiple',
      desc: 'use all features as targets',
      type: 'boolean',
      default: false
    }]
  }, {
    type: 3,
    name: 'Logistic Regression',
    parameters: [{
      name: 'solver',
      type: 'string',
      default: 'lbfgs'
    }, {
      name: 'penalty',
      type: 'string',
      default: 'l2'
    }]
  }, {
    type: 4,
    name: 'SVM',
    parameters: [{
      name: 'useSVR',
      type: 'boolean',
      default: false
    }, {
      name: 'gamma',
      type: 'string',
      default: 'auto'
    }, {
      name: 'kernel',
      type: 'string',
      default: 'rbf'
    }, {
      name: 'degree',
      type: 'number',
      default: 3
    }]
  }, {
    type: 6,
    name: 'LDA',
    parameters: []
  }, {
    type: 5,
    name: 'PCA',
    parameters: []
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
