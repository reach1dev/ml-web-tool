import { ADD_TRANSFORM, MOVE_TRANSFORM, ADD_TRANSFORM_TO_MLA, GET_TRANSFORM_DATA_SUCCESS, GET_TRANSFORM_DATA_START, GET_TRANSFORM_DATA_FAILED, CLEAR_TRANSFORMS, SELECT_TRANSFORM, APPLY_TRANSFORM_SETTINGS, REMOVE_TRANSFORM, TRAIN_AND_TEST_SUCCESS } from "../redux/ActionTypes";
import { IDS } from "../components/ItemTypes";
import { getDefaultParameters } from "../components/TransformParameters";
import { TR_IDS } from "../components/TransformationTools";

const initialState = {
  transforms: [{
    id: IDS.InputData,
    index: 0,
    tool: {shortName: 'Input Data', id: IDS.InputData},
    x: 0,
    y: 5,
    inputParameters: ['Date', 'Time', 'High', 'Low', 'Open', 'Close', 'Vol', 'OI'],
    outputParameters: ['Date', 'Time', 'High', 'Low', 'Open', 'Close', 'Vol', 'OI'],
    inputFilters: [true, true, true, true, true, true, true, true],
    visible: true,
    inputData: null,
    outputData: null,
    target: false
  }, {
    id: IDS.MLAlgorithm,
    index: 1,
    tool: {shortName: 'ML Algorithm', plusIcon: false, id: IDS.MLAlgorithm},
    x: 5,
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
  trainMetrics: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CLEAR_TRANSFORMS:
      return initialState
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
                  ...t.outputParameters.filter(t => t !== 'Date' && t !== 'Time').map(p => p + '#' + t.id)
                ]
              }
            })
            const inputParameters = [
              'Date', 'Time',
              ...params
            ]
            return {
              ...t,
              inputParameters: inputParameters,
              inputFilters: inputParameters.map(t => true)
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
    case TRAIN_AND_TEST_SUCCESS: {
      const {graph, metrics} = action.payload
      console.log('graph >> ' + JSON.stringify(graph))
      return {
        ...state,
        trainMetrics: metrics,
        inputData: null,
        outputData: graph,
        getTransformLoading: false
      }
    }
    case GET_TRANSFORM_DATA_SUCCESS: {
      const {inputData, outputData} = action.payload
      return {
        ...state,
        inputData: inputData,
        outputData: outputData,
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
      return {
        ...state,
        transforms: state.transforms.map((t) => {
          if (t.id === id) {
            return {
              ...t,
              ...settings
            }
          } else if (t.id === IDS.MLAlgorithm) {
            let params = []
            state.transforms.forEach(t => {
              if (t.target) {
                if (t.id === id) {
                  params = [
                    ...params,
                    ...(settings.outputParameters || t.outputParameters).filter(t => t !== 'Date' && t !== 'Time').map(p => p + '#' + t.id)
                  ]
                } else {
                  params = [
                    ...params,
                    ...t.outputParameters.filter(t => t !== 'Date' && t !== 'Time').map(p => p + '#' + t.id)
                  ]
                }
              }
            })
            const inputParameters = [
              'Date', 'Time',
              ...params
            ]
            return {
              ...t,
              inputParameters: inputParameters,
              inputFilters: inputParameters.map(t => true)
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
