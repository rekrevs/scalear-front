'use strict';

describe('Directive: student/newsFeed/newsFeedDirectives', function () {

  // load the directive's module
  beforeEach(module('scalearAngularApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<student/news-feed/news-feed-directives></student/news-feed/news-feed-directives>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the student/newsFeed/newsFeedDirectives directive');
  }));
});
