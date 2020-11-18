import { TRAINER_LOAD_SETTINGS, TRAINER_SAVE_SETTINGS, TRAINER_STARTED, TRAINER_FINISHED, TRAINER_FAILED, CLEAR_ALL, GET_TRANSFORM_DATA_START, OPTIMIZER_FINISHED } from '../redux/ActionTypes'
import { TransformParameters } from '../constants/TransformParameters'
import { IDS } from '../constants/ItemTypes'


const initialState = {
  training: false,
  options: {
    type: 0,
    trainLabel: 'triple_barrier',
    testShift: 1,
    trainSampleCount: 0,
    randomSelect: false,
    alertThreshold: '',
    alertCondition: '',
    parameters: TransformParameters[IDS.MLAlgorithm][0].parameters.reduce((params, p) => {
      return {
        ...params,
        [p.name]: p.default
      }
    }, {})
  }
}

export default function(state = initialState, action) {
  switch(action.type) {
    case CLEAR_ALL:
      return initialState
    case TRAINER_LOAD_SETTINGS: {
      return {
        ...state,
      }
    }
    case TRAINER_SAVE_SETTINGS: {
      return {
        ...state,
        options: {
          ...state.options,
          ...action.payload.options
        }
      }
    }
    case TRAINER_STARTED: {
      return {
        ...state,
        training: true,
      }
    }
    case TRAINER_FINISHED: {
      return {
        ...state,
        training: false,
      }
    }
    case TRAINER_FAILED: {
      return {
        ...state,
        training: false,
      }
    }
    case OPTIMIZER_FINISHED: {
      const newParams = Object.assign(state.options.parameters, action.payload.params)
      return {
        ...state,
        options: {
          ...state.options,
          ...newParams
        }
      }
    }
    default: {
      return state
    }
  }
}