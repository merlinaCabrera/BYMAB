/**
 * BYMAB Studio — The Convergence Motion Narrative & Circular Orbital Navigation
 * Continuous Mathematical Geometry & Interactive Hub
 */
(() => {
  const curtain = document.getElementById('intro-curtain');
  const stage = document.getElementById('intro-stage');
  const svg = document.getElementById('intro-svg');
  const btnHome = document.getElementById('btn-home');
  const menuNodes = document.querySelectorAll('.hub-node');

  if (!curtain || !svg) return;

  // Geometry Constants
  // Two circles of radius R = 125 centered at c1 = -75 and c2 = +75
  // exactly intersect at (0, -100) and (0, +100), with width -50 to +50.
  const R = 125;
  const targetC = 75;
  const startC = 175;

  // Easing helpers
  const clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v));

  const easeOutCubic = (x) => {
    x = clamp(x);
    return 1 - Math.pow(1 - x, 3);
  };

  const easeInOutQuad = (x) => {
    x = clamp(x);
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  };

  const easeOutBack = (x) => {
    x = clamp(x);
    const c1 = 1.6;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  };

  function renderFrame(t) {
    t = clamp(t);

    // =========================================================================
    // 1. PHYSICAL GLIDE (t: 0.0 -> 0.48)
    // =========================================================================
    const glideProgress = easeOutCubic(t / 0.48);
    const c1 = -startC + (startC - targetC) * glideProgress;
    const c2 = startC - (startC - targetC) * glideProgress;
    const d = c2 - c1;
    const entryOpacity = clamp(t / 0.10);

    // =========================================================================
    // 2. INTERSECTION FORMATION (Active as soon as d < 2*R)
    // =========================================================================
    let hasIntersection = false;
    let h = 0;
    let lensPath = '';

    if (d < 2 * R) {
      hasIntersection = true;
      const halfD = d / 2;
      h = Math.sqrt(Math.max(0, R * R - halfD * halfD));
      lensPath = `M 0 ${-h.toFixed(2)} A ${R} ${R} 0 0 1 0 ${h.toFixed(2)} A ${R} ${R} 0 0 1 0 ${(-h).toFixed(2)} Z`;
    }

    // =========================================================================
    // 3. FUSION & OUTER CIRCLES DISSOLVE (t: 0.48 -> 0.70)
    // =========================================================================
    const outerFadeProgress = clamp((t - 0.46) / 0.22);
    const outerOpacity = (1 - easeInOutQuad(outerFadeProgress)) * entryOpacity;
    const lensWeight = 2.4 + 1.1 * clamp((t - 0.35) / 0.30);

    // Lateral accent ring
    const sideAuraProgress = easeOutCubic((t - 0.52) / 0.22);
    const sideAuraAngle = (1 - sideAuraProgress) * 25;

    // =========================================================================
    // 4. CLARITY DIAMOND IGNITION (t: 0.65 -> 0.88)
    // =========================================================================
    const diamondT = clamp((t - 0.65) / 0.20);
    const diamondScale = diamondT > 0 ? easeOutBack(diamondT) : 0;
    const diamondOpacity = clamp(diamondT * 1.5);

    // =========================================================================
    // 5. BREATHING PULSE (t: 0.86 -> 1.0)
    // =========================================================================
    let breathScale = 1;
    if (t > 0.86) {
      const p = (t - 0.86) / 0.14;
      breathScale = 1 + 0.03 * Math.sin(p * Math.PI);
    }

    // Compose SVG
    let markup = `
      <defs>
        <filter id="diamondBloom" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="glow"/>
          <feMerge>
            <feMergeNode in="glow"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <radialGradient id="lensShimmer" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#DBB8BD" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="#491E2A" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <g transform="scale(${breathScale.toFixed(4)})">
    `;

    // 1. Moving Circles (Outer wings)
    if (outerOpacity > 0.005) {
      markup += `
        <!-- Strategy Circle 01 (Solid Line, gliding from left) -->
        <circle cx="${c1.toFixed(2)}" cy="0" r="${R}"
          stroke="#F6F3EE" stroke-width="3" fill="none"
          opacity="${outerOpacity.toFixed(3)}"/>

        <!-- Creative Instinct Circle 02 (Dashed Line, gliding from right) -->
        <circle cx="${c2.toFixed(2)}" cy="0" r="${R}"
          stroke="#DBB8BD" stroke-width="2.8" stroke-dasharray="4 8" fill="none"
          opacity="${outerOpacity.toFixed(3)}"/>
      `;
    }

    // 2. The Living Intersecting Lens
    if (hasIntersection) {
      const lensAlpha = clamp((t - 0.20) / 0.25);
      markup += `
        <path d="${lensPath}" fill="url(#lensShimmer)" opacity="${lensAlpha.toFixed(3)}"/>
        <path d="${lensPath}" stroke="#F6F3EE" stroke-width="${lensWeight.toFixed(2)}"
          stroke-linejoin="round" fill="none" opacity="${lensAlpha.toFixed(3)}"/>
      `;
    }

    // 3. Lateral Accent Ticks
    if (sideAuraProgress > 0.005) {
      markup += `
        <g transform="rotate(${sideAuraAngle.toFixed(2)})" opacity="${sideAuraProgress.toFixed(3)}">
          <ellipse cx="0" cy="0" rx="84" ry="84"
            stroke="#DBB8BD" stroke-width="1.6" stroke-dasharray="2 7" fill="none"/>
        </g>
      `;
    }

    // 4. Focal Clarity Diamond
    if (diamondScale > 0.005) {
      markup += `
        <g transform="scale(${diamondScale.toFixed(4)})" opacity="${diamondOpacity.toFixed(3)}"
           filter="${t > 0.80 ? 'url(#diamondBloom)' : 'none'}">
          <polygon points="0,-36 24,0 0,36 -24,0" fill="#DBB8BD"/>
        </g>
      `;
    }

    markup += `</g>`;

    svg.innerHTML = markup;

    // Trigger Logo Elevation and Circular Menu Blossom (t >= 0.78)
    if (stage) {
      if (t >= 0.78 && !stage.classList.contains('menu-active')) {
        stage.classList.add('menu-active');
      } else if (t < 0.78 && stage.classList.contains('menu-active')) {
        stage.classList.remove('menu-active');
      }
    }
  }

  function playIntro(duration = 2000) {
    // Accessibility check
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      renderFrame(1);
      if (stage) stage.classList.add('menu-active');
      return;
    }

    curtain.classList.remove('intro-done');
    curtain.style.pointerEvents = 'auto';
    if (stage) stage.classList.remove('menu-active');

    let animId;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      renderFrame(progress);

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      }
      // Note: At progress === 1, we deliberately DO NOT auto-dismiss.
      // The logo remains elevated and the circular orbital menu invites the user!
    }

    animId = requestAnimationFrame(step);
  }

  // Smoothly unveil site and navigate to destination
  function unveilSite(targetSelector = null) {
    curtain.classList.add('intro-done');
    document.body.classList.add('intro-finished');

    if (targetSelector && targetSelector !== '#hero') {
      const targetEl = document.querySelector(targetSelector);
      if (targetEl) {
        setTimeout(() => {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Bind Central Home Button
  if (btnHome) {
    btnHome.addEventListener('click', (e) => {
      e.preventDefault();
      unveilSite('#hero');
    });
  }

  // Bind Satellite Orbital Nodes
  menuNodes.forEach((node) => {
    const handler = (e) => {
      e.preventDefault();
      const action = node.getAttribute('data-action');
      if (action === 'replay') {
        playIntro(2050);
        return;
      }
      const target = node.getAttribute('data-target');
      unveilSite(target);
    };

    node.addEventListener('click', handler);
    node.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handler(e);
      }
    });
  });

  // Auto-play on direct visit, refresh, and load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => playIntro(2050));
  } else {
    playIntro(2050);
  }

  // Expose global controller
  window.BYMABIntro = {
    play: playIntro,
    unveil: unveilSite
  };

  // Replay on clicking brand logo in header
  const brandLink = document.querySelector('header .brand');
  if (brandLink) {
    brandLink.addEventListener('click', (e) => {
      e.preventDefault();
      playIntro(1850);
    });
  }
})();
