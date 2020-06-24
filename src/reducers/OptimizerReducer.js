import { OPTIMIZER_STARTED, OPTIMIZER_OPENED, OPTIMIZER_FINISHED, OPTIMIZER_FAILED, OPTIMIZER_CLOSED } from '../redux/ActionTypes'


const initialState = {
  opened: false,
  started: false
}

export default function(state = initialState, action) {
  switch(action.type) {
    case OPTIMIZER_OPENED: {
      return {
        ...state,
        opened: true,
        algType: action.payload.algType
      }
    }
    case OPTIMIZER_CLOSED: {
      return {
        ...state,
        opened: false,
      }
    }
    case OPTIMIZER_STARTED: {
      return {
        ...state,
        started: true
      }
    }
    case OPTIMIZER_FINISHED: {
      return {
        ...state,
        started: false,
        opened: false
      }
    }
    case OPTIMIZER_FAILED: {
      return {
        ...state,
        started: false,
        opened: true
      }
    }
    default: {
      return state
    }
  }
}