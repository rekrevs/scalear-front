'use strict';

describe('Service: StudentNewsFeed', function () {

  // load the service's module
  beforeEach(module('ScalearangularApp'));

  // instantiate service
  var StudentNewsFeed;
  beforeEach(inject(function (_StudentNewsFeed_) {
    StudentNewsFeed = _StudentNewsFeed_;
  }));

  it('should do something', function () {
    expect(!!StudentNewsFeed).toBe(true);
  });

});
