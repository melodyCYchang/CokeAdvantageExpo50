"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));

var _Item = _interopRequireDefault(require("./Item"));

var _ConfigContext = require("./ConfigContext");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const List = ({
  children,
  editing,
  onDragEnd
}) => {
  const config = (0, _react.useContext)(_ConfigContext.ConfigContext);
  const {
    SIZE,
    COL
  } = config;
  const scrollY = (0, _reactNativeReanimated.useSharedValue)(0);
  const scrollView = (0, _reactNativeReanimated.useAnimatedRef)();
  const positions = (0, _reactNativeReanimated.useSharedValue)(Object.assign({}, ...children.map((child, index) => ({
    [child.props.id]: index
  }))));
  const onScroll = (0, _reactNativeReanimated.useAnimatedScrollHandler)({
    onScroll: ({
      contentOffset: {
        y
      }
    }) => {
      scrollY.value = y;
    }
  });
  return /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.ScrollView, {
    onScroll: onScroll,
    ref: scrollView,
    contentContainerStyle: {
      height: Math.ceil(children.length / COL) * SIZE
    },
    showsVerticalScrollIndicator: false,
    bounces: false,
    scrollEventThrottle: 16
  }, children.map(child => {
    return /*#__PURE__*/_react.default.createElement(_Item.default, {
      key: child.props.id,
      positions: positions,
      id: child.props.id,
      editing: editing,
      onDragEnd: onDragEnd,
      scrollView: scrollView,
      scrollY: scrollY
    }, child);
  }));
};

var _default = List;
exports.default = _default;
//# sourceMappingURL=SortableGrid.js.map