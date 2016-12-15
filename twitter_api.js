
console.log('twitter_api.js started');

var utils = require("./utils.js");

var Twit = require('twit');
var Promise = require('bluebird');

var programTempDir = 'cytoscape-electron';
var apiAuth;

try {
  apiAuth = require('./api_key.json');
} catch (error) {
  console.log('api_key.json not found');
  //console.log(error);
}

var userCount = 100; // number of followers to return per call
var T;


try {
  if (apiAuth) {
    T = new Twit({
      consumer_key: apiAuth.key,
      consumer_secret: apiAuth.secret,
      app_only_auth: true,
      timeout_ms: 60 * 1000
    });
  }
} catch (error) {
  T = undefined;
  console.log('could not initialize Twit');
  console.log(error);
}

function TwitterAPI() {}

TwitterAPI.prototype.getAuth = function() {
  return (T && T.getAuth());
};



TwitterAPI.prototype.getUser = function(username) {
  return utils.readFile(username, 'user.json') // checks predownloaded data and cache
    .catch(function() {
      // need to download data from Twitter
      return T.get('users/show', { screen_name: username })
        .then(function(result) {
          // success; record and return data
          var data = result.data;
          utils.logDataToTemp(data, username, 'user.json');
          return Promise.resolve(data);
        }, function(err) {
          // error. probably rate limited or private user
          return Promise.reject(utils.makeErrorMessage(err));
        });
    });
};



TwitterAPI.prototype.getFollowers = function(username) {
  return utils.readFile(username, 'followers.json')
    .catch(function() {
      return T.get('followers/list', { screen_name: username, count: userCount, skip_status: true })
        .then(function(result) {
          var data = result.data.users;
          utils.logDataToTemp(data, username, 'followers.json');
          return Promise.resolve(data);
        }, function(err) {
          // error. probably rate limited or private user
          return Promise.reject(utils.makeErrorMessage(err));
        });
    });
};



module.exports = new TwitterAPI();




