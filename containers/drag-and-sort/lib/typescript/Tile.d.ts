import { ReactElement } from 'react';
import { ViewStyle } from 'react-native';
interface TileProps {
    id: string;
    children: ReactElement;
    onLongPress: () => void;
    style?: ViewStyle;
}
declare const Tile: ({ children, style }: TileProps) => JSX.Element;
export default Tile;
