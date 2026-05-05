import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={
            <div className="glass-panel" style={{ margin: 'auto', padding: '2rem', textAlign: 'center' }}>
              <h1 style={{ marginBottom: '1rem', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Coneckt Messaging
              </h1>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                The real-time internal communication platform.
              </p>
              <button className="btn-primary">Get Started</button>
            </div>
          } />
          {/* We will add /login and /chat routes later */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
