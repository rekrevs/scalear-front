'use strict';

angular.module('scalearAngularApp')
  .factory('CustomLink', ['$resource', '$http', '$stateParams', 'scalear_api', 'headers', '$rootScope', '$translate', function($resource, $http, $stateParams, scalear_api, headers, $rootScope, $translate) {

    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host + '/:lang/custom_links/:link_id/:action', { lang: $translate.use() }, {
      'create': { method: 'POST', headers: headers },
      'index': { method: 'GET', isArray: true, headers: headers },
      'update': { method: 'PUT', headers: headers },
      'destroy': { method: 'DELETE', headers: headers },
      'show': { method: 'GET', headers: headers },
      'validate': { method: 'PUT', headers: headers, params: { action: 'validate_custom_link' } },
      "linkCopy": { method: 'POST', params: { action: 'link_copy' }, headers: headers }
    });

  }]).factory("LinkModel", ['CustomLink', 'Module', 'ModuleModel', '$filter', '$rootScope', function(CustomLink, Module, ModuleModel, $filter, $rootScope) {

    var selected_link = null

    function setSelectedLink(link) {
      selected_link = link
      return getSelectedLink()
    }

    function getSelectedLink() {
      return selected_link
    }

    function clearSelectedLink() {
      selected_link = null
    }

    function create() {
      var module = ModuleModel.getSelectedModule()
      return Module.newCustomLink({
          course_id: module.course_id,
          module_id: module.id
        }, {})
        .$promise
        .then(function(data) {
          data.link.url = "http://"
          data.link.class_name = "customlink"
          var link = createInstance(data.link)
          $rootScope.$broadcast("Item:added", link)
          $rootScope.$broadcast('update_module_statistics')
          return link
        });
    }

    function paste(l, module_id) {
      var module = ModuleModel.getById(module_id)
      CustomLink.linkCopy({
          link_id: l.id,
          course_id: module.course_id,
          module_id: module.id
        }, {})
        .$promise
        .then(function(data) {
          data.link.class_name = 'customlink'
          var link = createInstance(data.link)
          $rootScope.$broadcast("Item:added", link)
          return link
        })

    }

    function isInstance(instance) {
      return(instance.instanceType && instance.instanceType() == "Link");
    }


    function createInstance(link) {

      if(isInstance(link)) {
        return link;
      }

      function remove() {
        return CustomLink.destroy({ link_id: link.id }, {})
          .$promise
          .then(function() {
            $rootScope.$broadcast("Item:removed", link)
          });
      }

      function module() {
        return ModuleModel.getById(link.group_id)
      }

      function instanceType() {
        return 'Link'
      }

      function validate() {
        return CustomLink.validate({ link_id: link.id }, { link: link })
          .$promise
          .catch(function(data) {
            if(data.status == 422)
              return data.data.errors[0];
            else
              return 'Server Error';
          })
      }

      function update() {
        link.url = $filter("formatURL")(link.url)
        return CustomLink.update({ link_id: link.id }, {
            "link": {
              url: link.url,
              name: link.name
            }
          })
        .$promise
      }

      function setAsSelected() {
        return setSelectedLink(link)
      }

      return angular.extend(link, {
        instanceType: instanceType,
        module: module,
        remove: remove,
        validate: validate,
        update:update,
        setAsSelected:setAsSelected
      })
    }


    return {
      isInstance: isInstance,
      createInstance:createInstance,
      setSelectedLink: setSelectedLink,
      getSelectedLink: getSelectedLink,
      clearSelectedLink: clearSelectedLink,
      create: create,
      paste: paste
    }
  }])
