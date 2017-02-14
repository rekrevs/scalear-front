'use strict';

angular.module('scalearAngularApp')
  .factory('Saml', ['$resource', '$http', '$stateParams', 'scalear_api', 'headers', '$rootScope', '$translate', function($resource, $http, $stateParams, scalear_api, headers, $rootScope, $translate) {

    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host + '/:lang/saml/:action', { lang: $translate.uses() }, {
      'Login': { method: 'GET', params: { action: 'saml_signin' }, headers: headers },
      'getDomain' :{method: 'GET', params: { action: 'get_domain' }, headers: headers}
    });

  }])
  .factory('SWAMID', ['Saml','$rootScope', function(Saml,$rootScope) {
        function list() {
          var utrecht_domain = {
              "descr":  "The University of Gävle Identity Provider is used by employees and students at the university.",
              "icon": "https://webkonto.student.hig.se/head/loggaengelska.png",
              "icon_height" : "94" ,
              "icon_width" : "83",
              "title": "Utrecht University",
              "hidden": "false",
              "title_order": "Utrecht University",
              "entityID": "https://namidp.services.uu.nl/nidp/saml2/metadata"
            }
          Saml.getDomain()
          .$promise
          .then(function(respone) {
          respone.domains.forEach(function(domain){
            domain.title_order = domain.title              
            if("KTH Royal Institute of Technology" == domain.title ){
              domain.title_order = "1 "+domain.title
            }
            else if("Uppsala University" == domain.title ){
              domain.title_order = "2 "+domain.title              
            }
          })
          respone.domains.push(utrecht_domain)
          $rootScope.$broadcast("smal_list_ready", respone.domains)
          })
          .catch(function(respone) {
            console.log(respone)
          })
      }
      return {
        list:list
      }
  }]);