# Bikmedia Admin

A modern Vue 3 + Vite admin dashboard for managing Bikmedia platform operations, featuring comprehensive entity management, VIP services, and a rich template component library.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📚 Documentation Organization

Our documentation is organized into **5 development phases** to help you navigate different aspects of the project efficiently:

### Phase-Based Documentation Structure

| Phase | Focus Area | Description |
|-------|------------|-------------|
| **[Phase 1](./DOCS/Phase-1-Architecture/)** | Architecture & Foundation | Project structure, migration strategies |
| **[Phase 2](./DOCS/Phase-2-Quality/)** | Code Quality & Standards | Technical debt analysis, quality metrics |
| **[Phase 3](./DOCS/Phase-3-Development/)** | Development Workflow | Best practices, team collaboration |
| **[Phase 4](./DOCS/Phase-4-Features/)** | Feature Enhancement | Entity management, feature development |
| **[Phase 5](./DOCS/Phase-5-Deployment/)** | Optimization & Deployment | Performance, production readiness |

### Quick Navigation
- 📖 **[Complete Documentation](./DOCS/README.md)** - Full documentation index
- 🚀 **[Quick Start Guides](./DOCS/Quick-Start/)** - Get up and running fast
- 🧩 **[Template Components](./DOCS/Template-Components/)** - Reusable UI components

## 🧩 Template Component System

This project includes a comprehensive template component library that you can adopt on-demand without loading unnecessary dependencies.

### Available Component Categories
- **Forms** - Wizards, validation, input components
- **Tables** - Data tables, sorting, filtering
- **Charts** - ApexCharts, ECharts integration
- **UI Elements** - Cards, modals, timelines
- **Authentication** - Login, registration forms
- **Pages** - Error pages, FAQ, contact forms

### Quick Template Adoption

```bash
# List available template components
npm run template:list

# Get info about a specific component
npm run template:info ComponentName

# Adopt a template component
npm run template:adopt ComponentName
```

### Manual Template Adoption
1. Browse available components in `src/views/` directories
2. Copy the component to your desired location
3. Install required dependencies: `npm install [dependency]`
4. Import required SCSS files
5. Customize as needed

📖 **[Full Template Guide](./DOCS/Template-Components/adoption-guide.md)**

## 🏗️ Project Structure

```
bikmedia_admin/
├── src/
│   ├── components/          # Reusable Vue components
│   ├── views/              # Page components & template library
│   │   ├── bikmedia/       # Core business logic views
│   │   ├── apps/           # Template: Calendar, chat, etc.
│   │   ├── auth/           # Template: Authentication pages
│   │   ├── charts/         # Template: Chart components
│   │   ├── forms/          # Template: Form components
│   │   └── tables/         # Template: Table components
│   ├── services/           # API services and HTTP client
│   ├── store/              # Vuex state management
│   ├── router/             # Vue Router configuration
│   ├── locales/            # Internationalization files
│   └── utils/              # Utility functions
├── DOCS/                   # Phase-organized documentation
└── public/                 # Static assets
```

## 🛠️ Development Workflow

### Core Features
- **Entity Management** - Equipment, gifts, levels, VIP services
- **User Management** - Authentication, profiles, permissions
- **Analytics Dashboard** - Charts, statistics, reporting
- **Internationalization** - Multi-language support
- **Template Library** - 200+ reusable components

### Development Commands

```bash
# Development
npm run dev                 # Start dev server
npm run build              # Production build
npm run preview            # Preview production build

# Deployment
npm run build:netlify      # Build for Netlify
npm run build:pages        # Build for GitHub Pages
npm run deploy:pages       # Deploy to GitHub Pages

# Utilities
npm run translation:validate    # Validate translations
npm run translation:report     # Generate translation report
```

### Environment Configuration
- **Development**: `.env` - Local development settings
- **Production**: `.env.production` - Production configuration
- **Netlify**: `.env.netlify` - Netlify deployment settings
- **Pages**: `.env.pages` - GitHub Pages deployment

📖 **[Environment Setup Guide](./DOCS/Features/ENVIRONMENT_CONFIG.md)**

## 🎯 Key Features

### Business Logic
- **Equipment Management** - CRUD operations, categories, attributes
- **Gift System** - Virtual gifts, distribution, analytics
- **Level Management** - User progression, achievements
- **VIP Services** - Premium features, privilege management

### Technical Features
- **Vue 3 Composition API** - Modern reactive framework
- **Vite** - Fast build tool and dev server
- **TypeScript Support** - Type safety (optional)
- **SCSS/Sass** - Advanced styling capabilities
- **Vue Router** - Client-side routing
- **Vuex** - State management
- **Vue I18n** - Internationalization

### UI/UX Features
- **Responsive Design** - Mobile-first approach
- **Dark/Light Theme** - Theme switching
- **RTL Support** - Right-to-left languages
- **Accessibility** - WCAG compliance
- **Performance Optimized** - Lazy loading, code splitting

## 🔧 Configuration

### Recommended IDE Setup
- [VS Code](https://code.visualstudio.com/)
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) - Vue 3 support
- [TypeScript Vue Plugin](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)

### Browser Support
- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 📖 Documentation Quick Links

### Getting Started
- 🚀 **[Development Setup](./DOCS/Quick-Start/development-setup.md)**
- 📖 **[Documentation Navigation](./DOCS/Quick-Start/documentation-navigation.md)**
- 🧩 **[Template Adoption](./DOCS/Quick-Start/template-adoption.md)**

### Development Guides
- 🏗️ **[Architecture Overview](./DOCS/Phase-1-Architecture/README.md)**
- 🔍 **[Code Quality Guidelines](./DOCS/Phase-2-Quality/README.md)**
- ⚡ **[Development Workflow](./DOCS/Phase-3-Development/README.md)**
- 🎯 **[Feature Development](./DOCS/Phase-4-Features/README.md)**
- 🚀 **[Deployment Guide](./DOCS/Phase-5-Deployment/README.md)**

### Component Library
- 📋 **[Component Catalog](./DOCS/Template-Components/component-catalog.md)**
- 📖 **[Adoption Guide](./DOCS/Template-Components/adoption-guide.md)**
- 💡 **[Usage Examples](./DOCS/Template-Components/examples.md)**

## 🤝 Contributing

1. Read the [Development Workflow](./DOCS/Phase-3-Development/README.md) documentation
2. Follow the [Code Quality Guidelines](./DOCS/Phase-2-Quality/README.md)
3. Use the [Template Components](./DOCS/Template-Components/) when possible
4. Ensure all translations are validated: `npm run translation:validate`

## 📄 License

This project is proprietary software for Bikmedia platform operations.

---

**Need help?** Check our [comprehensive documentation](./DOCS/README.md) or explore the [quick start guides](./DOCS/Quick-Start/).