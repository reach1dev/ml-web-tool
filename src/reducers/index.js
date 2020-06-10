import { combineReducers } from "redux";
import transforms from './TransformReducer';
import mlAlgorithm from './MLAlgorithmReducer';

export default combineReducers({ transforms, mlAlgorithm });