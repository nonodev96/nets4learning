/**
 *
 * @param {CustomModel_t} tmpModel
 * @return {CustomModel_t}
 */
export function cloneTmpModel (tmpModel) {
  return {
    ...tmpModel,
    original        : tmpModel.original.slice(0, tmpModel.original.length),
    feature_selector: {
      y_target  : tmpModel.feature_selector.y_target,
      X_features: new Set(Array.from([...tmpModel.feature_selector.X_features])),
    }
  }
}