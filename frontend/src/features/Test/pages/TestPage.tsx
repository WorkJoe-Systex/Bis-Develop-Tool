// useEffect 和 useState 是 React 的 Hook，分別用來管理副作用和狀態
import React, { useEffect, useState } from 'react';
import { fetchUsers, addUser, deleteUser } from '../services/testService';
import useNavigateToHome from '../../../hooks/useNavigateToHome';
import TestForm from '../components/TestForm';
import type { User } from '../types';
import BackToHomeButton from '../../../components/ui/BackToHomeButton';

const TestPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  
  // useEffect 用來在組件首次渲染時抓取用戶資料。這裡的 [] 表示這個副作用只會執行一次，即組件掛載時
  useEffect(() => {
    
    // Promise：是 JavaScript 用來處理異步操作的標準，代表一個尚未完成的操作，會返回一個結果或錯誤
    // then()：處理 Promise 成功的情況。
    // catch()：處理 Promise 失敗的情況。
    // finally()：無論 Promise 成功或失敗，最終都會執行的回呼函數。
    
    // fetchUsers() 會返回用戶資料。如果返回的資料是陣列，就用 setUsers 更新狀態。如果資料格式不是陣列，就在控制台輸出錯誤訊息，並清空 users
    fetchUsers()
    .then((data) => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error('Unexpected data format:', data);
          setUsers([]);
        }
      })

      // 如果 fetchUsers() 發生錯誤，則會捕捉錯誤並顯示在控制台，同時也清空 users
      .catch((error) => {
        console.error('Error fetching users:', error);
        setUsers([]);
      });
  }, []);
  
  // handleAddUser 是處理新增用戶的函數。當用戶提交表單時，它會呼叫 addUser 函數新增一個用戶，並在成功後重新抓取用戶資料並更新狀態
  const handleAddUser = (name: string) => {
    addUser(name).then(() => fetchUsers().then(setUsers));
  };

  // handleDeleteUser 是處理刪除用戶的函數。當用戶按下刪除按鈕時，它會呼叫 deleteUser 函數刪除指定 id 的用戶，並在成功後重新抓取用戶資料並更新狀態
  const handleDeleteUser = (id: number) => {
    deleteUser(id).then(() => fetchUsers().then(setUsers));
  };

  const { goToHomePage } = useNavigateToHome();

  return (
    <div>
      <h1>Users</h1>
      {/* TestForm 是一個子組件，並將 handleAddUser 函數作為 onAddUser 屬性傳遞給它 */}
      <TestForm onAddUser={handleAddUser} />
      <ul>
        {Array.isArray(users) && users.length > 0 ? (
          users.map((user) => (
            <li key={user.id}>
              {user.name} <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
            </li>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </ul>
      <BackToHomeButton />
    </div>
  );
};

export default TestPage;
