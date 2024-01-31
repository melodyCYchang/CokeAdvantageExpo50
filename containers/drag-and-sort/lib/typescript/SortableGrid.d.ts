import { ReactElement } from 'react';
interface Positions {
    [id: string]: number;
}
interface ListProps {
    children: ReactElement<{
        id: string;
    }>[];
    editing: boolean;
    onDragEnd: (diff: Positions) => void;
}
declare const List: ({ children, editing, onDragEnd }: ListProps) => JSX.Element;
export default List;
