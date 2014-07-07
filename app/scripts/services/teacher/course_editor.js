'use strict';

angular.module('scalearAngularApp')
.factory('CourseEditor', ['$window',function ($window) {    

  
  var x={	
  	get_index_by_id:function(groups, group_id) // returns index of an object in an array by searching for its id
 	{
 		for(var element in groups)
 		{
 			if(groups[element].id==group_id)
 				return element
 		}
 		return -1
 	},
  	capitalize: function(s)
	{
    return s[0].toUpperCase() + s.slice(1);
	},
   expandDragAnswers:function(id, answers, type, question_id){
			var all_answers=[];
			if(!(answers instanceof Array))
			{
				answers=[answers];
			}
			
			for(var answer in answers)
			{
				var new_ans=x.newAnswer(answers[answer],"","","","",type, question_id);
				
				if(answer==0)
					new_ans.id=id;
				
				all_answers.push(new_ans);
			}
		return all_answers;
	},

	 mergeDragAnswers:function(answers, type, question_id){
		var all_answers=[]
		answers.forEach(function(elem){
			if(type=="quiz")
				all_answers.push(elem.content)
			else
				all_answers.push(elem.answer)
		});
		return x.newAnswer(all_answers,"","","","",type, question_id);
	},

	mergeDragPos:function(answers){
		var all_pos=[]
		answers.forEach(function(elem){
			all_pos.push(parseInt(elem.pos))
		});
		return all_pos
	},
	
	newAnswer: function(ans, h, w,l, t, type, question_id){
		
		if(type!="quiz")
		{
			var y={
				answer: ans || "",
				correct:false,
				explanation:"",
				online_quiz_id:question_id, //$scope.selected_quiz.id
				height:h || 0,
				width:w  || 0,
				xcoor:l  || 0,
				ycoor:t  || 0,
				sub_xcoor:l  || 0,
				sub_ycoor:t  || 0
			}
		}
		else{
			var y={
				content: ans || "",
				correct:false,
				question_id:question_id,
			}
		}
		return y;
	}
  
  }
  return x;


}])