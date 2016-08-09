'use strict';

angular.module('scalearAngularApp')
  .service('ScalearUtils', ['$rootScope', '$translate', function($rootScope, $translate) {
    return {
      getKeys: function(obj) {
        return Object.keys ? Object.keys(obj) : (function(obj) {
          var item,
            list = []
          for(item in obj) {
            if(hasOwn.call(obj, item)) {
              list.push(item)
            }
          }
          return list
        })(obj)
      },
      safeApply: function(fn) {
        var phase = $rootScope.$root.$$phase;
        if(phase == '$apply' || phase == '$digest') {
          if(fn && (typeof(fn) === 'function')) {
            fn();
          }
        } else {
          $rootScope.$apply(fn);
        }
      },
      parseDuration: function(DurationString) {
        var matches = DurationString.match(/^P([0-9]+Y|)?([0-9]+M|)?([0-9]+D|)?T?([0-9]+H|)?([0-9]+M|)?([0-9]+S|)?$/),
          result = {};
        if(matches) {
          result.year = parseInt(matches[1]) || 0;
          result.month = parseInt(matches[2]) || 0;
          result.day = parseInt(matches[3]) || 0;
          result.hour = parseInt(matches[4]) || 0;
          result.minute = parseInt(matches[5]) || 0;
          result.second = parseInt(matches[6]) || 0;

          result.toString = function() {
            var string = '';
            if(this.year) string += this.year + ' Year' + (this.year == 1 ? '' : 's') + ' ';
            if(this.month) string += this.month + ' Month' + (this.month == 1 ? '' : 's') + ' ';
            if(this.day) string += this.day + ' Day' + (this.day == 1 ? '' : 's') + ' ';
            if(this.hour) string += this.hour + ' Hour' + (this.hour == 1 ? '' : 's') + ' ';
            if(this.minute) string += this.minute + ' Minute' + (this.minute == 1 ? '' : 's') + ' ';
            if(this.second) string += this.second + ' Second' + (this.second == 1 ? '' : 's') + ' ';
            return string;
          }
          return result;
        } else {
          return false;
        }
      },
      hour12: function(hour) {
        var hours = hour % 24;
        var mid = 'AM';
        if(hours == 0)
          hours = 12;
        else if(hours > 12) {
          hours = hours % 12;
          mid = 'PM';
        }
        return hours + ' ' + mid
      },
      toObjectById: function(arr) { //convert array to objec with IDs as keys
        var obj = {}
        if(arr instanceof Array) {
          arr.forEach(function(item) {
            obj[item.id] = item;
          });
        }
        return obj
      },
      urlWithProtocol: function(url) {
        console.log("URL is", url);
        if(url)
          return url.match(/^http/) ? url : 'http://' + url;
        else
          return url;
      },
      shorten: function(url, l) {
        var length = typeof(l) != "undefined" ? l : 50;
        var link = url.replace("http://", "").replace("https://", "");
        if(link.length <= length)
          return link
        var chunk_length = length / 2
        var start_chunk = this.shortString(link, chunk_length, false);
        var end_chunk = this.shortString(link, chunk_length, true);
        return start_chunk + ".." + end_chunk;
      },
      shortString:function(s, l, reverse) {
        var stop_chars = [' ', '/', '&'];
        var acceptable_shortness = l * 0.80; // When to start looking for stop characters
        var text = reverse ? s.split("").reverse().join("") : s;
        var short_s = "";

        for(var i = 0; i < l - 1; i++) {
          short_s += text[i];
          if(i >= acceptable_shortness && stop_chars.indexOf(s[i]) >= 0) {
            break;
          }
        }
        if(reverse) {
          return short_s.split("").reverse().join("");
        }
        return short_s;
      },
      getIndexById: function(arr, id) { // returns index of an object in an array by searching for its id
        for(var elem in arr) {
          if(arr[elem].id == id)
            return elem
        }
        return -1
      },
      isHtml: function(s) {
        return typeof s == "string" && /<[a-z][\s\S]*>/i.test(s)
      },
      getHtmlText: function(text) {
        if(this.isHtml(text)) {
          var val = $(text)
          val.find(".MathJax_Preview").remove()
          return val.text()
        }
        return text
      },
      capitalize: function(s) {
        return s[0].toUpperCase() + s.slice(1);
      },
      gcd: function(a, b) {
        return(b == 0) ? a : this.gcd(b, a % b);
      },
      calculateScreenRatio: function() {
        var w = screen.width;
        var h = screen.height;
        var r = this.gcd(w, h);
        return(w / r) + ":" + (h / r)
      },
      validateTime: function(time, video_duration) {
        var int_regex = /^\d\d:\d\d:\d\d$/; //checking format
        if(int_regex.test(time)) {
          var hhmm = time.split(':'); // split hours and minutes
          var hours = parseInt(hhmm[0]); // get hours and parse it to an int
          var minutes = parseInt(hhmm[1]); // get minutes and parse it to an int
          var seconds = parseInt(hhmm[2]);
          // check if hours or minutes are incorrect
          var calculated_duration = (hours * 60 * 60) + (minutes * 60) + (seconds);
          if(hours < 0 || hours > 24 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) { // display error
            return $translate('editor.incorrect_format_time')
          } else if(video_duration <= calculated_duration || calculated_duration <= 0) {
            return $translate('editor.time_outside_range')
          }
        } else {
          return $translate('editor.incorrect_format_time')
        }
      },
      arrayToSeconds: function(a) {
        return(+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]) // minutes are worth 60 seconds. Hours are worth 60 minutes.
      },
      listTimezones: function() {
        return [
          { name: "American Samoa", offset: -11, value: "(GMT-11:00) American Samoa" },
          // {name:"International Date Line West" ,offset:-11, value:"(GMT-11:00) International Date Line West"},
          // {name:"Midway Island" ,offset:-11, value:"(GMT-11:00) Midway Island"},
          { name: "Hawaii", offset: -10, value: "(GMT-10:00) Hawaii" },
          { name: "Alaska", offset: -9, value: "(GMT-09:00) Alaska" },
          { name: "Pacific Time (US & Canada)", offset: -8, value: "(GMT-08:00) Pacific Time (US & Canada)" },
          // {name:"Tijuana" ,offset:-8, value:"(GMT-08:00) Tijuana"},
          // {name:"Arizona" ,offset:-7, value:"(GMT-07:00) Arizona"},
          // {name:"Chihuahua" ,offset:-7, value:"(GMT-07:00) Chihuahua"},
          // {name:"Mazatlan" ,offset:-7, value:"(GMT-07:00) Mazatlan"},
          { name: "Mountain Time (US & Canada)", offset: -7, value: "(GMT-07:00) Mountain Time (US & Canada)" },
          // {name:"Central America" ,offset:-6, value:"(GMT-06:00) Central America"},
          { name: "Central Time (US & Canada)", offset: -6, value: "(GMT-06:00) Central Time (US & Canada)" },
          // {name:"Guadalajara" ,offset:-6, value:"(GMT-06:00) Guadalajara"},
          // {name:"Mexico City" ,offset:-6, value:"(GMT-06:00) Mexico City"},
          // {name:"Monterrey" ,offset:-6, value:"(GMT-06:00) Monterrey"},
          // {name:"Saskatchewan" ,offset:-6, value:"(GMT-06:00) Saskatchewan"},
          // {name:"Bogota" ,offset:-5, value:"(GMT-05:00) Bogota"},
          { name: "Eastern Time (US & Canada)", offset: -5, value: "(GMT-05:00) Eastern Time (US & Canada)" },
          // {name:"Indiana (East)" ,offset:-5, value:"(GMT-05:00) Indiana (East)"},
          // {name:"Lima" ,offset:-5, value:"(GMT-05:00) Lima"},
          // {name:"Quito" ,offset:-5, value:"(GMT-05:00) Quito"},
          // {name:"Caracas" ,offset:-5, value:"(GMT-04:30) Caracas"},
          { name: "Atlantic Time (Canada)", offset: -4, value: "(GMT-04:00) Atlantic Time (Canada)" },
          // {name:"Georgetown" ,offset:-4, value:"(GMT-04:00) Georgetown"},
          // {name:"La Paz" ,offset:-4, value:"(GMT-04:00) La Paz"},
          // {name:"Santiago" ,offset:-4, value:"(GMT-04:00) Santiago"},
          // {name:"Newfoundland" ,offset:-4, value:"(GMT-03:30) Newfoundland"},
          // {name:"Brasilia" ,offset:-3, value:"(GMT-03:00) Brasilia"},
          // {name:"Buenos Aires" ,offset:-3, value:"(GMT-03:00) Buenos Aires"},
          { name: "Greenland", offset: -3, value: "(GMT-03:00) Greenland" },
          { name: "Mid-Atlantic", offset: -2, value: "(GMT-02:00) Mid-Atlantic" },
          { name: "Azores", offset: -1, value: "(GMT-01:00) Azores" },
          // {name:"Cape Verde Is" ,offset:-1, value:"(GMT-01:00) Cape Verde Is."},
          // {name:"Edinburgh" ,offset:0, value:"(GMT+00:00) Edinburgh"},
          { name: "UTC", offset: 0, value: "(GMT+00:00) UTC" },
          // {name:"Monrovia" ,offset:0, value:"(GMT+00:00) Monrovia"},
          // {name:"London" ,offset:0, value:"(GMT+00:00) London"},
          // {name:"Dublin" ,offset:0, value:"(GMT+00:00) Dublin"},
          // {name:"Casablanca" ,offset:0, value:"(GMT+00:00) Casablanca"},
          // {name:"Lisbon" ,offset:0, value:"(GMT+00:00) Lisbon"},
          // {name:"Copenhagen" ,offset:1, value:"(GMT+01:00) Copenhagen"},
          // {name:"Zagreb" ,offset:1, value:"(GMT+01:00) Zagreb"},
          // {name:"West Central Africa" ,offset:1, value:"(GMT+01:00) West Central Africa"},
          // {name:"Warsaw" ,offset:1, value:"(GMT+01:00) Warsaw"},
          // {name:"Vienna" ,offset:1, value:"(GMT+01:00) Vienna"},
          { name: "Stockholm", offset: 1, value: "(GMT+01:00) Stockholm" },
          // {name:"Skopje" ,offset:1, value:"(GMT+01:00) Skopje"},
          // {name:"Sarajevo" ,offset:1, value:"(GMT+01:00) Sarajevo"},
          // {name:"Rome" ,offset:1, value:"(GMT+01:00) Rome"},
          // {name:"Prague" ,offset:1, value:"(GMT+01:00) Prague"},
          // {name:"Paris" ,offset:1, value:"(GMT+01:00) Paris"},
          // {name:"Madrid" ,offset:1, value:"(GMT+01:00) Madrid"},
          // {name:"Ljubljana" ,offset:1, value:"(GMT+01:00) Ljubljana"},
          // {name:"Amsterdam" ,offset:1, value:"(GMT+01:00) Amsterdam"},
          // {name:"Budapest" ,offset:1, value:"(GMT+01:00) Budapest"},
          // {name:"Brussels" ,offset:1, value:"(GMT+01:00) Brussels"},
          // {name:"Bratislava" ,offset:1, value:"(GMT+01:00) Bratislava"},
          // {name:"Bern" ,offset:1, value:"(GMT+01:00) Bern"},
          // {name:"Berlin" ,offset:1, value:"(GMT+01:00) Berlin"},
          // {name:"Belgrade" ,offset:1, value:"(GMT+01:00) Belgrade"},
          // {name:"Sofia" ,offset:2, value:"(GMT+02:00) Sofia"},
          // {name:"Riga" ,offset:2, value:"(GMT+02:00) Riga"},
          // {name:"Pretoria" ,offset:2, value:"(GMT+02:00) Pretoria"},
          // {name:"Vilnius" ,offset:2, value:"(GMT+02:00) Vilnius"},
          // {name:"Jerusalem" ,offset:2, value:"(GMT+02:00) Jerusalem"},
          // {name:"Istanbul" ,offset:2, value:"(GMT+02:00) Istanbul"},
          // {name:"Helsinki" ,offset:2, value:"(GMT+02:00) Helsinki"},
          // {name:"Harare" ,offset:2, value:"(GMT+02:00) Harare"},
          { name: "Cairo", offset: 2, value: "(GMT+02:00) Cairo" },
          // {name:"Bucharest" ,offset:2, value:"(GMT+02:00) Bucharest"},
          // {name:"Athens" ,offset:2, value:"(GMT+02:00) Athens"},
          // {name:"Kyiv" ,offset:2, value:"(GMT+02:00) Kyiv"},
          // {name:"Tallinn" ,offset:2, value:"(GMT+02:00) Tallinn"},
          // {name:"Tehran" ,offset:3, value:"(GMT+03:30) Tehran"},
          // {name:"Minsk" ,offset:3, value:"(GMT+03:00) Minsk"},
          // {name:"Nairobi" ,offset:3, value:"(GMT+03:00) Nairobi"},
          // {name:"Riyadh" ,offset:3, value:"(GMT+03:00) Riyadh"},
          // {name:"Baghdad" ,offset:3, value:"(GMT+03:00) Baghdad"},
          { name: "Kuwait", offset: 3, value: "(GMT+03:00) Kuwait" },
          // {name:"Kabul" ,offset:4, value:"(GMT+04:30) Kabul"},
          // {name:"Muscat" ,offset:4, value:"(GMT+04:00) Muscat"},
          // {name:"Yerevan" ,offset:4, value:"(GMT+04:00) Yerevan"},
          // {name:"St. Petersburg" ,offset:4, value:"(GMT+04:00) St. Petersburg"},
          // {name:"Tbilisi" ,offset:4, value:"(GMT+04:00) Tbilisi"},
          // {name:"Moscow" ,offset:4, value:"(GMT+04:00) Moscow"},
          // {name:"Baku" ,offset:4, value:"(GMT+04:00) Baku"},
          { name: "Abu Dhabi", offset: 4, value: "(GMT+04:00) Abu Dhabi" },
          // {name:"Volgograd" ,offset:4, value:"(GMT+04:00) Volgograd"},
          // {name:"Kathmandu" ,offset:5, value:"(GMT+05:45) Kathmandu"},
          { name: "Mumbai", offset: 5, value: "(GMT+05:30) Mumbai" },
          // {name:"Sri Jayawardenepura" ,offset:5, value:"(GMT+05:30) Sri Jayawardenepura"},
          // {name:"Kolkata" ,offset:5, value:"(GMT+05:30) Kolkata"},
          // {name:"Chennai" ,offset:5, value:"(GMT+05:30) Chennai"},
          // {name:"New Delhi" ,offset:5, value:"(GMT+05:30) New Delhi"},
          // {name:"Karachi" ,offset:5, value:"(GMT+05:00) Karachi"},
          // {name:"Islamabad" ,offset:5, value:"(GMT+05:00) Islamabad"},
          // {name:"Tashkent" ,offset:5, value:"(GMT+05:00) Tashkent"},
          // {name:"Rangoon" ,offset:6, value:"(GMT+06:30) Rangoon"},
          // {name:"Astana" ,offset:6, value:"(GMT+06:00) Astana"},
          { name: "Dhaka", offset: 6, value: "(GMT+06:00) Dhaka" },
          // {name:"Ekaterinburg" ,offset:6, value:"(GMT+06:00) Ekaterinburg"},
          // {name:"Almaty" ,offset:6, value:"(GMT+06:00) Almaty"},
          // {name:"Hanoi" ,offset:7, value:"(GMT+07:00) Hanoi"},
          // {name:"Jakarta" ,offset:7, value:"(GMT+07:00) Jakarta"},
          { name: "Bangkok", offset: 7, value: "(GMT+07:00) Bangkok" },
          // {name:"Novosibirsk" ,offset:7, value:"(GMT+07:00) Novosibirsk"},
          // {name:"Ulaan Bataar" ,offset:8, value:"(GMT+08:00) Ulaan Bataar"},
          // {name:"Singapore" ,offset:8, value:"(GMT+08:00) Singapore"},
          // {name:"Perth" ,offset:8, value:"(GMT+08:00) Perth"},
          // {name:"Kuala Lumpur" ,offset:8, value:"(GMT+08:00) Kuala Lumpur"},
          // {name:"Krasnoyarsk" ,offset:8, value:"(GMT+08:00) Krasnoyarsk"},
          { name: "Hong Kong", offset: 8, value: "(GMT+08:00) Hong Kong" },
          // {name:"Chongqing" ,offset:8, value:"(GMT+08:00) Chongqing"},
          // {name:"Beijing" ,offset:8, value:"(GMT+08:00) Beijing"},
          // {name:"Urumqi" ,offset:8, value:"(GMT+08:00) Urumqi"},
          // {name:"Taipei" ,offset:8, value:"(GMT+08:00) Taipei"},
          // {name:"Darwin" ,offset:9, value:"(GMT+09:30) Darwin"},
          // {name:"Adelaide" ,offset:9, value:"(GMT+09:30) Adelaide"},
          { name: "Tokyo", offset: 9, value: "(GMT+09:00) Tokyo" },
          // {name:"Irkutsk" ,offset:9, value:"(GMT+09:00) Irkutsk"},
          // {name:"Seoul" ,offset:9, value:"(GMT+09:00) Seoul"},
          // {name:"Sapporo" ,offset:9, value:"(GMT+09:00) Sapporo"},
          // {name:"Osaka" ,offset:9, value:"(GMT+09:00) Osaka"},
          // {name:"Canberra" ,offset:10, value:"(GMT+10:00) Canberra"},
          // {name:"Yakutsk" ,offset:10, value:"(GMT+10:00) Yakutsk"},
          { name: "Sydney", offset: 10, value: "(GMT+10:00) Sydney" },
          // {name:"Brisbane" ,offset:10, value:"(GMT+10:00) Brisbane"},
          // {name:"Melbourne" ,offset:10, value:"(GMT+10:00) Melbourne"},
          // {name:"Hobart" ,offset:10, value:"(GMT+10:00) Hobart"},
          // {name:"Guam" ,offset:10, value:"(GMT+10:00) Guam"},
          // {name:"Port Moresby" ,offset:10, value:"(GMT+10:00) Port Moresby"},
          // {name:"Vladivostok" ,offset:11, value:"(GMT+11:00) Vladivostok"},
          { name: "New Caledonia", offset: 11, value: "(GMT+11:00) New Caledonia" },
          // {name:"Magadan" ,offset:12, value:"(GMT+12:00) Magadan"},
          // {name:"Wellington" ,offset:12, value:"(GMT+12:00) Wellington"},
          // {name:"Solomon" Is. ,offset:12, value:"(GMT+12:00) Solomon Is."},
          // {name:"Marshall" Is. ,offset:12, value:"(GMT+12:00) Marshall Is."},
          // {name:"Auckland" ,offset:12, value:"(GMT+12:00) Auckland"},
          // {name:"Kamchatka" ,offset:12, value:"(GMT+12:00) Kamchatka"},
          { name: "Fiji", offset: 12, value: "(GMT+12:00) Fiji" }
          // {name:"Samoa" ,offset:13, value:"(GMT+13:00) Samoa"}
          // {name:"Nuku'alofa" ,offset:13, value:"(GMT+13:00) Nuku'alofa"},
          // {name:"Tokelau" Is. ,offset:13, value:"(GMT+13:00) Tokelau Is."},
        ]
      }
    }
  }]);
