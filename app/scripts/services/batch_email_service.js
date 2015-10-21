'use strict';

angular.module('scalearAngularApp')
.factory('batchEmailService', function(){
    var emails={
        value:[],
        getEmails: function(){
            return emails.value
        },
        setEmails: function(value){
           emails.value = value
        }
    }
    return emails
});