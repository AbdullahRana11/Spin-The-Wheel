import { useState, useRef, useEffect } from 'react'
import confetti from 'canvas-confetti'

const Wheel = ({ options, onSpinStart, onSpinEnd }) => {
  const canvasRef = useRef(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)

  // Draw the wheel whenever options or rotation changes is not needed, canvas transforms handles rotation.
  // But we need to redraw if options change.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = canvas.width / 2 - 10
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    if (options.length === 0) return

    const sliceAngle = (2 * Math.PI) / options.length

    options.forEach((option, i) => {
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, i * sliceAngle, (i + 1) * sliceAngle)
      ctx.closePath()
      
      ctx.fillStyle = option.color || '#ccc'
      ctx.fill()
      ctx.strokeStyle = '#1a1a2e'
      ctx.lineWidth = 2
      ctx.stroke()
      
      // Text
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate((i + 0.5) * sliceAngle)
      ctx.textAlign = 'right'
      ctx.fillStyle = '#1a1a2e'
      ctx.font = 'bold 14px Segoe UI'
      ctx.fillText(option.text, radius - 20, 5)
      ctx.restore()
    })
  }, [options])

  const spin = async () => {
    if (isSpinning || options.length < 2) return
    setIsSpinning(true)
    if (onSpinStart) onSpinStart();

    // Just send the IDs to the backend or the whole object
    // Backend expects list of items to choose one from.
    // We can send just the items array.
    
    try {
      const response = await fetch(import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL + '/api/spin' : 'http://127.0.0.1:5000/api/spin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ options }),
      })
      const data = await response.json()
      
      if (data.index !== undefined) {
        const sliceAngle = 360 / options.length
        
        // Calculate target rotation to land on the winner
        // Winner is at data.index
        // We want data.index to be at 0 degrees (Right)
        
        const index = data.index
        const stopAngle = 360 - (index * sliceAngle + sliceAngle / 2);
        
        const minSpin = 1800; // 5 spins
        const currentMod = rotation % 360;
        const dist = stopAngle - currentMod;
        const netRotation = dist >= 0 ? dist : 360 + dist;
        
        // Add some random offset within the slice to make it realistic
        // Slice width is sliceAngle. We can vary by +/- (sliceAngle/2 * 0.8)
        const randomOffset = (Math.random() - 0.5) * (sliceAngle * 0.8);

        const finalRotation = rotation + minSpin + netRotation + randomOffset;

        setRotation(finalRotation)
        
        setTimeout(() => {
          setIsSpinning(false)
          onSpinEnd(data.option) // This is the won option object
          if (data.option.type === 'winner') {
              confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ffd700', '#ffffff']
              })
          }
        }, 6000) // 6 seconds
      }
    } catch (error) {
      console.error("Spin failed", error)
      setIsSpinning(false)
    }
  }

  return (
    <div className="wheel-container" style={{ position: 'relative', width: '600px', height: '600px', margin: '0 auto' }}>
      <div className="pointer" style={{
        position: 'absolute',
        top: '50%',
        right: '-30px',
        transform: 'translateY(-50%)',
        width: '0',
        height: '0',
        borderTop: '20px solid transparent',
        borderBottom: '20px solid transparent',
        borderRight: '40px solid #e94560',
        zIndex: 10,
        filter: 'drop-shadow(-2px 0 2px rgba(0,0,0,0.5))'
      }}></div>
      <canvas 
        ref={canvasRef} 
        width={600} 
        height={600}
        style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 6s cubic-bezier(0.1, 0, 0.2, 1)' : 'none',
            boxShadow: '0 0 20px rgba(0,0,0,0.5), inset 0 0 50px rgba(0,0,0,0.5)'
        }}
      />
      <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: '#e94560',
          boxShadow: '0 0 10px rgba(0,0,0,0.5)',
          zIndex: 5,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
      }}>
         <button 
            onClick={spin} 
            disabled={isSpinning || options.length < 2}
            style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                cursor: isSpinning ? 'default' : 'pointer'
            }}
        >
            SPIN
        </button>
      </div>
    </div>
  )
}

export default Wheel
