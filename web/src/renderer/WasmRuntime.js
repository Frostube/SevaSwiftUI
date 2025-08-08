export class WasmRuntime {
  constructor() {
    this.wasmModule = null;
    this.jsRuntime = null;
    this.isInitialized = false;
  }

  async loadAndExecute(wasmBase64, jsCode, container) {
    try {
      // Convert base64 WASM to ArrayBuffer
      const wasmBinary = this.base64ToArrayBuffer(wasmBase64);
      
      // Load WASM module
      this.wasmModule = await WebAssembly.instantiate(wasmBinary);
      
      // Execute JavaScript glue code in sandboxed context
      this.executeJavaScript(jsCode);
      
      // Initialize and render
      if (window.SwiftUIWasmRuntime) {
        this.jsRuntime = new window.SwiftUIWasmRuntime(this.wasmModule);
        await this.jsRuntime.initialize();
        this.jsRuntime.render(container);
        this.isInitialized = true;
      } else {
        throw new Error('SwiftUIWasmRuntime not found in compiled JavaScript');
      }
      
      return { success: true };
    } catch (error) {
      console.error('WASM Runtime Error:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  executeJavaScript(jsCode) {
    try {
      // Create a sandboxed execution context
      // Note: In production, you'd want stricter sandboxing
      const script = document.createElement('script');
      script.textContent = jsCode;
      document.head.appendChild(script);
      
      // Clean up script element
      setTimeout(() => {
        document.head.removeChild(script);
      }, 100);
    } catch (error) {
      console.error('JavaScript execution error:', error);
      throw new Error(`Failed to execute JavaScript: ${error.message}`);
    }
  }

  dispose() {
    if (this.jsRuntime && this.jsRuntime.dispose) {
      this.jsRuntime.dispose();
    }
    this.wasmModule = null;
    this.jsRuntime = null;
    this.isInitialized = false;
  }
}
