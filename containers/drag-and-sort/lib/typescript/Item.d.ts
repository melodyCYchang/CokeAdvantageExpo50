import { ReactNode, RefObject } from 'react';
import Animated from 'react-native-reanimated';
import { Positions } from './ConfigContext';
interface ItemProps {
    children: ReactNode;
    positions: Animated.SharedValue<Positions>;
    id: string;
    editing: boolean;
    onDragEnd: (diffs: Positions) => void;
    scrollView: RefObject<Animated.ScrollView>;
    scrollY: Animated.SharedValue<number>;
}
declare const Item: ({ children, positions, id, onDragEnd, scrollView, scrollY, editing, }: ItemProps) => JSX.Element;
export default Item;
