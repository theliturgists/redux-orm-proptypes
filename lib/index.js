'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

exports.getPropTypesMixin = getPropTypesMixin;

var _propTypes = require('prop-types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function hasPropTypes(obj) {
    return (0, _typeof3.default)(obj.propTypes) === 'object';
}

function hasDefaultProps(obj) {
    return (0, _typeof3.default)(obj.defaultProps) === 'object';
}

function getPropTypesMixin(userOpts) {
    var opts = userOpts || {};

    var useValidation = void 0;

    if (Object.prototype.hasOwnProperty.call(opts, 'validate')) {
        useValidation = opts.validate;
    } else if (process) {
        useValidation = process.env.NODE_ENV !== 'production';
    } else {
        useValidation = true;
    }

    var useDefaults = Object.prototype.hasOwnProperty.call(opts, 'useDefaults') ? opts.useDefaults : true;

    return function (superclass) {
        return function (_superclass) {
            (0, _inherits3.default)(_class, _superclass);

            function _class() {
                (0, _classCallCheck3.default)(this, _class);
                return (0, _possibleConstructorReturn3.default)(this, _superclass.apply(this, arguments));
            }

            _class.create = function create() {
                var _superclass$create;

                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                var props = args[0],
                    rest = args.slice(1);


                var defaults = useDefaults && hasDefaultProps(this) ? this.defaultProps : {};

                var propsWithDefaults = (0, _assign2.default)({}, defaults, props);

                if (useValidation && hasPropTypes(this)) {
                    _propTypes.PropTypes.checkPropTypes(this.propTypes, propsWithDefaults, 'prop', this.modelName + '.create');
                }

                return (_superclass$create = _superclass.create).call.apply(_superclass$create, [this, propsWithDefaults].concat((0, _toConsumableArray3.default)(rest)));
            };

            _class.prototype.update = function update() {
                var _superclass$prototype;

                var modelClass = this.getClass();

                for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    args[_key2] = arguments[_key2];
                }

                if (useValidation && hasPropTypes(modelClass)) {
                    var props = args[0];

                    var propTypes = modelClass.propTypes,
                        modelName = modelClass.modelName;

                    // Run validators for only the props passed in, not
                    // all declared PropTypes.

                    var propTypesToValidate = (0, _keys2.default)(props).reduce(function (result, key) {
                        if (Object.prototype.hasOwnProperty.call(propTypes, key)) {
                            return (0, _extends4.default)({}, result, (0, _defineProperty3.default)({}, key, propTypes[key]));
                        }
                        return result;
                    }, {});
                    _propTypes.PropTypes.checkPropTypes(propTypesToValidate, props, 'prop', modelName + '.update');
                }

                return (_superclass$prototype = _superclass.prototype.update).call.apply(_superclass$prototype, [this].concat(args));
            };

            return _class;
        }(superclass);
    };
}

exports.default = getPropTypesMixin();