export const findFoldersByTermID = (obj: Array<any>, termID: number) => {
  if (!obj) return false;
  let term = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key].term_id === termID) {
      console.log('term_id::: ', obj[key]);

      term = obj[key];
    }
  });

  return term;
};
