export const findChildFoldersByTermID = (termID: number, obj?: Array<any>) => {
  if (!obj) return false;
  const temp = new Array<any>();

  Object.keys(obj).forEach((key) => {
    if (obj[key].parent === termID) {
      temp.push(obj[key]);
    }
  });
  return temp;
};
