import { ReactElement } from 'react';
export interface Positions {
    [id: string]: number;
}
interface SortableContainerProps {
    children: ReactElement;
    customconfig?: {
        MARGIN: number;
        COL: number;
        SIZE: number;
    };
}
export default function SortableContainer({ children, customconfig, }: SortableContainerProps): JSX.Element;
export {};
