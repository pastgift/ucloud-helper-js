var ucloudHelper = require('./ucloud-helper');

var helper = ucloudHelper.createHelper({
  publicKey : 'your_public_key',
  privateKey: 'your_private_key',
});

var params = {
  Action: 'GetRegion',
};
helper.call(params, function(err, apiRes) {
  console.log('err: ', err);
  console.log('apiRes: ', apiRes ? JSON.stringify(apiRes, null, '  ') : null);

  process.exit();
});