import React, { useEffect, useRef } from 'react';
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';
import { chatService } from '../../services/chat.service';
import ChatInput from './ChatInput';

const ChatWindow: React.FC = () => {
  const { user } = useAuthStore();
  const { activeConversation, messages, setMessages, typingUsers } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages when active conversation changes
  useEffect(() => {
    const loadMessages = async () => {
      if (activeConversation) {
        try {
          const data = await chatService.getMessages(activeConversation.id);
          setMessages(data);
        } catch (error) {
          console.error('Failed to fetch messages', error);
        }
      }
    };
    loadMessages();
  }, [activeConversation, setMessages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!activeConversation) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💬</div>
          <h2>Select a conversation</h2>
          <p>Choose a chat from the sidebar to start messaging.</p>
        </div>
      </div>
    );
  }

  const chatName = activeConversation.type === 'GROUP' 
    ? activeConversation.name 
    : activeConversation.memberships?.find(m => m.user?.id !== user?.id)?.user?.name || 'Unknown User';

  const isTyping = typingUsers[activeConversation.id];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-base)' }}>
      {/* Chat Header */}
      <div style={{
        padding: '1.5rem 2rem',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(10px)',
        zIndex: 10
      }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>{chatName}</h2>
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map((msg) => {
            const isMe = msg.senderId === user?.id;
            return (
              <div key={msg.id} style={{
                alignSelf: isMe ? 'flex-end' : 'flex-start',
                maxWidth: '70%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: isMe ? 'flex-end' : 'flex-start'
              }}>
                {!isMe && msg.sender?.name && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '0.25rem', marginLeft: '0.5rem' }}>
                    {msg.sender.name}
                  </span>
                )}
                <div style={{
                  padding: '0.75rem 1.25rem',
                  borderRadius: isMe ? '1.5rem 1.5rem 0 1.5rem' : '1.5rem 1.5rem 1.5rem 0',
                  background: isMe ? 'var(--gradient-primary)' : 'var(--bg-surface-elevated)',
                  color: isMe ? 'white' : 'var(--text-primary)',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {msg.content}
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '0.25rem', opacity: 0.7 }}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div style={{
              alignSelf: 'flex-start',
              padding: '0.75rem 1.25rem',
              borderRadius: '1.5rem 1.5rem 1.5rem 0',
              background: 'var(--bg-surface)',
              color: 'var(--text-secondary)',
              fontStyle: 'italic',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span className="typing-dot" style={{ animation: 'blink 1.4s infinite both' }}>.</span>
              <span className="typing-dot" style={{ animation: 'blink 1.4s infinite both 0.2s' }}>.</span>
              <span className="typing-dot" style={{ animation: 'blink 1.4s infinite both 0.4s' }}>.</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <ChatInput />

      {/* Inline styles for typing animation just to keep it self-contained */}
      <style>{`
        @keyframes blink {
          0% { opacity: 0.2; }
          20% { opacity: 1; }
          100% { opacity: 0.2; }
        }
      `}</style>
    </div>
  );
};

export default ChatWindow;
