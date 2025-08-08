import { HomePage } from './ui/HomePage.js';
import { PreviewPage } from './ui/PreviewPage.js';

// Simple router
class Router {
  constructor() {
    this.routes = {
      '/': HomePage,
      '/preview': PreviewPage
    };
    this.currentPage = null;
    this.container = null;
  }

  init(container) {
    this.container = container;
    window.addEventListener('popstate', () => this.navigate());
    this.navigate();
  }

  navigate(path = window.location.pathname) {
    const Page = this.routes[path] || this.routes['/'];
    
    if (this.currentPage) {
      this.currentPage.destroy?.();
    }
    
    this.container.innerHTML = '';
    this.currentPage = new Page();
    this.currentPage.render(this.container);
    
    if (path !== window.location.pathname) {
      history.pushState(null, '', path);
    }
  }

  go(path) {
    this.navigate(path);
  }
}

// Create app instance
export function createApp() {
  const router = new Router();
  
  return {
    mount(selector) {
      const container = document.querySelector(selector);
      if (!container) {
        throw new Error(`Container ${selector} not found`);
      }
      
      router.init(container);
      
      // Make router globally available
      window.router = router;
    }
  };
}
