'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeadComponent = exports.BodyComponent = undefined;

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _class, _temp;

var _lodash = require('lodash');

var _mjmlParserXml = require('mjml-parser-xml');

var _mjmlParserXml2 = _interopRequireDefault(_mjmlParserXml);

var _shorthandParser = require('./helpers/shorthandParser');

var _shorthandParser2 = _interopRequireDefault(_shorthandParser);

var _formatAttributes = require('./helpers/formatAttributes');

var _formatAttributes2 = _interopRequireDefault(_formatAttributes);

var _jsonToXML = require('./helpers/jsonToXML');

var _jsonToXML2 = _interopRequireDefault(_jsonToXML);

var _components = require('./components');

var _components2 = _interopRequireDefault(_components);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Component = (_temp = _class = function () {
  (0, _createClass3.default)(Component, null, [{
    key: 'getTagName',
    value: function getTagName() {
      return (0, _lodash.kebabCase)(this.name);
    }
  }, {
    key: 'isRawElement',
    value: function isRawElement() {
      return !!this.rawElement;
    }
  }]);

  function Component() {
    var initialDatas = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, Component);
    var _initialDatas$attribu = initialDatas.attributes,
        attributes = _initialDatas$attribu === undefined ? {} : _initialDatas$attribu,
        _initialDatas$childre = initialDatas.children,
        children = _initialDatas$childre === undefined ? [] : _initialDatas$childre,
        _initialDatas$content = initialDatas.content,
        content = _initialDatas$content === undefined ? '' : _initialDatas$content,
        _initialDatas$context = initialDatas.context,
        context = _initialDatas$context === undefined ? {} : _initialDatas$context,
        _initialDatas$props = initialDatas.props,
        props = _initialDatas$props === undefined ? {} : _initialDatas$props,
        _initialDatas$globalA = initialDatas.globalAttributes,
        globalAttributes = _initialDatas$globalA === undefined ? {} : _initialDatas$globalA,
        userContext = initialDatas.userContext;


    this.props = (0, _extends3.default)({}, props, {
      children: children,
      content: content,
      userContext: userContext
    });

    this.attributes = (0, _formatAttributes2.default)((0, _extends3.default)({}, this.constructor.defaultAttributes, globalAttributes, attributes), this.constructor.allowedAttributes);
    this.context = context;

    return this;
  }

  (0, _createClass3.default)(Component, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return this.context;
    }
  }, {
    key: 'getAttribute',
    value: function getAttribute(name) {
      return this.attributes[name];
    }
  }, {
    key: 'getUserContent',
    value: function getUserContent() {
      return this.props.userContext;
    }
  }, {
    key: 'getContent',
    value: function getContent() {
      return this.props.content.trim();
    }
  }, {
    key: 'renderMJML',
    value: function renderMJML(mjml) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (typeof mjml === 'string') {
        mjml = (0, _mjmlParserXml2.default)(mjml, (0, _extends3.default)({}, options, {
          components: _components2.default,
          ignoreIncludes: true
        }));
      }

      return this.context.processing(mjml, this.context);
    }
  }]);
  return Component;
}(), _class.defaultAttributes = {}, _temp);

