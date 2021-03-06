'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.readMjmlConfig = readMjmlConfig;
exports.resolveComponentPath = resolveComponentPath;
exports.registerCustomComponent = registerCustomComponent;
exports.default = handleMjmlConfig;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _mjmlValidator = require('mjml-validator');

var _components = require('../components');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function readMjmlConfig() {
  var configPathOrDir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : process.cwd();

  var componentRootPath = process.cwd();
  var mjmlConfigPath = configPathOrDir;
  try {
    mjmlConfigPath = _path2.default.basename(configPathOrDir) === '.mjmlconfig' ? _path2.default.resolve(configPathOrDir) : _path2.default.resolve(configPathOrDir, '.mjmlconfig');
    componentRootPath = _path2.default.dirname(mjmlConfigPath);
    var mjmlConfig = JSON.parse(_fs2.default.readFileSync(_path2.default.resolve(mjmlConfigPath), 'utf8'));
    return { mjmlConfig: mjmlConfig, componentRootPath: componentRootPath };
  } catch (e) {
    if (e.code !== 'ENOENT') {
      console.error('Error reading mjmlconfig : ', e); // eslint-disable-line no-console
    }
    return { mjmlConfig: { packages: [] }, mjmlConfigPath: mjmlConfigPath, componentRootPath: componentRootPath, error: e };
  }
}

function resolveComponentPath(compPath, componentRootPath) {
  if (!compPath) {
    return null;
  }
  if (!compPath.startsWith('.') && !_path2.default.isAbsolute(compPath)) {
    try {
      return require.resolve(compPath);
    } catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND') {
        console.error('Error resolving custom component path : ', e); // eslint-disable-line no-console
        return null;
      }
      // we got a 'MODULE_NOT_FOUND' error
      try {
        // try again as relative path to node_modules: (this may be necessary if mjml is installed globally or by npm link)
        return resolveComponentPath('./node_modules/' + compPath, componentRootPath);
      } catch (e) {
        //  try again as a plain local path:
        return resolveComponentPath('./' + compPath, componentRootPath);
      }
    }
  }
  return require.resolve(_path2.default.resolve(componentRootPath, compPath));
}

function registerCustomComponent(comp) {
  var registerCompFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _components.registerComponent;

  if (comp instanceof Function) {
    registerCompFn(comp);
  } else {
    var compNames = (0, _keys2.default)(comp); // this approach handles both an array and an object (like the mjml-accordion default export)
    compNames.forEach(function (compName) {
      registerCustomComponent(comp[compName], registerCompFn);
    });
  }
}

function handleMjmlConfig() {
  var configPathOrDir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : process.cwd();
  var registerCompFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _components.registerComponent;

  var _readMjmlConfig = readMjmlConfig(configPathOrDir),
      packages = _readMjmlConfig.mjmlConfig.packages,
      componentRootPath = _readMjmlConfig.componentRootPath,
      error = _readMjmlConfig.error;

  if (error) return { error: error };

  var result = {
    success: [],
    failures: []
  };

  packages.forEach(function (compPath) {
    var resolvedPath = compPath;
    try {
      resolvedPath = resolveComponentPath(compPath, componentRootPath);
      if (resolvedPath) {
        var requiredComp = require(resolvedPath); // eslint-disable-line global-require, import/no-dynamic-require
        registerCustomComponent(requiredComp.default || requiredComp, registerCompFn);
        (0, _mjmlValidator.registerDependencies)((requiredComp.default || requiredComp).dependencies);
        result.success.push(compPath);
      }
    } catch (e) {
      result.failures.push({ error: e, compPath: compPath });
      if (e.code === 'ENOENT' || e.code === 'MODULE_NOT_FOUND') {
        console.error('Missing or unreadable custom component : ', resolvedPath); // eslint-disable-line no-console
      } else {
        console.error('Error when registering custom component : ', resolvedPath, e); // eslint-disable-line no-console
      }
    }
  });

  return result;
}