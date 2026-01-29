
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Organisation } from '../types.ts';

interface Node extends Organisation {
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

interface DomainZone {
  id: string;
  label: string;
  cx: number;
  cy: number;
  color: string;
}

interface NetworkGraphProps {
  organisations: Organisation[];
  onOrgClick: (org: Organisation) => void;
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ organisations, onOrgClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [viewBox, setViewBox] = useState({ x: -450, y: -350, w: 900, h: 700 });
  const [isPanning, setIsPanning] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  
  // Simulation control
  const alphaRef = useRef(1.0);
  const frameRef = useRef<number>(0);
  const mouseMoveRef = useRef({ x: 0, y: 0 });
  const hasFittedRef = useRef(false);

  // 1. Identify Domain Zones
  const domainZones = useMemo<DomainZone[]>(() => [
    { id: 'Environment', label: 'Restoration & Ecology', cx: -180, cy: -120, color: '#2D4F2D' },
    { id: 'Community', label: 'Community & Culture', cx: 180, cy: -120, color: '#D4A373' },
    { id: 'Education', label: 'Learning & Research', cx: 180, cy: 120, color: '#4A4E69' },
    { id: 'Food Systems', label: 'Food & Nourishment', cx: -180, cy: 120, color: '#8E9AAF' },
    { id: 'Systems', label: 'Governance & Systems', cx: 0, cy: 0, color: '#E5E1DD' }
  ], []);

  // 2. Calculate Relationships (Edges)
  const processedEdges = useMemo(() => {
    const calculatedEdges: Edge[] = [];
    for (let i = 0; i < organisations.length; i++) {
      const orgA = organisations[i];
      for (let j = i + 1; j < organisations.length; j++) {
        const orgB = organisations[j];
        
        const sharedRecords = orgA.impact_reporting_ids.filter(id => orgB.impact_reporting_ids.includes(id));
        const sharedDomains = orgA.impact_domain.filter(d => orgB.impact_domain.includes(d));
        
        let weight = 0;
        if (sharedRecords.length > 0) weight += sharedRecords.length * 4;
        if (sharedDomains.length > 0) weight += sharedDomains.length * 1.2;

        if (weight > 0) {
          calculatedEdges.push({ source: orgA.id, target: orgB.id, weight });
        }
      }
    }
    return calculatedEdges;
  }, [organisations]);

  // 3. Initialize Nodes
  useEffect(() => {
    const initialNodes = organisations.map((org, i) => {
      let targetX = 0;
      let targetY = 0;
      const primaryDomain = org.impact_domain[0];
      const zone = domainZones.find(z => primaryDomain?.includes(z.id));
      if (zone) {
        targetX = zone.cx + (Math.random() - 0.5) * 50;
        targetY = zone.cy + (Math.random() - 0.5) * 50;
      } else {
        const angle = (i / organisations.length) * Math.PI * 2;
        targetX = Math.cos(angle) * 150;
        targetY = Math.sin(angle) * 150;
      }

      return {
        ...org,
        x: targetX,
        y: targetY,
        vx: 0,
        vy: 0
      };
    });
    setNodes(initialNodes);
    setEdges(processedEdges);
    alphaRef.current = 1.0; 
    hasFittedRef.current = false;
  }, [organisations, processedEdges, domainZones]);

