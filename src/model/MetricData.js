import { AlgorithmTypes, Classification } from "../components/TransformParameters"

export const getMetricMeta = (algType, featureColumns, extra = {}) => {
  let metricMeta = null
  
  if (algType === 5) {
    metricMeta = {
      'main': 'Features',
      'rows': featureColumns,
      'columns': ['explained_variance_ratio', 'singular_values']
    }
  } else if (algType > 0) {
    const mainType = AlgorithmTypes[algType]
    metricMeta = {
      'columns': ['Train', 'Test'],
      'rows': mainType !== Classification || extra['useSVR'] ? ['R2', 'MSE', 'MAE', 'Explained variance'] : ['Accuracy', 'Precision', 'Recall', 'F1'], 
      'main': 'Metric type'
    }
  }

  return metricMeta
}