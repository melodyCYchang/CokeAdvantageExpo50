import { ConfigContext } from './ConfigContext';
import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import { getOrder, getPosition } from './ConfigContext';
export default function SortableContainer({
  children,
  customconfig
}) {
  const {
    width
  } = Dimensions.get('window');
  const [config] = useState({
    MARGIN: 8,
    COL: 4,
    SIZE: width / 4 - 8,
    getPosition,
    getOrder
  });
  const joint = { ...customconfig,
    getPosition,
    getOrder
  };
  return /*#__PURE__*/React.createElement(ConfigContext.Provider, {
    value: !customconfig ? joint : config
  }, children);
}
//# sourceMappingURL=SortableContainer.js.map