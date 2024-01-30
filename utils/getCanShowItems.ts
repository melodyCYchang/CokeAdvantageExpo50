import {
  isAfter,
  isBefore,
  parse,
  parseJSON,
  isEqual,
  subDays,
  addDays,
} from 'date-fns';
import { Folder } from '../types/Folder';

const checkDate = (ele: any) => {
  const datenow = new Date();
  // console.log(
  //   '🚀 ~ file: getCanShowItems.ts ~ line 25 ~ checkDate ~ ele?.startDate',
  //   ele?.startDate,
  //   ele.name
  // );

  if (ele?.startDate && ele?.endDate) {
    const start = parse(ele?.startDate.toString(), 'yyyy-MM-dd', new Date());
    const end = addDays(
      parse(ele?.endDate.toString(), 'yyyy-MM-dd', new Date()),
      1
    );

    return isAfter(datenow, start) && isBefore(datenow, end);
  }
  if (ele?.startDate) {
    const start = parse(ele?.startDate.toString(), 'yyyy-MM-dd', new Date());

    return isAfter(datenow, start);
  }
  if (ele?.endDate) {
    const end = addDays(
      parse(ele?.endDate.toString(), 'yyyy-MM-dd', new Date()),
      1
    );

    return isBefore(datenow, end);
  }
  return true;
};
export const getCanShowItems = (
  obj: any[],
  userEmail: string,
  location?: string
): any[] => {
  const filtered = obj?.filter((ele) => {
    // console.log(
    //   '🚀 ~ file: getCanShowItems.ts ~ line 34 ~ filtered ~ ele',
    //   ele.id
    // );
    // console.log(
    //   '🚀 ~ file: getCanShowItems.ts ~ line 35 ~ filtered ~ checkDate(ele)',
    //   checkDate(ele)
    // );

    if (!checkDate(ele)) {
      return false;
    }

    if (
      userEmail &&
      ele?.belongs_to_users &&
      ele?.belongs_to_users?.length > 0
    ) {
      // checking belongs to users
      //   console.log('checking belongs to users');

      let belongsToUser = false;
      ele?.belongs_to_users?.forEach((item: any) => {
        if (userEmail === item.email) {
          belongsToUser = true;
        }
      });
      return belongsToUser;
    }
    // checking location
    if (location && ele?.location && ele?.location?.length > 0) {
      //   console.log('checking location');

      let isInLocation = false;
      ele?.location?.forEach((item: any) => {
        if (location === item.location) {
          isInLocation = true;
          return checkDate(ele);
        }
      });
      return isInLocation;
    }
    return true;
  });
  return filtered || [];
};
