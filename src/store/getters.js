const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,

  groupModeFetch: function(state) {
    return function(taskType, annotationType) {
      if (taskType in state.annotationSettings.twoGroupAnnotationMode) {
        return 2
      }
      if (taskType in state.annotationSettings.groupAnnotationMode) {
        for (var i = 0; i < state.annotationSettings.groupAnnotationMode[taskType].length; i++) {
          if (state.annotationSettings.groupAnnotationMode[taskType][i] === annotationType) {
            return 1
          }
        }
      }
      return 0
    }
  }
}
export default getters
