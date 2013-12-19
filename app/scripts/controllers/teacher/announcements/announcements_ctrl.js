'use strict';

angular.module('scalearAngularApp')
  .controller('announcementsCtrl',['$scope', 'Announcement','$stateParams','$translate', '$log','$window',  function ($scope, Announcement, $stateParams, $translate ,$log, $window) {
  	
    $log.debug("in announcements");

    $window.scrollTo(0, 0);
    
  	$scope.disable_new = false;
  	var init = function()
  	{
  		Announcement.index({course_id: $stateParams.course_id},
  			function(data){
  				$scope.announcements=data;
  			}
  		)
  	}
  	
  	$scope.deleteAnnouncement=function(index){
  		if(confirm($translate('announcement_form.confirm_delete'))){
  		if($scope.announcements[index].id){
	  		Announcement.destroy({course_id: $stateParams.course_id, announcement_id: $scope.announcements[index].id},{},function(data){
	  			//init();
	  			$scope.announcements.splice(index, 1)
                $scope.disable_new = false;
            })
	  	}else
	  		$scope.announcements.splice(index, 1);
            $scope.disable_new = false;

        }
  	}
  	
  	$scope.createAnnouncement= function(){
        $scope.disable_new = true;
        for(var element in $scope.announcements)
  		{
  			if($scope.announcements[element].show==true)
  				$scope.hideAnnouncement(element);
  		}
  		$scope.newAnnouncement= {announcement:"", created_at: new Date(), show:true};
  		$scope.announcements.push($scope.newAnnouncement);
  	}
  	$scope.hideAnnouncement = function(index){ //get old data.
        $scope.disable_new = false;
        $scope.announcements[index].show=false
  		if($scope.announcements[index].id){
  		Announcement.show({course_id: $stateParams.course_id,announcement_id:$scope.announcements[index].id },
  			function(data){
          $log.debug("announcements data=");
  				$log.debug(data);
  				$scope.announcements[index]=data;
  			}
  		);
  		}else{
//  			$scope.announcements[index]={announcement:"", created_at: new Date(), show:false};
            $scope.announcements.splice(index, 1);
  		}
  	}
  	$scope.showAnnouncement = function(index){
        for(var element in $scope.announcements)
  		{
  			if($scope.announcements[element].show==true)
  				$scope.hideAnnouncement(element);
  		}
        $scope.disable_new = true;
        $scope.announcements[index].show=true;
  		$scope.announcements[index].overclass='';
  	};
  	$scope.saveAnnouncement = function(index){
  		
  		if(!$scope.announcements[index].id) // create new one
  		{
  		  Announcement.create(
          {course_id: $stateParams.course_id},
          {announcement:{announcement:$scope.announcements[index].announcement}},
          function(data){
            $scope.announcements[index]=data.announcement;
            $scope.disable_new = false;
  		    },
          function(response){
      			$scope.announcements[index].errors=response["data"].errors
      		}
        )
  		}
      else{
    		Announcement.update(
          {course_id: $stateParams.course_id,announcement_id:$scope.announcements[index].id},
          {announcement:{announcement:$scope.announcements[index].announcement}},
          function(data){
      			$scope.announcements[index]=data.announcement;
      			$scope.disable_new = false;
      		},
          function(response){
      			$scope.announcements[index].errors=response["data"].errors
      		}
        )
  		}
  	};
  	
    $scope.tinymceOptions = {
        mode : "textareas",
        //theme : "advanced",
        plugins : "autolink,textcolor, lists,pagebreak,layer,table,save,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,template",

        // Theme options
        theme_advanced_buttons1 : "save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,styleselect,formatselect,fontselect,fontsizeselect",
        theme_advanced_buttons2 : "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
        theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
        theme_advanced_buttons4 : "insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,blockquote,pagebreak,|,insertfile,insertimage",
        theme_advanced_toolbar_location : "top",
        theme_advanced_toolbar_align : "left",
        theme_advanced_statusbar_location : "bottom",
        theme_advanced_resizing : true,

        // Skin options
       // skin : "o2k7",
       // skin_variant : "silver",
        handle_event_callback: function (e) {
    		// put logic here for keypress
  		}
  	}
    
    init();
  }]);
