import { UPLOADING_INPUT_DATA, UPLOADING_INPUT_DATA_SUCCESS, UPLOADING_INPUT_DATA_FAILED } from "../redux/ActionTypes"
import axios from 'axios'
import { BaseUrl } from "./Constants"

export const uploadInputData = (file) => {
  return (dispatch) => {
    dispatch({
      type: UPLOADING_INPUT_DATA,
    })

    const formData = new FormData();
      formData.append("file", file);

    axios.defaults.baseURL = BaseUrl
    // axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*'
    axios
      .post("/upload-input-data", formData)
      .then(res => {
        if (res.status === 200) {
          dispatch({
            type: UPLOADING_INPUT_DATA_SUCCESS,
            payload: {
              file: file.name,
              fileId: res.data.file_id
            }
          })
        } else {
          dispatch({
            type: UPLOADING_INPUT_DATA_FAILED,
          })
        }
      })
      .catch(err => console.log(err));
  }
}