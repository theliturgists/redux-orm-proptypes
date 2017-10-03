'use strict';

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _propTypes = require('prop-types');

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('PropTypesMixin', function () {
    var Model = void 0;
    var ModelWithMixin = void 0;
    var modelInstance = void 0;
    var createSpy = void 0;
    var updateSpy = void 0;
    var consoleErrorSpy = void 0;

    beforeEach(function () {
        Model = function () {
            function Model() {
                (0, _classCallCheck3.default)(this, Model);
            }

            Model.create = function create() {};

            Model.prototype.update = function update() {}; // eslint-disable-line class-methods-use-this


            Model.prototype.getClass = function getClass() {
                return this.constructor;
            };

            return Model;
        }();

        createSpy = jest.spyOn(Model, 'create');

        ModelWithMixin = (0, _index2.default)(Model);
        ModelWithMixin.modelName = 'ModelWithMixin';

        modelInstance = new ModelWithMixin();
        updateSpy = jest.spyOn(modelInstance, 'update');
        consoleErrorSpy = jest.spyOn(global.console, 'error');
        consoleErrorSpy.mockReset();
    });

    it('getPropTypesMixin works correctly', function () {
        var mixin = (0, _index.getPropTypesMixin)();
        expect(mixin).toBeInstanceOf(Function);

        var result = mixin(Model);
        expect(result).toBeInstanceOf(Function);
        expect((0, _getPrototypeOf2.default)(result)).toEqual(Model);
    });

    it('mixin correctly returns a class', function () {
        expect(ModelWithMixin).toBeInstanceOf(Function);
        expect((0, _getPrototypeOf2.default)(ModelWithMixin)).toEqual(Model);
    });

    it('correctly delegates to superclass create', function () {
        var arg = {};
        ModelWithMixin.create(arg);

        expect(createSpy.mock.calls.length).toBe(1);
        expect(createSpy).toBeCalledWith(arg);
    });

    it('correctly delegates to superclass update', function () {
        var arg = {};
        modelInstance.update(arg);

        expect(updateSpy.mock.calls.length).toBe(1);
        expect(updateSpy).toBeCalledWith(arg);
    });

    it('raises validation error on create correctly', function () {
        ModelWithMixin.propTypes = {
            name: _propTypes.PropTypes.string.isRequired
        };

        ModelWithMixin.create({ name: 'shouldnt raise error' });
        expect(consoleErrorSpy.mock.calls.length).toBe(0);

        ModelWithMixin.create({ notName: 'asd' });
        expect(consoleErrorSpy.mock.calls.length).toBe(1);
        expect(consoleErrorSpy).toBeCalledWith('Warning: Failed prop type: The prop `name` is marked as required in `ModelWithMixin.create`, but its value is `undefined`.');
    });

    it('raises validation error on update correctly', function () {
        ModelWithMixin.propTypes = {
            name: _propTypes.PropTypes.string.isRequired,
            age: _propTypes.PropTypes.number.isRequired
        };
        expect(consoleErrorSpy.mock.calls.length).toBe(0);
        var instance = new ModelWithMixin({ name: 'asd', age: 123 });
        expect(consoleErrorSpy.mock.calls.length).toBe(0);

        instance.update({ name: 123 });

        expect(consoleErrorSpy.mock.calls.length).toBe(1);
        expect(consoleErrorSpy).toBeCalledWith('Warning: Failed prop type: Invalid prop `name` of type `number` supplied to `ModelWithMixin.update`, expected `string`.');
    });

    it('correctly uses defaultProps', function () {
        ModelWithMixin.propTypes = {
            name: _propTypes.PropTypes.string.isRequired,
            age: _propTypes.PropTypes.number.isRequired,
            isFetching: _propTypes.PropTypes.bool.isRequired
        };
        ModelWithMixin.defaultProps = {
            isFetching: false
        };

        var createArg = { name: 'Tommi', age: 25 };

        ModelWithMixin.create(createArg);
        expect(createSpy.mock.calls.length).toBe(1);
        expect(createSpy).toBeCalledWith(expect.objectContaining({ name: 'Tommi', isFetching: false }));
    });
});