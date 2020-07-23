import { TASK_CREATED, TASK_TIMEOUT, TASK_FAILED, TASK_FINISHED, TASK_CANCELED } from '../redux/ActionTypes'

export const SUCCESS = 1
export const FAILED = -1
export const PROCESSING = 0

export const createTask = ({
  dispatch, callback, params,
  taskId = 0,
  taskType = 0,
  createType = TASK_CREATED,
  successType = TASK_FINISHED, 
  failedType = TASK_FAILED, 
  timeoutType = TASK_TIMEOUT, 
  interval = 4000, retry = 40}) => {

  dispatch({
    type: createType,
    taskId: taskId,
    taskType: taskType
  })

  let count = 0
  const timer = setInterval(async () => {
    if (count++ < retry) {
      const result = await callback(params)
      if (result.status !== PROCESSING) {
        clearInterval(timer)
        dispatch({
          type: result.status === SUCCESS ? successType : failedType,
          taskId: taskId,
          taskType: taskType,
          payload: result.data
        })
      }
    } else {
      window.alert('It takes too long to train/optimize.')
      clearInterval(timer)
      dispatch({
        type: timeoutType,
        taskId: taskId,
        taskType: taskType
      })
    }
  }, interval)

  return {
    cancel: () => {
      clearInterval(timer)
      dispatch({
        type: TASK_CANCELED,
        taskId: taskId,
        taskType: taskType
      })
    },
  }
}