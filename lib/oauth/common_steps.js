// Common API flows defined for WP Oauth service

var expect = require('chai').expect;
var Config = require('config');
var Qs = require('querystring');
var Url = require('urlencode');

var internals = {};

internals.CommonSteps = function () {};

// Signup API
// refer to https://developer.wordpress.com/docs/oauth2
internals.CommonSteps.login = function(wp, options) {
  options = options || {};
  options.clientId = options.clientId || Config.application.client_id;
  options.redirectUri = options.redirectUri || Config.application.redirect_uri;
  options.clientSecret = options.clientSecret || Config.application.client_secret,
  options.responseType = options.responseType || 'code';
  options.scope = options.scope || 'global';
  options.action = options.action || 'oauth2-login';
  options.redirectTo = options.redirectTo || 'https://public-api.wordpress.com/oauth2/authorize/?client_id=52547&redirect_uri=http%3A%2F%2Fwww.ccy.com&response_type=code&scope=global&jetpack-code&jetpack-user-id=0&action=oauth2-login',
  options.username = options.username || Config.user.name;
  options.password = options.password || Config.user.password;

  var loginForm = {
    client_id: options.clientId,
    redirect_uri: options.redirectUri,
    response_type: options.responseType,
    scope: options.scope,
    action: options.action,
    redirect_to: options.redirectTo,
    log: options.username,
    pwd: options.password
  };

  // Simulate wp login to get _wpnonce
  var r = wp.rawRequest({
    method: 'POST',
    uri: Config.server.login,
    proxy: Config.proxy,
    followRedirect: true,
    followAllRedirects: true,
    form: loginForm,
  });
  expect(r.data.statusCode).to.equal(200);
  var wpnonce = r.data.body.match(/_wpnonce=([a-zA-Z0-9_]+)/)[1];

  // Get access code
  var loginQuery = {
    blog_id: 0,
    client_id: options.clientId,
    redirect_uri: options.redirectUri,
    response_type: options.responseType,
    scope: options.scope,
    action: options.action,
    redirect_to: options.redirectTo,
    _wpnonce: wpnonce
  };

  r = wp.rawRequest({
    method: 'GET',
    uri: Config.server.oauth + '/oauth2/login/',
    qs: loginQuery,
    proxy: Config.proxy,
    followRedirect: false,
  });
  expect(r.data.statusCode).to.equal(302);
  var accessCode = r.data.headers.location.match(/code=(.+)&state/i)[1]

  // Get access token
  r = wp.rawRequest({
    method: 'POST',
    uri: Config.server.oauth + '/oauth2/token',
    proxy: Config.proxy,
    form: {
      client_id: options.clientId,
      client_secret: options.clientSecret,
      redirect_uri: options.redirectUri,
      code: accessCode,
      grant_type: 'authorization_code'
    }
  });
  expect(r.data.statusCode).to.equal(200);
  var accessToken = JSON.parse(r.data.body).access_token;
  expect(accessToken).to.be.a('String');

  // Validate access token
  r = wp.oauth2['token-info'].GET({
    query: {
      client_id: options.clientId,
      token: accessToken
    }
  });
  expect(r.data.statusCode).to.equal(200);
  expect(r.data.body.scope).to.equal(options.scope);

  // set access token header for all the coming API calls
  wp.setHeaders({
    Authorization: 'Bearer ' + accessToken
  })

  return {
    response: r,
    accessToken: accessToken
  };

};

exports = module.exports = internals.CommonSteps;

