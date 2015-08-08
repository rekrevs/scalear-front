'use strict';

angular.module('scalearAngularApp')
  .controller('announcementsCtrl',['$scope', 'Announcement','$stateParams','$translate', '$log','$window','Page','ContentNavigator',  function ($scope, Announcement, $stateParams, $translate ,$log, $window,Page, ContentNavigator) {
  	
    $log.debug("in announcements");
    ContentNavigator.close()
    Page.setTitle('head.announcements')
  	$scope.disable_new = false;

  	var init = function()
  	{
  		Announcement.index(
        {course_id: $stateParams.course_id},
  			function(data){
  				$scope.announcements=data;
          $scope.show_button = true
  			}
  		)
  	}

  	$scope.deleteAnnouncement=function(this_announcement){
  		//if(confirm($translate('announcement_form.confirm_delete'))){
  		if(this_announcement.id){
	  		Announcement.destroy(
          {
            course_id: $stateParams.course_id, 
            announcement_id: this_announcement.id
          },
          {}
          // function(){
  			     //  $scope.announcements.splice($scope.announcements.indexOf(this_announcement), 1)
          //     $scope.disable_new = false;
          // }
          )
	  	}
  		    $scope.announcements.splice($scope.announcements.indexOf(this_announcement), 1);
          $scope.disable_new = false;
      //  }
  	}
  	
  	$scope.createAnnouncement= function(){
      $scope.disable_new = true;
      for(var element in $scope.announcements){
			 if($scope.announcements[element].show)
				  $scope.hideAnnouncement(element);
  		}
  		$scope.newAnnouncement= {announcement:"", created_at: new Date(), show:true};
      if(!($scope.announcements instanceof Array)){
          $scope.announcements = []
      }
          
		  $scope.announcements.push($scope.newAnnouncement);
  	}

  	$scope.hideAnnouncement = function(this_announcement){ //get old data.
      $scope.disable_new = false;
      $scope.saving = false;
      this_announcement.show=false
  		if(this_announcement.id){
		    Announcement.show(
          {
            course_id: $stateParams.course_id,
            announcement_id:this_announcement.id 
          },
  			  function(data){
            $log.debug("announcements data=");
    				$log.debug(data);
    				this_announcement=data;
  			 }
  		  );
  		}
      else{
        $scope.announcements.splice($scope.announcements.indexOf(this_announcement), 1);
  		}
  	}

  	$scope.showAnnouncement = function(this_announcement){
      for(var element in $scope.announcements){
  			if($scope.announcements[element].show)
  				$scope.hideAnnouncement(element);
  		}
      $scope.disable_new = true;
      this_announcement.show=true;
  		this_announcement.overclass='';
  	}

  	$scope.saveAnnouncement = function(this_announcement){
      $scope.saving= true
      var tmp = document.createElement("DIV")
      tmp.innerHTML = this_announcement.announcement
      var inner_text =  tmp.textContent || tmp.innerText || ""
      inner_text = inner_text.replace(/\s/g,'')
      if(!inner_text.length)
         this_announcement.announcement = inner_text
  		if(!this_announcement.id){ // create new one
  		  Announcement.create(
          {course_id: $stateParams.course_id},
          {announcement:{announcement:this_announcement.announcement}},
          function(data){
            $scope.announcements[$scope.announcements.length-1] = data.announcement;
            $scope.disable_new = false;
            $scope.saving = false;
  		    },
          function(response){
      			this_announcement.errors=response.data.errors
            $scope.saving = false;
      		}
        )
  		}
      else{
    		Announcement.update(
          {course_id: $stateParams.course_id,announcement_id:this_announcement.id},
          {announcement:{announcement:this_announcement.announcement}},
          function(data){
            $scope.announcements[$scope.announcements.indexOf(this_announcement)] = data.announcement;
      			$scope.disable_new = false;
            $scope.saving = false;
      		},
          function(response){
      			this_announcement.errors=response.data.errors
            $scope.saving = false;
      		}
        )
  		}
  	};

    init();

  }]);
