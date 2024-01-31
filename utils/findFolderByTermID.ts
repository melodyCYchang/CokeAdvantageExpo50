export const findFoldersByTermID = (termID: number, obj?: Array<any>) => {
  if (!obj) return false;
  let term = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key].term_id === termID) {
      console.log("term_id::: ", obj[key]);

      term = obj[key];
    }
  });

  return term;
};
