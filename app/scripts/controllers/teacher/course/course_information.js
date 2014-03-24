'use strict';

angular.module('scalearAngularApp')
  .controller('teacherCourseInformationCtrl', ['$scope', '$stateParams', 'Course','$q', '$translate', '$log','$window','Page', function ($scope, $stateParams, Course, $q, $translate, $log, $window,Page) {

        $window.scrollTo(0, 0);
        Page.setTitle('Information')
        Course.show({course_id:$stateParams.course_id},function(response){
        	$scope.data=response
        	// $scope.timezones=response.timezones;
            $scope.timezones=[
                      {value:-11.0,text:"(GMT -11:00) Midway Island, Samoa"},
                      {value:-10.0,text:"(GMT -10:00) Hawaii"},
                      {value:-9.0,text:"(GMT -9:00) Alaska"},
                      {value:-8.0,text:"(GMT -8:00) Pacific Time (US &amp; Canada)"},
                      {value:-7.0,text:"(GMT -7:00) Mountain Time (US &amp; Canada)"},
                      {value:-6.0,text:"(GMT -6:00) Central Time (US &amp; Canada), Mexico City"},
                      {value:-5.0,text:"(GMT -5:00) Eastern Time (US &amp; Canada), Bogota, Lima"},
                      {value:-4.0,text:"(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz"},
                      {value:-3.0,text:"(GMT -3:00) Brazil, Buenos Aires, Georgetown"},
                      {value:-2.0,text:"(GMT -2:00) Mid-Atlantic"},
                      {value:-1.0,text:"(GMT -1:00) Azores, Cape Verde Islands"},
                      {value:0.0,text:"(GMT 00:00) Western Europe Time, London, Lisbon, Casablanca"},
                      {value:1.0,text:"(GMT +1:00) Brussels, Madrid, Paris, stockholm"},
                      {value:2.0,text:"(GMT +2:00) Cairo, Kaliningrad, South Africa"},
                      {value:3.0,text:"(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg"},
                      {value:3.5,text:"(GMT +3:30) Tehran"},
                      {value:4.0,text:"(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi"},
                      {value:5.0,text:"(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent"},
                      {value:6.0,text:"(GMT +6:00) Almaty, Dhaka, Colombo"},
                      {value:7.0,text:"(GMT +7:00) Bangkok, Hanoi, Jakarta"},
                      {value:8.0,text:"(GMT +8:00) Beijing, Perth, Singapore, Hong Kong"},
                      {value:9.0,text:"(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk"},
                      {value:10.0,text:"(GMT +10:00) Eastern Australia, Guam, Vladivostok"},
                      {value:11.0,text:"(GMT +11:00) Magadan, Solomon Islands, New Caledonia"},
                      {value:12.0,text:"(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka"}
                ]//data.timezones;
                // $scope.course.time_zone = $scope.timezones[0]
                // var zone = new Date().getTimezoneOffset()/60 * -1
                // for(var tz in $scope.timezones){
                //     if(parseInt($scope.timezones[tz].value) == zone){
                //         $scope.course.time_zone = $scope.timezones[tz]
                //         break;
                //     }
                // }
        });
        

        $scope.updateCourse = function(data,type){
            if(data && data instanceof Date){ 
                  data.setMinutes(data.getMinutes() + 120);
                  $scope.data.course[type] = data
            }
            var modified_course=angular.copy($scope.data.course);
            delete modified_course.id;
            delete modified_course.created_at;
            delete modified_course.updated_at;
            delete modified_course.unique_identifier;
            $log.debug(modified_course);
            Course.update(
                {course_id:$stateParams.course_id},
                {course:modified_course},
                function(response){
                	$scope.data=response;
                });
        }

		$scope.validateCourse = function(column,data) {
		      var d = $q.defer();
		      var course={}
		      course[column]=data;
		      Course.validateCourse({course_id:$stateParams.course_id},course,function(data){
		        d.resolve()
		      },function(data){
		        $log.debug(data.status);
		        $log.debug(data);
		        if(data.status==422)
		          d.resolve(data.data.errors.join());
		        else
		          d.reject('Server Error');
		        }
		      )
		      return d.promise;
    	};

        $scope.exportCourse = function(course){;
            Course.exportCsv({course_id: $stateParams.course_id}, function(){
              console.log("success");
            })
        }

        $scope.url_with_protocol = function(url)
        {
            if(url)
                return url.match(/^http/)? url: 'http://'+url;
            else
                return url;
        }


        // $scope.validateDuration=function(type,value){
            // if (value<1 || value >=1000)
                  // return $translate('courses.duration_invalid')
        // }

  }]);
