// import FormData from 'form-data';
import assert from 'assert';
import { Dispatch } from 'redux';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';

import { RootState } from '../redux/store';
import getImageDimentions from '../utils/getImageDimentions';
import { wpApi } from '../services/wpApi';
import { UploadMockupResponse } from '../types/UploadMockupResponse';
import { CreateMockupPayload } from '../types/CreateMockupPayload';
import { UploadMockupPayload } from '../types/UploadMockupPayload';

const uploadMockupAsync =
  (
    user: any,
    imgId: number,
    imageUri: string,
    companyName: string,
    machineList: any
  ) =>
  async (dispatch: Dispatch<any>, getState: () => RootState) => {
    // Image.getSize(imageUri, async (width, height) => {
    console.log('🚀 ~ file: uploadMockupAsync.ts ~ line 17 ~ imgId', imgId);

    const { width, height } = await getImageDimentions(imageUri);
    const resize: { width?: number; height?: number } =
      width > height ? { width: 1024 } : { height: 1024 };

    const manipResult = await manipulateAsync(imageUri, [{ resize }], {
      compress: 1,
      format: SaveFormat.JPEG,
    });
    // console.log(
    //   '🚀 ~ file: uploadMockupAsync.ts ~ line 21 ~ //Image.getSize ~ manipResult',
    //   manipResult
    // );
    // console.log("🚀 ~ file: uploadMockupAsync.ts ~ line 14 ~ machineList", machineList);

    const uploadPayload = new FormData();
    const filename = manipResult.uri.split('/').pop();

    uploadPayload.append('files.image', {
      uri: manipResult.uri,
      name: filename,
      type: 'image/jpg',
    });
    uploadPayload.append(
      'data',
      JSON.stringify({
        name: companyName,
        owner: user?.strapiID,
        stickerPlacement: JSON.stringify(machineList),
      })
    );
    // console.log(
    //   '🚀 ~ file: uploadMockupAsync.ts ~ line 39 ~ //Image.getSize ~ user?.id',
    //   user?.strapiID
    // );

    const createPayload: UploadMockupPayload = {
      form: uploadPayload,
    };

    let uploadResults;
    // Trigger manually
    if (imgId) {
      createPayload.id = imgId;

      uploadResults = await dispatch(
        wpApi.endpoints.updateMockup.initiate(createPayload)
        // { track: true }
      );
    } else {
      uploadResults = await dispatch(
        wpApi.endpoints.uploadMockup.initiate(createPayload)
        // { track: true }
      );
    }

    if (uploadResults?.error?.message)
      throw new Error(uploadResults.error.message);
    console.log(
      '🚀 ~ file: uploadMockupAsync.ts ~ line 46 ~ //Image.getSize ~ uploadResults',
      uploadResults
    );

    assert(uploadResults?.data?.id, uploadResults?.error?.error);

    // const photo: UploadMockupResponse = uploadResults.data;

    // const createPayload: CreateMockupPayload = {
    //   appToken: user?.appToken,
    //   userId: user?.id,
    //   photo_url: photo.photo_url,
    //   photo_id: photo.photo_id,
    //   company_name: companyName,
    //   machine_positioning: JSON.stringify(machineList),
    // };
    // console.log(
    //   '🚀 ~ file: uploadMockupAsync.ts ~ line 70 ~ //Image.getSize ~ createPayload',
    //   createPayload
    // );

    // // Trigger manually
    // const createResults = await dispatch(
    //   wpApi.endpoints.createMockup.initiate(createPayload)
    //   // { track: true }
    // );
    // if (createResults?.error?.message)
    //   throw new Error(createResults.error.message);
    // console.log(
    //   '🚀 ~ file: uploadMockupAsync.ts ~ line 46 ~ //Image.getSize ~ createResults',
    //   createResults
    // );

    // assert(createResults?.data?.photo_id, 'invalid response');

    // const uploadResultsData = await fetch(
    //   'https://swiretoolkit.com/api/mockups/upload',
    //   {
    //     // headers: {
    //     //   'Content-Type': 'multipart/form-data',
    //     //   Accept: 'application/json',
    //     //   // Accept: '*/*',
    //     // },
    //     method: 'POST',
    //     body: uploadPayload,
    //   }
    // );

    // const uploadResults = await uploadResultsData.json();

    // assert(uploadResults?.data?.photo_id, 'photo_id not returned');
    // assert(uploadResults?.data?.photo_url, 'photo_url not returned');

    // const createPayload = {
    //   appToken: user?.appToken,
    //   userId: user?.id,
    //   photo_url: uploadResults?.data?.photo_url,
    //   photo_id: uploadResults?.data?.photo_id,
    //   company_name: companyName,
    //   machine_positioning: [],
    // };

    // const uploadResultsData = await fetch(
    //   'https://swiretoolkit.com/api/mockups/upload',
    //   {
    //     // headers: {
    //     //   'Content-Type': 'multipart/form-data',
    //     //   Accept: 'application/json',
    //     //   // Accept: '*/*',
    //     // },
    //     method: 'POST',
    //     body: uploadPayload,
    //   }
    // );

    // const uploadResults = await uploadResultsData.json();

    // const uploadResults: any = await uploadMockup(uploadPayload);

    // console.log(
    //   '🚀 ~ file: SaveMockupScreen.tsx ~ line 76 ~ Image.getSize ~ uploadResults',
    //   uploadResults
    // );

    return uploadResults;
  };

export default uploadMockupAsync;
