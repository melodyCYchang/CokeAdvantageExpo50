"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));

var _reactNativeGestureHandler = require("react-native-gesture-handler");

var _ConfigContext = require("./ConfigContext");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const Item = ({
  children,
  positions,
  id,
  onDragEnd,
  scrollView,
  scrollY,
  editing
}) => {
  const config = (0, _react.useContext)(_ConfigContext.ConfigContext);
  const {
    SIZE,
    COL,
    getOrder,
    getPosition
  } = config;
  const containerHeight = _reactNative.Dimensions.get('window').height - 40;
  const contentHeight = Object.keys(positions.value).length / COL * SIZE;
  const isGestureActive = (0, _reactNativeReanimated.useSharedValue)(false);
  const position = getPosition(config, positions.value[id]);
  const translateX = (0, _reactNativeReanimated.useSharedValue)(position.x);
  const translateY = (0, _reactNativeReanimated.useSharedValue)(position.y);
  (0, _reactNativeReanimated.useAnimatedReaction)(() => positions.value[id], newOrder => {
    if (!isGestureActive.value) {
      const pos = getPosition(config, newOrder);
      translateX.value = (0, _reactNativeReanimated.withTiming)(pos.x, _ConfigContext.animationConfig);
      translateY.value = (0, _reactNativeReanimated.withTiming)(pos.y, _ConfigContext.animationConfig);
    }
  });
  const onGestureEvent = (0, _reactNativeReanimated.useAnimatedGestureHandler)({
    onStart: (_, ctx) => {
      // dont allow drag start if we're done editing
      if (editing) {
        ctx.x = translateX.value;
        ctx.y = translateY.value;
        isGestureActive.value = true;
      }
    },
    onActive: ({
      translationX,
      translationY
    }, ctx) => {
      // dont allow drag if we're done editing
      if (editing) {
        translateX.value = ctx.x + translationX;
        translateY.value = ctx.y + translationY; // 1. We calculate where the tile should be

        const newOrder = getOrder(config, translateX.value, translateY.value, Object.keys(positions.value).length - 1); // 2. We swap the positions

        const oldOlder = positions.value[id];

        if (newOrder !== oldOlder) {
          const idToSwap = Object.keys(positions.value).find(key => positions.value[key] === newOrder);

          if (idToSwap) {
            // Spread operator is not supported in worklets
            // And Object.assign doesn't seem to be working on alpha.6
            const newPositions = JSON.parse(JSON.stringify(positions.value));
            newPositions[id] = newOrder;
            newPositions[idToSwap] = oldOlder;
            positions.value = newPositions;
          }
        } // 3. Scroll up and down if necessary


        const lowerBound = scrollY.value;
        const upperBound = lowerBound + containerHeight - SIZE;
        const maxScroll = contentHeight - containerHeight;
        const leftToScrollDown = maxScroll - scrollY.value;

        if (translateY.value < lowerBound) {
          const diff = Math.min(lowerBound - translateY.value, lowerBound);
          scrollY.value -= diff;
          (0, _reactNativeReanimated.scrollTo)(scrollView, 0, scrollY.value, false);
          ctx.y -= diff;
          translateY.value = ctx.y + translationY;
        }

        if (translateY.value > upperBound) {
          const diff = Math.min(translateY.value - upperBound, leftToScrollDown);
          scrollY.value += diff;
          (0, _reactNativeReanimated.scrollTo)(scrollView, 0, scrollY.value, false);
          ctx.y += diff;
          translateY.value = ctx.y + translationY;
        }
      }
    },
    onEnd: () => {
      const newPosition = getPosition(config, positions.value[id]);
      translateX.value = (0, _reactNativeReanimated.withTiming)(newPosition.x, _ConfigContext.animationConfig, () => {
        isGestureActive.value = false;
        (0, _reactNativeReanimated.runOnJS)(onDragEnd)(positions.value);
      });
      translateY.value = (0, _reactNativeReanimated.withTiming)(newPosition.y, _ConfigContext.animationConfig);
    }
  });
  const style = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    const zIndex = isGestureActive.value ? 100 : 0;
    const scale = (0, _reactNativeReanimated.withSpring)(isGestureActive.value ? 1.05 : 1);
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      width: SIZE,
      height: SIZE,
      zIndex,
      transform: [{
        translateX: translateX.value
      }, {
        translateY: translateY.value
      }, {
        scale
      }]
    };
  });
  return /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: style
  }, /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.PanGestureHandler, {
    enabled: editing,
    onGestureEvent: onGestureEvent
  }, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: _reactNative.StyleSheet.absoluteFill
  }, children)));
};

var _default = Item;
exports.default = _default;
//# sourceMappingURL=Item.js.map