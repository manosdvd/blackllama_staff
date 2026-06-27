import { generateSlug } from '../services/wikiService.js';

export function renderWikiGraph() {
  return `
    <div class="wiki-graph-container" style="position: relative; width: 100%; height: 500px; background: hsl(var(--card) / 0.7); border: 1px solid hsl(var(--border) / 0.5); border-radius: var(--radius-md); overflow: hidden; margin-bottom: 24px;">
      <div style="position: absolute; top: 12px; left: 16px; z-index: 10; pointer-events: none;">
        <h3 style="margin: 0 0 4px 0; font-family: var(--font-heading); font-size: 18px; color: hsl(var(--primary)); text-shadow: 0 0 8px hsl(var(--primary) / 0.3);">Handbook Connections Graph</h3>
        <p style="margin: 0; font-size: 12px; color: hsl(var(--muted-foreground));">Click nodes to navigate • Drag to reorganize</p>
      </div>
      <div style="position: absolute; top: 12px; right: 16px; z-index: 10; display: flex; gap: 8px;">
        <button id="graph-reset-btn" class="glass-btn" style="padding: 4px 10px; font-size: 12px;">Reset Layout</button>
        <button id="graph-close-btn" class="glass-btn" style="padding: 4px 10px; font-size: 12px; background: hsl(var(--danger) / 0.1); color: hsl(var(--danger)); border-color: hsl(var(--danger) / 0.2);">Close Graph</button>
      </div>
      <canvas id="wiki-graph-canvas" style="display: block; width: 100%; height: 100%; cursor: grab;"></canvas>
      <div id="graph-tooltip" style="position: absolute; pointer-events: none; background: hsl(var(--popover)); border: 1px solid hsl(var(--border)); border-radius: var(--radius-sm); padding: 6px 10px; font-size: 12px; color: hsl(var(--popover-foreground)); box-shadow: var(--shadow-md); opacity: 0; transition: opacity 0.15s; font-weight: 500; font-family: var(--font-body); z-index: 20;"></div>
    </div>
  `;
}

