import { MonacoEditor } from '../editor/MonacoEditor.js';
import { getTemplate, getAllTemplates } from '../templates/index.js';
import { WasmRuntime } from '../renderer/WasmRuntime.js';
import { CompileService } from '../renderer/CompileService.js';

export class PreviewPage {
  constructor() {
    this.container = null;
    this.editor = null;
    this.monacoEditor = null;
    this.currentTemplate = 'hello';
    this.wasmRuntime = new WasmRuntime();
    this.compileService = new CompileService();
  }

  render(container) {
    this.container = container;
    
    // Check for template parameter
    const urlParams = new URLSearchParams(window.location.search);
    const template = urlParams.get('template');
    if (template) {
      this.currentTemplate = template;
    }
    
    container.innerHTML = `
      <div class="preview-page" style="height: 100vh; display: flex; flex-direction: column;">
        <!-- Header -->
        <header class="preview-header" style="padding: var(--spacing-base); border-bottom: 1px solid var(--stroke); background: var(--surface);">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-base">
              <button class="btn btn-ghost" onclick="window.router.go('/')" style="padding: var(--spacing-sm);">
                ← Back
              </button>
              <h1 class="text-title" style="margin: 0;">SwiftUI Preview</h1>
            </div>
            <div class="toolbar flex items-center gap-sm">
              <button id="runBtn" class="btn btn-primary">
                <span>Run</span>
              </button>
              <button id="themeBtn" class="btn btn-secondary">
                <span>Dark</span>
              </button>
              <button id="resetBtn" class="btn btn-secondary">
                <span>Reset</span>
              </button>
            </div>
          </div>
        </header>

        <!-- Main Content -->
        <div class="preview-content flex" style="flex: 1; overflow: hidden;">
          <!-- Editor Panel -->
          <div class="editor-panel" style="width: 50%; border-right: 1px solid var(--stroke); display: flex; flex-direction: column;">
            <div class="editor-toolbar" style="padding: var(--spacing-sm) var(--spacing-base); background: var(--surface); border-bottom: 1px solid var(--stroke);">
              <select id="templateSelect" class="input" style="background: var(--surface-2); border: 1px solid var(--stroke); padding: var(--spacing-xs) var(--spacing-sm);">
                ${this.renderTemplateOptions()}
              </select>
            </div>
            <div id="editor" style="flex: 1;"></div>
          </div>

          <!-- Preview Panel -->
          <div class="preview-panel" style="width: 50%; display: flex; flex-direction: column;">
            <!-- Preview Toolbar -->
            <div class="preview-toolbar" style="padding: var(--spacing-sm) var(--spacing-base); background: var(--surface); border-bottom: 1px solid var(--stroke);">
              <div class="flex items-center gap-base">
                <span class="text-caption">Dynamic Type:</span>
                <input id="dynamicTypeSlider" type="range" min="0.8" max="1.4" step="0.1" value="1.0" style="flex: 1; max-width: 120px;">
                <span id="dynamicTypeValue" class="text-caption">1.0x</span>
              </div>
            </div>

            <!-- Preview Content -->
            <div class="preview-content-area" style="flex: 1; display: flex; flex-direction: column;">
              <!-- Device Frame -->
              <div class="device-frame" style="margin: var(--spacing-base); flex: 1; background: var(--bg); border: 8px solid #1C1C1E; border-radius: 24px; overflow: hidden; position: relative;">
                <div id="previewOutput" style="width: 100%; height: 100%; background: #000; color: white; display: flex; align-items: center; justify-content: center;">
                  <div class="preview-placeholder">
                    <p style="margin: 0; text-align: center; color: #666;">
                      Click "Run" to see your SwiftUI preview
                    </p>
                  </div>
                </div>
              </div>

              <!-- Support Matrix & Errors -->
              <div class="preview-info" style="margin: 0 var(--spacing-base) var(--spacing-base) var(--spacing-base);">
                <!-- Support Matrix -->
                <div class="support-matrix surface" style="padding: var(--spacing-base); margin-bottom: var(--spacing-sm);">
                  <h4 class="text-caption" style="margin: 0 0 var(--spacing-sm) 0; color: var(--text-2);">Support Status</h4>
                  <div id="supportStatus" class="flex flex-col gap-xs">
                    <div class="flex items-center gap-sm">
                      <div class="status-dot" style="width: 8px; height: 8px; background: var(--success); border-radius: 50%;"></div>
                      <span class="text-caption">Ready to analyze...</span>
                    </div>
                  </div>
                </div>

                <!-- Error Console -->
                <div class="error-console surface" style="padding: var(--spacing-base);">
                  <h4 class="text-caption" style="margin: 0 0 var(--spacing-sm) 0; color: var(--text-2);">Console</h4>
                  <div id="errorOutput" class="console-output" style="font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace; font-size: 12px; line-height: 1.4; min-height: 60px; max-height: 120px; overflow-y: auto; background: var(--bg); border: 1px solid var(--stroke); border-radius: var(--radius-input); padding: var(--spacing-sm);">
                    <div class="console-line text-2">
                      Ready for compilation...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Initialize components
    this.initializeEditor();
    this.setupEventListeners();
    this.loadTemplate(this.currentTemplate);
    this.checkServerConnection();
  }

  async initializeEditor() {
    const editorContainer = document.getElementById('editor');
    
    try {
      // Initialize Monaco Editor
      this.monacoEditor = new MonacoEditor(editorContainer, {
        language: 'swift',
        theme: 'seva-dark'
      });
      
      this.editor = await this.monacoEditor.initialize();
      
      // Auto-save and analyze on input
      this.editor.onDidChangeModelContent(() => {
        this.debounce(() => {
          this.analyzeCode();
        }, 500)();
      });
      
    } catch (error) {
      console.error('Monaco initialization failed, using fallback:', error);
      // Fallback to textarea
      this.createFallbackEditor(editorContainer);
    }
  }

  createFallbackEditor(container) {
    container.innerHTML = `
      <textarea id="codeEditor" style="
        width: 100%; 
        height: 100%; 
        background: var(--bg); 
        color: var(--text); 
        border: none; 
        outline: none; 
        padding: var(--spacing-base); 
        font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace; 
        font-size: 14px; 
        line-height: 1.5;
        resize: none;
      " placeholder="Write your SwiftUI code here..."></textarea>
    `;

    const textarea = document.getElementById('codeEditor');
    this.editor = {
      getValue: () => textarea.value,
      setValue: (value) => { textarea.value = value; },
      onDidChangeModelContent: (callback) => {
        textarea.addEventListener('input', callback);
      }
    };
    
    // Auto-save and analyze on input
    textarea.addEventListener('input', () => {
      this.debounce(() => {
        this.analyzeCode();
      }, 500)();
    });
  }

  setupEventListeners() {
    // Run button
    document.getElementById('runBtn').addEventListener('click', () => {
      this.runCode();
    });

    // Theme toggle
    document.getElementById('themeBtn').addEventListener('click', () => {
      this.toggleTheme();
    });

    // Reset button
    document.getElementById('resetBtn').addEventListener('click', () => {
      this.resetCode();
    });

    // Template selector
    document.getElementById('templateSelect').addEventListener('change', (e) => {
      this.loadTemplate(e.target.value);
    });

    // Dynamic Type slider
    const slider = document.getElementById('dynamicTypeSlider');
    const valueDisplay = document.getElementById('dynamicTypeValue');
    
    slider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      valueDisplay.textContent = `${value.toFixed(1)}x`;
      this.updateDynamicType(value);
    });
  }

  renderTemplateOptions() {
    const templateEntries = [
      ['hello', 'Hello VStack'],
      ['list', 'List View'],
      ['navigation', 'Navigation'],
      ['cards', 'Cards'],
      ['forms', 'Forms'],
      ['animations', 'Animations'],
      ['weather', 'Weather App']
    ];
    
    return templateEntries.map(([key, name]) => 
      `<option value="${key}">${name}</option>`
    ).join('');
  }

  loadTemplate(templateName) {
    const template = getTemplate(templateName);
    
    if (template && this.editor) {
      this.editor.setValue(template.code);
      document.getElementById('templateSelect').value = templateName;
      this.analyzeCode();
    }
  }

  analyzeCode() {
    const code = this.editor.getValue();
    const supportStatus = document.getElementById('supportStatus');
    
    // Simple analysis of SwiftUI components
    const analysis = this.analyzeSwiftUICode(code);
    
    supportStatus.innerHTML = analysis.map(item => `
      <div class="flex items-center gap-sm">
        <div class="status-dot" style="width: 8px; height: 8px; background: ${this.getStatusColor(item.status)}; border-radius: 50%;"></div>
        <span class="text-caption">${item.component} - ${item.status}</span>
      </div>
    `).join('');

    // Track unsupported APIs
    const unsupported = analysis.filter(item => item.status === 'no-op');
    if (unsupported.length > 0) {
      unsupported.forEach(item => {
        window.analytics?.track('unsupported_api_used', { name: item.component });
      });
    }
  }

  analyzeSwiftUICode(code) {
    const analysis = [];
    
    // Define support matrix
    const supportMatrix = {
      'Text': 'supported',
      'VStack': 'supported',
      'HStack': 'supported',
      'Button': 'supported',
      'Image': 'supported',
      'NavigationView': 'partial',
      'NavigationLink': 'partial',
      'List': 'partial',
      'ScrollView': 'partial',
      'LazyVStack': 'partial',
      'Form': 'partial',
      'TextField': 'supported',
      'Toggle': 'supported',
      'Picker': 'partial',
      'ForEach': 'supported',
      'matchedGeometryEffect': 'no-op',
      'safeAreaInset': 'no-op'
    };

    // Simple regex-based analysis
    for (const [component, status] of Object.entries(supportMatrix)) {
      const regex = new RegExp(`\\b${component}\\b`, 'g');
      if (regex.test(code)) {
        analysis.push({ component, status });
      }
    }

    if (analysis.length === 0) {
      analysis.push({ component: 'No components detected', status: 'info' });
    }

    return analysis;
  }

  getStatusColor(status) {
    const colors = {
      'supported': 'var(--success)',
      'partial': 'var(--warning)',
      'no-op': 'var(--error)',
      'info': 'var(--text-2)'
    };
    return colors[status] || colors.info;
  }

  async runCode() {
    const code = this.editor.getValue();
    const errorOutput = document.getElementById('errorOutput');
    const previewOutput = document.getElementById('previewOutput');
    const runBtn = document.getElementById('runBtn');

    // Update UI state
    runBtn.disabled = true;
    runBtn.textContent = 'Compiling...';
    errorOutput.innerHTML = '<div class="console-line text-2">Compiling Swift code...</div>';
    previewOutput.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666;">Compiling...</div>';

    try {
      // Compile the code
      const result = await this.compileService.compile(code);
      
      if (result.success) {
        // Display compilation info
        const messages = [
          `✓ Compilation successful ${result.cached ? '(cached)' : ''}`,
          ...(result.logs || []),
          ...(result.warnings || []).map(w => `⚠ ${w}`)
        ];
        
        errorOutput.innerHTML = messages.map(msg => 
          `<div class="console-line ${msg.startsWith('✓') ? 'text-success' : msg.startsWith('⚠') ? 'text-warning' : 'text-2'}">${msg}</div>`
        ).join('');

        // Load and execute WASM
        const runtimeResult = await this.wasmRuntime.loadAndExecute(
          result.wasm, 
          result.js, 
          previewOutput
        );

        if (!runtimeResult.success) {
          throw new Error(`Runtime error: ${runtimeResult.error}`);
        }

        // Track successful run
        this.compileService.sendTelemetry('run_ok', {
          cached: result.cached,
          compilationTime: result.compilationTime,
          codeLength: code.length
        });

      } else {
        throw new Error(result.message || 'Compilation failed');
      }
      
    } catch (error) {
      console.error('Compilation failed:', error);
      
      // Show error
      errorOutput.innerHTML = `<div class="console-line text-error">✗ ${error.message}</div>`;
      previewOutput.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #666; text-align: center; padding: 20px;">
          <div style="font-size: 18px; margin-bottom: 8px;">Compilation Failed</div>
          <div style="font-size: 14px;">${error.message}</div>
        </div>
      `;

      // Track error
      this.compileService.sendTelemetry('run_error', {
        error: error.message,
        codeLength: code.length
      });
      
    } finally {
      // Reset UI state
      runBtn.disabled = false;
      runBtn.textContent = 'Run';
    }
  }

  showMockPreview(code) {
    const previewOutput = document.getElementById('previewOutput');
    
    // Simple mock preview based on detected components
    let mockHTML = '<div style="padding: 16px; font-family: -apple-system, sans-serif;">';
    
    if (code.includes('VStack')) {
      mockHTML += '<div style="display: flex; flex-direction: column; gap: 12px; align-items: center;">';
    }
    
    if (code.includes('Text("Hello')) {
      mockHTML += '<div style="font-size: 24px; font-weight: 600; color: white;">Hello, SwiftUI!</div>';
    }
    
    if (code.includes('Text("Welcome')) {
      mockHTML += '<div style="font-size: 16px; color: #999;">Welcome to the web preview</div>';
    }
    
    if (code.includes('Button')) {
      mockHTML += '<button style="padding: 8px 16px; background: #007AFF; color: white; border: none; border-radius: 8px; font-size: 16px;">Tap me!</button>';
    }
    
    if (code.includes('List')) {
      mockHTML += '<div style="background: #1c1c1e; border-radius: 8px; padding: 8px; width: 100%;">';
      const items = ['Apple', 'Banana', 'Cherry', 'Date'];
      items.forEach(item => {
        mockHTML += `<div style="padding: 12px; border-bottom: 1px solid #333; color: white;">${item}</div>`;
      });
      mockHTML += '</div>';
    }
    
    if (code.includes('VStack')) {
      mockHTML += '</div>';
    }
    
    mockHTML += '</div>';
    
    previewOutput.innerHTML = mockHTML;
  }

  toggleTheme() {
    const btn = document.getElementById('themeBtn');
    const currentTheme = btn.textContent.trim();
    
    if (currentTheme === 'Dark') {
      document.body.classList.add('theme-light');
      btn.textContent = 'Light';
    } else {
      document.body.classList.remove('theme-light');
      btn.textContent = 'Dark';
    }
  }

  updateDynamicType(scale) {
    const previewOutput = document.getElementById('previewOutput');
    previewOutput.style.fontSize = `${scale}em`;
  }

  resetCode() {
    this.loadTemplate(this.currentTemplate);
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  async checkServerConnection() {
    const isServerHealthy = await this.compileService.healthCheck();
    const errorOutput = document.getElementById('errorOutput');
    
    if (isServerHealthy) {
      errorOutput.innerHTML = '<div class="console-line text-success">✓ Connected to compilation server</div>';
    } else {
      errorOutput.innerHTML = '<div class="console-line text-warning">⚠ Compilation server unavailable (using mock mode)</div>';
    }
  }

  destroy() {
    // Cleanup WASM runtime
    if (this.wasmRuntime) {
      this.wasmRuntime.dispose();
    }
    
    // Cleanup Monaco editor
    if (this.monacoEditor) {
      this.monacoEditor.dispose();
    }
  }
}
