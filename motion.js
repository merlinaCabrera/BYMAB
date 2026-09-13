/**
 * BYMAB Studio — The Convergence Motion Narrative
 * Strategy × Creative Instinct
 */
(() => {
  const curtain = document.getElementById('intro-curtain');
  const svg = document.getElementById('intro-svg');
  const brand = document.getElementById('intro-brand');
  if (!curtain || !svg) return;

  const lensPath = 'M0 -100 C66 -42 66 42 0 100 C-66 42 -66 -42 0 -100Z';
  const diamondPath = 'M0 -36 24 0 0 36 -24 0Z';

  const clamp = (x) => Math.max(0, Math.min(1, x));
  const ease = (x) => {
    x = clamp(x);
    return x * x * (3 - 2 * x);
  };
  const cubic = (x) => {
    x = clamp(x);
    // Custom cubic-bezier approximation for luxury deceleration
    return 1 - Math.pow(1 - x, 3);
  };

  function renderFrame(t) {
    t = clamp(t);
    const e = ease(t);

    // 01 / ANALYSIS & 02 / INTUITION (Circles approach and overlap)
    // Between t=0 and t=0.55: circles move from +/-95 towards +/-35
    const approach = ease(t / 0.52);
    const circleFade = 1 - ease((t - 0.38) / 0.28);
    const cxLeft = -95 + 60 * approach;
    const cxRight = 95 - 60 * approach;

    // 03 / CONVERGENCE (The lens aperture coalesces)
    const lensOpacity = ease((t - 0.35) / 0.28);
    const sideAuraOpacity = ease((t - 0.48) / 0.28) * 0.7;

    // 04 / CLARITY (The diamond ignites and blooms)
    const diamondProgress = ease((t - 0.64) / 0.26);
    const diamondScale = 0.6 + 0.4 * diamondProgress;
    const diamondOpacity = diamondProgress;

    // Pulse at finish (t > 0.90)
    let pulseScale = 1;
    if (t > 0.88) {
      const p = (t - 0.88) / 0.12;
      pulseScale = 1 + 0.08 * Math.sin(p * Math.PI);
    }

    let markup = `
      <defs>
        <filter id="clarityGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
    `;

    // Phase 1: Circles
    if (circleFade > 0.001) {
      markup += `
        <g opacity="${circleFade}">
          <!-- Strategy Circle (Solid) -->
          <circle cx="${cxLeft}" cy="0" r="76" stroke="#F6F3EE" stroke-width="3.5" fill="none" opacity="${ease(t / 0.25)}"/>
          <!-- Creative Instinct Circle (Dashed) -->
          <circle cx="${cxRight}" cy="0" r="76" stroke="#DBB8BD" stroke-width="3" stroke-dasharray="3 7" fill="none" opacity="${ease(t / 0.2)}"/>
        </g>
      `;
    }

    // Phase 2: Lateral Accent Ring
    if (sideAuraOpacity > 0.001) {
      markup += `
        <g opacity="${sideAuraOpacity}">
          <ellipse cx="0" cy="0" rx="84" ry="84" stroke="#DBB8BD" stroke-width="1.6" stroke-dasharray="2 7" fill="none"/>
        </g>
      `;
    }

    // Phase 3: Coalesced Optical Lens
    if (lensOpacity > 0.001) {
      markup += `
        <g opacity="${lensOpacity}">
          <path d="${lensPath}" stroke="#F6F3EE" stroke-width="3.5" stroke-linejoin="round" fill="none"/>
        </g>
      `;
    }

    // Phase 4: Center Diamond
    if (diamondOpacity > 0.001) {
      const totalScale = diamondScale * pulseScale;
      markup += `
        <g opacity="${diamondOpacity}" transform="scale(${totalScale})" filter="${t > 0.82 ? 'url(#clarityGlow)' : 'none'}">
          <path d="${diamondPath}" fill="#DBB8BD" stroke="none"/>
        </g>
      `;
    }

    svg.innerHTML = markup;

    // Brand Reveal (subtle text below)
    if (brand) {
      if (t >= 0.72 && !brand.classList.contains('revealed')) {
        brand.classList.add('revealed');
      } else if (t < 0.72 && brand.classList.contains('revealed')) {
        brand.classList.remove('revealed');
      }
    }
  }

  function playIntro(duration = 1800) {
    // Reduced motion preference
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      renderFrame(1);
      setTimeout(() => {
        curtain.classList.add('intro-done');
        document.body.classList.add('intro-finished');
      }, 200);
      return;
    }

    curtain.classList.remove('intro-done');
    curtain.style.pointerEvents = 'auto';
    if (brand) brand.classList.remove('revealed');

    let animId;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      renderFrame(progress);

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      } else {
        // Complete motion with a breath, then unveil the site
        setTimeout(() => {
          curtain.classList.add('intro-done');
          document.body.classList.add('intro-finished');
        }, 220);
      }
    }

    animId = requestAnimationFrame(step);
  }

  // Auto-run immediately on page load / refresh
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => playIntro(1850));
  } else {
    playIntro(1850);
  }

  // Expose global controller & allow re-playing by clicking header brand
  window.BYMABIntro = { play: playIntro };

  const brandLink = document.querySelector('header .brand');
  if (brandLink) {
    brandLink.addEventListener('click', (e) => {
      // Re-trigger intro if desired
      if (window.scrollY < 50) {
        e.preventDefault();
        playIntro(1750);
      }
    });
  }
})();
