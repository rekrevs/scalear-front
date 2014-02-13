angular.module('scalearAngularApp').factory('doc',
    ['$rootScope', function ($rootScope) {


        var service = $rootScope.$new(true); // creating a new scope.
        service.dirty = false;
        service.lastSave = 0;
        service.first=true;
        service.timeSinceLastSave = function () {
            return new Date().getTime() - this.lastSave;
        };

        var initWatcher = function () {
            if (service.info && service.info.editable) {
                service.$watch('info',
                    function (newValue, oldValue) {
                        if (oldValue != null && newValue !== oldValue && newValue!= null) {
                            console.log("old value");
                            console.log(oldValue);
                            console.log("new value");
                            console.log(newValue);
                            service.dirty = true;
                        }
                    },
                    true);
            }
        };

        service.$on('firstSaved', initWatcher);
        service.$on('loaded', initWatcher); // like saying scope.on ..

        return service;
    }]);