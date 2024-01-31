import { createContext } from 'react';
import { Dimensions } from 'react-native';
import { Easing } from 'react-native-reanimated';
export const {
  width
} = Dimensions.get('window');
export const getPosition = (config, order) => {
  'worklet';

  return {
    x: order % config.COL * config.SIZE,
    y: Math.floor(order / config.COL) * config.SIZE
  };
};
export const getOrder = (config, tx, ty, max) => {
  'worklet';

  const x = Math.round(tx / config.SIZE) * config.SIZE;
  const y = Math.round(ty / config.SIZE) * config.SIZE;
  const row = Math.max(y, 0) / config.SIZE;
  const col = Math.max(x, 0) / config.SIZE;
  return Math.min(row * config.COL + col, max);
};
export const ConfigContext = /*#__PURE__*/createContext({
  MARGIN: 8,
  COL: 3,
  SIZE: width / 4 - 8,
  getPosition,
  getOrder
});
export const animationConfig = {
  easing: Easing.inOut(Easing.ease),
  duration: 350
};
//# sourceMappingURL=ConfigContext.js.map