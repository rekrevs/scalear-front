'use strict';

angular.module('scalearAngularApp')
  .factory('TimeItem', function() {
    return function(time, type, data) {
      this.time = time || 0
      this.type = type || ""
      this.data = data || null
    }
  }).factory('Timeline', ['TimeItem', function(TimeItem) {
    return function() {
      this.items = []
      this.items.push(new TimeItem())
      this.add = function(time, type, data) {
        var time_index = this.items.length - 1
        var item = new TimeItem(time, type, data)
        for (; time_index >= 0; time_index--) {
          if (item.time >= this.items[time_index].time) {
            this.items.splice(time_index + 1, 0, item);
            break;
          }
        }
        return time_index + 1
      }
      this.getIndexById = function(id, type) {
        for (var time_index = this.items.length - 1; time_index >= 0; time_index--) {
          if (this.items[time_index].data.id == id && this.items[time_index].type == type) {
            return time_index
          }
        }
      }
      this.removeById = function(id, type) {
        this.items.splice(this.getIndexById(id, type), 1)
      }
      this.getNearestEvent = function(time) {
        var min = this.items[this.items.length - 1].time
        var nearest_event = this.items[this.items.length - 1]
        for (var time_index = this.items.length - 1; time_index >= 0; time_index--) {
          var time_diff = Math.abs(time - this.items[time_index].time)
          if (Math.abs(time - this.items[time_index].time) < min) {
            min = time_diff
            nearest_event = this.items[time_index]
          }
        }
        return nearest_event
      }
      this.filterByType = function(type) {
        return this.items.filter(function(item) {
          return item.type == type
        })
      }
      this.filterByNotType = function(type) {
        return this.items.filter(function(item) {
          return item.type != type
        })
      }
      this.getNextItem = function(item) {
        return this.items[this.items.indexOf(item) + 1]
      }
      this.getPrevItem = function(item) {
        return this.items[this.items.indexOf(item) - 1]
      }
      this.getNextByType = function(item) {
        var filtered = this.filterByType(item.type)
        return filtered[filtered.indexOf(item) + 1]
      }
      this.getPrevByType = function(item) {
        var filtered = this.filterByType(item.type)
        return filtered[filtered.indexOf(item) - 1]
      }
      this.getItemsBetweenTime = function(start_time, end_time) {
        return this.items.filter(function(item, index) {
          return (item.time >= start_time && item.time <= end_time && index > 0)
        }).sort(function(a, b) {
          return a.time - b.time
        });
      }
      this.getItemsBetweenTimeByType = function(start_time, end_time, type) {
        return this.filterByType(type).filter(function(item, index) {
          return (item.time >= start_time && item.time <= end_time && index > 0)
        }).sort(function(a, b) {
          return a.time - b.time
        });
      }
      this.removeAllByType = function(type) {
        this.items = this.filterByNotType(type)
      }
    };
  }]);
