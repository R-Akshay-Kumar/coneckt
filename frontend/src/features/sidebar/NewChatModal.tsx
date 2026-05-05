import React, { useState, useEffect } from 'react';
import { Search, X, User as UserIcon } from 'lucide-react';
import { User } from '../../types';
import { userService } from '../../services/user.service';
import { chatService } from '../../services/chat.service';
import { useChatStore } from '../../store/useChatStore';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewChatModal: React.FC<NewChatModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const { conversations, setConversations, setActiveConversation } = useChatStore();

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (query.trim().length > 1) {
        setIsSearching(true);
        try {
          const users = await userService.searchUsers(query);
          setResults(users);
        } catch (error) {
          console.error('Search failed', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
      }
    }, 400); // debounce

    return () => clearTimeout(searchTimer);
  }, [query]);

  const handleStartChat = async (targetUser: User) => {
    try {
      const newConv = await chatService.createConversation(targetUser.id);
      
      // Update local store
      const exists = conversations.find(c => c.id === newConv.id);
      if (!exists) {
        setConversations([newConv, ...conversations]);
      }
      
      setActiveConversation(newConv);
      onClose();
    } catch (error) {
      console.error('Failed to create conversation', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100
    }}>
      <div className="glass-panel" style={{
        width: '90%',
        maxWidth: '450px',
        maxHeight: '80vh',
        background: 'var(--bg-surface)',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--radius-lg)'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Start New Chat</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* Search Input */}
        <div style={{ padding: '1.5rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-base)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.5rem 1rem'
          }}>
            <Search size={20} color="var(--text-tertiary)" />
            <input
              autoFocus
              type="text"
              placeholder="Search users by name or email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                outline: 'none',
                padding: '0.5rem',
                marginLeft: '0.5rem'
              }}
            />
          </div>
        </div>

        {/* Results List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 1.5rem 1.5rem' }}>
          {isSearching && <div style={{ color: 'var(--text-tertiary)', textAlign: 'center' }}>Searching...</div>}
          
          {!isSearching && query.trim().length > 1 && results.length === 0 && (
            <div style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>No users found.</div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {results.map(user => (
              <div 
                key={user.id}
                onClick={() => handleStartChat(user)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  background: 'var(--bg-surface-elevated)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'var(--primary-hover)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'var(--bg-surface-elevated)'}
              >
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
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'white' }}>{user.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>{user.email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;
