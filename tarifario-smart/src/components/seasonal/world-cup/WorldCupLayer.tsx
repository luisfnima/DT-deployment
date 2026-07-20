'use client';

import React from 'react';
import FloatingFootball from './FloatingFootball';
import StadiumGlow from './StadiumGlow';

interface WorldCupLayerProps {
  operatorId: string;
}

export default function WorldCupLayer({ operatorId }: WorldCupLayerProps) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Resplandor del estadio interactivo por operador */}
      <StadiumGlow operatorId={operatorId} />

      {/* Lanzador de pelota de fútbol aleatoria */}
      <FloatingFootball />
    </div>
  );
}
