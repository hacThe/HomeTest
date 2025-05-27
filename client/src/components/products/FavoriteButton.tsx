"use client"

import { Heart } from "lucide-react"
import { useState } from "react"
import { updateProductFavorite } from "@/lib/products.service"

interface FavoriteButtonProps {
  productId: number
  initialIsFavorite: boolean
}

const PARTICLE_COUNT = 8
const PARTICLE_COLORS = [
  '#ef4444', // red-500
  '#f59e42', // orange
  '#fbbf24', // yellow-400
  '#10b981', // green-500
  '#3b82f6', // blue-500
  '#a21caf', // purple-800
  '#f472b6', // pink-400
  '#facc15', // yellow-300
]

export function FavoriteButton({ productId, initialIsFavorite }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const [isBouncing, setIsBouncing] = useState(false)
  const [showParticles, setShowParticles] = useState(false)

  const toggleFavorite = async () => {
    setIsBouncing(true)
    if (!isFavorite) setShowParticles(true)
    setTimeout(() => setIsBouncing(false), 400)
    setTimeout(() => setShowParticles(false), 700)
    
    try {
      await updateProductFavorite(productId, !isFavorite)
      setIsFavorite(!isFavorite)
    } catch (error) {
      console.error('Error updating favorite status:', error)
    }
  }

  return (
    <span className="relative inline-block" style={{ width: 24, height: 24 }}>
      <style jsx>{`
        .bounce {
          animation: bounce-pop 0.4s cubic-bezier(.36,1.7,.3,.9);
        }
        @keyframes bounce-pop {
          0% { transform: scale(1); }
          30% { transform: scale(1.5) rotate(-10deg); filter: drop-shadow(0 0 8px #ef4444aa); }
          60% { transform: scale(0.95) rotate(8deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        .particle {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          opacity: 0.8;
          pointer-events: none;
          z-index: 10;
          animation: particle-burst 0.7s forwards;
        }
        @keyframes particle-burst {
          0% {
            transform: translate(-50%, -50%) scale(0.7);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1.2);
            opacity: 0;
          }
        }
      `}</style>
      {showParticles &&
        Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
          const angle = (360 / PARTICLE_COUNT) * i
          const distance = 24
          const x = Math.cos((angle * Math.PI) / 180) * distance
          const y = Math.sin((angle * Math.PI) / 180) * distance
          return (
            <span
              key={i}
              className="particle"
              style={{
                background: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
                '--tx': `${x}px`,
                '--ty': `${y}px`,
              } as React.CSSProperties}
            />
          )
        })}
      <Heart
        size={20}
        className={`${isFavorite ? 'text-red-500 fill-red-500' : 'text-muted-foreground'} cursor-pointer hover:scale-110 transition-transform ${isBouncing ? 'bounce' : ''}`}
        onClick={toggleFavorite}
        style={{ position: 'relative', zIndex: 20 }}
        aria-label="favorite"
      />
    </span>
  )
} 