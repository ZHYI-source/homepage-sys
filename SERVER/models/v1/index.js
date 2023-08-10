const fs = require('fs');

const models_path = __dirname + '/mapping'
fs.readdirSync(models_path).forEach(function (file) {
    require(models_path + '/' + file);
    const modelName = file.replace('.js', '');
    exports[modelName] = require(models_path + '/' + file);
});

// module.exports = {
//     UsersModel: require('./UsersModel'),
// }
