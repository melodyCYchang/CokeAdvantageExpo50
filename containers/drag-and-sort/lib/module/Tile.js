import React, { useContext } from 'react';
import { View } from 'react-native';
import { ConfigContext } from './ConfigContext';

const Tile = ({
  children,
  style
}) => {
  const config = useContext(ConfigContext);
  const {
    SIZE,
    MARGIN
  } = config;
  const container = {
    width: SIZE - MARGIN,
    height: SIZE - MARGIN
  };
  return /*#__PURE__*/React.createElement(View, {
    style: [style, container],
    pointerEvents: "none"
  }, children);
};

export default Tile;
//# sourceMappingURL=Tile.js.map