var BodyComponent = function (_Component) {
  (0, _inherits3.default)(BodyComponent, _Component);

  function BodyComponent() {
    (0, _classCallCheck3.default)(this, BodyComponent);
    return (0, _possibleConstructorReturn3.default)(this, (BodyComponent.__proto__ || (0, _getPrototypeOf2.default)(BodyComponent)).apply(this, arguments));
  }

  (0, _createClass3.default)(BodyComponent, [{
    key: 'getStyles',

    // eslint-disable-next-line class-methods-use-this
    value: function getStyles() {
      return {};
    }
  }, {
    key: 'getShorthandAttrValue',
    value: function getShorthandAttrValue(attribute, direction) {
      var mjAttributeDirection = this.getAttribute(attribute + '-' + direction);
      var mjAttribute = this.getAttribute(attribute);

      if (mjAttributeDirection) {
        return parseInt(mjAttributeDirection, 10);
      }

      if (!mjAttribute) {
        return 0;
      }

      return (0, _shorthandParser2.default)(mjAttribute, direction);
    }
  }, {
    key: 'getShorthandBorderValue',
    value: function getShorthandBorderValue(direction) {
      var borderDirection = direction && this.getAttribute('border-' + direction);
      var border = this.getAttribute('border');

      return (0, _shorthandParser.borderParser)(borderDirection || border || '0', 10);
    }
  }, {
    key: 'getBoxWidths',
    value: function getBoxWidths() {
      var containerWidth = this.context.containerWidth;

      var parsedWidth = parseInt(containerWidth, 10);

      var paddings = this.getShorthandAttrValue('padding', 'right') + this.getShorthandAttrValue('padding', 'left');

      var borders = this.getShorthandBorderValue('right') + this.getShorthandBorderValue('left');

      return {
        totalWidth: parsedWidth,
        borders: borders,
        paddings: paddings,
        box: parsedWidth - paddings - borders
      };
    }
  }, {
    key: 'htmlAttributes',
    value: function htmlAttributes(attributes) {
      var _this2 = this;

      var specialAttributes = {
        style: function style(v) {
          return _this2.styles(v);
        },
        default: _lodash.identity
      };

      return (0, _lodash.reduce)(attributes, function (output, v, name) {
        var value = (specialAttributes[name] || specialAttributes.default)(v);

        if (!(0, _lodash.isNil)(value)) {
          return output + ' ' + name + '="' + value + '"';
        }

        return output;
      }, '');
    }
  }, {
    key: 'styles',
    value: function styles(_styles) {
      var stylesObject = void 0;

      if (_styles) {
        if (typeof _styles === 'string') {
          stylesObject = (0, _lodash.get)(this.getStyles(), _styles);
        } else {
          stylesObject = _styles;
        }
      }

      return (0, _lodash.reduce)(stylesObject, function (output, value, name) {
        if (!(0, _lodash.isNil)(value)) {
          return '' + output + name + ':' + value + ';';
        }
        return output;
      }, '');
    }
  }, {
    key: 'renderChildren',
    value: function renderChildren(childrens) {
      var _this3 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _options$props = options.props,
          props = _options$props === undefined ? {} : _options$props,
          _options$renderer = options.renderer,
          renderer = _options$renderer === undefined ? function (component) {
        return component.render();
      } : _options$renderer,
          _options$attributes = options.attributes,
          attributes = _options$attributes === undefined ? {} : _options$attributes,
          _options$rawXML = options.rawXML,
          rawXML = _options$rawXML === undefined ? false : _options$rawXML;


      childrens = childrens || this.props.children;

      if (rawXML) {
        return childrens.map(function (child) {
          return (0, _jsonToXML2.default)(child);
        }).join('\n');
      }

      var sibling = childrens.length;

      var rawComponents = (0, _lodash.filter)(_components2.default, function (c) {
        return c.isRawElement();
      });
      var nonRawSiblings = childrens.filter(function (child) {
        return !(0, _lodash.find)(rawComponents, function (c) {
          return c.getTagName() === child.tagName;
        });
      }).length;

      var output = '';
      var index = 0;

      (0, _lodash.forEach)(childrens, function (children) {
        var component = (0, _components.initComponent)({
          name: children.tagName,
          initialDatas: (0, _extends3.default)({
            userContext: _this3.props.userContext
          }, children, {
            attributes: (0, _extends3.default)({}, attributes, children.attributes),
            context: _this3.getChildContext(),
            props: (0, _extends3.default)({}, props, {
              first: index === 0,
              index: index,
              last: index + 1 === sibling,
              sibling: sibling,
              nonRawSiblings: nonRawSiblings
            })
          })
        });

        if (component !== null) {
          output += renderer(component);
        }

        index++; // eslint-disable-line no-plusplus
      });

      return output;
    }
  }]);
  return BodyComponent;
}(Component);

exports.BodyComponent = BodyComponent;

var HeadComponent = exports.HeadComponent = function (_Component2) {
  (0, _inherits3.default)(HeadComponent, _Component2);

  function HeadComponent() {
    (0, _classCallCheck3.default)(this, HeadComponent);
    return (0, _possibleConstructorReturn3.default)(this, (HeadComponent.__proto__ || (0, _getPrototypeOf2.default)(HeadComponent)).apply(this, arguments));
  }

  (0, _createClass3.default)(HeadComponent, [{
    key: 'handlerChildren',
    value: function handlerChildren() {
      var _this5 = this;

      var childrens = this.props.children;

      return childrens.map(function (children) {
        var component = (0, _components.initComponent)({
          name: children.tagName,
          initialDatas: (0, _extends3.default)({}, children, {
            userContext: _this5.props.userContext,
            context: _this5.getChildContext()
          })
        });

        if (!component) {
          // eslint-disable-next-line no-console
          console.error('No matching component for tag : ' + children.tagName);
          return null;
        }

        if (component.handler) {
          component.handler();
        }

        if (component.render) {
          return component.render();
        }
        return null;
      });
    }
  }], [{
    key: 'getTagName',
    value: function getTagName() {
      return (0, _lodash.kebabCase)(this.name);
    }
  }]);
  return HeadComponent;
}(Component);