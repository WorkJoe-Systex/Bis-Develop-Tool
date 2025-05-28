// useState 是一個 React Hook，用來在函數組件中管理狀態
import React, { useState } from 'react';

// Props 類型是用來定義組件需要的屬性類型。在 TypeScript 中，
// 組件的屬性可以被視為一個物件，其中包含了傳遞給組件的所有資料。
// 這些屬性需要事先定義類型，這樣 TypeScript 可以檢查是否正確傳遞了資料
interface Props {
  // 這個函數接受一個字串參數 name，並且返回 void（即不會返回任何值）
  // 表示父組件傳遞給 TestForm 的 onAddUser 屬性必須是一個函數，這個函數會接受一個 name 字串作為參數
  onAddUser: (name: string) => void;
}

// React.FC<Props> 是 React 的函數組件類型
// 定義一個名為 TestForm 的函數組件，這個組件接收 Props 類型的屬性，並且使用其中的 onAddUser 函數來處理用戶提交的名字
const TestForm: React.FC<Props> = ({ onAddUser }) => {

  // 宣告`name`變數，預設值=''，`setName`用於設值`name`變數
  // 調用 setName 時，React 會重新渲染組件並顯示最新的狀態值
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {

    // 防止表單的默認行為（即頁面重新加載）
    e.preventDefault();

    // 將 name 作為參數傳遞給父組件的函數
    onAddUser(name);

    // 提交後，重設 name 狀態為空字串，清空輸入框
    setName('');
  };

  return (
    // onSubmit 屬性設置為 handleSubmit，這樣當用戶提交表單時，就會執行 handleSubmit 函數
    <form onSubmit={handleSubmit}>
      <input
        type="text"

        // 綁定到 name 狀態，並在用戶輸入時更新狀態 (onChange)
        value={name}
        onChange={(e) => setName(e.target.value)}

        // placeholder 是一個屬性，用來在 HTML <input> 元素中顯示提示文字，當用戶沒有輸入任何內容時顯示此文字。這個文字會隨著用戶開始輸入而消失
        placeholder="Enter user name"
      />
      <button type="submit">Add User</button>
    </form>
  );
};

// 將 TestForm 組件導出，這樣它可以在其他地方被引入和使用
export default TestForm;
