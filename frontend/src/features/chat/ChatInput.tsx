import React, { useState } from 'react';
import { Send, Smile } from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';
import { chatService } from '../../services/chat.service';
import { socketService } from '../../services/socket';

const ChatInput: React.FC = () => {
  const [content, setContent] = useState('');
  const activeConversation = useChatStore(state => state.activeConversation);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);

    if (!activeConversation) return;

    if (!isTyping) {
      setIsTyping(true);
      socketService.emitTypingStart(activeConversation.id);
    }

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      setIsTyping(false);
      socketService.emitTypingStop(activeConversation.id);
    }, 2000); // stop typing after 2s of inactivity

    setTypingTimeout(timeout);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !activeConversation) return;

    try {
      const messageContent = content;
      setContent('');
      
      if (isTyping && typingTimeout) {
        clearTimeout(typingTimeout);
        setIsTyping(false);
        socketService.emitTypingStop(activeConversation.id);
      }

      await chatService.sendMessage(activeConversation.id, messageContent);
      // The message will be broadcasted back via sockets, so we don't necessarily 
      // need to append it locally here unless we want optimistic UI updates.
      // The backend Socket 'receive_message' event covers it.
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (!activeConversation) return null;

  return (
    <div style={{
      padding: '1.5rem',
      background: 'var(--bg-base)',
      borderTop: '1px solid var(--border-subtle)'
    }}>
      <form 
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          background: 'var(--bg-surface)',
          padding: '0.5rem 1rem',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <button type="button" style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}>
          <Smile size={24} />
        </button>
        
        <input
          type="text"
          value={content}
          onChange={handleTextChange}
          placeholder="Type a message..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            outline: 'none',
            fontSize: '1rem',
            padding: '0.5rem 0'
          }}
        />
        
        <button 
          type="submit" 
          disabled={!content.trim()}
          style={{ 
            background: content.trim() ? 'var(--gradient-primary)' : 'var(--bg-surface-elevated)', 
            border: 'none', 
            color: content.trim() ? 'white' : 'var(--text-tertiary)',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: content.trim() ? 'pointer' : 'not-allowed',
            transition: 'all var(--transition-fast)'
          }}
        >
          <Send size={18} style={{ marginLeft: '2px' }} />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
