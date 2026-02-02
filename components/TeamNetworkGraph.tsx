
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TeamMember } from '../types.ts';

interface Node extends TeamMember {
  x: number;
  y: number;
  area: string;
}

interface Cluster {
  area: string;
  cx: number;
  cy: number;
  radius: number;
}

interface TeamNetworkGraphProps {
  members: TeamMember[];
  onMemberClick: (member: TeamMember) => void;
}

const CLUSTER_COLORS = ['#2D4F2D', '#D4A373', '#4A4E69', '#8E9AAF', '#A5A19D', '#9A5B42'];

const TeamNetworkGraph: React.FC<TeamNetworkGraphProps> = ({ members, onMemberClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [viewBox, setViewBox] = useState({ x: -450, y: -350, w: 900, h: 700 });

  const { nodes, clusters } = useMemo(() => {
    const grouped: Record<string, TeamMember[]> = {};
    members.forEach(member => {
      const area = member.areas?.[0] || member.pod || 'General';
      if (!grouped[area]) grouped[area] = [];
      grouped[area].push(member);
    });

    const areas = Object.keys(grouped);
    const totalClusters = Math.max(areas.length, 1);
    const columns = Math.ceil(Math.sqrt(totalClusters));
    const rows = Math.ceil(totalClusters / columns);
    const spacingX = 420;
    const spacingY = 360;
    const startX = -((columns - 1) * spacingX) / 2;
    const startY = -((rows - 1) * spacingY) / 2;

    const computedClusters: Cluster[] = [];
    const computedNodes: Node[] = [];

    areas.forEach((area, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);
      const cx = startX + col * spacingX;
      const cy = startY + row * spacingY;
      const membersInArea = grouped[area];
      const radius = Math.max(120, Math.min(180, membersInArea.length * 18));

      computedClusters.push({ area, cx, cy, radius });

      membersInArea.forEach((member, i) => {
        const angle = (Math.PI * 2 * i) / Math.max(membersInArea.length, 1);
        const ring = membersInArea.length > 8 ? 1 : 0;
        const ringRadius = radius + ring * 60;
        const x = cx + Math.cos(angle) * ringRadius;
        const y = cy + Math.sin(angle) * ringRadius;
        computedNodes.push({ ...member, x, y, area });
      });
    });

    return { nodes: computedNodes, clusters: computedClusters };
  }, [members]);

  useEffect(() => {
    if (!containerRef.current || nodes.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const containerW = rect.width || 900;
    const containerH = rect.height || 700;
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    nodes.forEach(n => {
      minX = Math.min(minX, n.x - 90);
      maxX = Math.max(maxX, n.x + 90);
      minY = Math.min(minY, n.y - 110);
      maxY = Math.max(maxY, n.y + 110);
    });

    clusters.forEach(c => {
      minX = Math.min(minX, c.cx - c.radius - 120);
      maxX = Math.max(maxX, c.cx + c.radius + 120);
      minY = Math.min(minY, c.cy - c.radius - 140);
      maxY = Math.max(maxY, c.cy + c.radius + 140);
    });

    const contentW = maxX - minX || 900;
    const contentH = maxY - minY || 700;
    const scale = Math.max(contentW / (containerW * 0.9), contentH / (containerH * 0.9), 1);
    const finalW = containerW * scale;
    const finalH = containerH * scale;
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    setViewBox({ x: centerX - finalW / 2, y: centerY - finalH / 2, w: finalW, h: finalH });
  }, [nodes, clusters]);

  return (
    <div ref={containerRef} className="w-full h-full select-none">
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

        <g id="cluster-backgrounds" opacity="0.35">
          {clusters.map((cluster, index) => {
            const color = CLUSTER_COLORS[index % CLUSTER_COLORS.length];
            return (
              <g key={cluster.area}>
                <circle cx={cluster.cx} cy={cluster.cy} r={cluster.radius + 60} fill={color} fillOpacity="0.04" stroke={color} strokeOpacity="0.16" />
                <text x={cluster.cx} y={cluster.cy - cluster.radius - 70} textAnchor="middle" className="text-[11px] uppercase tracking-[0.4em] font-black opacity-30 fill-[#1A1A1A]">
                  {cluster.area}
                </text>
              </g>
            );
          })}
        </g>

        <g id="team-nodes">
          {nodes.map(node => {
            const isHovered = hoveredNodeId === node.id;
            return (
              <g 
                key={node.id} 
                className="cursor-pointer transition-opacity duration-300"
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                onClick={() => onMemberClick(node)}
              >
                <circle cx={node.x} cy={node.y} r="38" fill="white" stroke={isHovered ? "#2D4F2D" : "#E5E1DD"} strokeWidth={isHovered ? "2" : "1"} filter="url(#teamShadow)" />
                <image href={node.image} x={node.x - 35} y={node.y - 35} width="70" height="70" clipPath={`url(#clip-${node.id})`} preserveAspectRatio="xMidYMid slice" />
                
                <g className={`animate-in fade-in duration-300 ${isHovered ? '' : 'opacity-70'}`}>
                  <rect x={node.x - 60} y={node.y + 45} width="120" height="20" rx="10" fill="white" fillOpacity="0.95" stroke="#E5E1DD" strokeWidth="0.5" />
                  <text x={node.x} y={node.y + 58} textAnchor="middle" className="text-[8px] uppercase tracking-[0.2em] font-black fill-[#1A1A1A]">
                    {node.name}
                  </text>
                </g>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default TeamNetworkGraph;
