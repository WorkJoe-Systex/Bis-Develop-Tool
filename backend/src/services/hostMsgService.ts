import * as hostMsgModel from '../models/hostMsgModel'
import * as pathModel from '../models/pathModel'
import path from 'path';
import fs from 'fs';

export const qryAllHostMsg = async () => {
  const result = await hostMsgModel.qryAllHostMsg();
  return result;
}

export const updateHostMsgStatus = async (id: string, status: string) => {
  await hostMsgModel.updateHostMsgStatus(id, status);

  console.log(`status updated successfully.`);
}

export async function writeTextFile(fileName: string, content: string, overwrite = false) {
  const svnPath = await pathModel.getPath('SVN', 'jbranch')[0].path;
  const fakeHostMsgPath = await pathModel.getPath('SVN', 'fakeHostMsg')[0].path;
  const fullPath = path.join(svnPath, fakeHostMsgPath, fileName + '.txt');
  if (fs.existsSync(fullPath) && !overwrite) {
    throw new Error('File already exists.');
  }
  console.log(fullPath);
  fs.writeFileSync(fullPath, content);
}

export async function deleteTextFile(fileName: string) {
  const svnPath = await pathModel.getPath('SVN', 'jbranch')[0].path;
  const fakeHostMsgPath = await pathModel.getPath('SVN', 'fakeHostMsg')[0].path;
  const fullPath = path.join(svnPath, fakeHostMsgPath, fileName + '.txt');
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  } else {
    throw new Error('File does not exist.');
  }
}