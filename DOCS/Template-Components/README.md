# Template Components

This directory contains comprehensive documentation for all available template components from the Cork Vue 3 template. These components can be selectively adopted into your project when needed, without loading unnecessary dependencies or assets.

## Overview

The template component system provides a lightweight approach to adopting pre-built UI components on-demand. Instead of loading all template components by default, you can selectively choose which components to integrate based on your specific needs.

## Key Benefits

- **Selective Adoption**: Only include components you actually need
- **Optimized Bundle**: Avoid loading unused dependencies and assets
- **Easy Integration**: Simple copy-and-customize approach
- **Full Template Library**: All original template components remain available
- **No Lock-in**: Components become part of your codebase for full customization
- **Dependency Management**: Comprehensive dependency mapping with bundle size impact analysis

## Available Component Categories

### 📱 Apps (7 components)
Complete application interfaces ready for integration:
- **Calendar** - Full-featured calendar with event management
- **Chat** - Real-time chat interface with user management
- **Contacts** - Contact management system with search and filtering
- **Mailbox** - Email client interface with folder management
- **Notes** - Note-taking application with categories
- **Scrumboard** - Kanban-style project management board
- **TodoList** - Task management system with priorities

### 🔐 Authentication (4 components)
User authentication and security interfaces:
- **LoginBoxed** - Boxed login form with modern design
- **RegisterBoxed** - Boxed registration form with validation
- **PasswordRecovery** - Password recovery form
- **LockScreen** - Screen lock interface for session security

### 📊 Charts (1 component)
Data visualization components:
- **ApexCharts** - Comprehensive chart library with multiple chart types

### 🎨 UI Components (10 components)
Reusable UI elements for enhanced user experience:
- **Accordions** - Collapsible content panels
- **Cards** - Various card layouts and styles
- **Carousel** - Image and content carousel
- **Countdown** - Countdown timer with custom formats
- **Counter** - Animated number counters
- **Lightbox** - Image lightbox with gallery functionality
- **Modals** - Various modal dialog styles
- **Timeline** - Timeline component for chronological events
- **Toast** - Toast notification system
- **SweetAlert** - Beautiful alert dialogs and confirmations

### 🧩 Elements (5 components)
Basic UI building blocks:
- **Alerts** - Alert messages with various styles
- **Buttons** - Comprehensive button styles and variations
- **Badges** - Badge components for labels and status
- **Pagination** - Pagination controls for data navigation
- **ProgressBar** - Progress indicators with various styles

### 📝 Forms (8 components)
Advanced form components and input elements:
- **FormWizard** - Multi-step form wizard with validation
- **FormValidation** - Form validation examples with various rules
- **FileUpload** - File upload with drag & drop and preview
- **DateRangePicker** - Date and time picker with range selection
- **RichTextEditor** - Rich text editor with formatting tools
- **MarkdownEditor** - Markdown editor with live preview
- **Select2** - Advanced select dropdown with search
- **Switches** - Toggle switches and checkboxes

### 📋 Tables (4 components)
Data table components for displaying and managing data:
- **DataTableBasic** - Basic data table with sorting and pagination
- **DataTableAdvanced** - Advanced table with filtering and export
- **DataTableActions** - Table with row actions and bulk operations
- **V3TableBasic** - Alternative table component with server-side processing

### 📄 Pages (5 components)
Complete page templates for common use cases:
- **Error404** - Custom 404 error page
- **Error500** - Server error page
- **FAQ** - Frequently Asked Questions page
- **ContactUs** - Contact form with location map
- **ComingSoon** - Coming soon page with countdown

### 👤 Users (2 components)
User management and profile interfaces:
- **UserProfile** - User profile page with activity timeline
- **AccountSettings** - Account settings page with tabbed interface

## Quick Start

1. **Preview Components**: Use the [Template Preview System](./preview-system.md) to explore components interactively
2. **Browse Components**: Check the [component catalog](./component-catalog.md) for detailed component information
3. **Follow Adoption Guide**: Use the [adoption guide](./adoption-guide.md) for step-by-step integration instructions
4. **See Examples**: Review [usage examples](./examples.md) for implementation patterns

## Documentation Files

- **[Preview System](./preview-system.md)** - Interactive component preview and exploration system
- **[Component Catalog](./component-catalog.md)** - Complete inventory of all available components
- **[Adoption Guide](./adoption-guide.md)** - Step-by-step instructions for adopting components
- **[Usage Examples](./examples.md)** - Practical examples and implementation patterns
- **[Dependency Mapping](./dependency-mapping.md)** - Comprehensive dependency management system

## Component Inventory

All components are cataloged in `src/templates/available-components.js` with detailed information including:
- File paths and locations
- Required dependencies
- Associated assets and styles
- Feature descriptions
- Usage examples and recommendations

### Dependency Management System

The template now includes a comprehensive dependency mapping system (`template-dependencies.json`) that provides:

- **Precise Dependency Tracking**: Each component mapped to its exact dependencies with versions
- **Bundle Size Impact**: Estimated bundle size impact for informed adoption decisions
- **Dependency Groups**: Components organized by functionality (charts, forms, tables, etc.)
- **Adoption Recommendations**: Components categorized by complexity and bundle impact:
  - **Lightweight** (0KB): Components with no external dependencies
  - **Essential** (~82KB): Components with small, essential dependencies
  - **Specialized** (~360KB): Components for specific use cases
  - **Feature-rich** (~655KB): Components with comprehensive functionality

Use the dependency checker utilities in `src/utils/dependency-checker.js` to:
- Validate component adoption readiness
- Calculate bundle impact of multiple components
- Get installation commands for missing dependencies
- Find components by dependency group

## Support

For questions about template components or adoption process:
1. Check the documentation files in this directory
2. Review the component source files for implementation details
3. Refer to the original template documentation for advanced features

---

*This template component system preserves the full Cork template library while providing a clean, organized approach to selective component adoption.*