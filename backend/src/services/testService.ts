import * as userModel from '../models/testModel';

export const getUsers = async () => {
  const users = await userModel.getAllUsers();
  // 可以在這裡添加任何額外的業務邏輯，例如篩選、排序
  return users;
};

export const createUser = async (name: string) => {
  if (!name || name.trim() === '') {
    throw new Error('Name is required and cannot be empty.');
  }
  
  // 格式化名稱
  const formattedName = name.trim().toUpperCase();
  
  // 檢查使用者是否已存在
  const existingUser = await userModel.findUserByName(formattedName);
  console.log(`name:${name}`);
  console.log(`existingUser:${existingUser}`);
  console.log(`existingUser.length:${existingUser.length}`);
  if (existingUser.includes(name)) {
    throw new Error('User already exists.');
  }
  
  // 新增使用者
  return userModel.addUser(formattedName);
};

export const deleteUser = async (id: number) => {
  if (isNaN(id)) {
    throw new Error('Invalid ID.');
  }
  
  // 刪除使用者
  return userModel.deleteUser(id);
};
