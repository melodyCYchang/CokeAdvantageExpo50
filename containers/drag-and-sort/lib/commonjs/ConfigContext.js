"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.animationConfig = exports.ConfigContext = exports.getOrder = exports.getPosition = exports.width = void 0;

var _react = require("react");

var _reactNative = require("react-native");

var _reactNativeReanimated = require("react-native-reanimated");

const {
  width
} = _reactNative.Dimensions.get('window');

exports.width = width;

const getPosition = (config, order) => {
  'worklet';

  return {
    x: order % config.COL * config.SIZE,
    y: Math.floor(order / config.COL) * config.SIZE
  };
};

exports.getPosition = getPosition;

const getOrder = (config, tx, ty, max) => {
  'worklet';

  const x = Math.round(tx / config.SIZE) * config.SIZE;
  const y = Math.round(ty / config.SIZE) * config.SIZE;
  const row = Math.max(y, 0) / config.SIZE;
  const col = Math.max(x, 0) / config.SIZE;
  return Math.min(row * config.COL + col, max);
};

exports.getOrder = getOrder;
const ConfigContext = /*#__PURE__*/(0, _react.createContext)({
  MARGIN: 8,
  COL: 3,
  SIZE: width / 4 - 8,
  getPosition,
  getOrder
});
exports.ConfigContext = ConfigContext;
const animationConfig = {
  easing: _reactNativeReanimated.Easing.inOut(_reactNativeReanimated.Easing.ease),
  duration: 350
};
exports.animationConfig = animationConfig;
//# sourceMappingURL=ConfigContext.js.map