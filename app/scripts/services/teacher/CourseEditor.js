'use strict';

angular.module('scalearAngularApp')
.factory('CourseEditor', function () {    

  
  var x={	
   expand_drag_answers:function(id, answers, type, question_id){
		console.log("add_drag_answer2 ");
		console.log(!(answers instanceof Array));
		var allAnswers=[];
		if(!(answers instanceof Array))
		{
			console.log("here");
			answers=[answers];
		}
			
			for(var answer in answers)
			{
				var new_ans=x.new_answer(answers[answer],"","","","",type, question_id);
				if(answer==0)
					new_ans.id=id;
				console.log(new_ans);
				allAnswers.push(new_ans);
			}
		return allAnswers;
	},

	 merge_drag_answers:function(answers, type, question_id){
		var allAnswers=[]
		answers.forEach(function(elem){
			if(type=="quiz")
				allAnswers.push(elem.content)
			else
				allAnswers.push(elem.answer)
			
			console.log(allAnswers)
		});
		return x.new_answer(allAnswers,"","","","",type, question_id);
	},

	merge_drag_pos:function(answers){
		var allPos=[]
		answers.forEach(function(elem){
			allPos.push(parseInt(elem.pos))
			console.log(allPos)
		});
		return allPos
	},
	
	new_answer: function(ans, h, w,l, t, type, question_id){
		
		if(type!="quiz")
		{
			var y={
				answer: ans || "",
				correct:false,
				explanation:"",
				online_quiz_id:question_id, //$scope.selectedQuiz.id
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