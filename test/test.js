var Config = require('config');
var Bluecat = require('bluecat');
exports.CommonSteps = require('../lib').commonSteps;

var api = Bluecat.Api('wp');
api.oauth2.host = Config.server.oauth;

service = new Bluecat.ServiceSync(api, Config.server.host);
service.setProxy(Config.proxy);
exports.wp = service;
