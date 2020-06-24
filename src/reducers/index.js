import { combineReducers } from "redux";
import transforms from './TransformReducer';
import trainer from './TrainerReducer';
import optimizer from './OptimizerReducer';
import chart from './ChartReducer';
import metric from './MetricReducer';

export default combineReducers({ transforms, trainer, optimizer, chart, metric });