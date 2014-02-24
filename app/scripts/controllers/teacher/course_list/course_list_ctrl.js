'use strict';

angular.module('scalearAngularApp')
  .controller('courseListCtrl',['$scope','Course','$stateParams', '$translate','$log','$window', function ($scope, Course,$stateParams, $translate, $log, $window) {

  	$log.debug("in course list")
    $window.scrollTo(0, 0);
    
  		Course.index({},
			function(data){
				$log.debug(data)
        // console.log(data)
				$scope.courses = data
        // console.log($scope.courses)
        $scope.M = getMeanOfMean();
        $scope.means = []
        $scope.courses.forEach(function(course, i){
          $scope.means.push(course.average_activity) 
        })
        $scope.std_deviation = getStandardDeviation($scope.means, 10);
        $scope.most_active = getMostActive();
        $scope.least_active = getLeastActive();
			},
			function(){
				//alert("Could not get courses, please check your internet connection")
			})

  		$scope.column='name'

  		$scope.deleteCourse=function(course){
  			// can't pass index.. cause its not reliable with filter. so instead take course, and get its position in scope.courses
  			//if(confirm($translate("courses.you_sure_delete_course", {course:course.name}))){
	  			Course.destroy({course_id: course.id},{},
	  				function(response){
	  					$scope.courses.splice($scope.courses.indexOf(course), 1)
	  					$log.debug(response)
	  				},
	  				function(){
	  					//alert("Could not delete course, please check your internet connection")
	  				})
	  	//	}
  		}

  		$scope.filterTeacher=function(teacher_name){
  			$scope.filtered_teacher= teacher_name;
  		}

      $scope.removeFilter=function(){
        $scope.filtered_teacher = ''
      }

  		$scope.order=function(column_name){
  			$scope.column = column_name
  			$scope.is_reverse = !$scope.is_reverse
  		}

      var getMostActive = function(){
        var max = $scope.courses[0].average_activity;
        $scope.courses.forEach(function(course, i){
          if(course.average_activity > max){
            max = course.average_activity
          }
        })
        var z = (max - $scope.M)/$scope.std_deviation
        return z
      }
      var getLeastActive = function(){
        var min = $scope.courses[0].average_activity;
        $scope.courses.forEach(function(course, i){
          if(course.average_activity < min){
            min = course.average_activity;
          }
        })
        var z = (min - $scope.M)/$scope.std_deviation
        return z
      }

      var getMeanOfMean = function(){
        var sum =0
        $scope.courses.forEach(function(course, i){
          sum += course.average_activity
        })
        return sum/$scope.courses.length
      }

      $scope.checkActivity = function(value){
        var z = (value - $scope.M)/$scope.std_deviation
        if(z <= ($scope.most_active/4)){
          return 1
        }
        else if(z <= ($scope.most_active/2)){
          return 2
        }
        else if(z <= $scope.most_active){
          return 3
        }
      }

      //Activity Indicator Statistics Functions
      var isArray = function (obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
      },
      getNumWithSetDec = function( num, numOfDec ){
        var pow10s = Math.pow( 10, numOfDec || 0 );
        return ( numOfDec ) ? Math.round( pow10s * num ) / pow10s : num;
      },
      getAverageFromNumArr = function( numArr, numOfDec ){
        if( !isArray( numArr ) ){ return false; }
        var i = numArr.length, 
          sum = 0;
        while( i-- ){
          sum += numArr[ i ];
        }
        return getNumWithSetDec( (sum / numArr.length ), numOfDec );
      },
      getVariance = function( numArr, numOfDec ){
        if( !isArray(numArr) ){ return false; }
        var avg = getAverageFromNumArr( numArr, numOfDec ), 
          i = numArr.length,
          v = 0;
       
        while( i-- ){
          v += Math.pow( (numArr[ i ] - avg), 2 );
        }
        v /= numArr.length;
        return getNumWithSetDec( v, numOfDec );
      },
      getStandardDeviation = function( numArr, numOfDec ){
        if( !isArray(numArr) ){ return false; }
        var stdDev = Math.sqrt( getVariance( numArr, numOfDec ) );
        return getNumWithSetDec( stdDev, numOfDec );
      };
  		
  }]);
