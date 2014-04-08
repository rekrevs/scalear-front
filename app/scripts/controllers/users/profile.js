'use strict';

angular.module('scalearAngularApp')
  .controller('UsersProfileCtrl', ['$scope', '$stateParams', 'User', 'Page', function ($scope, $stateParams, User, Page) {
  	Page.setTitle('profile.profile')
    $scope.init = function(){
    	User.get_user({user_id: $stateParams.user_id},
  			function(data){
  				$scope.user = JSON.parse(data.user);
  				$scope.profile_image = data.profile_image;
  				var date1 = new Date();
  				var date2 = new Date($scope.user.created_at);
  				var time_difference = Math.abs(date1.getTime() - date2.getTime());
  				var days_difference = Math.ceil(time_difference / (1000 * 3600 * 24)); 
				if(days_difference < 7){
					$scope.member_since = Math.floor(days_difference)
					if($scope.member_since == 1){
						$scope.format = 'profile.day_ago'
					}
					else{
						$scope.format = 'profile.days_ago'
					}
				}
				else if(days_difference < 30){
					$scope.member_since = Math.floor(days_difference/7)
					if($scope.member_since == 1){
						$scope.format = 'profile.week_ago'
					}
					else{
						$scope.format = 'profile.weeks_ago'
					}
				}
				else if(days_difference < 365){
					$scope.member_since = Math.floor(days_difference/30)
					if($scope.member_since == 1){
						$scope.format = 'profile.month_ago'
					}
					else{
						$scope.format = 'profile.months_ago'
					}
				}
				else {
					$scope.member_since = Math.floor(days_difference/365)
					if($scope.member_since == 1){
						$scope.format = 'profile.year_ago'
					}
					else{
						$scope.format = 'profile.years_ago'
					}
				}
				if($scope.user.link){
					$scope.short_url = $scope.shorten($scope.url_with_protocol($scope.user.link), 20);
				}
  				// console.log(data.user)
  				// console.log(data.profile_image)
  			}
		)
    }

    $scope.shorten = function(url, l){
	    var l = typeof(l) != "undefined" ? l : 50;
	    var chunk_l = (l/2);
	    var url = url.replace("http://","").replace("https://","");

	    if(url.length <= l){ return url; }

	    var start_chunk = shortString(url, chunk_l, false);
	    var end_chunk = shortString(url, chunk_l, true);
	    return start_chunk + ".." + end_chunk;
	}
	var shortString = function(s, l, reverse){
	    var stop_chars = [' ','/', '&'];
	    var acceptable_shortness = l * 0.80; // When to start looking for stop characters
	    var reverse = typeof(reverse) != "undefined" ? reverse : false;
	    var s = reverse ? s.split("").reverse().join("") : s;
	    var short_s = "";

	    for(var i=0; i < l-1; i++){
	        short_s += s[i];
	        if(i >= acceptable_shortness && stop_chars.indexOf(s[i]) >= 0){
	            break;
	        }
	    }
	    if(reverse){ return short_s.split("").reverse().join(""); }
	    return short_s;
	}
	$scope.url_with_protocol = function(url)
    {
        if(url)
            return url.match(/^http/)? url: 'http://'+url;
        else
            return url;
    }
    $scope.init();
  }]);
