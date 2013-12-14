'use strict';

angular.module('scalearAngularApp')
  .controller('TeacherCourseCourseInformationCtrl', ['$scope', '$stateParams','$http', 'Course','course', '$translate', function ($scope, $stateParams,$http, Course, course, $translate) {
        
        console.log("in course information");
        course.start_date = new Date(course.data.start_date);

        $scope.data = course.data;
        console.log(course.data);

        $scope.updateCourse = function(data,type){
            if(data && data instanceof Date){ 
                  data.setMinutes(data.getMinutes() + 120);
                  $scope.data.course[type] = data
            }
            var modified_course=angular.copy($scope.data.course);
            delete modified_course["id"];
            delete modified_course["created_at"];
            delete modified_course["updated_at"];
            delete modified_course["unique_identifier"];
            console.log(modified_course);
            Course.update(
                {course_id:$stateParams.course_id},
                {course:modified_course}
            )
        }

        $scope.validateDuration=function(type,value){
            if (value<1 || value >=1000)
                  return $translate('courses.duration_invalid')
        }

        $scope.timezones = [
            {value:"Abu Dhabi", text:"Abu Dhabi"},
            {value:"Adelaide", text:"Adelaide"},
            {value:"Alaska", text:"Alaska"},
            {value:"Almaty", text:"Almaty"},
            {value:"American Samoa", text:"American Samoa"},
            {value:"Amsterdam", text:"Amsterdam"},
            {value:"Arizona", text:"Arizona"},
            {value:"Astana", text:"Astana"},
            {value:"Athens", text:"Athens"},
            {value:"Atlantic Time (Canada)", text:"Atlantic Time (Canada)"},
            {value:"Auckland", text:"Auckland"},
            {value:"Azores", text:"Azores"},
            {value:"Baghdad", text:"Baghdad"},
            {value:"Baku", text:"Baku"},
            {value:"Bangkok", text:"Bangkok"},
            {value:"Beijing", text:"Beijing"},
            {value:"Belgrade", text:"Belgrade"},
            {value:"Berlin", text:"Berlin"},
            {value:"Bern", text:"Bern"},
            {value:"Bogota", text:"Bogota"},
            {value:"Brasilia", text:"Brasilia"},
            {value:"Bratislava", text:"Bratislava"},
            {value:"Brisbane", text:"Brisbane"},
            {value:"Brussels", text:"Brussels"},
            {value:"Bucharest", text:"Bucharest"},
            {value:"Budapest", text:"Budapest"},
            {value:"Buenos Aires", text:"Buenos Aires"},
            {value:"Cairo", text:"Cairo"},
            {value:"Canberra", text:"Canberra"},
            {value:"Cape Verde Is.", text:"Cape Verde Is."},
            {value:"Caracas", text:"Caracas"},
            {value:"Casablanca", text:"Casablanca"},
            {value:"Central America", text:"Central America"},
            {value:"Central Time (US &amp; Canada)", text:"Central Time (US &amp; Canada)"},
            {value:"Chennai", text:"Chennai"},
            {value:"Chihuahua", text:"Chihuahua"},
            {value:"Chongqing", text:"Chongqing"},
            {value:"Copenhagen", text:"Copenhagen"},
            {value:"Darwin", text:"Darwin"},
            {value:"Dhaka", text:"Dhaka"},
            {value:"Dublin", text:"Dublin"},
            {value:"Eastern Time (US &amp; Canada)", text:"Eastern Time (US &amp; Canada)"},
            {value:"Edinburgh", text:"Edinburgh"},
            {value:"Ekaterinburg", text:"Ekaterinburg"},
            {value:"Fiji", text:"Fiji"},
            {value:"Georgetown", text:"Georgetown"},
            {value:"Greenland", text:"Greenland"},
            {value:"Guadalajara", text:"Guadalajara"},
            {value:"Guam", text:"Guam"},
            {value:"Hanoi", text:"Hanoi"},
            {value:"Harare", text:"Harare"},
            {value:"Hawaii", text:"Hawaii"},
            {value:"Helsinki", text:"Helsinki"},
            {value:"Hobart", text:"Hobart"},
            {value:"Hong Kong", text:"Hong Kong"},
            {value:"Indiana (East)", text:"Indiana (East)"},
            {value:"International Date Line West", text:"International Date Line West"},
            {value:"Irkutsk", text:"Irkutsk"},
            {value:"Islamabad", text:"Islamabad"},
            {value:"Istanbul", text:"Istanbul"},
            {value:"Jakarta", text:"Jakarta"},
            {value:"Jerusalem", text:"Jerusalem"},
            {value:"Kabul", text:"Kabul"},
            {value:"Kamchatka", text:"Kamchatka"},
            {value:"Karachi", text:"Karachi"},
            {value:"Kathmandu", text:"Kathmandu"},
            {value:"Kolkata", text:"Kolkata"},
            {value:"Krasnoyarsk", text:"Krasnoyarsk"},
            {value:"Kuala Lumpur", text:"Kuala Lumpur"},
            {value:"Kuwait", text:"Kuwait"},
            {value:"Kyiv", text:"Kyiv"},
            {value:"La Paz", text:"La Paz"},
            {value:"Lima", text:"Lima"},
            {value:"Lisbon", text:"Lisbon"},
            {value:"Ljubljana", text:"Ljubljana"},
            {value:"London", text:"London"},
            {value:"Madrid", text:"Madrid"},
            {value:"Magadan", text:"Magadan"},
            {value:"Marshall Is.", text:"Marshall Is."},
            {value:"Mazatlan", text:"Mazatlan"},
            {value:"Melbourne", text:"Melbourne"},
            {value:"Mexico City", text:"Mexico City"},
            {value:"Mid-Atlantic", text:"Mid-Atlantic"},
            {value:"Midway Island", text:"Midway Island"},
            {value:"Minsk", text:"Minsk"},
            {value:"Monrovia", text:"Monrovia"},
            {value:"Monterrey", text:"Monterrey"},
            {value:"Moscow", text:"Moscow"},
            {value:"Mountain Time (US &amp; Canada)", text:"Mountain Time (US &amp; Canada)"},
            {value:"Mumbai", text:"Mumbai"},
            {value:"Muscat", text:"Muscat"},
            {value:"Nairobi", text:"Nairobi"},
            {value:"New Caledonia", text:"New Caledonia"},
            {value:"New Delhi", text:"New Delhi"},
            {value:"Newfoundland", text:"Newfoundland"},
            {value:"Novosibirsk", text:"Novosibirsk"},
            {value:"Nuku&#x27;alofa", text:"Nuku&#x27;alofa"},
            {value:"Osaka", text:"Osaka"},
            {value:"Pacific Time (US &amp; Canada)", text:"Pacific Time (US &amp; Canada)"},
            {value:"Paris", text:"Paris"},
            {value:"Perth", text:"Perth"},
            {value:"Port Moresby", text:"Port Moresby"},
            {value:"Prague", text:"Prague"},
            {value:"Pretoria", text:"Pretoria"},
            {value:"Quito", text:"Quito"},
            {value:"Rangoon", text:"Rangoon"},
            {value:"Riga", text:"Riga"},
            {value:"Riyadh", text:"Riyadh"},
            {value:"Rome", text:"Rome"},
            {value:"Samoa", text:"Samoa"},
            {value:"Santiago", text:"Santiago"},
            {value:"Sapporo", text:"Sapporo"},
            {value:"Sarajevo", text:"Sarajevo"},
            {value:"Saskatchewan", text:"Saskatchewan"},
            {value:"Seoul", text:"Seoul"},
            {value:"Singapore", text:"Singapore"},
            {value:"Skopje", text:"Skopje"},
            {value:"Sofia", text:"Sofia"},
            {value:"Solomon Is.", text:"Solomon Is."},
            {value:"Sri Jayawardenepura", text:"Sri Jayawardenepura"},
            {value:"St. Petersburg", text:"St. Petersburg"},
            {value:"Stockholm", text:"Stockholm"},
            {value:"Sydney", text:"Sydney"},
            {value:"Taipei", text:"Taipei"},
            {value:"Tallinn", text:"Tallinn"},
            {value:"Tashkent", text:"Tashkent"},
            {value:"Tbilisi", text:"Tbilisi"},
            {value:"Tehran", text:"Tehran"},
            {value:"Tijuana", text:"Tijuana"},
            {value:"Tokelau Is.", text:"Tokelau Is."},
            {value:"Tokyo", text:"Tokyo"},
            {value:"UTC", text:"UTC"},
            {value:"Ulaan Bataar", text:"Ulaan Bataar"},
            {value:"Urumqi", text:"Urumqi"},
            {value:"Vienna", text:"Vienna"},
            {value:"Vilnius", text:"Vilnius"},
            {value:"Vladivostok", text:"Vladivostok"},
            {value:"Volgograd", text:"Volgograd"},
            {value:"Warsaw", text:"Warsaw"},
            {value:"Wellington", text:"Wellington"},
            {value:"West Central Africa", text:"West Central Africa"},
            {value:"Yakutsk", text:"Yakutsk"},
            {value:"Yerevan", text:"Yerevan"},
            {value:"Zagreb", text:"Zagreb"}
        ]
  }]);
