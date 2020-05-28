import { ADD_TRANSFORM, MOVE_TRANSFORM, ADD_TRANSFORM_TO_MLA, GET_TRANSFORM_DATA_SUCCESS, GET_TRANSFORM_DATA_START, GET_TRANSFORM_DATA_FAILED, CLEAR_TRANSFORMS, SELECT_TRANSFORM, APPLY_TRANSFORM_SETTINGS } from "../redux/ActionTypes";
import { IDS } from "../components/ItemTypes";

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
    inputParameters: [],
    outputParameters: [],
    parameters: {},
    visible: true,
    inputData: null,
    outputData: null,
    target: false
  }],
  selectedTransform: -1,
  inputData: {
    data: []
  },
  outputData: {
    data: []
  }
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
      const {index, x, y} = action.payload
      const transforms = state.transforms
      transforms[index] = {
        ...state.transforms[index],
        x: x,
        y: y
      }
      return {
        ...state,
        transforms: transforms
      };
    }
    case ADD_TRANSFORM_TO_MLA: {
      const {index} = action.payload
      const transforms = state.transforms
      transforms[index] = {
        ...state.transforms[index],
        target: true
      }
      return {
        ...state,
        transforms: transforms
      };
    }
    case SELECT_TRANSFORM: {
      return {
        ...state,
        selectedTransform: action.payload.index
      }
    }
    case GET_TRANSFORM_DATA_START: {
      return {
        ...state,
        getTransformLoading: true
      }
    }
    case GET_TRANSFORM_DATA_SUCCESS: {
      const {inputData, outputData} = action.payload
      return {
        ...state,
        inputData: inputData,
        outputData: outputData,
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
      const {index, settings} = action.payload
      let transforms = state.transforms
      transforms[index] = {
        ...transforms[index],
        ...settings
      }
      return {
        ...state,
        transforms: transforms
      }
    }
    default:
      return state;
  }
}
