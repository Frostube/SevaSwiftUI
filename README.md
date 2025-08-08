# SevaSwiftUI Web Previewer

A web-based SwiftUI-style previewer that lets you design iOS-looking UIs on Windows/Linux. Build and signing still happens on macOS/Xcode.

## Features

- 🎨 SwiftUI-style component previewing in the browser
- ⚡ Hot reload with Monaco editor
- 📱 iOS-ish visual design system
- 🔧 Support matrix showing API compatibility
- 📋 Ready-to-use templates

## Architecture

- **Renderer**: Tokamak + SwiftWasm for SwiftUI-to-web compilation
- **Editor**: Monaco with Swift syntax highlighting
- **Shim Layer**: SevaUI that maps SwiftUI to Tokamak for web preview
- **Compile Strategy**: Server-side compilation with sandboxed containers

## Project Structure

```
swiftui-previewer/
  /web
    /src
      /editor          # Monaco wrapper
      /renderer        # Tokamak bootstrap, runtime
      /shim           # SevaUI mapping, no-op warnings
      /templates      # Sample views
      /ui             # Site components: Hero, Matrix, Docs
      tokens.css      # Design system
    /public           # Icons, OG images
  /server
    /compile-worker   # SwiftWasm toolchain, cache, API
```

## Getting Started

### Web Development
```bash
cd web
npm install
npm run dev
```

### Server Development
```bash
cd server
# Setup instructions coming soon
```

## Legal & Compliance

- Not affiliated with Apple Inc.
- Build and sign your apps on macOS with Xcode
- Uses system font stack, not SF Pro
- Icons from open source libraries, not SF Symbols

## License

MIT License - see LICENSE file for details
