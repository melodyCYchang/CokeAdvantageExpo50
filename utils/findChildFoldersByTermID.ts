export const findChildFoldersByTermID = (obj: Array<any>, termID: number) => {
  if (!obj) return false;
  const temp = new Array<any>();

  Object.keys(obj).forEach((key) => {
    if (obj[key].parent === termID) {
      temp.push(obj[key]);
    }
  });
  return temp;
};
