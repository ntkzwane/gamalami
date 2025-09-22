import React, { useRef, useEffect, useCallback } from 'react';
import { DitemaElement } from '../types/ditema';
import './DitemaCanvas.css';

interface DitemaCanvasProps {
  elements: DitemaElement[];
  width?: number;
  height?: number;
}

const DitemaCanvas: React.FC<DitemaCanvasProps> = ({ 
  elements, 
  width = 400, 
  height = 300 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawElement = useCallback((ctx: CanvasRenderingContext2D, element: DitemaElement) => {
    ctx.save();
    
    const { x, y } = element.position;
    const { size, color, rotation, opacity } = element.properties;

    ctx.globalAlpha = opacity || 1;
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    if (rotation) {
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-x, -y);
    }

    switch (element.type) {
      case 'triangle':
        drawTriangle(ctx, x, y, size);
        break;
      case 'circle':
        drawCircle(ctx, x, y, size);
        break;
      case 'dot':
        drawDot(ctx, x, y, size);
        break;
      case 'line':
        drawLine(ctx, x, y, size);
        break;
      case 'curve':
        drawCurve(ctx, x, y, size);
        break;
    }

    ctx.restore();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#f7fafc';
    ctx.fillRect(0, 0, width, height);

    // Draw elements
    elements.forEach((element) => {
      drawElement(ctx, element);
    });
  }, [elements, width, height, drawElement]);

  const drawTriangle = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const halfSize = size / 2;
    ctx.beginPath();
    ctx.moveTo(x, y - halfSize);
    ctx.lineTo(x - halfSize, y + halfSize);
    ctx.lineTo(x + halfSize, y + halfSize);
    ctx.closePath();
    ctx.stroke();
    
    // Add a subtle fill
    ctx.fillStyle = 'rgba(102, 126, 234, 0.1)';
    ctx.fill();
    ctx.fillStyle = '#667eea'; // Reset for other elements
  };

  const drawCircle = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const radius = size / 2;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Add a subtle fill
    ctx.fillStyle = 'rgba(30, 30, 30, 0.05)';
    ctx.fill();
    ctx.fillStyle = '#1e1e1e'; // Reset for other elements
  };

  const drawDot = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const radius = size / 2;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
  };

  const drawLine = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    ctx.moveTo(x - size / 2, y);
    ctx.lineTo(x + size / 2, y);
    ctx.stroke();
  };

  const drawCurve = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const halfSize = size / 2;
    ctx.beginPath();
    ctx.moveTo(x - halfSize, y);
    ctx.quadraticCurveTo(x, y - halfSize, x + halfSize, y);
    ctx.stroke();
  };

  return (
    <div className="ditema-canvas-container">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="ditema-canvas"
      />
    </div>
  );
};

export default DitemaCanvas;