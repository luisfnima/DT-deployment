'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function FloatingFootball() {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ startX: 0, startY: 0, endX: 0, endY: 0, controlX: 0, controlY: 0 });

  useEffect(() => {
    // Verificar si prefiere movimiento reducido
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const spawnBall = () => {
      if (document.hidden) return;

      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      // Definir una trayectoria aleatoria cruzando una esquina o parte vacía de la pantalla (evitando el centro)
      const corners = [
        // Top-left to bottom-right (curved)
        { startX: -100, startY: screenHeight * 0.1, endX: screenWidth * 0.6, endY: screenHeight + 100, controlX: screenWidth * 0.1, controlY: screenHeight * 0.8 },
        // Top-right to bottom-left (curved)
        { startX: screenWidth + 100, startY: screenHeight * 0.1, endX: screenWidth * 0.4, endY: screenHeight + 100, controlX: screenWidth * 0.9, controlY: screenHeight * 0.8 },
        // Bottom-left to top-right (curved)
        { startX: -100, startY: screenHeight * 0.7, endX: screenWidth * 0.7, endY: -100, controlX: screenWidth * 0.2, controlY: screenHeight * 0.2 },
      ];

      const chosenPath = corners[Math.floor(Math.random() * corners.length)];
      setCoords(chosenPath);
      setIsVisible(true);
    };

    // Lanzar el primer spawn después de un intervalo aleatorio inicial
    const initialDelay = Math.random() * 10000 + 10000; // 10s a 20s
    let timeoutId = setTimeout(() => {
      spawnBall();
    }, initialDelay);

    const intervalId = setInterval(() => {
      if (!isVisible) {
        spawnBall();
      }
    }, 20000); // Intento cada 20s

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [isVisible]);

  const handleAnimationComplete = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ 
            x: coords.startX, 
            y: coords.startY, 
            rotate: 0, 
            opacity: 0, 
            scale: 0.6 
          }}
          animate={{
            x: [coords.startX, coords.controlX, coords.endX],
            y: [coords.startY, coords.controlY, coords.endY],
            rotate: 720,
            opacity: [0, 0.8, 0.8, 0],
            scale: [0.6, 0.9, 0.9, 0.6]
          }}
          transition={{
            duration: 8,
            ease: "easeInOut",
            times: [0, 0.2, 0.8, 1]
          }}
          onAnimationComplete={handleAnimationComplete}
          className="fixed pointer-events-none z-0 select-none"
          style={{ width: '48px', height: '48px' }}
        >
          {/* SVG de pelota de fútbol estilizada premium */}
          <svg viewBox="0 0 512 512" className="w-full h-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.15)]">
            <circle cx="256" cy="256" r="240" fill="#ffffff" stroke="#2b2d31" strokeWidth="16" />
            
            {/* Pentágono Central */}
            <polygon points="256,180 328,232 300,318 212,318 184,232" fill="#2b2d31" />
            
            {/* Líneas y pentágonos secundarios */}
            <path d="M256,180 L256,90 M328,232 L405,190 M300,318 L360,390 M212,318 L152,390 M184,232 L107,190" stroke="#2b2d31" strokeWidth="16" strokeLinecap="round" />
            
            {/* Parches del borde */}
            <polygon points="256,16 210,60 215,90 297,90 302,60" fill="#2b2d31" transform="translate(0, -20)" />
            <polygon points="496,256 430,220 405,250 430,300" fill="#2b2d31" transform="translate(15, 0)" />
            <polygon points="360,496 340,420 370,400 410,430" fill="#2b2d31" transform="translate(10, 10)" />
            <polygon points="152,496 172,420 142,400 102,430" fill="#2b2d31" transform="translate(-10, 10)" />
            <polygon points="16,256 82,220 107,250 82,300" fill="#2b2d31" transform="translate(-15, 0)" />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
