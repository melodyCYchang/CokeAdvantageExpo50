import { Image } from 'react-native';

const getImageDimentions = (
  imageUri: string
): Promise<{ width: number; height: number }> =>
  new Promise((resolve, reject) =>
    Image.getSize(imageUri, async (width, height) => {
      resolve({ width, height });
    })
  );

export default getImageDimentions;
