import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useChatStore } from '../../store/useChatStore';
import { chatService } from '../../services/chat.service';
import { socketService } from '../../services/socket';
import { LogOut, User as UserIcon, Plus } from 'lucide-react';
import NewChatModal from './NewChatModal';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { conversations, setConversations, activeConversation, setActiveConversation } = useChatStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const data = await chatService.getConversations();
        setConversations(data);
        
        // Connect socket and join rooms once we have conversations
        socketService.connect();
        socketService.joinRooms(data.map(c => c.id));
      } catch (error) {
        console.error('Failed to load conversations', error);
      }
    };

    loadConversations();
  }, [setConversations]);

  return (
    <div style={{
      width: '320px',
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      {/* Current User Profile Snippet */}
      <div style={{
        padding: '1.5rem',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg-surface-elevated)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold'
          }}>
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{user?.status}</div>
          </div>
        </div>
        <button 
          onClick={() => {
            socketService.disconnect();
            logout();
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '0.5rem'
          }}
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>

      {/* Conversations List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0' }}>
        <div style={{ 
          padding: '0 1.5rem 0.5rem', 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
            Recent Chats
          </span>
          <button 
            onClick={() => setIsModalOpen(true)}
            style={{ 
              background: 'var(--bg-surface-elevated)', 
              border: 'none', 
              color: 'var(--text-primary)',
              width: '24px',
              height: '24px',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Plus size={16} />
          </button>
        </div>
        
        {conversations.length === 0 ? (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            No conversations yet.
          </div>
        ) : (
          conversations.map((conv) => {
            // Simplistic way to get the 'other' user's name for 1:1 chats
            const otherMember = conv.memberships?.find(m => m.user?.id !== user?.id);
            const chatName = conv.isGroup ? conv.name : (otherMember?.user?.name || 'Unknown User');
            const isActive = activeConversation?.id === conv.id;

            return (
              <div 
                key={conv.id}
                onClick={() => setActiveConversation(conv)}
                style={{
                  padding: '1rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  cursor: 'pointer',
                  background: isActive ? 'var(--bg-surface-elevated)' : 'transparent',
                  borderLeft: isActive ? '4px solid var(--primary)' : '4px solid transparent',
                  transition: 'background var(--transition-fast)'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)'
                }}>
                  <UserIcon size={20} />
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontWeight: isActive ? 600 : 500, color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {chatName}
                  </div>
                  {conv.messages && conv.messages.length > 0 && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {conv.messages[0].content}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <NewChatModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Sidebar;
