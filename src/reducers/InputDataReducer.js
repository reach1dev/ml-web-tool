import { CLEAR_TRANSFORMS, UPLOADING_INPUT_DATA_SUCCESS, UPLOADING_INPUT_DATA, UPLOADING_INPUT_DATA_FAILED } from "../redux/ActionTypes";

const initialState = {
  file: null,
  uploading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CLEAR_TRANSFORMS:
      return initialState
    case UPLOADING_INPUT_DATA_SUCCESS: {
      const { file } = action.payload;
      return {
        ...state,
        uploading: false,
        file: file
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
    default:
      return state;
  }
}
