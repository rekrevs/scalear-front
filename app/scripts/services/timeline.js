'use strict';

angular.module('scalearAngularApp')
.factory('TimeItem',function () {  

  var x = function(time,type, data){
    this.time= time || 0
    this.type= type || ""
    this.data= data ||null
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
  };
  return x;

}]);