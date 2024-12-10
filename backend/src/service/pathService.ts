import * as compressedModel from '../models/pathModel';

export const getPath = async (serverType: string, name: string) => {
  const path = await compressedModel.getPath(serverType, name);
  // 可以在這裡添加任何額外的業務邏輯，例如篩選、排序
  return path;
};

export const updatePath = async (path: string, serverType: string, name: string) => {
  // const doUpdate = await compressedModel.updateTargetPath(path, serverType, name);
  await compressedModel.updatePath(path, serverType, name);
  // 可以在這裡添加任何額外的業務邏輯，例如篩選、排序

  console.log(`Path updated successfully.`);

  // return doUpdate; // 返回更新結果 也可以不用
};