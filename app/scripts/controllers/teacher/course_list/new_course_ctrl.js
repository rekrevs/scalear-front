'use strict';

angular.module('scalearAngularApp')
  .controller('newCourseCtrl',['$scope','Course','$state','$window', '$log','Page', function ($scope, Course,$state, $window, $log,Page) {
		$window.scrollTo(0, 0);
		Page.setTitle('courses.new_course')
		$scope.submitting=false;
		$scope.course={}
		Course.newCourse(
			function(data){
				//$scope.course=data.course;
				$scope.importing=data.importing;
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
				$scope.course.time_zone = $scope.timezones[0]
				var zone = new Date().getTimezoneOffset()/60 * -1
				for(var tz in $scope.timezones){
					if(parseInt($scope.timezones[tz].value) == zone){
						$scope.course.time_zone = $scope.timezones[tz]
						break;
					}
				}
				$scope.import_from=""				
				$scope.course.start_date = new Date()

			},function(response){
				
			}
		);

		/* <select name="DropDownTimezone" id="DropDownTimezone">
      
</select>*/
		
		$scope.createCourse = function(){
			if($scope.form.$valid)
 			{
 				var modified_course = angular.copy($scope.course)
                $scope.submitting=true;
 				modified_course.start_date.setMinutes(modified_course.start_date.getMinutes() + 120);

                if($scope.import_from)
                {
                    console.log($scope.import_from);
                    $state.go("import_from",{"shared_item":$scope.import_from})
                }
                else{
                	modified_course.time_zone = modified_course.time_zone.value;
                Course.create({course:modified_course, "import":$scope.import_from},
			function(data){
                $scope.submitting=false;
				$scope.submitted=false;
				if(data.importing==true){
					//$(window).scrollTop(0);
					$state.go("course_list")
				}
				else{
					//$(window).scrollTop(0);
					$state.go("course.course_editor",{"course_id":data.course.id})
				}
			},function(response){
				//server error must handle.
                $scope.submitting=false;
				$scope.server_errors=response.data.errors
			}
		);}
		}else{
			$scope.submitted=true
		}
		}

        $scope.$watch('current_lang', function(newval, oldval){
            if(newval!=oldval)
                $scope.server_errors={}
        });
 }]);
