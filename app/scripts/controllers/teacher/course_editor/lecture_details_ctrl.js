'use strict';

angular.module('scalearAngularApp')
    .controller('lectureDetailsCtrl', ['$stateParams', '$scope', '$http', '$q','$state', 'Lecture', 'lecture', function ($stateParams, $scope, $http, $q, $state, Lecture, lecture) {

	console.log("made it in details!!");
    $scope.lecture=lecture.data

	$scope.screen_options = [
		{value: "widescreen", text: 'widescreen'},
		{value: "smallscreen", text: 'smallscreen'}
	]

	getYoutubeDetails();

 	$scope.validateLecture = function(column,data) {
	    var d = $q.defer();
	    var lecture={}
	    lecture[column]=data;
	    Lecture.validateLecture(
	    	{lecture_id:$scope.lecture.id},
	    	lecture,
	    	function(data){
				d.resolve()
			},function(data){
				console.log(data.status);
				console.log(data);
			if(data.status==422)
			 	d.resolve(data.data[column].join());
			else
				d.reject('Server Error');
			}
	    )
	    return d.promise;
    };

	$scope.updateLecture= function(){
		console.log($scope.lecture)
		var modified_lecture=angular.copy($scope.lecture);

		delete modified_lecture["id"];
		delete modified_lecture["created_at"];
		delete modified_lecture["updated_at"];
		delete modified_lecture["className"];
		delete modified_lecture["detected_aspect_ratio"];
		
		Lecture.update(
			{lecture_id:$scope.lecture.id},
			{lecture:modified_lecture},
			function(data){	
				$scope.$emit('detailsUpdate')			
				$scope.$emit('accordianUpdate',$scope.lecture.group_id);				
			},
			function(){
				alert("Failed to update lecture, please check your internet connection")
			}
		);	
	}

	$scope.updateLectureUrl= function(){
		urlFormat()
		$scope.updateLectureVideo()
	}

	$scope.updateLectureVideo= function(){
		$scope.updateLecture()
		$scope.$emit('refreshVideo')
	}

	var urlFormat =function()
	{
		var url=$scope.lecture.url
		var video_id = url.match(/(?:https?:\/{2})?(?:w{3}\.)?(?:youtu|y2u)(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]{11})/);
		if(video_id != null) {
		   $scope.lecture.url= "http://www.youtube.com/watch?v="+video_id[1];
		}
		getYoutubeDetails();
	}

	function getYoutubeDetails()
	{
		var id=$scope.lecture.url.split("v=")[1]
		$scope.video={}
		if(id!=null && typeof id != 'undefined')
		{
			id= id.split("&")[0]
			console.log(id);
			var title="";
			var duration;
			var author;
			var url="http://gdata.youtube.com/feeds/api/videos/"+id+"?alt=json&v=2&callback=JSON_CALLBACK"
			$http.jsonp(url)
				.success(function (data) {
		        	console.log(data.entry)
			        $scope.video.title = data.entry.title.$t;
			        $scope.video.author = data.entry.author[0].name.$t;
			        $scope.lecture.duration = data.entry.media$group.yt$duration.seconds
			        if(data.entry.media$group.yt$aspectRatio == null || data.entry.media$group.yt$aspectRatio === undefined)
			        	$scope.lecture.aspect_ratio="smallscreen";
			        else
			        	$scope.lecture.detected_aspect_ratio = data.entry.media$group.yt$aspectRatio.$t;

			        $scope.video.thumbnail = "<img class=bigimg src="+data.entry.media$group.media$thumbnail[0].url+" />";
			});
		}
	}
}]);