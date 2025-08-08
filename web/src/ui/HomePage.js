export class HomePage {
  constructor() {
    this.container = null;
  }

  render(container) {
    this.container = container;
    
    container.innerHTML = `
      <link rel="stylesheet" href="/src/landing.css" />
      <header class="site-nav">
        <div class="container">
          <div class="brand">SevaSwiftUI</div>
          <nav class="nav-links">
            <a href="#preview" onclick="window.router.go('/preview'); return false;">Preview</a>
            <a href="https://github.com/yourusername/seva-swiftui" target="_blank" rel="noreferrer">GitHub</a>
            <a class="badge">BETA</a>
          </nav>
        </div>
      </header>

      <section class="hero">
        <div class="glow" aria-hidden="true"></div>
        <div class="container">
          <div class="glass" id="heroCard">
            <h1 class="display">SwiftUI Web Preview</h1>
            <p class="lede">Design iOS-style UIs on Windows & Linux. Live, private, fast.</p>
            <div class="cta">
              <a class="btn accent" href="#preview" onclick="window.router.go('/preview'); return false;">Open Preview</a>
              <a class="btn tonal" href="https://github.com/yourusername/seva-swiftui" target="_blank" rel="noreferrer">GitHub</a>
            </div>
            <p class="legal">Not affiliated with Apple. Build & sign on macOS with Xcode.</p>
          </div>
        </div>
      </section>

      <section id="preview" class="section">
        <div class="container two-col">
          <div class="card">
            <div class="section-title">
              <h2>Editor</h2>
              <div class="actions">
                <button class="btn tiny tonal" onclick="window.router.go('/preview')">Open</button>
              </div>
            </div>
            <pre class="code">VStack(spacing: 16) {
  Text("Hello, iOS-style Web Preview").font(.title2).bold()
  Button("Primary Action") { /* … */ }
    .buttonStyle(.borderedProminent)
}</pre>
          </div>
          <div class="card">
            <div class="section-title"><h2>Preview</h2><span class="muted">Approximation</span></div>
            <div class="preview-surface">
              <div class="preview-placeholder">Your view renders here</div>
            </div>
          </div>
        </div>
      </section>

      <section id="templates" class="section">
        <div class="container">
          <h2>Templates</h2>
          <div class="cards-grid">
            <div class="card small"><h3>List</h3><p>Basic list with dividers.</p></div>
            <div class="card small"><h3>Navigation</h3><p>Push/pop stack.</p></div>
            <div class="card small"><h3>Cards</h3><p>Glass + progress.</p></div>
            <div class="card small"><h3>Forms</h3><p>Inputs & toggles.</p></div>
          </div>
        </div>
      </section>

      <footer class="site-footer">
        <div class="container">
          <span class="muted">© ${new Date().getFullYear()} Not affiliated with Apple.</span>
          <a href="#" class="muted">Privacy</a>
        </div>
      </footer>
    `;

    // Add CSS
    this.addStyles();
  }

  renderTemplateCard(title, description, type) {
    return `
      <div class="template-card surface" style="padding: var(--spacing-lg); cursor: pointer; transition: all var(--duration-normal) var(--easing);" 
           onmouseover="this.style.transform='translateY(-4px)'" 
           onmouseout="this.style.transform='translateY(0)'"
           onclick="window.router.go('/preview?template=${type}')">
        <div class="template-preview" style="height: 120px; background: var(--surface-2); border-radius: var(--radius-pill); margin-bottom: var(--spacing-base); display: flex; align-items: center; justify-content: center;">
          <span class="text-caption text-2">Preview</span>
        </div>
        <h3 class="text-body" style="margin: 0 0 var(--spacing-xs) 0; font-weight: 600;">${title}</h3>
        <p class="text-caption" style="margin: 0;">${description}</p>
      </div>
    `;
  }

  renderMatrixItem(name, status) {
    const statusColors = {
      'supported': 'var(--success)',
      'partial': 'var(--warning)',
      'no-op': 'var(--error)'
    };
    
    return `
      <div class="matrix-item flex items-center gap-sm">
        <div class="status-dot" style="width: 8px; height: 8px; background: ${statusColors[status]}; border-radius: 50%;"></div>
        <span class="text-caption">${name}</span>
      </div>
    `;
  }

  addStyles() {
    // Attach tilt behavior (inline to avoid extra file)
    const tilt = document.createElement('script');
    tilt.textContent = `(() => {const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; const card = document.getElementById('heroCard'); if (!card || prefersReduce) return; let raf=null; const clamp=(n,min,max)=>Math.max(min,Math.min(n,max)); function onMove(e){const r=card.getBoundingClientRect(); const cx=r.left+r.width/2, cy=r.top+r.height/2; const dx=(e.clientX-cx)/(r.width/2); const dy=(e.clientY-cy)/(r.height/2); const rx=clamp(dy*6,-6,6); const ry=clamp(-dx*6,-6,6); if(raf) cancelAnimationFrame(raf); raf=requestAnimationFrame(()=>{card.style.transform=\`perspective(1200px) rotateX(\${rx}deg) rotateY(\${ry}deg) translateZ(0)\`; card.style.boxShadow='0 16px 60px rgba(0,0,0,.45)';});} function onLeave(){if(raf) cancelAnimationFrame(raf); card.style.transform=''; card.style.boxShadow='';} card.addEventListener('pointermove', onMove); card.addEventListener('pointerleave', onLeave);})();`;
    document.body.appendChild(tilt);
  }

  destroy() {
    // Cleanup if needed
  }
}
