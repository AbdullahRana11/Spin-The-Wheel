import { useState } from 'react'

const Controls = ({ options, onAdd, onRemove }) => {
  const [inputValue, setInputValue] = useState('')
  const [type, setType] = useState('winner')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onAdd(inputValue.trim(), type)
      setInputValue('')
    }
  }

  return (
    <div className="controls">
      <h3>Options</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
                type="text" 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)} 
                placeholder="Add new item..." 
                style={{ flex: 1 }}
            />
            <button type="submit" style={{ background: '#0f3460', color: 'white', border: 'none', padding: '0 1rem', borderRadius: '5px' }}>
                Add
            </button>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select 
                value={type} 
                onChange={(e) => setType(e.target.value)}
                style={{ 
                    flex: 1, 
                    padding: '0.5rem', 
                    borderRadius: '5px', 
                    background: 'rgba(255,255,255,0.1)', 
                    color: 'white', 
                    border: '1px solid #0f3460' 
                }}
            >
                <option value="winner">Winner (Good things)</option>
                <option value="failure">Failure (Sad things)</option>
                <option value="unlucky">Unlucky (Funny things)</option>
            </select>
        </div>
      </form>
      
      <div className="options-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {options.map((option) => (
          <div key={option.id} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            background: 'rgba(255,255,255,0.05)',
            borderLeft: `5px solid ${option.color}`,
            padding: '0.5rem',
            marginBottom: '0.5rem',
            borderRadius: '5px'
          }}>
            <span>{option.text} <small style={{ opacity: 0.5 }}>({option.type})</small></span>
            <button 
                onClick={() => onRemove(option.id)}
                style={{ background: 'transparent', border: 'none', color: '#ff6b6b', fontSize: '1.2rem' }}
            >
                &times;
            </button>
          </div>
        ))}
        {options.length === 0 && <p style={{ color: '#888' }}>Add items to spin!</p>}
      </div>
    </div>
  )
}

export default Controls
