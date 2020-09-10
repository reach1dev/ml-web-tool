import * as types from "../redux/ActionTypes"
import { IDS } from "../components/ItemTypes";

const initialState = {
  transforms: [{
    id: IDS.InputData,
    index: 0,
    tool: {shortName: 'Input Data', id: IDS.InputData},
    x: 0,
    y: 5,
    inputParameters: [],
    outputParameters: {},
    inputFilters: [],
    visible: true,
    inputData: null,
    outputData: null,
    target: false
  }, {
    id: IDS.MLAlgorithm,
    index: 1,
    tool: {shortName: 'Trainer', plusIcon: false, id: IDS.MLAlgorithm},
    x: 6,
    y: 5,
    inputParameters: [],
    outputParameters: ['Date', 'Time', 'Label'],
    inputFilters: [],
    trainLabel: '',
    algorithmType: 'kmean',
    parameters: {n_clusters: 8},
    visible: true,
    inputData: null,
    outputData: null,
    targets: []
  }],
  selectedTransform: null,
  inputData: null,
  outputData: null,
  trainMetrics: null,
  metricMeta: null,
  fileId: 'data_BCRaw',
  file: null,
  uploading: false,  
  sampleCount: 0,
  indexColumn: 'Date'
};


const updateTransforms = (state, transforms) => {
  return {
    ...state,
    transforms: state.transforms.map((t) => {
      if (transforms[t.id]) {
        return transforms[t.id]
      } else if (t.id === IDS.MLAlgorithm) {
        let features = []
        let targets = []
        state.transforms.forEach(t => {
          const t1 = transforms[t.id] ? transforms[t.id] : t
          if (t.target) {
            features = [
              ...features,
              ...Object.values((t1).outputParameters).filter(p => t1.features[p])
            ]
            if (t1.targetColumn !== '') {
              targets = [
                ...targets,
                t1.targetColumn
              ]
            }
          }
        })
        return {
          ...t,
          inputParameters: features,
          inputFilters: features.map((f, idx) => (idx<t.inputFilters.length) ? t.inputFilters[idx] : true),
          targets: targets,
          parameters: {
            ...t.parameters,
            trainLabel: targets.indexOf(t.parameters.trainLabel).length > 0 ? t.parameters.trainLabel : ''
          }
        }
      }
      return t
    })
  }
}
export default function(state = initialState, action) {
  switch (action.type) {
    case types.CLEAR_ALL:
      return initialState
    case types.UPDATE_TRANSFORMS:
      const transforms = action.transforms
      return {
        ...state,
        transforms: transforms
      }
    case types.UPLOADING_INPUT_DATA_SUCCESS: {
      const { file, fileId, columns, indexColumn, sampleCount } = action.payload;
      return {
        ...state,
        uploading: false,
        file: file,
        fileId: fileId,
        sampleCount: sampleCount,
        indexColumn: indexColumn,
        transforms: state.transforms.map(t => {
          if (t.id === IDS.InputData) {
            const outputs = {}
            columns.forEach(col => {
              outputs[col] = col
            })
            return {
              ...t,
              outputParameters: outputs
            }
          } else {
            return t
          }
        })
      };
    }
    case types.UPLOADING_INPUT_DATA: {
      return {
        ...state,
        uploading: true,
      };
    }
    case types.UPLOADING_INPUT_DATA_FAILED: {
      return {
        ...state,
        uploading: true,
      };
    }
    case types.ADD_TRANSFORM: {
      return {
        ...state,
        transforms: [
          ...state.transforms,
          action.payload
        ]
      };
    }
    case types.MOVE_TRANSFORM: {
      const {id, x, y} = action.payload
      return {
        ...state,
        transforms: state.transforms.map((t) => {
          if (t.id === id) {
            return {
              ...t,
              x: x,
              y: y
            }
          }
          return t
        })
      };
    }
    case types.REMOVE_TRANSFORM_FROM_MLA: {
      const {id} = action.payload
      return {
        ...state,
        transforms: state.transforms.map((t) => {
          if (t.id === id) {
            return {
              ...t,
              target: false
            }
          }
          return t
        })
      }
    }
    case types.ADD_TRANSFORM_TO_MLA: {
      const {id} = action.payload
      const tr = state.transforms.filter(t => t.id === id)[0]
      return {
        ...state,
        transforms: state.transforms.map((t) => {
          if (t.id === id) {
            return {
              ...t,
              target: true
            }
          } else if (t.id === IDS.MLAlgorithm) {
            let params = []
            state.transforms.forEach(t => {
              if (t.target || t.id === id) {
                params = [
                  ...params,
                  ...Object.values(t.outputParameters).filter(p => t.features[p])
                ]
              }
            })
            return {
              ...t,
              inputParameters: params,
              inputFilters: params.map(t => true)
            }
          }
          return t
        })
      };
    }
    case types.SELECT_TRANSFORM: {
      const transforms = state.transforms.filter((t) => t.id === action.payload.id)
      return {
        ...state,
        selectedTransform: transforms.length>0?transforms[0]:null
      }
    }
    case types.TRAIN_AND_TEST_STARTED: {
      const {optimized, resFileId} = action.payload
      if (optimized) {
        return {
          ...state,
          resFileId: resFileId
        }
      }
      return {
        ...state,
        resFileId: action.payload.resFileId
      }
    }
    case types.TRAIN_AND_TEST_SUCCESS: {
      const {chart, metrics, metricMeta, params, optimized} = action.payload
      const res = {
        ...state,
        trainMetrics: metrics,
        metricMeta: metricMeta,
        inputData: null,
        outputData: chart,
        getTransformLoading: false
      }
      if (optimized) {
        return {
          ...res,
          parameters: params,
          optimizeFinished: false,
          transforms: state.transforms.map(t => {
            if (t.id === IDS.MLAlgorithm) {
              return {
                ...t,
                parameters: params
              }
            }
            return t
          })
        }
      }
      return res
    }
    case types.GET_TRANSFORM_DATA_FAILED: {
      return {
        ...state,
        getTransformLoading: false
      }
    }
    case types.TRAIN_AND_TEST_FAILED: {
      return {
        ...state,
        getTransformLoading: false
      }
    }
    case types.APPLY_TRANSFORM_SETTINGS: {
      const {id, settings} = action.payload
      let parentTransform = {...state.transforms.filter(t => t.id===id)[0], ...settings}
      let transform = state.transforms.filter(t => t.parentId === parentTransform.id)[0]
      let transforms = {[parentTransform.id]: parentTransform}

      while(transform) {
        const tr = transform
        const outputParameters = {}
        const newInputParameters = parentTransform.inputParameters.concat(Object.values(parentTransform.outputParameters))
        newInputParameters.forEach(p => {
          if (tr.outputParameters[p]) {
            outputParameters[p] = tr.outputParameters[p]
          }
        });
        const trNew = {
          ...tr,
          outputParameters: outputParameters,
          inputParameters: newInputParameters
        }
        transforms[tr.id] = trNew
        parentTransform = trNew
        transform = state.transforms.filter(t => t.parentId === tr.id)[0]
      }
      return updateTransforms(state, transforms)
    }
    case types.REMOVE_TRANSFORM: {
      const {transformId} = action.payload
      const children = state.transforms.filter((t) => t.id !== transformId).filter(t => t.parentId === transformId)
      const transforms = {}
      children.forEach(c => transforms[c.id] = {
        ...c,
        parentId: -1
      })
      const newState = state
      newState.transforms = state.transforms.filter(t => t.id !== transformId)

      return {
        ...updateTransforms(newState, transforms),
        selectedTransform: state.transforms[0],
      }
    }
    default:
      return state;
  }
}
