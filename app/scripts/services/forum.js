'use strict';

angular.module('scalearAngularApp')
.factory('Forum', ['$resource','$http','$stateParams','scalear_api','headers','$rootScope', '$translate',function($resource, $http, $stateParams, scalear_api, headers, $rootScope ,$translate) {

    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host+'/:lang/discussions/:action', {lang:$translate.use()},
      {
        'createPost':{method: 'POST', params: {action: 'create_post'}, headers: headers},
        'votePost':{method: 'POST', params: {action: 'vote'}, headers: headers},
        'flagPost':{method: 'POST', params: {action: 'flag'}, headers: headers},
        'createComment':{method: 'POST', params: {action: 'create_comment'}, headers: headers},
        'deletePost':{method: 'DELETE', params: {action: 'delete_post'}, headers: headers},
        'deleteComment':{method: 'DELETE', params: {action: 'delete_comment'}, headers: headers},
        'voteComment':{method: 'POST', params: {action: 'vote_comment'}, headers: headers},
        'flagComment':{method: 'POST', params: {action: 'flag_comment'}, headers: headers},
        'removeAllFlags':{method: 'DELETE', params: {action: 'remove_all_flags'}, headers: headers},
        'removeAllCommentFlags':{method: 'DELETE', params: {action: 'remove_all_comment_flags'}, headers: headers},
        'hideDiscussion':{method: 'POST', params: {action: 'hide_post'}, headers: headers},
        'hideComment':{method: 'POST', params: {action: 'hide_comment'}, headers: headers},
        'updatePost':{method: 'POST', params: {action: 'update_post'}, headers: headers}
      });

}]);