import { TR_IDS } from "./TransformationTools";

export const Clustering = 0
export const Classification = 1
export const Regression = 2
export const Analyse = 3

export const AlgorithmTypes = [Clustering, Classification, Regression, Classification, Classification, Analyse, Classification, Classification, Classification]

export const TransformParameters = {
  [TR_IDS.MLAlgorithm]: [{
    type: 0,
    name: 'k-Mean',
    parameters: [{
      name: 'n_clusters',
      type: 'number',
      default: 8,
      defaultRange: '2~12'
    }, {
      name: 'random_state',
      type: 'number',
      default: 1,
      defaultRange: '1'
    }, {
      name: 'init',
      type: 'string',
      default: 'k-means++',
      defaultRange: 'k-means++'
    }
  ]}, {
    type: 1,
    name: 'k-NN',
    parameters: [{
      name: 'n_neighbors',
      type: 'number',
      default: 8,
      defaultRange: '3~12'
    }, {
      name: 'P',
      type: 'number',
      default: 1,
      defaultRange: '2'
    }, {
      name: 'metric',
      type: 'string',
      default: 'minkowski',
      defaultRange: 'minkowski'
    }]
  }, {
    type: 2,
    name: 'Linear Regression',
    parameters: []
  }, {
    type: 3,
    name: 'Logistic Regression',
    parameters: [{
      name: 'C',
      type: 'number',
      default: 1,
      defaultRange: '0.1,0.5,1,2,4,10'
    }, {
      name: 'solver',
      type: 'string',
      default: 'lbfgs',
      defaultRange: 'newton-cg,lbfgs,liblinear,sag,saga'
    }, {
      name: 'penalty',
      type: 'string',
      default: 'l2',
      defaultRange: 'l1,l2,elasticnet,none'
    }, {
      name: 'random_state',
      type: 'number',
      default: 1,
      defaultRange: '1'
    }]
  }, {
    type: 4,
    name: 'SVM',
    parameters: [{
      name: 'useSVR',
      type: 'boolean',
      default: false,
    },{
      name: 'C',
      type: 'number',
      default: 1,
      defaultRange: '0.1,1,2,4'
    }, {
      name: 'gamma',
      type: 'string',
      default: 'auto',
      defaultRange: 'auto,scale'
    }, {
      name: 'kernel',
      type: 'string',
      default: 'rbf',
      defaultRange: 'linear,poly,rbf'
    }, {
      name: 'degree',
      type: 'number',
      default: 3,
      defaultRange: '3'
    }, {
      name: 'random_state',
      type: 'number',
      default: 1,
      defaultRange: '1'
    }]
  }, {
    type: 5,
    name: 'PCA',
    parameters: []
  }, {
    type: 6,
    name: 'LDA',
    parameters: [{
      name: 'n_components',
      type: 'number',
      default: 2
    }]
  }, {
    type: 7,
    name: 'Decision Tree',
    parameters: [{
      name: 'regression',
      type: 'boolean',
      default: false
    }, {
      name: 'max_depth',
      type: 'number',
      default: 2,
      defaultRange: '2~4'
    }, {
      name: 'random_state',
      type: 'number',
      default: 0,
      defaultRange: '0'
    }, {
      name: 'criterion',
      type: 'string',
      default: 'mse',
      defaultRange: 'mse,mae'
    }]
  }, {
    type: 8,
    name: 'Random forest',
    parameters: [{
      name: 'regression',
      type: 'boolean',
      default: false
    }, {
      name: 'max_depth',
      type: 'number',
      default: 2
    }, {
      name: 'random_state',
      type: 'number',
      default: 0
    }, {
      name: 'n_estimators',
      type: 'number',
      default: 90
    }, {
      name: 'criterion',
      type: 'string',
      default: 'mse',
      defaultRange: 'mse,mae'
    }]
  }],

  [TR_IDS.Normalization]: [{
    name: 'rolling',
    type: 'number',
    default: 20,
    required: false
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
    default: 20,
    required: false
  }],

  [TR_IDS.Fisher]: [],

  [TR_IDS.SubtractMedium]: [{
    name: 'rolling',
    type: 'number',
    default: 20,
    required: false
  }],

  [TR_IDS.SubtractAverage]: [{
    name: 'rolling',
    type: 'number',
    default: 20,
    required: false
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

  [TR_IDS.MathOperators]: [{
    name: 'name',
    type: 'string',
    placeholder: 'click save to see in target',
    default: ''
  } , {
    name: 'expression',
    type: 'string',
    default: ''
  }],

  [TR_IDS.RollingMean]: [{
    name: 'rolling',
    type: 'number',
    default: 20,
    required: false
  }],

  [TR_IDS.TurnC2CD]: [],

  [TR_IDS.TurnRanking]: [],

  [TR_IDS.TurnPercentiles]: [{
    name: 'rolling',
    type: 'number',
    default: 0,
    required: false
  }],

  [TR_IDS.PowerFunctions]: [{
    name: 'power',
    type: 'number',
    default: 2
  }]
}
