import * as userModel from '../models/userModel';

export const getUserInfo = async (name: any) => {
  const data = await userModel.getUserInfo(name);
  // 可以在這裡添加任何額外的業務邏輯，例如篩選、排序
  return data;
};

export const updateCompressedType = async (compressedDir: string, zipType: string, name: string) => {
  // const doUpdate = await pathModel.updateTargetPath(path, serverType, name);
  await userModel.updateCompressedType(compressedDir, zipType, name);
  // 可以在這裡添加任何額外的業務邏輯，例如篩選、排序

  console.log(`PathType updated successfully.`);

  // return doUpdate; // 返回更新結果 也可以不用
};