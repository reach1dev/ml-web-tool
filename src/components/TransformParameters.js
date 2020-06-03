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
  }]
}
