angular.module('scalearAngularApp').factory('doc',
    ['$rootScope', function ($rootScope) {
        var service = $rootScope.$new(true);
        service.dirty = false;
        service.lastSave = 0;
        service.timeSinceLastSave = function () {
            return new Date().getTime() - this.lastSave;
        };

        var initWatcher = function () {
            if (service.info && service.info.editable) {
                service.$watch('info',
                    function (newValue, oldValue) {
                        console.log("in watch")
                        if (oldValue != null && newValue !== oldValue) {
                            service.dirty = true;
                        }
                    },
                    true);
            }
        };

        service.$on('firstSaved', initWatcher);
        service.$on('loaded', initWatcher);

        return service;
    }]);