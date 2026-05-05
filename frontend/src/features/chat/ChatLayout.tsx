import React from 'react';
import Sidebar from '../sidebar/Sidebar';
import ChatWindow from './ChatWindow';

const ChatLayout: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      background: 'var(--bg-base)'
    }}>
      <Sidebar />
      <ChatWindow />
    </div>
  );
};

export default ChatLayout;
