import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import HostMsgPage1 from '../components/HostMsg/HostMsgPage1';
import useNavigateToHome from '../hooks/useNavigateToHome';
import { toXML } from '../utils/xmlParser';
import styles from '../components/HostMsg/TodoList.module.css';
import React, { useState } from 'react';
import { parseTiTotaData } from '../services/parserService';
import ParserPage from '../components/HostMsg/ParserPage';

const HostMsg: React.FC = () => {
  const { goToHomePage } = useNavigateToHome();

  return (
    <div>
      <div id="page1">
        <HostMsgPage1 />
      </div>
      <div>
        <ParserPage />
      </div>
      <div>

      </div>
      <div>
        <p>
          <button onClick={goToHomePage}>Back</button>
        </p>
      </div>
    </div>
  );
};

export default HostMsg;
