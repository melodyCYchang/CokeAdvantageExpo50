import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { Dispatch } from "react";
// import { createDuck, FSA } from "redux-duck";
// import { AnyAction } from "redux";

export const loginSlice = createSlice({
  name: 'login',
  initialState: {
    email: '',
    password: '',
    rememberMe: false,
  },
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    resetCred: (state) => {
      state.email = '';
      state.password = '';
      state.rememberMe = false;
    },
    setRememberMe: (state, action: PayloadAction<boolean>) => {
      state.rememberMe = action.payload;
    },
  },
});

// Selectors
export const getLogin = (state: any) => state.login;

// each case under reducers becomes an action
export const { setPassword, setEmail, resetCred, setRememberMe } =
  loginSlice.actions;

export default loginSlice.reducer;

// export interface CountState {
//   readonly count: number;
// }

// const initialState: CountState = { count: 0 };
// function sleep(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// const countDuck = createDuck("count", "my-app");

// const ADD = countDuck.defineType("ADD");
// const INC = countDuck.defineType("INC");
// const DEC = countDuck.defineType("DEC");
// const RESET = countDuck.defineType("RESET");

// // Selectors
// export const getCount = (state: any) => state.count.count;

// export const addCount = countDuck.createAction(ADD);
// export const incCount = countDuck.createAction(INC);
// export const decCount = countDuck.createAction(DEC);
// export const resetCount = countDuck.createAction(RESET);

// export const countToTen = async () => {
//   return async (dispatch: Dispatch<any>): Promise<number> => {
//     let i = 0;
//     dispatch(resetCount());
//     while (i < 10) {
//       // eslint-disable-next-line no-await-in-loop
//       await sleep(200);
//       dispatch(incCount());
//       i += 1;
//     }
//     return i;
//   };
// };

// type AddCountAction = FSA<{ amount: number }>;

// const reducer = countDuck.createReducer<CountState>(
//   {
//     [ADD]: (
//       state: CountState,
//       { payload: { amount } }: AddCountAction
//     ): CountState => {
//       return { ...state, count: state.count + amount };
//     },
//     [INC]: (state: CountState): CountState => ({
//       ...state,
//       count: state.count + 1,
//     }),
//     [DEC]: (state: CountState): CountState => ({
//       ...state,
//       count: state.count - 1,
//     }),
//     [RESET]: (): CountState => initialState,
//   },
//   initialState
// );

// export default reducer;

// // Action Types

// export enum CountActions {
//   ADD = 'my-app/count/ADD',
//   INC = 'my-app/count/INC',
//   DEC = 'my-app/count/DEC',
//   RESET = 'my-app/count/RESET',
// }

// type CountAction =
//   | FSA<
//       CountActions.ADD,
//       {
//         readonly amount: number;
//       }
//     >
//   | FSA<CountActions.INC>
//   | FSA<CountActions.DEC>
//   | FSA<CountActions.RESET>;

// // type CountDuckBuilder = DuckBuilder<CountAction>;

// // Duck Builders

// const countBuilder = createDuck('count', 'my-app');

// type AddCountAction = Action<string> & {
//   payload?: { amount: number };
// };

// export default countBuilder.createReducer<CountState>(
//   {
//     [CountActions.ADD]: (state, { payload: { amount } }: AddCountAction) => {
//       return { ...state, count: state.count + amount };
//     },
//     [CountActions.INC]: (state, action) => ({
//       ...state,
//       count: state.count + 1,
//     }),
//     [CountActions.DEC]: (state, action) => ({
//       ...state,
//       count: state.count - 1,
//     }),
//     [CountActions.RESET]: (state, action) => initialState,
//   },
//   initialState
// );

// // const INC = countDuck.defineType('INC');
// // const DEC = countDuck.defineType('DEC');
// // const RESET = countDuck.defineType('RESET');

// export const addCount = countBuilder.createAction(CountActions.ADD);
// export const incCount = countBuilder.createAction(CountActions.INC);
// export const decCount = countBuilder.createAction(CountActions.DEC);
// export const resetCount = countBuilder.createAction(CountActions.RESET);

// export async function countToTen() {
//   return async (dispatch: Dispatch<CountActions>): Promise<number> => {
//     let i = 0;
//     dispatch(resetCount());
//     while (i < 10) {
//       // eslint-disable-next-line no-await-in-loop
//       await sleep(200);
//       dispatch(incCount());
//       i += 1;
//     }
//     return i;
//   };
// }

// const reducer = countDuck.createReducer(
//   {
//     [INC]: (state, action) => ({ ...state, count: state.count + 1 }),
//     [DEC]: (state, action) => ({ ...state, count: state.count - 1 }),
//     [RESET]: (state, action) => initialState,
//   },
//   initialState
// );

// export default reducer;

// export interface CountState {
//   count: number;
// }

// interface CountAction {
//   type?: string;
// }

// export type CountActionTypes = CountAction;

// extensable-ducks

// export default new Duck({
//   namespace: 'my-app',
//   store: 'count',
//   types: ['INC', 'DEC', 'RESET'],
//   initialState,
//   reducer: (state, action, duck) => {
//     switch (action.type) {
//       case duck.types.INC:
//         console.log(duck, state);
//         return { ...state, count: state.count + 1 };
//       case duck.types.DEC:
//         return { ...state, count: state.count - 1 };
//       case duck.types.RESET:
//         return { ...state, count: 0 };
//       default:
//         return state;
//     }
//   },
//   selectors: {
//     count: (state) => state.count.count,
//   },
//   creators: (duck) => ({
//     incCount: () => ({ type: duck.types.INC }),
//     decCount: () => ({ type: duck.types.DEC }),
//     resetCount: () => ({ type: duck.types.RESET }),
//     countToTen: async () => {
//       return async (dispatch: Dispatch<any>): Promise<number> => {
//         let i = 0;
//         console.log('🚀 ~ file: countDuck.ts ~ line 51 ~ duck', duck);
//         dispatch(duck.creators.resetCount());
//         while (i < 10) {
//           // eslint-disable-next-line no-await-in-loop
//           await sleep(200);
//           dispatch(duck.creators.incCount());
//           i += 1;
//         }
//         return i;
//       };
//     },
//   }),
//   sagas: (duck) => ({}),
// });

// BASE REDUX

// const INC = 'my-app/count/INC';
// const DEC = 'my-app/count/DEC';
// const RESET = 'my-app/count/RESET';

// // interface SendMessageAction {
// //   type: typeof INC
// //   payload: Message
// // }

// // Reducer
// export default function reducer(
//   state = initialState,
//   action: CountActionTypes = {}
// ): CountState {
//   switch (action.type) {
//     case INC:
//       return { ...state, count: state.count + 1 };
//     case DEC:
//       return { ...state, count: state.count - 1 };
//     case RESET:
//       return { ...state, count: 0 };
//     default:
//       return state;
//   }
// }

// // Action Creators
// export function incCount(): AnyAction {
//   return { type: INC };
// }
// export function decCount(): AnyAction {
//   return { type: DEC };
// }
// export function resetCount(): AnyAction {
//   return { type: RESET };
// }

// // side effects, only as applicable
// // e.g. thunks, epics, etc
// export async function countToTen() {
//   return async (dispatch: Dispatch<any>): Promise<number> => {
//     let i = 0;
//     dispatch(resetCount());
//     while (i < 10) {
//       // eslint-disable-next-line no-await-in-loop
//       await sleep(200);
//       dispatch(incCount());
//       i += 1;
//     }
//     return i;
//   };
// }
