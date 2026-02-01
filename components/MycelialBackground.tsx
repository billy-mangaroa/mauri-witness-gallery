
import React, { useEffect, useRef } from 'react';

const MycelialBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        width = parent.clientWidth;
        height = parent.clientHeight;
        const ratio = window.devicePixelRatio || 1;
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(ratio, ratio);
      }
    };

    window.addEventListener('resize', resize);
    resize();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Organic mycelial "roots"
    const roots = Array.from({ length: 6 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      branches: Array.from({ length: 3 + Math.floor(Math.random() * 3) }, () => ({
        segments: Array.from({ length: 3 }, () => ({
          cp1x: (Math.random() - 0.5) * 200,
          cp1y: (Math.random() - 0.5) * 200,
          cp2x: (Math.random() - 0.5) * 200,
          cp2y: (Math.random() - 0.5) * 200,
          endX: (Math.random() - 0.5) * 300,
          endY: (Math.random() - 0.5) * 300,
        })),
        speed: 0.00002 + Math.random() * 0.00004,
        phase: Math.random() * Math.PI * 2,
        opacity: 0.03 + Math.random() * 0.04,
      }))
    }));

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      
      roots.forEach(root => {
        root.branches.forEach(branch => {
          ctx.beginPath();
          ctx.strokeStyle = '#2D4F2D';
          ctx.lineWidth = 0.6;
          
          // Subtle "breathing" opacity
          const breathe = Math.sin(time * 0.0004 + branch.phase);
          ctx.globalAlpha = branch.opacity * (0.6 + 0.4 * breathe);
          
          ctx.moveTo(root.x, root.y);
          
          let curX = root.x;
          let curY = root.y;
          
          branch.segments.forEach((seg, i) => {
            // Very slow drift for the mycelial threads
            const driftX = Math.sin(time * branch.speed + branch.phase + i) * 15;
            const driftY = Math.cos(time * branch.speed + branch.phase + i) * 15;
            
            const cp1x = curX + seg.cp1x + driftX;
            const cp1y = curY + seg.cp1y + driftY;
            const cp2x = curX + seg.cp2x - driftX;
            const cp2y = curY + seg.cp2y - driftY;
            const targetX = curX + seg.endX;
            const targetY = curY + seg.endY;

            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, targetX, targetY);
            
            curX = targetX;
            curY = targetY;
          });
          
          ctx.stroke();
        });
      });

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    if (prefersReducedMotion) {
      draw(0);
    } else {
      animationFrameId = requestAnimationFrame(draw);
    }

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default MycelialBackground;
