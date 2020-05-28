import { UPLOADING_INPUT_DATA, UPLOADING_INPUT_DATA_SUCCESS, UPLOADING_INPUT_DATA_FAILED } from "../redux/ActionTypes"
import axios from 'axios'

export const uploadInputData = (file) => {
  return (dispatch) => {
    dispatch({
      type: UPLOADING_INPUT_DATA,
    })

    const formData = new FormData();
      formData.append("file", file);

    axios.defaults.baseURL = 'https://api-ml-web-tool.herokuapp.com'
    axios
      .post("/upload-input-data", formData)
      .then(res => {
        if (res.status === 200) {
          dispatch({
            type: UPLOADING_INPUT_DATA_SUCCESS,
            payload: {
              file: file.name
            }
          })
        } else {
          dispatch({
            type: UPLOADING_INPUT_DATA_FAILED,
          })
        }
      })
      .catch(err => console.warn(err));
  }
}