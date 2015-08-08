angular.module('scalearAngularApp').factory('doc',
    ['$rootScope', function ($rootScope) {

        return function() {
        var service = $rootScope.$new(true); // creating a new scope.
        service.dirty = false;
        service.lastSave = 0;
        service.first=true;
        service.timeSinceLastSave = function () {
            return new Date().getTime() - this.lastSave;
        };

        service.initWatcher = function () {
            if (service.info && service.info.editable) {
                service.$watch('info',
                    function (newValue, oldValue) {
                        if (oldValue != null && newValue !== oldValue && newValue!= null) {
//                            $log.debug("old value");
//                            $log.debug(oldValue);
//                            $log.debug("new value");
//                            $log.debug(newValue);
//                            $log.debug(newValue.content)
                            service.dirty = true;
                        }
                    },
                    true);
            }
        };

       // service.$on('firstSaved', initWatcher);
       // service.$on('loaded', initWatcher); // like saying scope.on ..


        return service;
        }
    }]);