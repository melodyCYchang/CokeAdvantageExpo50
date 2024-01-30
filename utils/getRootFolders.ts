import { Folder } from '../types/Folder';

export const getRootFolders = (obj: Array<Folder> | undefined): Array<Folder> =>
  obj?.filter((ele: Folder) => ele.folder === null) || [];