  // Function to center and scale view to fit nodes
  const fitToView = (currentNodes: Node[]) => {
    if (currentNodes.length === 0 || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const containerW = rect.width || 900;
    const containerH = rect.height || 700;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    currentNodes.forEach(n => {
      minX = Math.min(minX, n.x - 60); // node radius + buffer
      maxX = Math.max(maxX, n.x + 60);
      minY = Math.min(minY, n.y - 60);
      maxY = Math.max(maxY, n.y + 60);
    });

    const contentW = maxX - minX;
    const contentH = maxY - minY;
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    const margin = 0.2; // 20% margin
    const scale = Math.max(
      contentW / (containerW * (1 - margin)), 
      contentH / (containerH * (1 - margin)),
      1.0 // don't zoom in too much by default
    );
    
    const finalW = containerW * scale;
    const finalH = containerH * scale;

    setViewBox({
      x: centerX - finalW / 2,
      y: centerY - finalH / 2,
      w: finalW,
      h: finalH
    });
  };

  // 4. Physics Simulation with Anti-Overlap
  useEffect(() => {
    const step = () => {
      // Cooling check
      if (alphaRef.current < 0.005) {
        if (!hasFittedRef.current) {
          setNodes(n => {
            fitToView(n);
            return n;
          });
          hasFittedRef.current = true;
        }
        cancelAnimationFrame(frameRef.current);
        return;
      }

      setNodes(prevNodes => {
        if (prevNodes.length === 0) return prevNodes;
        
        const nextNodes = prevNodes.map(n => ({ ...n }));
        const alpha = alphaRef.current;
        
        // a. Repulsion (Many-Body) - Increased for spacing
        for (let i = 0; i < nextNodes.length; i++) {
          for (let j = i + 1; j < nextNodes.length; j++) {
            const dx = nextNodes[i].x - nextNodes[j].x;
            const dy = nextNodes[i].y - nextNodes[j].y;
            const distSq = dx * dx + dy * dy || 1;
            const dist = Math.sqrt(distSq);
            
            // Stronger repulsion at close range
            const force = (alpha * 1500) / distSq;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            
            nextNodes[i].vx += fx;
            nextNodes[i].vy += fy;
            nextNodes[j].vx -= fx;
            nextNodes[j].vy -= fy;

            // Anti-Overlap Collision
            const minPadding = 85; // 30 (radius) * 2 + 25 (padding)
            if (dist < minPadding) {
              const overlap = minPadding - dist;
              const ox = (dx / dist) * overlap * 0.2;
              const oy = (dy / dist) * overlap * 0.2;
              nextNodes[i].vx += ox;
              nextNodes[i].vy += oy;
              nextNodes[j].vx -= ox;
              nextNodes[j].vy -= oy;
            }
          }
        }

        // b. Attraction (Edges) - Balanced link distance
        edges.forEach(edge => {
          const source = nextNodes.find(n => n.id === edge.source);
          const target = nextNodes.find(n => n.id === edge.target);
          if (source && target) {
            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const desiredDist = 140; 
            const strength = 0.01 * edge.weight * alpha * (dist - desiredDist) / dist;
            const fx = dx * strength;
            const fy = dy * strength;
            
            source.vx += fx;
            source.vy += fy;
            target.vx -= fx;
            target.vy -= fy;
          }
        });

        // c. Domain Zone Attraction
        nextNodes.forEach(n => {
          const relevantZones = domainZones.filter(z => 
            n.impact_domain.some(d => d.includes(z.id))
          );
          
          if (relevantZones.length > 0) {
            let avgX = 0, avgY = 0;
            relevantZones.forEach(rz => { avgX += rz.cx; avgY += rz.cy; });
            avgX /= relevantZones.length;
            avgY /= relevantZones.length;

            n.vx += (avgX - n.x) * 0.012 * alpha;
            n.vy += (avgY - n.y) * 0.012 * alpha;
          }

          n.vx -= n.x * 0.003 * alpha;
          n.vy -= n.y * 0.003 * alpha;
          
          n.vx *= 0.82; // Damping
          n.vy *= 0.82;
          
          n.x += n.vx;
          n.y += n.vy;
        });

        return nextNodes;
      });

      alphaRef.current *= 0.985;
      frameRef.current = requestAnimationFrame(step);
    };

    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [edges, domainZones]);

  // 5. Scroll Zoom Handling (Non-Passive for preventDefault)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      // Only zoom if inside the component
      e.preventDefault();
      e.stopPropagation();

      const scaleFactor = e.deltaY > 0 ? 1.05 : 0.95;
      setViewBox(v => {
        const newW = Math.min(Math.max(v.w * scaleFactor, 300), 4000);
        const newH = Math.min(Math.max(v.h * scaleFactor, 250), 3000);
        return {
          ...v,
          w: newW,
          h: newH,
          x: v.x + (v.w - newW) / 2,
          y: v.y + (v.h - newH) / 2
        };
      });
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    
    // Auto-fit on resize
    const onResize = () => {
      setNodes(n => { fitToView(n); return n; });
    };
    window.addEventListener('resize', onResize);

    return () => {
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const getMicroMotion = (node: Node) => {
    if (hoveredNodeId === null) return '';
    const isHovered = hoveredNodeId === node.id;
    const isNeighbor = edges.some(e => 
      (e.source === hoveredNodeId && e.target === node.id) ||
      (e.target === hoveredNodeId && e.source === node.id)
    );
    if (isHovered || isNeighbor) {
      const dx = (mouseMoveRef.current.x - 400) * 0.008;
      const dy = (mouseMoveRef.current.y - 300) * 0.008;
      return `translate(${dx}px, ${dy}px)`;
    }
    return '';
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

  const handleMouseUp = () => setIsPanning(false);

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase();
  };

  const activeNode = hoveredNodeId ? nodes.find(n => n.id === hoveredNodeId) : null;
  const neighbors = useMemo(() => {
    if (!hoveredNodeId) return new Set();
    const set = new Set();
    edges.forEach(e => {
      if (e.source === hoveredNodeId) set.add(e.target);
      if (e.target === hoveredNodeId) set.add(e.source);
    });
    return set;
  }, [hoveredNodeId, edges]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full cursor-grab active:cursor-grabbing select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <svg 
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`} 
        className="w-full h-full"
      >
        <defs>
          <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
            <feOffset dx="0" dy="4" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.08" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {nodes.map(node => (
            <clipPath key={`clip-${node.id}`} id={`clip-${node.id}`}>
              <circle cx={node.x} cy={node.y} r="25" />
            </clipPath>
          ))}
        </defs>

        {/* 1. Background Domain Zones */}
        <g id="domain-zones" opacity="0.4">
          {domainZones.map(zone => (
            <g key={zone.id}>
              <circle 
                cx={zone.cx} cy={zone.cy} r="240" 
                fill={zone.color} fillOpacity="0.03"
                stroke={zone.color} strokeOpacity="0.08" strokeWidth="1"
              />
              <text 
                x={zone.cx} y={zone.cy - 250} 
                textAnchor="middle" 
                className="text-[10px] uppercase tracking-[0.4em] font-black opacity-10 fill-[#1A1A1A]"
              >
                {zone.label}
              </text>
            </g>
          ))}
        </g>

        {/* 2. Edges */}
        <g id="edges">
          {edges.map((edge, i) => {
            const source = nodes.find(n => n.id === edge.source);
            const target = nodes.find(n => n.id === edge.target);
            if (!source || !target) return null;
            
            const isRelatedToHover = hoveredNodeId && (edge.source === hoveredNodeId || edge.target === hoveredNodeId);
            const isFaded = hoveredNodeId && !isRelatedToHover;

            return (
              <path
                key={`edge-${i}`}
                d={`M ${source.x} ${source.y} L ${target.x} ${target.y}`}
                stroke="#2D4F2D"
                strokeWidth={Math.min(edge.weight / 1.5, 4)}
                strokeOpacity={isRelatedToHover ? 0.3 : isFaded ? 0.015 : 0.08}
                className="transition-all duration-500"
                style={{ strokeLinecap: 'round', strokeDasharray: isRelatedToHover ? 'none' : '4 4' }}
              />
            );
          })}
        </g>

        {/* 3. Nodes */}
        <g id="nodes">
          {nodes.map(node => {
            const isHovered = hoveredNodeId === node.id;
            const isNeighbor = neighbors.has(node.id);
            const isFaded = hoveredNodeId && !isHovered && !isNeighbor;
            const motionStyle = getMicroMotion(node);

            return (
              <g 
                key={node.id} 
                className={`cursor-pointer transition-opacity duration-500 ${isFaded ? 'opacity-20' : 'opacity-100'}`}
                style={{ transform: motionStyle, transition: 'transform 0.1s ease-out, opacity 0.5s ease' }}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                onClick={() => onOrgClick(node)}
              >
                <circle 
                  cx={node.x} cy={node.y} r="30" 
                  fill="white" stroke={isHovered ? "#2D4F2D" : "#E5E1DD"} 
                  strokeWidth={isHovered ? "2" : "1"}
                  filter="url(#softShadow)"
                />

                {node.logo ? (
                  <image 
                    href={node.logo.url}
                    x={node.x - 22} y={node.y - 22} width="44" height="44"
                    clipPath={`url(#clip-${node.id})`}
                    preserveAspectRatio="xMidYMid slice"
                  />
                ) : (
                  <text 
                    x={node.x} y={node.y} 
                    dy="0.35em" textAnchor="middle" 
                    className="text-[12px] font-black opacity-30 tracking-widest fill-[#1A1A1A]"
                  >
                    {getInitials(node.org_name)}
                  </text>
                )}

                {(isHovered || isNeighbor) && (
                  <g className="animate-in fade-in duration-300">
                    <rect 
                       x={node.x - 60} y={node.y + 40} width="120" height="20" rx="10"
                       fill="white" fillOpacity="0.8" stroke="#E5E1DD" strokeWidth="0.5"
                    />
                    <text 
                      x={node.x} y={node.y + 53} 
                      textAnchor="middle" 
                      className="text-[7px] uppercase tracking-[0.3em] font-black fill-[#1A1A1A]"
                    >
                      {node.org_name}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Meta Tooltip */}
      {activeNode && (
        <div 
          className="absolute pointer-events-none bg-white border border-[#E5E1DD] p-5 rounded-[24px] shadow-2xl max-w-xs animate-in fade-in zoom-in-95 duration-300"
          style={{ left: 20, top: 20 }}
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-[#2D4F2D]" />
               <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-[#1A1A1A]">
                {activeNode.org_name}
              </h4>
            </div>
            {activeNode.how_connected && (
              <p className="text-[10px] text-[#888] italic leading-relaxed line-clamp-3">
                "{activeNode.how_connected}"
              </p>
            )}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {activeNode.impact_domain.map(d => (
                <span key={d} className="text-[7px] uppercase tracking-widest font-black px-2 py-1 border border-[#E5E1DD] text-[#A5A19D] rounded-full">
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkGraph;
