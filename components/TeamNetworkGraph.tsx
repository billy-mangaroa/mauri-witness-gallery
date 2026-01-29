
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { TeamMember } from '../types.ts';

interface Node extends TeamMember {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Edge {
  source: string;
  target: string;
  weight: number;
}

interface PodZone {
  id: string;
  label: string;
  cx: number;
  cy: number;
  color: string;
}

interface TeamNetworkGraphProps {
  members: TeamMember[];
  onMemberClick: (member: TeamMember) => void;
}

const TeamNetworkGraph: React.FC<TeamNetworkGraphProps> = ({ members, onMemberClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [viewBox, setViewBox] = useState({ x: -450, y: -350, w: 900, h: 700 });
  const [isPanning, setIsPanning] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  
  const alphaRef = useRef(1.0);
  const frameRef = useRef<number>(0);
  const mouseMoveRef = useRef({ x: 0, y: 0 });
  const hasFittedRef = useRef(false);

  // 1. Pod Zones
  const podZones = useMemo<PodZone[]>(() => [
    { id: 'Land', label: 'Land & Farm', cx: -200, cy: -150, color: '#2D4F2D' },
    { id: 'Community', label: 'Community & Events', cx: 200, cy: -150, color: '#D4A373' },
    { id: 'Education', label: 'Education & Research', cx: 200, cy: 150, color: '#4A4E69' },
    { id: 'Story', label: 'Story & Media', cx: -200, cy: 150, color: '#8E9AAF' },
    { id: 'Stewardship', label: 'Stewardship & Vision', cx: 0, cy: 0, color: '#A5A19D' }
  ], []);

  // 2. Initialize Nodes & Edges
  useEffect(() => {
    const initialNodes = members.map((m, i) => {
      const zone = podZones.find(z => z.id === m.pod) || podZones[4];
      return {
        ...m,
        x: zone.cx + (Math.random() - 0.5) * 60,
        y: zone.cy + (Math.random() - 0.5) * 60,
        vx: 0,
        vy: 0
      };
    });

    // Simple edges: connect nodes within same pod
    const calculatedEdges: Edge[] = [];
    initialNodes.forEach((nodeA, i) => {
      initialNodes.forEach((nodeB, j) => {
        if (i < j && nodeA.pod === nodeB.pod) {
          calculatedEdges.push({ source: nodeA.id, target: nodeB.id, weight: 1.5 });
        }
      });
    });

    setNodes(initialNodes);
    setEdges(calculatedEdges);
    alphaRef.current = 1.0;
    hasFittedRef.current = false;
  }, [members, podZones]);

  // View fitting
  const fitToView = (currentNodes: Node[]) => {
    if (currentNodes.length === 0 || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const containerW = rect.width || 900;
    const containerH = rect.height || 700;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    currentNodes.forEach(n => {
      minX = Math.min(minX, n.x - 70);
      maxX = Math.max(maxX, n.x + 70);
      minY = Math.min(minY, n.y - 70);
      maxY = Math.max(maxY, n.y + 70);
    });

    const contentW = maxX - minX;
    const contentH = maxY - minY;
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    const margin = 0.25;
    const scale = Math.max(contentW / (containerW * (1 - margin)), contentH / (containerH * (1 - margin)), 1.1);
    
    const finalW = containerW * scale;
    const finalH = containerH * scale;

    setViewBox({ x: centerX - finalW / 2, y: centerY - finalH / 2, w: finalW, h: finalH });
  };

  // 3. Physics Simulation
  useEffect(() => {
    const step = () => {
      if (alphaRef.current < 0.005) {
        if (!hasFittedRef.current) {
          setNodes(n => { fitToView(n); return n; });
          hasFittedRef.current = true;
        }
        cancelAnimationFrame(frameRef.current);
        return;
      }

      setNodes(prevNodes => {
        const nextNodes = prevNodes.map(n => ({ ...n }));
        const alpha = alphaRef.current;
        
        // Repulsion & Collision
        for (let i = 0; i < nextNodes.length; i++) {
          for (let j = i + 1; j < nextNodes.length; j++) {
            const dx = nextNodes[i].x - nextNodes[j].x;
            const dy = nextNodes[i].y - nextNodes[j].y;
            const distSq = dx * dx + dy * dy || 1;
            const dist = Math.sqrt(distSq);
            
            const force = (alpha * 1200) / distSq;
            nextNodes[i].vx += (dx / dist) * force;
            nextNodes[i].vy += (dy / dist) * force;
            nextNodes[j].vx -= (dx / dist) * force;
            nextNodes[j].vy -= (dy / dist) * force;

            const minPadding = 110; 
            if (dist < minPadding) {
              const overlap = minPadding - dist;
              nextNodes[i].vx += (dx / dist) * overlap * 0.15;
              nextNodes[i].vy += (dy / dist) * overlap * 0.15;
              nextNodes[j].vx -= (dx / dist) * overlap * 0.15;
              nextNodes[j].vy -= (dy / dist) * overlap * 0.15;
            }
          }
        }

        // Attraction
        edges.forEach(edge => {
          const source = nextNodes.find(n => n.id === edge.source);
          const target = nextNodes.find(n => n.id === edge.target);
          if (source && target) {
            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const desiredDist = 160;
            const strength = 0.015 * edge.weight * alpha * (dist - desiredDist) / dist;
            source.vx += dx * strength;
            source.vy += dy * strength;
            target.vx -= dx * strength;
            target.vy -= dy * strength;
          }
        });

        // Pod attraction & Damping
        nextNodes.forEach(n => {
          const zone = podZones.find(z => z.id === n.pod) || podZones[4];
          n.vx += (zone.cx - n.x) * 0.015 * alpha;
          n.vy += (zone.cy - n.y) * 0.015 * alpha;
          
          n.vx -= n.x * 0.005 * alpha;
          n.vy -= n.y * 0.005 * alpha;
          
          n.vx *= 0.8;
          n.vy *= 0.8;
          n.x += n.vx;
          n.y += n.vy;
        });

        return nextNodes;
      });

      alphaRef.current *= 0.982;
      frameRef.current = requestAnimationFrame(step);
    };

    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [edges, podZones]);

  // 4. Input Events
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const scaleFactor = e.deltaY > 0 ? 1.05 : 0.95;
      setViewBox(v => {
        const newW = Math.min(Math.max(v.w * scaleFactor, 400), 5000);
        const newH = Math.min(Math.max(v.h * scaleFactor, 300), 4000);
        return {
          ...v, w: newW, h: newH,
          x: v.x + (v.w - newW) / 2, y: v.y + (v.h - newH) / 2
        };
      });
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    const onResize = () => setNodes(n => { fitToView(n); return n; });
    window.addEventListener('resize', onResize);

    return () => {
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const getMicroMotion = (node: Node) => {
    if (hoveredNodeId !== node.id) return '';
    const dx = (mouseMoveRef.current.x - 400) * 0.01;
    const dy = (mouseMoveRef.current.y - 300) * 0.01;
    return `translate(${dx}px, ${dy}px)`;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseMoveRef.current = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
    if (isPanning) {
      const dx = (e.clientX - lastMousePos.current.x) * (viewBox.w / (containerRef.current?.clientWidth || 900));
      const dy = (e.clientY - lastMousePos.current.y) * (viewBox.h / (containerRef.current?.clientHeight || 700));
      setViewBox(v => ({ ...v, x: v.x - dx, y: v.y - dy }));
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  };

  return (
    <div 
      ref={containerRef}
      className="w-full h-full cursor-grab active:cursor-grabbing select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={() => setIsPanning(false)}
      onMouseLeave={() => setIsPanning(false)}
    >
      <svg viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`} className="w-full h-full">
        <defs>
          <filter id="teamShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
            <feOffset dx="0" dy="4" result="offsetblur" />
            <feComponentTransfer><feFuncA type="linear" slope="0.1" /></feComponentTransfer>
            <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {nodes.map(n => (
            <clipPath key={`clip-${n.id}`} id={`clip-${n.id}`}>
              <circle cx={n.x} cy={n.y} r="35" />
            </clipPath>
          ))}
        </defs>

        <g id="pod-backgrounds" opacity="0.3">
          {podZones.map(z => (
            <g key={z.id}>
              <circle cx={z.cx} cy={z.cy} r="200" fill={z.color} fillOpacity="0.04" stroke={z.color} strokeOpacity="0.1" />
              <text x={z.cx} y={z.cy - 210} textAnchor="middle" className="text-[10px] uppercase tracking-[0.4em] font-black opacity-10 fill-[#1A1A1A]">
                {z.label}
              </text>
            </g>
          ))}
        </g>

        <g id="team-nodes">
          {nodes.map(node => {
            const isHovered = hoveredNodeId === node.id;
            const motion = getMicroMotion(node);
            return (
              <g 
                key={node.id} 
                className="cursor-pointer transition-opacity duration-300"
                style={{ transform: motion, transition: 'transform 0.1s ease-out' }}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                onClick={() => onMemberClick(node)}
              >
                <circle cx={node.x} cy={node.y} r="38" fill="white" stroke={isHovered ? "#2D4F2D" : "#E5E1DD"} strokeWidth={isHovered ? "2" : "1"} filter="url(#teamShadow)" />
                <image href={node.image} x={node.x - 35} y={node.y - 35} width="70" height="70" clipPath={`url(#clip-${node.id})`} preserveAspectRatio="xMidYMid slice" className="grayscale-[40%] hover:grayscale-0 transition-all duration-300" />
                
                {isHovered && (
                  <g className="animate-in fade-in duration-300">
                    <rect x={node.x - 60} y={node.y + 45} width="120" height="20" rx="10" fill="white" fillOpacity="0.9" stroke="#E5E1DD" strokeWidth="0.5" />
                    <text x={node.x} y={node.y + 58} textAnchor="middle" className="text-[8px] uppercase tracking-[0.2em] font-black fill-[#1A1A1A]">
                      {node.name}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default TeamNetworkGraph;
