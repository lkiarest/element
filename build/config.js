var path = require('path');
var fs = require('fs');
var nodeExternals = require('webpack-node-externals');
var Components = require('../components.json');
var userConfig = require('./user.config');

// 打包过程涉及的全局参数
exports.oldGlobalName = 'ElementUI';
exports.oldLibName = 'element-ui';
exports.oldPrefix = 'el';
exports.libName = userConfig.libName;
exports.globalName = userConfig.globalName;
exports.targetPrefix = userConfig.targetPrefix;

var utilsList = fs.readdirSync(path.resolve(__dirname, '../src/utils'));
var mixinsList = fs.readdirSync(path.resolve(__dirname, '../src/mixins'));
var transitionList = fs.readdirSync(path.resolve(__dirname, '../src/transitions'));
var externals = {};

Object.keys(Components).forEach(function(key) {
  externals[`${exports.libName}/packages/${key}`] = `${exports.libName}/lib/${key}`;
});

externals[`${exports.libName}/src/locale`] = `${exports.libName}/lib/locale`;
utilsList.forEach(function(file) {
  file = path.basename(file, '.js');
  externals[`${exports.libName}/src/utils/${file}`] = `${exports.libName}/lib/utils/${file}`;
});
mixinsList.forEach(function(file) {
  file = path.basename(file, '.js');
  externals[`${exports.libName}/src/mixins/${file}`] = `${exports.libName}/lib/mixins/${file}`;
});
transitionList.forEach(function(file) {
  file = path.basename(file, '.js');
  externals[`${exports.libName}/src/transitions/${file}`] = `${exports.libName}/lib/transitions/${file}`;
});

externals = [Object.assign({
  vue: 'vue'
}, externals), nodeExternals()];

exports.externals = externals;

exports.alias = {
  main: path.resolve(__dirname, '../src'),
  packages: path.resolve(__dirname, '../packages'),
  examples: path.resolve(__dirname, '../examples'),
  [exports.libName]: path.resolve(__dirname, '../')
};

exports.vue = {
  root: 'Vue',
  commonjs: 'vue',
  commonjs2: 'vue',
  amd: 'vue'
};

exports.jsexclude = /node_modules|utils\/popper\.js|utils\/date\.js/;

// 指定要替换的前缀
exports.prefixReplace = [exports.oldPrefix, exports.targetPrefix];

const upperFirst = (str) => {
  if (!str) {
    return str;
  }

  return str.charAt(0).toUpperCase() + str.substring(1);
};

const [ from, to ] = exports.prefixReplace;

exports.prefixLoader = {
  loader: path.resolve(__dirname, 'prefix-loader/index.js'),
  options: {
    rules: [{
      from: new RegExp(`\\b${from}-`, 'g'),
      to: `${to}-`
    }, {
      from: new RegExp(`\\b${upperFirst(from)}([A-Z])`, 'g'),
      to: (_, next) => `${upperFirst(to)}${next}`
    }, {
      from: new RegExp(`\\b${exports.oldLibName}\\b`, 'g'),
      to: exports.libName
    }, {
      from: new RegExp(`\\b${exports.oldGlobalName}\\b`, 'g'),
      to: `${exports.globalName}`
    }]
  }
};

exports.demoPrefixLoader = {
  loader: path.resolve(__dirname, 'prefix-loader/index.js'),
  options: {
    rules: [
      ...exports.prefixLoader.options.rules,
      {
        from: /https:\/\/github.com\/ElemeFE/ig,
        to: userConfig.gitRepo
      },
      {
        from: /\bElement\b/g,
        to: upperFirst(exports.libName)
      }
    ]
  }
};
