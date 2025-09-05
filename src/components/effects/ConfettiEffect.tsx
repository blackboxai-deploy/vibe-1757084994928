'use client';

import { useEffect, useState, memo } from 'react';
import { cn } from '@/lib/utils';

interface ConfettiParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

interface ConfettiEffectProps {
  trigger: boolean;
  duration?: number;
  particleCount?: number;
  originX?: number; // Position where confetti should originate (0-100%)
  originY?: number; // Position where confetti should originate (0-100%)
  tileValue?: number; // The tile value to determine confetti intensity
  className?: string;
}

export const ConfettiEffect = memo(function ConfettiEffect({
  trigger,
  duration = 3000,
  particleCount = 50,
  originX = 50,
  originY = 50,
  tileValue = 0,
  className,
}: ConfettiEffectProps) {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!trigger) return;

    // Enhanced colors based on tile value
    const getColorsForValue = (value: number) => {
      if (value >= 2048) return ['#FFD700', '#FFA500', '#FF6B6B', '#FF1493', '#9370DB', '#00CED1'];
      if (value >= 1024) return ['#9370DB', '#8A2BE2', '#FF69B4', '#FFB6C1', '#DDA0DD'];
      if (value >= 512) return ['#32CD32', '#00FF32', '#ADFF2F', '#98FB98', '#90EE90'];
      if (value >= 256) return ['#FFD700', '#FFFF00', '#FFFFE0', '#F0E68C', '#BDB76B'];
      if (value >= 128) return ['#FF8C00', '#FFA500', '#FFB347', '#FFDAB9', '#FFEBCD'];
      return ['#87CEEB', '#87CEFA', '#B0E0E6', '#ADD8E6', '#E0F6FF'];
    };

    const colors = getColorsForValue(tileValue);
    
    // Adjust particle count based on tile value
    const adjustedParticleCount = Math.min(
      particleCount + Math.floor(tileValue / 128) * 10,
      100
    );

    // Create particles with origin-based positioning
    const newParticles: ConfettiParticle[] = Array.from(
      { length: adjustedParticleCount },
      (_, i) => {
        // Create burst pattern from origin point
        const angle = (Math.PI * 2 * i) / adjustedParticleCount + Math.random() * 0.3;
        const velocity = Math.random() * 1.5 + 0.8 + (tileValue >= 512 ? 0.5 : 0); // Much slower
        
        return {
          id: `particle-${i}`,
          x: originX + (Math.random() - 0.5) * 3, // Smaller random spread around origin
          y: originY + (Math.random() - 0.5) * 3,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity - Math.random() * 0.8, // Gentle upward bias
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 4 + 3 + (tileValue >= 1024 ? 2 : 0),
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 8, // Slower rotation
        };
      }
    );

    setParticles(newParticles);
    setIsActive(true);

    const animationFrame = () => {
      setParticles(prevParticles =>
        prevParticles
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vx: particle.vx * 0.985, // More air resistance for smoother deceleration
            vy: particle.vy + 0.08, // Gentler gravity
            rotation: particle.rotation + particle.rotationSpeed,
          }))
          .filter(particle => 
            particle.y < 120 && 
            particle.x > -10 && 
            particle.x < 110
          ) // Remove particles that leave screen
      );
    };

    const intervalId = setInterval(animationFrame, 20); // Slightly slower frame rate for smoother motion

    const timeoutId = setTimeout(() => {
      setIsActive(false);
      setParticles([]);
      clearInterval(intervalId);
    }, duration);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [trigger, duration, particleCount, originX, originY, tileValue]);

  if (!isActive || particles.length === 0) return null;

  return (
    <div 
      className={cn(
        'fixed inset-0 pointer-events-none z-50 overflow-hidden',
        className
      )}
    >
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute transition-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
});

ConfettiEffect.displayName = 'ConfettiEffect';