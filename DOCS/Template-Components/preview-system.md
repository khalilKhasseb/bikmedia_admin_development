# Template Component Preview System

The Template Component Preview System provides an interactive way to explore and evaluate template components before adopting them in your project.

## Access Methods

### 1. Standalone HTML Preview
Access the standalone preview system directly in your browser:
```
http://localhost:3000/template-preview.html
```

This standalone version works independently of the Vue application and can be used for:
- Quick component exploration
- Sharing with team members
- Documentation purposes
- Testing without authentication

### 2. Integrated Vue Component
Access the integrated preview within the application:
```
http://localhost:3000/template-preview
```

This integrated version provides:
- Seamless navigation within the app
- Authentication-protected access
- Better performance with Vue reactivity
- Consistent styling with the main application

## Features

### 🔍 Search and Filter
- **Global Search**: Search components by name, description, or features
- **Category Filtering**: Filter by component categories (apps, forms, tables, etc.)
- **Real-time Results**: Instant filtering as you type

### 📋 Component Information
Each component card displays:
- **Category Badge**: Visual category identification
- **Description**: Clear explanation of component purpose
- **Features List**: Key capabilities and functionality
- **Dependencies**: Required npm packages
- **Usage Examples**: Practical use cases
- **File Path**: Location in the project structure

### 👁️ Interactive Previews
- **Live Previews**: Fully interactive mockups with working functionality
- **Real Interactions**: Click, drag, type, and interact with component features
- **Sample Data**: Pre-populated with realistic data for testing
- **Event Handling**: Working buttons, forms, and user interactions
- **State Management**: Components respond to user actions and state changes
- **No Dependencies**: Previews work without installing component dependencies
- **Popup Windows**: Interactive previews open in dedicated windows for better experience

### 📦 Adoption Helpers
- **Copy File Path**: Quick access to component location
- **Copy Install Command**: Ready-to-use npm install commands
- **Step-by-step Guide**: Detailed adoption instructions
- **Dependency Information**: Clear dependency requirements

## Component Categories

### 📱 Apps
Full-featured application components with interactive previews:
- **Calendar**: Interactive calendar with clickable dates, event popups, and navigation
- **Chat**: Live chat interface with message sending and user status
- **Contacts**: Searchable contact list with selection and action buttons
- **Scrumboard**: Drag-and-drop Kanban board with moveable task cards
- **Notes**: Interactive note-taking with editing capabilities

### 🔐 Authentication
User authentication interfaces:
- Login forms (standard and boxed)
- Registration forms
- Password recovery
- Lock screen interface

### 📊 Charts
Interactive data visualization components:
- **ApexCharts**: Multiple chart types with tab switching
- **Interactive Tooltips**: Hover effects with data point details
- **Legend Controls**: Click to show/hide data series
- **Chart Controls**: Export options, data labels toggle
- **Live Statistics**: Real-time calculated metrics display

### 🎨 UI Components
Reusable interface elements:
- Accordions and collapsible content
- Image carousels and sliders
- Modal dialogs
- Timeline components
- Toast notifications

### 📝 Forms
Advanced form components with working interactions:
- **Multi-step Wizards**: Navigate between steps, form validation, progress tracking
- **File Upload**: Drag & drop functionality, progress bars, file management
- **Date Pickers**: Interactive calendar, date range selection, shortcuts
- **Rich Text Editors**: Live text editing with formatting options
- **Advanced Selects**: Searchable dropdowns with multi-selection

### 📊 Tables
Interactive data table components:
- **Basic Tables**: Sortable columns, live search, pagination controls
- **Advanced Tables**: Column filtering, dropdown actions, bulk operations
- **Row Editing**: Inline editing with save/cancel functionality
- **Export Features**: Working export buttons and data manipulation
- **Real-time Search**: Instant filtering as you type

### 📄 Pages
Complete page templates:
- Error pages (404, 500)
- FAQ pages
- Contact forms
- Coming soon pages

## Usage Workflow

### 1. Explore Components
1. Browse the component grid or use search/filters
2. Read component descriptions and features
3. Check dependency requirements
4. View interactive previews

### 2. Evaluate Suitability
1. Click "View Details" for comprehensive information
2. Review adoption steps and requirements
3. Check if dependencies align with your project
4. Assess if features match your needs

### 3. Adopt Components
1. Copy the component file path
2. Copy and run the install command for dependencies
3. Follow the step-by-step adoption guide
4. Customize the component for your use case

## Preview System Architecture

### Standalone HTML (`public/template-preview.html`)
- Self-contained HTML file with embedded JavaScript
- No build process required
- Works in any web browser
- Includes all component data inline

### Vue Component (`src/views/template-preview.vue`)
- Integrated with Vue router and application
- Uses reactive data and computed properties
- Leverages existing component inventory
- Direct HTML rendering without iframes
- CSP-compliant implementation
- Provides better user experience within the app

### Preview Generator (`src/utils/template-preview-generator.js`)
- Creates interactive mockups of components
- Generates HTML and CSS for previews
- Provides realistic component demonstrations
- No actual component dependencies required
- Safe HTML generation without security risks

## Customization

### Adding New Component Previews
To add a preview for a new component:

1. Update the `previewTemplates` object in `template-preview-generator.js`:
```javascript
'YourComponent': () => `
  <div class="your-component-preview">
    <!-- Your preview HTML -->
  </div>
`,
```

2. Add corresponding CSS styles in `generatePreviewStyles()`:
```css
.your-component-preview {
  /* Your preview styles */
}
```

### Modifying Existing Previews
Edit the template function for the component in `template-preview-generator.js` and update the corresponding CSS styles.

## Benefits

### For Developers
- **Quick Evaluation**: See components without full setup
- **Informed Decisions**: Understand capabilities before adoption
- **Reduced Risk**: Preview before committing to dependencies
- **Time Savings**: Avoid trial-and-error component testing

### For Teams
- **Shared Understanding**: Common reference for component capabilities
- **Design Consistency**: See how components fit together
- **Documentation**: Living catalog of available components
- **Onboarding**: Help new team members understand available tools

### For Projects
- **Bundle Optimization**: Only adopt components you actually need
- **Dependency Management**: Clear understanding of requirements
- **Maintenance**: Easy reference for component capabilities
- **Scalability**: Systematic approach to component adoption

## Technical Notes

### Browser Compatibility
- Modern browsers with ES6+ support
- CSS Grid and Flexbox support required
- Clipboard API for copy functionality

### Performance
- Lazy loading of preview content
- Minimal JavaScript for standalone version
- Efficient filtering and search algorithms
- No external API dependencies
- Direct DOM rendering without iframe overhead

### Security
- No external script loading
- Safe HTML generation with v-html sanitization
- CSP-compliant implementation (no iframe usage)
- No eval() or unsafe operations
- Respects Content Security Policy restrictions

## Troubleshooting

### Preview Not Loading
- Check browser console for errors
- Ensure JavaScript is enabled
- Verify file paths are correct

### Search Not Working
- Clear browser cache
- Check for JavaScript errors
- Verify component data is loaded

### Copy Functions Not Working
- Ensure HTTPS or localhost context
- Check clipboard API support
- Verify browser permissions

## Future Enhancements

Potential improvements to the preview system:
- Screenshot generation for components
- Integration with Storybook
- Component usage analytics
- Automated preview generation
- Mobile-optimized previews
- Component comparison features