"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SortableContainer;

var _ConfigContext = require("./ConfigContext");

var _react = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function SortableContainer({
  children,
  customconfig
}) {
  const {
    width
  } = _reactNative.Dimensions.get('window');

  const [config] = (0, _react.useState)({
    MARGIN: 8,
    COL: 4,
    SIZE: width / 4 - 8,
    getPosition: _ConfigContext.getPosition,
    getOrder: _ConfigContext.getOrder
  });
  const joint = { ...customconfig,
    getPosition: _ConfigContext.getPosition,
    getOrder: _ConfigContext.getOrder
  };
  return /*#__PURE__*/_react.default.createElement(_ConfigContext.ConfigContext.Provider, {
    value: !customconfig ? joint : config
  }, children);
}
//# sourceMappingURL=SortableContainer.js.map