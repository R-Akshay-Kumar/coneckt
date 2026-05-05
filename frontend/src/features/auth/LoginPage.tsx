import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { googleLogin } from '../../services/auth.service';
import { MessageSquareText } from 'lucide-react';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error('No credential received from Google');
      }
      
      const { user, token } = await googleLogin(credentialResponse.credential);
      login(user, token);
      navigate('/');
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.response?.data?.error || 'Authentication failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    console.error('Google Login Failed');
    setError('Google sign-in was unsuccessful.');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-base)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background glowing orbs */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '20%',
        width: '400px',
        height: '400px',
        background: 'var(--primary-light)',
        filter: 'blur(120px)',
        opacity: 0.2,
        borderRadius: '50%'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '20%',
        width: '300px',
        height: '300px',
        background: 'var(--primary)',
        filter: 'blur(100px)',
        opacity: 0.15,
        borderRadius: '50%'
      }} />

      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '420px',
        padding: '3rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{
          background: 'var(--gradient-primary)',
          padding: '1rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <MessageSquareText size={32} color="white" />
        </div>
        
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 700, 
          marginBottom: '0.5rem',
          background: 'var(--gradient-primary)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Coneckt
        </h1>
        
        <p style={{ 
          color: 'var(--text-secondary)', 
          textAlign: 'center',
          marginBottom: '2.5rem' 
        }}>
          Sign in to collaborate and chat in real-time with your team.
        </p>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            width: '100%',
            fontSize: '0.875rem',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            {error}
          </div>
        )}

        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="filled_black"
            shape="rectangular"
            size="large"
            width="300"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
