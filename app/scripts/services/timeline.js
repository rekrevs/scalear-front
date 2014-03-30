'use strict';

angular.module('scalearAngularApp')
    .factory('TimeItem',function () {

        var x = function(time,type, data, extra_data){
            this.time= time || 0
            this.type= type || ""
            this.data= data ||null
            this.extra_data = extra_data||null
        }
        return x;
    })
    .factory('Timeline', ['TimeItem',function (TimeItem) {

        var x=function(){
            this.items=[]

            this.items.push(new TimeItem())

            this.add=function(time, type, data){
                var item = new TimeItem(time, type, data)
                for ( var time_index = this.items.length - 1; time_index >= 0; time_index-- ) {
                    if ( item.time >= this.items[ time_index ].time ) {
                        this.items.splice( time_index + 1, 0, item );
                        break;
                    }
                }
            }

            this.search_by_id = function(id, type)
            {
                for ( var time_index = this.items.length - 1; time_index >= 0; time_index-- ) {
                    if ( this.items[time_index].data.id == id && this.items[time_index].type==type) {
                        return time_index
                    }
                }
            }
        };
        return x;

    }]);

