/**
 * 统一替换组件库前缀及库名称
 */
const { getOptions } = require('loader-utils');

module.exports = function(source) {
  if (!source) {
    return '';
  }

  let { rules } = getOptions(this);

  rules = rules.filter(({ from, to }) => from && to && from !== to);

  rules.forEach(({ from, to }) => {
    try {
      source = source.replace(from, to);
    } catch (e) {
      console.error('[prefixLoader]', e.message);
    }
  });

  return source;
};
