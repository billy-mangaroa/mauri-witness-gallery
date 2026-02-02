
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TeamMember } from '../types.ts';

interface Node extends TeamMember {
  x: number;
  y: number;
  area: string;
  labelX: number;
  labelY: number;
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
  const [hoveredCluster, setHoveredCluster] = useState<string | null>(null);
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
    const spacingX = 520;
    const spacingY = 440;
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
      const radius = Math.max(150, Math.min(220, membersInArea.length * 20));

      computedClusters.push({ area, cx, cy, radius });

      const clusterNodes: Node[] = [];
      membersInArea.forEach((member, i) => {
        const angle = (Math.PI * 2 * i) / Math.max(membersInArea.length, 1);
        const ring = membersInArea.length > 7 ? Math.floor(i / 7) : 0;
        const ringRadius = radius - 40 + ring * 55;
        const jitter = (Math.random() - 0.5) * 18;
        const x = cx + Math.cos(angle) * (ringRadius + jitter);
        const y = cy + Math.sin(angle) * (ringRadius + jitter);
        const labelOffset = 70;
        const labelX = x;
        const labelY = y + labelOffset;
        const node = { ...member, x, y, area, labelX, labelY };
        computedNodes.push(node);
        clusterNodes.push(node);
      });

      const labelHeight = 22;
      const labelPadding = 10;
      const sortedByY = [...clusterNodes].sort((a, b) => a.labelY - b.labelY);
      for (let i = 1; i < sortedByY.length; i += 1) {
        const prev = sortedByY[i - 1];
        const current = sortedByY[i];
        if (current.labelY - prev.labelY < labelHeight + labelPadding) {
          current.labelY = prev.labelY + labelHeight + labelPadding;
        }
      }
    });

    const minDistance = 120;
    for (let pass = 0; pass < 5; pass += 1) {
      for (let i = 0; i < computedNodes.length; i += 1) {
        for (let j = i + 1; j < computedNodes.length; j += 1) {
          const a = computedNodes[i];
          const b = computedNodes[j];
          if (a.area !== b.area) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          if (distance < minDistance) {
            const push = (minDistance - distance) * 0.5;
            const nx = dx / distance;
            const ny = dy / distance;
            a.x += nx * push;
            a.y += ny * push;
            b.x -= nx * push;
            b.y -= ny * push;
            a.labelX += nx * push;
            a.labelY += ny * push;
            b.labelX -= nx * push;
            b.labelY -= ny * push;
          }
        }
      }
    }

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

        <g id="cluster-backgrounds" opacity="0.6">
          {clusters.map((cluster, index) => {
            const color = CLUSTER_COLORS[index % CLUSTER_COLORS.length];
            return (
              <g key={cluster.area}>
                <circle
                  cx={cluster.cx}
                  cy={cluster.cy}
                  r={cluster.radius + 110}
                  fill={color}
                  fillOpacity="0.03"
                  stroke={color}
                  strokeOpacity="0.6"
                  strokeWidth="2"
                  strokeDasharray="8 8"
                  onMouseEnter={() => setHoveredCluster(cluster.area)}
                  onMouseLeave={() => setHoveredCluster(null)}
                />
              </g>
            );
          })}
        </g>

        {hoveredCluster && (
          <text
            x={clusters.find(cluster => cluster.area === hoveredCluster)?.cx}
            y={(clusters.find(cluster => cluster.area === hoveredCluster)?.cy || 0) + 6}
            textAnchor="middle"
            className="font-serif text-[24px] font-black fill-[#1A1A1A]"
          >
            {hoveredCluster}
          </text>
        )}

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
                <circle cx={node.x} cy={node.y} r="44" fill="white" stroke={isHovered ? "#2D4F2D" : "#E5E1DD"} strokeWidth={isHovered ? "2" : "1"} filter="url(#teamShadow)" />
                <image href={node.image} x={node.x - 40} y={node.y - 40} width="80" height="80" clipPath={`url(#clip-${node.id})`} preserveAspectRatio="xMidYMid slice" />
                
                <g className={`animate-in fade-in duration-300 ${isHovered ? '' : 'opacity-70'}`}>
                  <rect x={node.labelX - 70} y={node.labelY - 15} width="140" height="22" rx="11" fill="white" fillOpacity="0.95" stroke="#E5E1DD" strokeWidth="0.5" />
                  <text x={node.labelX} y={node.labelY} textAnchor="middle" className="text-[9px] uppercase tracking-[0.22em] font-black fill-[#1A1A1A]">
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
