'use strict';

angular.module('scalearAngularApp')
  .factory('URLInformation', ["$cookieStore", function($cookieStore){
    var redirect_link = null;
    var enroll_link = null;
    var history = []
    function shouldRedirect(){
      return !!redirect_link;
    }
    function getRedirectLink(){
      return redirect_link;
    }
    function setRedirectLink(link){
      redirect_link = link;
      return getRedirectLink();
    }
    function clearRedirectLink(){
      redirect_link = null
    }
    function addToHistory(link){
      history.push(link);
    }
    function getHistory(){
      return history.pop();
    }

    function setEnrollLink(link){
      enroll_link = link;
      $cookieStore.put("enroll_link", link)
      return getEnrollLink();
    }
    function getEnrollLink(){
      return enroll_link ||  $cookieStore.get("enroll_link");
    }
    function clearEnrollLink(){
      enroll_link = null;
      $cookieStore.remove("enroll_link");
    }
    function hasEnroll(){
      return !!getEnrollLink();
    }

    return {
    	shouldRedirect: shouldRedirect,
    	getRedirectLink:getRedirectLink,
      setRedirectLink:setRedirectLink,
      clearRedirectLink:clearRedirectLink,
      addToHistory:addToHistory,
      getHistory:getHistory,
      setEnrollLink:setEnrollLink,
      getEnrollLink:getEnrollLink,
      clearEnrollLink:clearEnrollLink,
      hasEnroll:hasEnroll
    };
  }]);
