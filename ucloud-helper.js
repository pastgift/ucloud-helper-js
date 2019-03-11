'use strict';

var crypto  = require('crypto');
var request = require('request');

/**
 * @constructor
 * @param  {Object} config
 * @return {Object} - UCloud Helper
 */
var UCloudHelper = function(config) {
  this.config = config

  this.publicKey  = this.config.publicKey;
  this.privateKey = this.config.privateKey;
};

UCloudHelper.prototype.sign = function(params) {
  var self = this;

  // Sort keys
  var keys = [];
  for (var k in params) if (params.hasOwnProperty(k)) {
    keys.push(k);
  }
  keys.sort();

  // Get string to sign
  var stringToSign = '';
  keys.forEach(function(k) {
    stringToSign += k.toString() + params[k].toString();
  });
  stringToSign += self.privateKey;

  var c = crypto.createHash('sha1');
  c.update(stringToSign);

  var signature = c.digest('hex');
  return signature;
};

UCloudHelper.prototype.percentEncode = function(s) {
  s = s.replace(/\+/g, '%20');
  s = s.replace(/\*/g, '%2A');
  s = s.replace(/%7E/g, '~');
  s = s.replace(/\"/g, '%22');

  return s;
};

UCloudHelper.prototype.getQueryString = function(params) {
  var self = this;

  // Sort keys
  var keys = [];
  for (var k in params) if (params.hasOwnProperty(k)) {
    keys.push(k);
  }
  keys.sort();

  var queryStringParts = [];
  keys.forEach(function(k) {
    queryStringParts.push(encodeURI(k) + '=' + encodeURI(params[k]));
  });

  var queryString = queryStringParts.join('&');
  queryString = self.percentEncode(queryString);

  return queryString;
};

UCloudHelper.prototype.call = function(params, callback) {
  var self = this;

  params['PublicKey'] = self.publicKey;
  params['Signature'] = self.sign(params);
  var queryString = self.getQueryString(params);

  var url = 'https://api.ucloud.cn?' + queryString;
  var requestOptions = {
    forever: true,
    timeout: 10 * 1000,
    method : 'GET',
    url    : url,
  };

  request(requestOptions, function(err, res, body) {
    if ('string' === typeof body) {
      body = JSON.parse(body);
    }

    if (err) {
      return callback(err);
    } else if (res.statusCode >= 400 || body.RetCode > 0) {
      return callback(body);
    } else {
      return callback(null, body);
    }
  });
};

exports.UCloudHelper = UCloudHelper;
exports.createHelper = function(config) {
  return new UCloudHelper(config);
};
