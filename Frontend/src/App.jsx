import { useState, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Wheel from './components/Wheel'
import Controls from './components/Controls'
import ResultModal from './components/ResultModal'
import './index.css'

const DEFAULT_OPTIONS = [
  { id: '1', text: 'Prize A', type: 'winner', color: '#ffd700' },
  { id: '2', text: 'Try Again', type: 'failure', color: '#ff6b6b' },
  { id: '3', text: 'Jackpot', type: 'winner', color: '#00d2d3' },
  { id: '4', text: 'Oops', type: 'unlucky', color: '#5f27cd' },
  { id: '5', text: 'Bonus', type: 'winner', color: '#ff9ff3' },
  { id: '6', text: 'Nothing', type: 'failure', color: '#ff4757' }
];

function App() {
  const [options, setOptions] = useState(DEFAULT_OPTIONS)
  const [result, setResult] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [volume, setVolume] = useState(0.5)

  // Sound effects refs
  const sounds = useRef({
    winner: new Audio('/sounds/win.mp3'),
    failure: new Audio('/sounds/fail.mp3'),
    unlucky: new Audio('/sounds/unlucky.mp3'),
    spin: new Audio('/sounds/spin.mp3')
  })

  useEffect(() => {
    // Preload sounds and set volume
    Object.values(sounds.current).forEach(sound => {
      sound.load();
      sound.volume = volume;
    });
  }, [volume]);

  const handleAddOption = (text, type) => {
    if (!text) return;
    
    let color;
    switch (type) {
      case 'winner': color = '#ffd700'; break; // Gold
      case 'failure': color = '#ff6b6b'; break; // Red
      case 'unlucky': color = '#a55eea'; break; // Purple
      default: color = '#ffffff';
    }

    // Assign random variations for same types to look better
    if (type === 'winner') {
       const variants = ['#ffd700', '#00d2d3', '#ff9ff3', '#feca57'];
       color = variants[Math.floor(Math.random() * variants.length)];
    }

    const newOption = {
      id: uuidv4(),
      text,
      type,
      color
    }
    setOptions([...options, newOption])
  }

  const handleRemoveOption = (id) => {
    setOptions(options.filter(option => option.id !== id))
  }

  const handleSpinStart = () => {
    const spinSound = sounds.current.spin;
    spinSound.currentTime = 0;
    spinSound.loop = true;
    spinSound.play().catch(e => console.error("Spin Audio play failed. Interaction might be needed.", e));
  }

  const handleSpinEnd = (wonOption) => {
    const spinSound = sounds.current.spin;
    spinSound.pause();
    
    setResult(wonOption);
    setIsModalOpen(true);
    
    // Play result sound
    const sound = sounds.current[wonOption.type];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(e => console.error(`Result Audio (${wonOption.type}) play failed`, e));
    }
  }

  const testAudio = () => {
    console.log("Testing audio...");
    // Try playing the win sound as a test
    sounds.current.winner.play().then(() => {
        console.log("Audio test successful");
        alert("Audio is working! You should hear a win sound.");
    }).catch(e => {
        console.error("Audio test failed", e);
        alert(`Audio test failed: ${e.message}. Check console for details.`);
    });
  };

  return (
    <div className="app-container">
      <h1 className="main-title">Spin The Wheel</h1>
      <button 
        onClick={testAudio}
        style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid white',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '0.8rem'
        }}
      >
        Test Audio
      </button>
      <div className="content-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
        <div className="wheel-section glass-panel">
            <Wheel 
                options={options} 
                onSpinStart={handleSpinStart}
                onSpinEnd={handleSpinEnd} 
            />
        </div>
        <div className="controls-section glass-panel">
            <Controls 
                options={options} 
                onAdd={handleAddOption} 
                onRemove={handleRemoveOption} 
            />
        </div>
      </div>
      {isModalOpen && <ResultModal result={result} onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}

export default App
