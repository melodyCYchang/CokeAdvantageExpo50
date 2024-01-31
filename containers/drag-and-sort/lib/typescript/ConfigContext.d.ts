/// <reference types="react" />
export declare const width: number;
export declare const getPosition: (config: any, order: number) => {
    x: number;
    y: number;
};
export declare const getOrder: (config: any, tx: number, ty: number, max: number) => number;
export declare const ConfigContext: import("react").Context<{
    MARGIN: number;
    COL: number;
    SIZE: number;
    getPosition: (config: any, order: number) => {
        x: number;
        y: number;
    };
    getOrder: (config: any, tx: number, ty: number, max: number) => number;
}>;
export interface Positions {
    [id: string]: number;
}
export declare const animationConfig: {
    easing: (value: number) => number;
    duration: number;
};
