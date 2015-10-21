'use strict';

angular.module('scalearAngularApp')
.factory('TimeItem',function () {
    var x = function(time,type, data){
        this.time= time || 0
        this.type= type || ""
        this.data= data ||null
    }
    return x;
}).factory('Timeline', ['TimeItem',function (TimeItem) {
    var x=function(){
        this.items=[]
        this.items.push(new TimeItem())
        this.add=function(time, type, data){
            var time_index = this.items.length - 1
            var item = new TimeItem(time, type, data)
            for ( ; time_index >= 0; time_index-- ) {
                if ( item.time >= this.items[ time_index ].time ) {
                    this.items.splice( time_index + 1, 0, item );
                    break;
                }
            }
            return time_index + 1
        }
        this.search_by_id = function(id, type){
            for ( var time_index = this.items.length - 1; time_index >= 0; time_index-- ) {
                if ( this.items[time_index].data.id == id && this.items[time_index].type==type) {
                    return time_index
                }
            }
        }
        this.getNearestEvent=function(time){
            var min = this.items[this.items.length - 1].time
            var nearest_event = this.items[this.items.length - 1]
            for ( var time_index = this.items.length - 1; time_index >= 0; time_index-- ){
                var time_diff =Math.abs(time - this.items[time_index].time)
                if ( Math.abs(time - this.items[time_index].time)< min ){
                    min = time_diff
                    nearest_event = this.items[time_index]
                }
            }
            return nearest_event
        }
    };
    return x;
}]);