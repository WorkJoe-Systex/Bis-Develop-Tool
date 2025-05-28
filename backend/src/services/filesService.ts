import * as pathModel from '../models/pathModel';

export const getFiles = async (serverType: string, name: string) => {
  const path = await pathModel.getPath(serverType, name);
  return path;
};
