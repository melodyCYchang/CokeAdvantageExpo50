/**
 *
 * @param firstKey
 * @param secondKey
 * @param direction
 * @returns
 */

const sortByKeys =
  (firstKey = 'weight', secondKey = 'name', direction = 'asc') =>
  (a: any, b: any): number => {
    if (a[firstKey] === b[firstKey]) {
      if (a[secondKey] === b[secondKey]) return 0;
      if (a[secondKey] < b[secondKey]) return direction === 'asc' ? -1 : 1;
      return direction === 'asc' ? 1 : -1;
    }
    if (a[firstKey] === b[firstKey]) return 0;
    if (a[firstKey] < b[firstKey]) return direction === 'asc' ? -1 : 1;
    return direction === 'asc' ? 1 : -1;
  };

export default sortByKeys;
