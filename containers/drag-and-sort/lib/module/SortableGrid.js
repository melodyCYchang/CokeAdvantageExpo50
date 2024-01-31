import React, { useContext } from 'react';
import Animated, { useAnimatedRef, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import Item from './Item';
import { ConfigContext } from './ConfigContext';

const List = ({
  children,
  editing,
  onDragEnd
}) => {
  const config = useContext(ConfigContext);
  const {
    SIZE,
    COL
  } = config;
  const scrollY = useSharedValue(0);
  const scrollView = useAnimatedRef();
  const positions = useSharedValue(Object.assign({}, ...children.map((child, index) => ({
    [child.props.id]: index
  }))));
  const onScroll = useAnimatedScrollHandler({
    onScroll: ({
      contentOffset: {
        y
      }
    }) => {
      scrollY.value = y;
    }
  });
  return /*#__PURE__*/React.createElement(Animated.ScrollView, {
    onScroll: onScroll,
    ref: scrollView,
    contentContainerStyle: {
      height: Math.ceil(children.length / COL) * SIZE
    },
    showsVerticalScrollIndicator: false,
    bounces: false,
    scrollEventThrottle: 16
  }, children.map(child => {
    return /*#__PURE__*/React.createElement(Item, {
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

export default List;
//# sourceMappingURL=SortableGrid.js.map