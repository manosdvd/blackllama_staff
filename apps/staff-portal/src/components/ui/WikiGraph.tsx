'use client';

import React, { useEffect, useRef } from 'react';

interface WikiNode {
  id: string;
  title: string;
  category: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface WikiLink {
  source: string;
  target: string;
}

interface WikiGraphProps {
  articles: { slug: string; title: string; category: string; content: string }[];
  onNodeClick: (slug: string) => void;
  onClose: () => void;
}

export function WikiGraph({ articles, onNodeClick, onClose }: WikiGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let isDragging = false;
    let draggedNode: WikiNode | null = null;

    // Initialize Nodes
    const nodes: WikiNode[] = articles.map((art, idx) => {
      const angle = (idx / articles.length) * Math.PI * 2;
      const radius = 250;
      return {
        id: art.slug,
        title: art.title,
        category: art.category,
        x: window.innerWidth / 2 + Math.cos(angle) * radius,
        y: window.innerHeight / 2 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        radius: art.title.length > 20 ? 30 : 25
      };
    });

    // Parse links from double brackets
    const links: WikiLink[] = [];
    articles.forEach(art => {
      const matches = art.content.matchAll(/\[\[(.*?)\]\]/g);
      for (const match of matches) {
        const linkTarget = match[1];
        let targetSlug = linkTarget;
        if (linkTarget.includes('|')) {
          targetSlug = linkTarget.split('|')[0];
        }
        targetSlug = targetSlug
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        if (nodes.some(n => n.id === targetSlug)) {
          links.push({ source: art.slug, target: targetSlug });
        }
      }
    });

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Physics constants
    const repulsion = 1800;
    const attraction = 0.035;
    const gravity = 0.02;
    const damping = 0.85;

    const updatePhysics = () => {
      // Repulsion between nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < 400) {
            const force = repulsion / (dist * dist);
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            if (nodes[i] !== draggedNode) {
              nodes[i].vx -= fx;
              nodes[i].vy -= fy;
            }
            if (nodes[j] !== draggedNode) {
              nodes[j].vx += fx;
              nodes[j].vy += fy;
            }
          }
        }
      }

      // Attraction along links
      links.forEach(link => {
        const sourceNode = nodes.find(n => n.id === link.source);
        const targetNode = nodes.find(n => n.id === link.target);
        if (sourceNode && targetNode) {
          const dx = targetNode.x - sourceNode.x;
          const dy = targetNode.y - sourceNode.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = dist * attraction;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          if (sourceNode !== draggedNode) {
            sourceNode.vx += fx;
            sourceNode.vy += fy;
          }
          if (targetNode !== draggedNode) {
            targetNode.vx -= fx;
            targetNode.vy -= fy;
          }
        }
      });

      // Gravity towards center
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      nodes.forEach(node => {
        if (node === draggedNode) return;
        const dx = centerX - node.x;
        const dy = centerY - node.y;
        node.vx += dx * gravity;
        node.vy += dy * gravity;

        // Apply velocity
        node.x += node.vx;
        node.y += node.vy;
        node.vx *= damping;
        node.vy *= damping;

        // Contain in screen boundaries
        node.x = Math.max(node.radius, Math.min(canvas.width - node.radius, node.x));
        node.y = Math.max(node.radius, Math.min(canvas.height - node.radius, node.y));
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw links
      ctx.lineWidth = 1.5;
      links.forEach(link => {
        const sourceNode = nodes.find(n => n.id === link.source);
        const targetNode = nodes.find(n => n.id === link.target);
        if (sourceNode && targetNode) {
          const grad = ctx.createLinearGradient(sourceNode.x, sourceNode.y, targetNode.x, targetNode.y);
          grad.addColorStop(0, 'rgba(16, 185, 129, 0.25)'); // Forest Green
          grad.addColorStop(1, 'rgba(217, 165, 33, 0.25)'); // Gold
          ctx.strokeStyle = grad;
          ctx.beginPath();
          ctx.moveTo(sourceNode.x, sourceNode.y);
          ctx.lineTo(targetNode.x, targetNode.y);
          ctx.stroke();
        }
      });

      // Draw nodes
      nodes.forEach(node => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

        // Highlight emergency
        const isEmergency = node.category === 'Safety & Training';
        if (isEmergency) {
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 3;
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#ef4444';
          ctx.fillStyle = 'rgba(127, 29, 29, 0.85)';
        } else {
          ctx.strokeStyle = 'rgba(16, 185, 129, 0.7)';
          ctx.lineWidth = 2;
          ctx.shadowBlur = 8;
          ctx.shadowColor = 'rgba(16, 185, 129, 0.4)';
          ctx.fillStyle = 'rgba(6, 78, 59, 0.9)';
        }

        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Node Title Text
        ctx.fillStyle = '#f3f4f6';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Wrap text to fit inside bubble
        const words = node.title.split(' ');
        if (words.length > 2) {
          ctx.fillText(words.slice(0, 2).join(' '), node.x, node.y - 6);
          ctx.fillText(words.slice(2).join(' '), node.x, node.y + 6);
        } else {
          ctx.fillText(node.title, node.x, node.y);
        }
      });
    };

    const tick = () => {
      updatePhysics();
      draw();
      animationId = requestAnimationFrame(tick);
    };

    tick();

    // Mouse Drag Listeners
    const getMousePos = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const onMouseDown = (e: MouseEvent) => {
      const { x, y } = getMousePos(e);
      // Find clicked node
      for (const node of nodes) {
        const dx = node.x - x;
        const dy = node.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < node.radius) {
          draggedNode = node;
          isDragging = true;
          break;
        }
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging && draggedNode) {
        const { x, y } = getMousePos(e);
        draggedNode.x = x;
        draggedNode.y = y;
        draggedNode.vx = 0;
        draggedNode.vy = 0;
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      if (isDragging && draggedNode) {
        const { x, y } = getMousePos(e);
        const dx = draggedNode.x - x;
        const dy = draggedNode.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        // If it was a quick click, navigate to article
        if (!isDragging || dist < 2) {
          onNodeClick(draggedNode.id);
          onClose();
        }
      }
      isDragging = false;
      draggedNode = null;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseup', onMouseUp);
    };
  }, [articles, onNodeClick, onClose]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-screen h-screen bg-black/85 z-50 flex flex-col justify-between"
    >
      <header className="p-5 border-b border-neutral-800 bg-neutral-900/50 flex justify-between items-center z-10">
        <div>
          <h3 className="text-emerald-500 font-extrabold text-lg font-heading tracking-wide">
            HANDBOOK WIKI CONNECTION GRAPH
          </h3>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
            Interactive canvas force physics layout. Drag nodes to explore. Click to read.
          </p>
        </div>
        <button
          onClick={onClose}
          className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-750 text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors"
        >
          ✕ Close Graph Map
        </button>
      </header>

      <canvas ref={canvasRef} className="flex-1 block cursor-grab active:cursor-grabbing" />
    </div>
  );
}
export default WikiGraph;
