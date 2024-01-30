export const findQuicklinkByTermId = (obj: Array<any>, termID: number) => {
  if (!obj) return false;

  for (let i = 0; i < obj.length; i++) {
    if (obj[i].termID === termID) {
      return obj[i];
    }
    if (obj[i].childFolders) {
      const result = findQuicklinkByTermId(obj[i].childFolders, termID);
      if (result) {
        return result;
      }
    }
  }
  return false;
};
