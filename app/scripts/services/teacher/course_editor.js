'use strict';

angular.module('scalearAngularApp')
.factory('CourseEditor', function () {    

  
  var x={	
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
			
			console.log(all_answers)
		});
		return x.newAnswer(all_answers,"","","","",type, question_id);
	},

	mergeDragPos:function(answers){
		var all_pos=[]
		answers.forEach(function(elem){
			all_pos.push(parseInt(elem.pos))
			console.log(all_pos)
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
				ycoor:t  || 0
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


})