export function initWikiGraph(pages, onNavigate, onClose) {
  const canvas = document.getElementById('wiki-graph-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const tooltip = document.getElementById('graph-tooltip');
  const resetBtn = document.getElementById('graph-reset-btn');
  const closeBtn = document.getElementById('graph-close-btn');

  if (closeBtn && onClose) {
    closeBtn.addEventListener('click', onClose);
  }

  // Set canvas scale for high DPI displays
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
  resizeCanvas();

  // Color map for categories
  const categoryColors = {
    'Culture & Training': '#3b82f6', // blue
    'Policies & Laws': '#eab308',     // amber/yellow
    'Emergency & Safety': '#ef4444',  // red
    'General': '#10b981',             // emerald green
    'Songbook & Skits': '#8b5cf6'      // purple
  };

  // Build nodes and links
  const nodes = [];
  const links = [];

  // Create nodes
  pages.forEach((p, idx) => {
    const angle = (idx / pages.length) * Math.PI * 2;
    const radius = 160;
    const centerX = canvas.clientWidth / 2;
    const centerY = canvas.clientHeight / 2;

    nodes.push({
      id: p.slug,
      title: p.title,
      category: p.category || 'General',
      x: centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * 30,
      y: centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * 30,
      vx: 0,
      vy: 0,
      radius: p.category?.includes('Emergency') ? 14 : 10,
      isEmergency: !!p.category?.includes('Emergency')
    });
  });

  // Create links (edges) based on wiki link references
  pages.forEach(p => {
    const content = p.content || '';
    const wikiLinkRegex = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
    let match;

    while ((match = wikiLinkRegex.exec(content)) !== null) {
      const target = match[1];
      const targetSlug = generateSlug(target);
      const targetNode = nodes.find(n => n.id === targetSlug || n.title.toLowerCase() === target.toLowerCase().trim());
      const sourceNode = nodes.find(n => n.id === p.slug);

      if (sourceNode && targetNode && sourceNode.id !== targetNode.id) {
        // Avoid duplicate links in the same direction
        const exists = links.some(l => l.source === sourceNode.id && l.target === targetNode.id);
        if (!exists) {
          links.push({
            source: sourceNode,
            target: targetNode
          });
        }
      }
    }
  });

  let dragNode = null;
  let hoverNode = null;
  let animationFrameId = null;

  // Simple Force-Directed Graph physics simulation
  function tickPhysics() {
    const kRepel = 300;     // Repulsion constant
    const kAttract = 0.05;   // Link stiffness
    const kGravity = 0.02;   // Pull toward center
    const damping = 0.85;    // Friction
    const center = { x: canvas.clientWidth / 2, y: canvas.clientHeight / 2 };

    // 1. Repulsion between all nodes
    for (let i = 0; i < nodes.length; i++) {
      const n1 = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const n2 = nodes[j];
        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const dist = Math.hypot(dx, dy) || 1;
        const force = kRepel / (dist * dist);

        // Cap maximum force to avoid infinite explosions
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        if (n1 !== dragNode) {
          n1.vx -= fx;
          n1.vy -= fy;
        }
        if (n2 !== dragNode) {
          n2.vx += fx;
          n2.vy += fy;
        }
      }
    }

    // 2. Attraction along links
    links.forEach(link => {
      const source = link.source;
      const target = link.target;
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const dist = Math.hypot(dx, dy) || 1;

      // Rest length is 80px
      const restLength = 100;
      const force = (dist - restLength) * kAttract;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;

      if (source !== dragNode) {
        source.vx += fx;
        source.vy += fy;
      }
      if (target !== dragNode) {
        target.vx -= fx;
        target.vy -= fy;
      }
    });

    // 3. Gravity and central pull
    nodes.forEach(n => {
      if (n === dragNode) return;
      const dx = center.x - n.x;
      const dy = center.y - n.y;
      n.vx += dx * kGravity;
      n.vy += dy * kGravity;

      // Apply velocities and friction
      n.x += n.vx;
      n.y += n.vy;
      n.vx *= damping;
      n.vy *= damping;

      // Keep inside bounds
      const padding = 20;
      n.x = Math.max(padding, Math.min(canvas.clientWidth - padding, n.x));
      n.y = Math.max(padding, Math.min(canvas.clientHeight - padding, n.y));
    });
  }

  // Drawing loop
  function draw() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    // 1. Draw links (edges)
    ctx.lineWidth = 1.5;
    links.forEach(link => {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath();
      ctx.moveTo(link.source.x, link.source.y);
      ctx.lineTo(link.target.x, link.target.y);
      ctx.stroke();

      // Draw small direction indicator arrow halfway
      const midX = (link.source.x + link.target.x) / 2;
      const midY = (link.source.y + link.target.y) / 2;
      const angle = Math.atan2(link.target.y - link.source.y, link.target.x - link.source.x);
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.beginPath();
      ctx.arc(midX, midY, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // 2. Draw nodes
    nodes.forEach(node => {
      const color = categoryColors[node.category] || '#10b981';
      
      // Node glow aura
      const shadowGradient = ctx.createRadialGradient(node.x, node.y, 2, node.x, node.y, node.radius * 2);
      shadowGradient.addColorStop(0, color);
      shadowGradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = shadowGradient;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Core node body
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fill();

      // Emergency special rings
      if (node.isEmergency) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        const pulse = 1 + Math.sin(Date.now() / 150) * 0.15;
        ctx.arc(node.x, node.y, node.radius * pulse * 1.3, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Border outline
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = node === hoverNode ? 2.5 : 1;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.stroke();

      // Draw node text (only if hovered or node is large/important)
      const isImportant = node.isEmergency || nodes.length < 15;
      if (node === hoverNode || isImportant) {
        ctx.fillStyle = '#ffffff';
        ctx.font = node === hoverNode 
          ? 'bold 12.5px Outfit, sans-serif'
          : '500 11px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 4;
        
        ctx.fillText(node.title, node.x, node.y + node.radius + 5);
        
        // Reset shadows
        ctx.shadowBlur = 0;
      }
    });
  }

  // Animation Frame callback
  function loop() {
    tickPhysics();
    draw();
    animationFrameId = requestAnimationFrame(loop);
  }
  animationFrameId = requestAnimationFrame(loop);

  // Mouse & Touch interaction
  function getCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function findNodeAt(x, y) {
    return nodes.find(node => Math.hypot(node.x - x, node.y - y) <= node.radius + 6);
  }

  // Mouse event listeners
  function handleDown(e) {
    const coords = getCoordinates(e);
    const clickedNode = findNodeAt(coords.x, coords.y);

    if (clickedNode) {
      dragNode = clickedNode;
      canvas.style.cursor = 'grabbing';
      if (!e.touches) e.preventDefault();
    }
  }

  function handleMove(e) {
    const coords = getCoordinates(e);
    
    if (dragNode) {
      dragNode.x = coords.x;
      dragNode.y = coords.y;
      dragNode.vx = 0;
      dragNode.vy = 0;
    } else {
      const node = findNodeAt(coords.x, coords.y);
      if (node !== hoverNode) {
        hoverNode = node;
        canvas.style.cursor = node ? 'pointer' : 'grab';

        // Tooltip control
        if (node) {
          tooltip.innerHTML = `
            <div style="font-weight:700; color: ${categoryColors[node.category] || 'inherit'}; margin-bottom: 2px;">${node.title}</div>
            <div style="font-size:10.5px; opacity:0.8;">Category: ${node.category}</div>
          `;
          tooltip.style.opacity = '1';
          const canvasRect = canvas.getBoundingClientRect();
          tooltip.style.left = `${node.x + 15}px`;
          tooltip.style.top = `${node.y - 20}px`;
        } else {
          tooltip.style.opacity = '0';
        }
      } else if (node) {
        // Follow cursor/node position
        tooltip.style.left = `${node.x + 15}px`;
        tooltip.style.top = `${node.y - 20}px`;
      }
    }
  }

  function handleUp(e) {
    if (dragNode) {
      // If we didn't drag it far, treat it as a click
      const coords = getCoordinates(e);
      const nodeAtEnd = findNodeAt(coords.x, coords.y);
      
      if (nodeAtEnd === dragNode && onNavigate) {
        onNavigate(dragNode.id);
      }
      
      dragNode = null;
      canvas.style.cursor = hoverNode ? 'pointer' : 'grab';
    }
  }

  canvas.addEventListener('mousedown', handleDown);
  canvas.addEventListener('mousemove', handleMove);
  window.addEventListener('mouseup', handleUp);

  canvas.addEventListener('touchstart', handleDown, { passive: true });
  canvas.addEventListener('touchmove', handleMove, { passive: true });
  window.addEventListener('touchend', handleUp);

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      // Re-distribute nodes in circle
      nodes.forEach((n, idx) => {
        const angle = (idx / nodes.length) * Math.PI * 2;
        const radius = 160;
        const centerX = canvas.clientWidth / 2;
        const centerY = canvas.clientHeight / 2;
        n.x = centerX + Math.cos(angle) * radius;
        n.y = centerY + Math.sin(angle) * radius;
        n.vx = 0;
        n.vy = 0;
      });
    });
  }

  // Cleanup function
  return () => {
    cancelAnimationFrame(animationFrameId);
    canvas.removeEventListener('mousedown', handleDown);
    canvas.removeEventListener('mousemove', handleMove);
    window.removeEventListener('mouseup', handleUp);
    canvas.removeEventListener('touchstart', handleDown);
    canvas.removeEventListener('touchmove', handleMove);
    window.removeEventListener('touchend', handleUp);
  };
}
