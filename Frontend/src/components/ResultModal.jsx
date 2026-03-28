import React from 'react';

const ResultModal = ({ result, onClose }) => {
  if (!result) return null;

  let title = "Result";
  let color = "#fff";
  let animation = "";

  switch (result.type) {
    case 'winner':
      color = "#ffd700";
      animation = "animate-bounce";
      break;
    case 'failure':
      color = "#ff6b6b";
      animation = "animate-shake";
      break;
    case 'unlucky':
      color = "#a55eea";
      animation = "animate-pulse";
      break;
    default:
      color = "#fff";
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(5px)'
    }} onClick={onClose}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '4rem',
        borderRadius: '20px',
        textAlign: 'center',
        border: `3px solid ${color}`,
        boxShadow: `0 0 80px ${color}`,
        transform: 'scale(1)',
        animation: 'popIn 0.3s ease-out',
        maxWidth: '80%',
        minWidth: '300px'
      }} onClick={e => e.stopPropagation()}>
        <h1 style={{ 
            fontSize: '4rem', 
            margin: 0,
            background: `linear-gradient(45deg, #fff, ${color})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
        }}>{result.text}</h1>
        <p style={{ marginTop: '2rem', color: '#ccc' }}>Click anywhere to close</p>
      </div>
      <style>{`
        @keyframes popIn {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ResultModal;
