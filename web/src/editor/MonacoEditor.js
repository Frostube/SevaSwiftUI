export class MonacoEditor {
  constructor(container, options = {}) {
    this.container = container;
    this.editor = null;
    this.options = {
      language: 'swift',
      theme: 'seva-dark',
      fontSize: 14,
      fontFamily: "'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
      lineNumbers: 'on',
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 4,
      insertSpaces: true,
      wordWrap: 'on',
      ...options
    };
  }

  async initialize() {
    try {
      // Load Monaco via loader (CDN-backed, avoids bundling issues)
      const loaderModule = await import('@monaco-editor/loader');
      const loader = loaderModule.default || loaderModule;

      // Set Monaco base path to CDN
      loader.config({
        paths: {
          vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs'
        }
      });

      const monaco = await loader.init();
      
      // Register Swift language
      this.registerSwiftLanguage(monaco);
      
      // Define custom theme
      this.defineTheme(monaco);
      
      // Create editor instance
      this.editor = monaco.editor.create(this.container, this.options);
      
      // Setup auto-completion
      this.setupAutoCompletion(monaco);
      
      return this.editor;
    } catch (error) {
      console.error('Failed to initialize Monaco Editor:', error);
      // Fallback to textarea
      return this.createFallbackEditor();
    }
  }

  registerSwiftLanguage(monaco) {
    // Register Swift language if not already registered
    const languages = monaco.languages.getLanguages();
    const swiftExists = languages.some(lang => lang.id === 'swift');
    
    if (!swiftExists) {
      monaco.languages.register({ id: 'swift' });
      
      // Define Swift syntax highlighting
      monaco.languages.setMonarchTokensProvider('swift', {
        tokenizer: {
          root: [
            // Keywords
            [/\b(import|struct|class|enum|protocol|extension|func|var|let|if|else|for|while|switch|case|default|return|break|continue|in|true|false|nil)\b/, 'keyword'],
            
            // SwiftUI keywords
            [/\b(View|Text|VStack|HStack|ZStack|Button|Image|List|NavigationView|NavigationLink|ScrollView|Form|TextField|Toggle|Picker|Spacer|Divider|Section)\b/, 'type.swiftui'],
            
            // Modifiers
            [/\.(padding|background|foregroundColor|font|cornerRadius|shadow|frame|overlay|clipShape|opacity|animation|transition)\b/, 'function.modifier'],
            
            // Strings
            [/"([^"\\]|\\.)*$/, 'string.invalid'],
            [/"/, 'string', '@string'],
            
            // Numbers
            [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
            [/\d+/, 'number'],
            
            // Comments
            [/\/\/.*$/, 'comment'],
            [/\/\*/, 'comment', '@comment'],
            
            // Attributes
            [/@\w+/, 'annotation'],
            
            // Operators
            [/[{}()\[\]]/, 'delimiter.bracket'],
            [/[<>=!&|+\-*\/]/, 'operator'],
          ],
          
          comment: [
            [/[^\/*]+/, 'comment'],
            [/\*\//, 'comment', '@pop'],
            [/[\/*]/, 'comment']
          ],
          
          string: [
            [/[^\\"]+/, 'string'],
            [/\\./, 'string.escape'],
            [/"/, 'string', '@pop']
          ]
        }
      });
    }
  }

  defineTheme(monaco) {
    monaco.editor.defineTheme('seva-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '#FF7A1A', fontStyle: 'bold' },
        { token: 'type.swiftui', foreground: '#3A5FFF', fontStyle: 'bold' },
        { token: 'function.modifier', foreground: '#34C759' },
        { token: 'string', foreground: '#FF9F0A' },
        { token: 'number', foreground: '#FF7A1A' },
        { token: 'comment', foreground: '#6D6D80', fontStyle: 'italic' },
        { token: 'annotation', foreground: '#FF7A1A' },
        { token: 'operator', foreground: '#F5F7FA' },
      ],
      colors: {
        'editor.background': '#0B0B10',
        'editor.foreground': '#F5F7FA',
        'editor.lineHighlightBackground': '#13131A',
        'editor.selectionBackground': '#262636',
        'editorCursor.foreground': '#FF7A1A',
        'editorLineNumber.foreground': '#6D6D80',
        'editorLineNumber.activeForeground': '#A9B0C0',
        'editor.selectionHighlightBackground': '#191A22',
        'editorBracketMatch.background': '#262636',
        'editorBracketMatch.border': '#FF7A1A'
      }
    });
  }

  setupAutoCompletion(monaco) {
    // Register completion provider for SwiftUI
    monaco.languages.registerCompletionItemProvider('swift', {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };

        const suggestions = [
          // SwiftUI Views
          {
            label: 'VStack',
            kind: monaco.languages.CompletionItemKind.Class,
            insertText: 'VStack(spacing: ${1:20}) {\n\t${2:// content}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'A vertical stack that arranges its children in a vertical line',
            range: range
          },
          {
            label: 'HStack',
            kind: monaco.languages.CompletionItemKind.Class,
            insertText: 'HStack(spacing: ${1:20}) {\n\t${2:// content}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'A horizontal stack that arranges its children in a horizontal line',
            range: range
          },
          {
            label: 'Text',
            kind: monaco.languages.CompletionItemKind.Class,
            insertText: 'Text("${1:Hello, World!}")',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'A view that displays one or more lines of read-only text',
            range: range
          },
          {
            label: 'Button',
            kind: monaco.languages.CompletionItemKind.Class,
            insertText: 'Button("${1:Title}") {\n\t${2:// action}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'A control that initiates an action',
            range: range
          },
          // Common modifiers
          {
            label: 'padding',
            kind: monaco.languages.CompletionItemKind.Method,
            insertText: 'padding(${1:.all}, ${2:16})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Adds padding around the view',
            range: range
          },
          {
            label: 'background',
            kind: monaco.languages.CompletionItemKind.Method,
            insertText: 'background(${1:Color.blue})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Sets the background of the view',
            range: range
          },
          {
            label: 'foregroundColor',
            kind: monaco.languages.CompletionItemKind.Method,
            insertText: 'foregroundColor(${1:.primary})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Sets the foreground color of the view',
            range: range
          },
          {
            label: 'cornerRadius',
            kind: monaco.languages.CompletionItemKind.Method,
            insertText: 'cornerRadius(${1:8})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Rounds the corners of the view',
            range: range
          }
        ];

        return { suggestions };
      }
    });
  }

  createFallbackEditor() {
    // Create a simple textarea fallback
    const textarea = document.createElement('textarea');
    textarea.style.cssText = `
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
    `;
    textarea.placeholder = "Write your SwiftUI code here...";
    
    this.container.appendChild(textarea);
    
    // Return a Monaco-like interface
    return {
      getValue: () => textarea.value,
      setValue: (value) => { textarea.value = value; },
      onDidChangeModelContent: (callback) => {
        textarea.addEventListener('input', callback);
      },
      dispose: () => {
        textarea.remove();
      }
    };
  }

  getValue() {
    return this.editor?.getValue() || '';
  }

  setValue(value) {
    this.editor?.setValue(value);
  }

  onDidChangeModelContent(callback) {
    this.editor?.onDidChangeModelContent(callback);
  }

  dispose() {
    this.editor?.dispose();
  }
}
