'use strict';

angular.module('scalearAngularApp')
  .factory('Module', ['$resource', '$http', '$stateParams', 'scalear_api', 'headers', '$rootScope', '$translate', function($resource, $http, $stateParams, scalear_api, headers, $rootScope, $translate) {

    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host + '/:lang/courses/:course_id/groups/:module_id/:action', { course_id: $stateParams.course_id, lang: $translate.uses() }, {
      'create': { method: 'POST', headers: headers },
      'index': { method: 'GET', isArray: true, headers: headers },
      'update': { method: 'PUT', headers: headers },
      'destroy': { method: 'DELETE', headers: headers },
      'show': { method: 'GET', headers: headers },
      'newModule': { method: 'POST', params: { action: 'new_module_angular' }, headers: headers },
      'newCustomLink': { method: 'POST', params: { action: 'new_link_angular' }, headers: headers },
      'saveSort': { method: 'POST', params: { action: 'sort' }, headers: headers },
      'getModuleStatistics': { method: 'GET', params: { action: 'get_group_statistics' }, headers: headers },
      'validateModule': { method: 'PUT', params: { action: 'validate_group_angular' }, headers: headers },
      'getLectureProgress': { method: 'GET', params: { action: 'get_lecture_progress_angular' }, headers: headers },
      'getQuizzesProgress': { method: 'GET', params: { action: 'get_quizzes_progress_angular' }, headers: headers },
      'getSurveysProgress': { method: 'GET', params: { action: 'get_surveys_progress_angular' }, headers: headers },
      'getAllItemsProgress': { method: 'GET', ignoreLoadingBar: true, params: { action: 'get_all_items_progress_angular' }, headers: headers },
      'getModuleCharts': { method: 'GET', params: { action: 'get_module_charts_angular' }, headers: headers },
      'getLectureCharts': { method: 'GET', params: { action: 'get_lecture_charts_angular' }, headers: headers },
      'getQuizChart': { method: 'GET', params: { action: 'get_quiz_chart_angular' }, headers: headers },
      'getSurveyChart': { method: 'GET', params: { action: 'get_survey_chart_angular' }, headers: headers },
      'getStudentStatistics': { method: 'GET', params: { action: 'get_student_statistics_angular' }, headers: headers },
      'changeModuleStatus': { method: 'POST', params: { action: 'change_status_angular' }, headers: headers },
      'displayQuizzes': { method: 'GET', params: { action: 'display_quizzes_angular' }, headers: headers },
      'displayQuestions': { method: 'GET', params: { action: 'display_questions_angular' }, headers: headers },
      'displaySurveys': { method: 'GET', params: { action: 'display_surveys_angular' }, headers: headers },
      'hideQuiz': { method: 'POST', params: { action: 'hide_invideo_quiz' }, headers: headers },
      'hideQuestion': { method: 'POST', params: { action: 'hide_student_question' }, headers: headers },
      'getStudentQuestions': { method: 'GET', params: { action: 'get_student_questions' }, headers: headers },
      'getInclassActive': { method: 'GET', params: { action: 'get_inclass_active_angular' }, headers: headers },
      'getStudentModule': { method: 'GET', params: { action: 'get_module_data_angular' }, headers: headers },
      'moduleCopy': { method: 'POST', params: { action: 'module_copy' }, headers: headers },
      'displayAll': { method: 'GET', params: { action: 'display_all' }, headers: headers },
      'getModuleProgress': { method: 'GET', params: { action: 'get_module_progress' }, headers: headers },
      'getModuleInclass': { method: 'GET', params: { action: 'get_module_inclass' }, headers: headers },
      'getQuizCharts': { method: 'GET', params: { action: 'get_quiz_charts' }, headers: headers },
      'getQuizChartsInclass': { method: 'GET', params: { action: 'get_quiz_charts_inclass' }, headers: headers },
      'getSurveyCharts': { method: 'GET', params: { action: 'get_survey_charts' }, headers: headers },
      'getLastWatched': { method: 'GET', params: { action: 'last_watched' }, headers: headers },
      'sortGroupLinks': { method: 'POST', headers: headers, params: { action: 'sort_group_links' } },
      'getInclassStudentStatus': { method: 'GET', ignoreLoadingBar: true, headers: headers, params: { action: 'get_inclass_student_status' } },
      'updateAllInclassSessions': { method: 'POST', ignoreLoadingBar: true, headers: headers, params: { action: 'update_all_inclass_sessions' } }
    });
  }])
  .factory('ModuleModel', ['Module', 'ScalearUtils', '$rootScope','ItemsModel', function(Module, ScalearUtils, $rootScope, ItemsModel) {
    var selected_module = null
    var modules = []
    var module_obj = {}
    var course = null

    $rootScope.$on("Course:ready", function(course_data) {
      course = course_data
    })

    $rootScope.$on("Course:set_modules", function(ev, modules) {
      setModules(modules)
    })

    function setSelectedModule(module) {
      selected_module = module
    }

    function getSelectedModule() {
      return selected_module
    }

    function removeSelectedModule() {
      selected_module = null
    }

    function setModules(all_modules) {
      modules = all_modules
      module_obj = ScalearUtils.toObjectById(all_modules)
      modules.forEach(function(module) {
        ItemsModel.addToList(module.items)
      })
      $rootScope.$broadcast("Module:ready", modules)
        // modules.forEach(function(module) {
        //   module_obj[module.id] = module
    }

    function add() {
      var deferred = $q.defer();
      Module.newModule({ course_id: course.id }, {},
        function(data) {
          var module = data.group
          module.items = []
          modules.push(module)
          $scope.module_obj[module.id] = module //$scope.course.modules[$scope.course.modules.length - 1]
          deferred.resolve(module);
          $rootScope.$broadcast("Module:added", module)
        })
      return deferred.promise;
    }

    function remove(module) {
      return Module.destroy({
          course_id: module.course_id,
          module_id: module.id
        }, {},
        function() {
          modules.splice(modules.indexOf(module), 1)
          delete module_obj[module.id]
        }).$promise
    }

    function getById(id) {
      return module_obj[id]
    }

    function getStatistics() {
      return Module.getModuleStatistics({
        course_id: selected_module.course_id,
        module_id: selected_module.id
      }).$promise
    }

    function validate(m) {
      return Module.validateModule({course_id: selected_module.course_id, module_id: selected_module.id},m).$promise
    }

    function update(module){
      var modified_module = angular.copy(module);
      delete modified_module.id;
      delete modified_module.items;
      delete modified_module.created_at;
      delete modified_module.updated_at;
      delete modified_module.total_time;

      Module.update({
          course_id: module.course_id,
          module_id: module.id
        }, {
          group: modified_module
        },
        function(response) {
          $rootScope.$broadcast("Module:"+module.id+":updated", module)
        });
    }

    return {
      setSelectedModule: setSelectedModule,
      getSelectedModule: getSelectedModule,
      removeSelectedModule: removeSelectedModule,
      setModules: setModules,
      getById: getById,
      add: add,
      remove: remove,
      getStatistics: getStatistics,
      validate:validate,
      update:update
    }

  }])
