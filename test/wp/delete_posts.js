// WordPress.com REST API tests

var Config = require('config');
var expect = require('chai').expect;
var test = require('../../test/test.js');

describe('WordPress.com API: ', function() {
  before(function() {
    wp = test.wp;
  });

  it('Delete all posts from a site [C001]', function(done) {
    wp.run(function() {
      // Oauth login
      test.CommonSteps.oauth.login(wp);

      // Get current user information
      r = wp.me.GET();
      expect(r.data.statusCode).to.equal(200);
      expect(r.data.body.display_name).to.equal(Config.user.name);

      // Get current user's sites information
      r = wp.me.sites.GET();
      expect(r.data.statusCode).to.equal(200);
      expect(r.data.body.sites.length).to.be.above(0);
      // TODO: for now, only get the first site for a POC
      // Will iterate all sites and delete all posts based on requirements
      var siteId = r.data.body.sites[0].ID;
      var siteUrl = r.data.body.sites[0].URL;

      // Get all posts from the a site
      r = wp.sites['${site}'].posts.GET({
        params: {
          site: siteId
        }
      });
      expect(r.data.statusCode).to.equal(200);
      var posts = r.data.body.posts;

      // Delete all posts from that site
      posts.forEach(function(post){
        console.log('    INFO: Deleting post "' + post.title + '" from ' + siteUrl + ' ...');
        r = wp.sites['${site}'].posts['${post_ID}'].delete.POST({
          params: {
            site: siteId,
            post_ID: post.ID
          }
        });
        expect(r.data.statusCode).to.equal(200);
      })

      done();
    });
  });

});
