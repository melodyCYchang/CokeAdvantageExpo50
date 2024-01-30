export const searchResult = (obj: Array<any>, searchText: string) => {
  if (!obj) return false;
  const temp = new Array<any>();

  for (let i = 0; i < obj.length; i++) {
    if (obj[i]?.name?.toLowerCase()?.includes(searchText.toLowerCase())) {
      temp.push(obj[i]);
    }
  }

  return temp;
};
