import { combineReducers } from "redux";
import transforms from './TransformReducer';
import inputData from "./InputDataReducer";
import mlAlgorithm from './MLAlgorithmReducer';

export default combineReducers({ inputData, transforms, mlAlgorithm });