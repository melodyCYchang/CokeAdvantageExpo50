import {
  AnyAction,
  createSlice,
  Dispatch,
  PayloadAction,
} from '@reduxjs/toolkit';
import * as FileSystem from 'expo-file-system';

import { RootState } from './store';
// import { Dispatch } from "react";
// import { createDuck, FSA } from "redux-duck";
// import { AnyAction } from "redux";

const initialState: {
  downloads: any;
  confirmDeleteId: null | string;
  downloading: any;
  error: string;
} = {
  downloads: {},
  confirmDeleteId: null,
  downloading: {},
  error: '',
};

export const downloadsSlice = createSlice({
  name: 'downloads',
  initialState,
  reducers: {
    setDownloads: (state, action: PayloadAction<any>) => {
      state.downloads = action.payload;
    },
    setConfirmDeleteId: (state, action: PayloadAction<null | string>) => {
      state.confirmDeleteId = action.payload;
    },
    setDownloadError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setDownloading: (state, action: PayloadAction<string>) => {
      state.downloading[action.payload] = true;
    },
    stopDownloading: (state, action: PayloadAction<string>) => {
      delete state.downloading[action.payload];
    },
    // setPassword: (state, action: PayloadAction<string>) => {
    //   state.password = action.payload;
    // },
    resetDownloads: (state) => {
      state = initialState;
    },
    // setRememberMe: (state, action: PayloadAction<boolean>) => {
    //   state.rememberMe = action.payload;
    // },
  },
});

// Selectors
export const getDownloads = (state: RootState) => state.downloads.downloads;
export const getDownloading = (state: RootState) => state.downloads.downloading;
export const getConfirmDeleteId = (state: RootState) =>
  state.downloads.confirmDeleteId;

// each case under reducers becomes an action
export const {
  setDownloads,
  setDownloadError,
  setDownloading,
  stopDownloading,
  resetDownloads,
} = downloadsSlice.actions;

export default downloadsSlice.reducer;

export const getDownloadUrl = (file: any) => file?.video || file.media.url;
export const getDownloadId = (file: any) => file?.id?.toString();
export const getDownloadFilename = (file: any) =>
  getDownloadUrl(file).split('/').pop();

export const getDownloadPath = async (file: any) => {
  const dir = await FileSystem.getInfoAsync(
    `${FileSystem.documentDirectory}${getDownloadId(file)}`
  );
  if (!dir.exists) {
    await FileSystem.makeDirectoryAsync(
      `${FileSystem.documentDirectory}${getDownloadId(file)}`
    );
  }
  return `${FileSystem.documentDirectory}${getDownloadId(
    file
  )}/${getDownloadFilename(file)}`;
};

// Async Functions
export const downloadFile =
  (file: any) => async (dispatch: Dispatch<any>, getState: () => RootState) => {
    const state = getState();
    const existingDownloads: any = state.downloads.downloads;
    console.log(
      '🚀 ~ file: downloads.ts ~ line 51 ~ return ~ existingDownloads',
      existingDownloads
    );
    console.log(
      '🚀 ~ file: FilesTile.tsx ~ line 46 ~ handleDownload ~ file',
      file
    );

    const id = getDownloadId(file);
    const filename = getDownloadFilename(file);
    const url = getDownloadUrl(file);
    const destinationPath = await getDownloadPath(file);
    if (filename) {
      if (existingDownloads[id]) {
        dispatch(setDownloadError(''));
        dispatch(stopDownloading(id));
        return existingDownloads[id];
      }

      dispatch(setDownloadError(''));
      dispatch(setDownloading(id));
      try {
        console.log(`downloading ${url} to ${destinationPath} as ${filename}`);

        const uri = await FileSystem.downloadAsync(url, destinationPath);
        console.log('🚀 ~ file: downloads.ts ~ line 83 ~ uri', uri);

        const newDownloads = { ...existingDownloads };
        newDownloads[id] = { ...file, localFile: destinationPath };
        dispatch(setDownloads(newDownloads));
        dispatch(stopDownloading(id));

        return newDownloads[id];
      } catch (err: any) {
        dispatch(setDownloadError(err.message));
        dispatch(stopDownloading(id));
      }
    }

    // const downloaded = await FileSystem.getInfoAsync(
    //   `${FileSystem.documentDirectory}${filename}`
    // );

    // if (downloaded.exists === false) {
    //   const uri = await FileSystem.downloadAsync(
    //     downloadPath,
    //     `${FileSystem.documentDirectory}${filename}`
    //   );
    //   console.log('Finished downloading to ', uri);
    // } else {
    //   console.log('file already downloaded');
    // }
  };

export const deleteDownloadFile =
  (file: any) => async (dispatch: Dispatch<any>, getState: () => RootState) => {
    console.log('🚀 ~ file: downloads.ts ~ line 153 ~ file', file);
    const state = getState();
    const existingDownloads: any = state.downloads.downloads;

    const id = getDownloadId(file);
    const filename = getDownloadFilename(file);
    const url = getDownloadUrl(file);
    const destinationPath = await getDownloadPath(file);
    if (filename) {
      dispatch(setDownloadError(''));
      if (!existingDownloads[id]) {
        dispatch(stopDownloading(id));
        return destinationPath;
      }

      dispatch(setDownloading(id));
      try {
        console.log(`deleting ${destinationPath}`);

        await FileSystem.deleteAsync(destinationPath);
        console.log('deleted file');
      } catch (err: any) {
        console.log(`error deleting file ${err.message}`);
        // dispatch(setDownloadError(err.message));
      }

      // always remove from stored data
      const newDownloads = { ...existingDownloads };
      delete newDownloads[id];
      dispatch(setDownloads(newDownloads));
      dispatch(stopDownloading(id));
    }
  };
