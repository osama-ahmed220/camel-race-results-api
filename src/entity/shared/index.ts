import { ObjectID } from "mongodb";
export const convertStringToObjectID = (ids: string | string[] = "") => {
  let objectIds: any = [];
  if (typeof ids === "object") {
    for (let i = 0; i < ids.length; i++) {
      objectIds.push(new ObjectID(ids[i]));
    }
  } else {
    objectIds = ids;
  }
  return objectIds;
};
