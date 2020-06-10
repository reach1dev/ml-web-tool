import { UPLOADING_INPUT_DATA_SUCCESS, UPLOADING_INPUT_DATA, UPLOADING_INPUT_DATA_FAILED, REMOVE_TRANSFORM_FROM_MLA } from "../redux/ActionTypes"
import { TRAIN_AND_TEST_STARTED, ADD_TRANSFORM, MOVE_TRANSFORM, ADD_TRANSFORM_TO_MLA, GET_TRANSFORM_DATA_SUCCESS, GET_TRANSFORM_DATA_START, GET_TRANSFORM_DATA_FAILED, CLEAR_TRANSFORMS, SELECT_TRANSFORM, APPLY_TRANSFORM_SETTINGS, REMOVE_TRANSFORM, TRAIN_AND_TEST_SUCCESS } from "../redux/ActionTypes"
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
    inputFilters: [true, true, true, true, true, true, true, true],
    visible: true,
    inputData: null,
    outputData: null,
    target: false
  }, {
    id: IDS.MLAlgorithm,
    index: 1,
    tool: {shortName: 'ML Algorithm', plusIcon: false, id: IDS.MLAlgorithm},
    x: 6,
    y: 5,
    inputParameters: ['Date', 'Time'],
    outputParameters: ['Date', 'Time', 'Label'],
    inputFilters: [true, true],
    trainLabel: '',
    algorithmType: 'kmean',
    parameters: {n_clusters: 8},
    visible: true,
    inputData: null,
    outputData: null,
    target: false
  }],
  selectedTransform: null,
  inputData: null,
  outputData: null,
  trainMetrics: null,
  fileId: null,
  file: null,
  uploading: false,  
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CLEAR_TRANSFORMS:
      return initialState
    case UPLOADING_INPUT_DATA_SUCCESS: {
      const { file, fileId, columns } = action.payload;
      return {
        ...state,
        uploading: false,
        file: file,
        fileId: fileId,
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
    case UPLOADING_INPUT_DATA: {
      return {
        ...state,
        uploading: true,
      };
    }
    case UPLOADING_INPUT_DATA_FAILED: {
      return {
        ...state,
        uploading: true,
      };
    }
    case ADD_TRANSFORM: {
      return {
        ...state,
        transforms: [
          ...state.transforms,
          action.payload
        ]
      };
    }
    case MOVE_TRANSFORM: {
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
    case REMOVE_TRANSFORM_FROM_MLA: {
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
    case ADD_TRANSFORM_TO_MLA: {
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
                  ...Object.values(t.outputParameters)
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
    case SELECT_TRANSFORM: {
      const transforms = state.transforms.filter((t) => t.id === action.payload.id)
      return {
        ...state,
        selectedTransform: transforms.length>0?transforms[0]:null
      }
    }
    case GET_TRANSFORM_DATA_START: {
      return {
        ...state,
        getTransformLoading: true
      }
    }
    case TRAIN_AND_TEST_STARTED: {
      return {
        ...state,
        resFileId: action.payload.resFileId
      }
    }
    case TRAIN_AND_TEST_SUCCESS: {
      const {chart, metrics} = action.payload
      return {
        ...state,
        trainMetrics: metrics,
        inputData: null,
        outputData: chart,
        getTransformLoading: false
      }
    }
    case GET_TRANSFORM_DATA_SUCCESS: {
      const {chart} = action.payload
      return {
        ...state,
        inputData: chart,
        outputData: chart,
        trainMetrics: null,
        getTransformLoading: false
      };
    }
    case GET_TRANSFORM_DATA_FAILED: {
      return {
        ...state,
        getTransformLoading: false
      }
    }
    case APPLY_TRANSFORM_SETTINGS: {
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
      return {
        ...state,
        transforms: state.transforms.map((t) => {
          if (transforms[t.id]) {
            return transforms[t.id]
          } else if (t.id === IDS.MLAlgorithm) {
            let params = []
            state.transforms.forEach(t => {
              if (t.target) {
                params = [
                  ...params,
                  ...Object.values((transforms[t.id] ? transforms[t.id] : t).outputParameters)
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
      }
    }
    case REMOVE_TRANSFORM: {
      const {transformId} = action.payload
      return {
        ...state,
        selectedTransform: state.transforms[0],
        transforms: state.transforms.filter((t) => t.id !== transformId).map(t => {
          if (t.parentId === transformId) {
            return {
              ...t,
              parentId: -1
            }
          }
          return t
        })
      }
    }
    default:
      return state;
  }
}
