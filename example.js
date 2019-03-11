var ucloudHelper = require('./ucloud-helper');

var helper = ucloudHelper.createHelper({
  publicKey : 'your_public_key',
  privateKey: 'your_private_key',
});

var params = {
  Action: 'GetRegion',
};
helper.call(params, function(err, apiRes) {
  console.log(err);
  console.log(JSON.stringify(JSON.parse(apiRes), null, '  '))

  process.exit();
});