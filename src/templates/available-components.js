/**
 * Template Component Inventory
 * 
 * This file catalogs all available template components from the original Cork template
 * that can be adopted on-demand. Each component includes its path, dependencies,
 * assets, and usage information.
 */

export const templateComponents = {
  // ===== APPS CATEGORY =====
  'Calendar': {
    path: 'src/views/apps/calendar.vue',
    category: 'apps',
    dependencies: ['@fullcalendar/core', '@fullcalendar/daygrid', '@fullcalendar/interaction', '@fullcalendar/timegrid', '@fullcalendar/vue3'],
    assets: ['src/assets/sass/apps/calendar.scss'],
    description: 'Full-featured calendar with event management, drag & drop, and multiple views',
    features: ['Event creation/editing', 'Drag & drop events', 'Month/Week/Day views', 'Event filtering'],
    usageExample: 'Perfect for scheduling systems, appointment booking, or event management'
  },

  'Chat': {
    path: 'src/views/apps/chat.vue',
    category: 'apps',
    dependencies: ['vue3-perfect-scrollbar'],
    assets: ['src/assets/sass/apps/chat.scss'],
    description: 'Real-time chat interface with user list, message history, and file sharing',
    features: ['Message threads', 'User status indicators', 'File attachments', 'Search functionality'],
    usageExample: 'Ideal for customer support, team communication, or messaging features'
  },

  'Contacts': {
    path: 'src/views/apps/contacts.vue',
    category: 'apps',
    dependencies: ['@suadelabs/vue3-multiselect'],
    assets: ['src/assets/sass/apps/contacts.scss'],
    description: 'Contact management system with search, filtering, and detailed contact cards',
    features: ['Contact search', 'Category filtering', 'Contact details modal', 'Bulk actions'],
    usageExample: 'Great for CRM systems, address books, or customer databases'
  },

  'Mailbox': {
    path: 'src/views/apps/mailbox.vue',
    category: 'apps',
    dependencies: ['vue3-perfect-scrollbar'],
    assets: ['src/assets/sass/apps/mailbox.scss'],
    description: 'Email client interface with inbox, compose, and folder management',
    features: ['Email composition', 'Folder organization', 'Email search', 'Attachment handling'],
    usageExample: 'Perfect for internal messaging systems or email management tools'
  },

  'Notes': {
    path: 'src/views/apps/notes.vue',
    category: 'apps',
    dependencies: ['vue3-perfect-scrollbar'],
    assets: ['src/assets/sass/apps/notes.scss'],
    description: 'Note-taking application with categories, search, and rich text editing',
    features: ['Note categories', 'Search functionality', 'Rich text editing', 'Note archiving'],
    usageExample: 'Ideal for documentation systems, personal notes, or knowledge bases'
  },

  'Scrumboard': {
    path: 'src/views/apps/scrumboard.vue',
    category: 'apps',
    dependencies: ['vue-draggable-next'],
    assets: ['src/assets/sass/apps/scrumboard.scss'],
    description: 'Kanban-style project management board with drag & drop functionality',
    features: ['Drag & drop cards', 'Multiple columns', 'Task assignment', 'Progress tracking'],
    usageExample: 'Perfect for project management, task tracking, or workflow visualization'
  },

  'TodoList': {
    path: 'src/views/apps/todo_list.vue',
    category: 'apps',
    dependencies: ['vue-draggable-next'],
    assets: ['src/assets/sass/apps/todolist.scss'],
    description: 'Task management system with priorities, categories, and completion tracking',
    features: ['Task priorities', 'Category organization', 'Completion tracking', 'Task search'],
    usageExample: 'Great for personal productivity, team tasks, or project milestones'
  },

  // ===== AUTHENTICATION CATEGORY =====
  'LoginBoxed': {
    path: 'src/views/auth/login_boxed.vue',
    category: 'auth',
    dependencies: [],
    assets: ['src/assets/sass/authentication/auth-boxed.scss'],
    description: 'Boxed login form with modern design and validation',
    features: ['Form validation', 'Remember me option', 'Forgot password link', 'Social login buttons'],
    usageExample: 'Alternative login design for applications requiring boxed layout'
  },

  'RegisterBoxed': {
    path: 'src/views/auth/register_boxed.vue',
    category: 'auth',
    dependencies: [],
    assets: ['src/assets/sass/authentication/auth-boxed.scss'],
    description: 'Boxed registration form with terms acceptance and validation',
    features: ['Multi-field validation', 'Terms acceptance', 'Password strength indicator', 'Social registration'],
    usageExample: 'User registration with boxed design layout'
  },

  'PasswordRecovery': {
    path: 'src/views/auth/pass_recovery.vue',
    category: 'auth',
    dependencies: [],
    assets: ['src/assets/sass/authentication/auth.scss'],
    description: 'Password recovery form with email validation',
    features: ['Email validation', 'Success feedback', 'Back to login link'],
    usageExample: 'Password reset functionality for user authentication flows'
  },

  'LockScreen': {
    path: 'src/views/auth/lockscreen.vue',
    category: 'auth',
    dependencies: [],
    assets: ['src/assets/sass/authentication/auth.scss'],
    description: 'Screen lock interface for session security',
    features: ['User avatar display', 'Password unlock', 'Session timeout handling'],
    usageExample: 'Security feature for applications requiring session locking'
  },

  // ===== CHARTS CATEGORY =====
  'ApexCharts': {
    path: 'src/views/charts/apex_chart.vue',
    category: 'charts',
    dependencies: ['apexcharts', 'vue3-apexcharts'],
    assets: [],
    description: 'Comprehensive chart library with multiple chart types',
    features: ['Line charts', 'Area charts', 'Bar charts', 'Donut charts', 'Mixed charts', 'Interactive tooltips'],
    usageExample: 'Perfect for dashboards, analytics, and data visualization'
  },

  // ===== UI COMPONENTS CATEGORY =====
  'Accordions': {
    path: 'src/views/components/accordions.vue',
    category: 'components',
    dependencies: [],
    assets: ['src/assets/sass/components/tabs-accordian/custom-accordions.scss'],
    description: 'Collapsible content panels with various styles',
    features: ['Multiple accordion styles', 'Icon indicators', 'Smooth animations', 'Nested accordions'],
    usageExample: 'FAQ sections, content organization, or space-saving layouts'
  },

  'Cards': {
    path: 'src/views/components/cards.vue',
    category: 'components',
    dependencies: [],
    assets: ['src/assets/sass/components/cards/card.scss'],
    description: 'Various card layouts and styles for content display',
    features: ['Multiple card designs', 'Image cards', 'Action buttons', 'Card overlays'],
    usageExample: 'Product displays, user profiles, or content previews'
  },

  'Carousel': {
    path: 'src/views/components/carousel.vue',
    category: 'components',
    dependencies: ['vue3-carousel'],
    assets: ['src/assets/sass/components/custom-carousel.scss'],
    description: 'Image and content carousel with navigation controls',
    features: ['Auto-play', 'Navigation arrows', 'Dot indicators', 'Touch/swipe support'],
    usageExample: 'Image galleries, product showcases, or featured content'
  },

  'Countdown': {
    path: 'src/views/components/countdown.vue',
    category: 'components',
    dependencies: [],
    assets: ['src/assets/sass/components/custom-countdown.scss'],
    description: 'Countdown timer with customizable display formats',
    features: ['Multiple time formats', 'Custom styling', 'Event callbacks', 'Responsive design'],
    usageExample: 'Event countdowns, sale timers, or deadline tracking'
  },

  'Counter': {
    path: 'src/views/components/counter.vue',
    category: 'components',
    dependencies: ['vue-countup-v3'],
    assets: ['src/assets/sass/components/custom-counter.scss'],
    description: 'Animated number counters with various effects',
    features: ['Count-up animations', 'Custom formatting', 'Trigger on scroll', 'Decimal support'],
    usageExample: 'Statistics display, achievement counters, or metric dashboards'
  },

  'Lightbox': {
    path: 'src/views/components/lightbox.vue',
    category: 'components',
    dependencies: ['vue-easy-lightbox'],
    assets: ['src/assets/sass/components/custom-lightbox.scss'],
    description: 'Image lightbox with gallery functionality',
    features: ['Image zoom', 'Gallery navigation', 'Thumbnail preview', 'Fullscreen mode'],
    usageExample: 'Photo galleries, product images, or media showcases'
  },

  'Modals': {
    path: 'src/views/components/modals.vue',
    category: 'components',
    dependencies: [],
    assets: ['src/assets/sass/components/custom-modal.scss'],
    description: 'Various modal dialog styles and sizes',
    features: ['Multiple sizes', 'Animation effects', 'Custom styling', 'Video modals'],
    usageExample: 'Confirmations, forms, content display, or media playback'
  },

  'Timeline': {
    path: 'src/views/components/timeline.vue',
    category: 'components',
    dependencies: [],
    assets: ['src/assets/sass/components/timeline/custom-timeline.scss'],
    description: 'Timeline component for displaying chronological events',
    features: ['Vertical timeline', 'Event markers', 'Custom icons', 'Responsive design'],
    usageExample: 'Project milestones, company history, or process flows'
  },

  'Toast': {
    path: 'src/views/components/toast.vue',
    category: 'components',
    dependencies: [],
    assets: [],
    description: 'Toast notification system with various styles',
    features: ['Multiple notification types', 'Auto-dismiss', 'Custom positioning', 'Action buttons'],
    usageExample: 'User feedback, success messages, or error notifications'
  },

  'SweetAlert': {
    path: 'src/views/components/sweetalert.vue',
    category: 'components',
    dependencies: ['sweetalert2'],
    assets: ['src/assets/sass/components/custom-sweetalert.scss'],
    description: 'Beautiful alert dialogs and confirmations',
    features: ['Custom styling', 'Input prompts', 'Confirmation dialogs', 'Success/error states'],
    usageExample: 'User confirmations, input prompts, or important notifications'
  },

  // ===== ELEMENTS CATEGORY =====
  'Alerts': {
    path: 'src/views/elements/alerts.vue',
    category: 'elements',
    dependencies: [],
    assets: ['src/assets/sass/elements/alert.scss'],
    description: 'Alert messages with various styles and dismissible options',
    features: ['Multiple alert types', 'Dismissible alerts', 'Icon support', 'Custom styling'],
    usageExample: 'Status messages, warnings, or informational content'
  },

  'Buttons': {
    path: 'src/views/elements/buttons.vue',
    category: 'elements',
    dependencies: [],
    assets: [],
    description: 'Comprehensive button styles and variations',
    features: ['Multiple button styles', 'Size variations', 'Icon buttons', 'Loading states'],
    usageExample: 'Form actions, navigation, or call-to-action elements'
  },

  'Badges': {
    path: 'src/views/elements/badges.vue',
    category: 'elements',
    dependencies: [],
    assets: [],
    description: 'Badge components for labels and status indicators',
    features: ['Various badge styles', 'Notification badges', 'Pill badges', 'Custom colors'],
    usageExample: 'Status indicators, notification counts, or category labels'
  },

  'Pagination': {
    path: 'src/views/elements/pagination.vue',
    category: 'elements',
    dependencies: [],
    assets: [],
    description: 'Pagination controls for data navigation',
    features: ['Multiple pagination styles', 'Page size options', 'Jump to page', 'Responsive design'],
    usageExample: 'Table navigation, search results, or content browsing'
  },

  'ProgressBar': {
    path: 'src/views/elements/progress_bar.vue',
    category: 'elements',
    dependencies: [],
    assets: [],
    description: 'Progress indicators with various styles',
    features: ['Linear progress', 'Circular progress', 'Animated progress', 'Custom colors'],
    usageExample: 'Loading states, completion tracking, or skill indicators'
  },

  // ===== FORMS CATEGORY =====
  'FormWizard': {
    path: 'src/views/forms/wizards.vue',
    category: 'forms',
    dependencies: ['vue3-form-wizard'],
    assets: [],
    description: 'Multi-step form wizard with validation and navigation',
    features: ['Step navigation', 'Form validation', 'Progress indicator', 'Custom styling'],
    usageExample: 'Registration processes, surveys, or complex data entry'
  },

  'FormValidation': {
    path: 'src/views/forms/validation.vue',
    category: 'forms',
    dependencies: ['@vuelidate/core', '@vuelidate/validators'],
    assets: [],
    description: 'Form validation examples with various validation rules',
    features: ['Real-time validation', 'Custom validators', 'Error messaging', 'Field highlighting'],
    usageExample: 'User input validation, data quality assurance, or form security'
  },

  'FileUpload': {
    path: 'src/views/forms/fileupload.vue',
    category: 'forms',
    dependencies: ['file-upload-with-preview'],
    assets: ['src/assets/sass/forms/file-upload-with-preview.min.css'],
    description: 'File upload component with drag & drop and preview',
    features: ['Drag & drop upload', 'File preview', 'Multiple file support', 'Progress tracking'],
    usageExample: 'Document uploads, image galleries, or media management'
  },

  'DateRangePicker': {
    path: 'src/views/forms/date_range_picker.vue',
    category: 'forms',
    dependencies: ['vue-flatpickr-component'],
    assets: ['src/assets/sass/forms/custom-flatpickr.css'],
    description: 'Date and time picker with range selection',
    features: ['Date range selection', 'Time picker', 'Custom formatting', 'Localization support'],
    usageExample: 'Booking systems, report filtering, or event scheduling'
  },

  'RichTextEditor': {
    path: 'src/views/forms/quill_editor.vue',
    category: 'forms',
    dependencies: ['vue3-quill'],
    assets: [],
    description: 'Rich text editor with formatting tools',
    features: ['Text formatting', 'Image insertion', 'Link creation', 'Custom toolbar'],
    usageExample: 'Content management, blog posts, or document editing'
  },

  'MarkdownEditor': {
    path: 'src/views/forms/markdown_editor.vue',
    category: 'forms',
    dependencies: ['vue3-easymde'],
    assets: [],
    description: 'Markdown editor with live preview',
    features: ['Markdown syntax', 'Live preview', 'Toolbar shortcuts', 'Full-screen mode'],
    usageExample: 'Documentation, blog writing, or technical content creation'
  },

  'Select2': {
    path: 'src/views/forms/select2.vue',
    category: 'forms',
    dependencies: ['@suadelabs/vue3-multiselect'],
    assets: [],
    description: 'Advanced select dropdown with search and multi-select',
    features: ['Search functionality', 'Multi-select', 'Custom options', 'Ajax loading'],
    usageExample: 'Category selection, user assignment, or tag management'
  },

  'Switches': {
    path: 'src/views/forms/switches.vue',
    category: 'forms',
    dependencies: [],
    assets: ['src/assets/sass/forms/switches.scss'],
    description: 'Toggle switches and checkboxes with various styles',
    features: ['Toggle switches', 'Custom styling', 'Size variations', 'Disabled states'],
    usageExample: 'Settings toggles, feature flags, or boolean inputs'
  },

  // ===== TABLES CATEGORY =====
  'DataTableBasic': {
    path: 'src/views/tables/vue3-datatable/basic.vue',
    category: 'tables',
    dependencies: ['@bhplugin/vue3-datatable'],
    assets: ['src/assets/sass/tables/table-basic.scss'],
    description: 'Basic data table with sorting and pagination',
    features: ['Column sorting', 'Pagination', 'Row selection', 'Responsive design'],
    usageExample: 'Simple data display, user lists, or basic reporting'
  },

  'DataTableAdvanced': {
    path: 'src/views/tables/vue3-datatable/advance.vue',
    category: 'tables',
    dependencies: ['@bhplugin/vue3-datatable'],
    assets: ['src/assets/sass/tables/table-custom.scss'],
    description: 'Advanced data table with filtering, search, and export',
    features: ['Global search', 'Column filtering', 'Export functionality', 'Custom actions'],
    usageExample: 'Complex data management, reporting, or admin interfaces'
  },

  'DataTableActions': {
    path: 'src/views/tables/vue3-datatable/actions.vue',
    category: 'tables',
    dependencies: ['@bhplugin/vue3-datatable'],
    assets: ['src/assets/sass/tables/table-custom.scss'],
    description: 'Data table with row actions and bulk operations',
    features: ['Row actions', 'Bulk operations', 'Confirmation dialogs', 'Custom buttons'],
    usageExample: 'User management, content moderation, or bulk data operations'
  },

  'V3TableBasic': {
    path: 'src/views/tables/v3-table/basic.vue',
    category: 'tables',
    dependencies: ['v-tables-3'],
    assets: ['src/assets/sass/tables/table-basic.scss'],
    description: 'Alternative table component with different feature set',
    features: ['Server-side processing', 'Custom templates', 'Event handling', 'Flexible configuration'],
    usageExample: 'Large datasets, server-side pagination, or custom table layouts'
  },

  // ===== PAGES CATEGORY =====
  'Error404': {
    path: 'src/views/pages/error404.vue',
    category: 'pages',
    dependencies: [],
    assets: ['src/assets/sass/pages/error/style-400.scss'],
    description: 'Custom 404 error page with navigation options',
    features: ['Custom error message', 'Navigation links', 'Search functionality', 'Responsive design'],
    usageExample: 'Handle missing pages, broken links, or unauthorized access'
  },

  'Error500': {
    path: 'src/views/pages/error500.vue',
    category: 'pages',
    dependencies: [],
    assets: ['src/assets/sass/pages/error/style-500.scss'],
    description: 'Server error page with support contact information',
    features: ['Error reporting', 'Support contact', 'Retry functionality', 'Professional design'],
    usageExample: 'Server errors, maintenance mode, or system failures'
  },

  'FAQ': {
    path: 'src/views/pages/faq.vue',
    category: 'pages',
    dependencies: [],
    assets: ['src/assets/sass/pages/faq/faq.scss'],
    description: 'Frequently Asked Questions page with search',
    features: ['Question search', 'Category filtering', 'Expandable answers', 'Contact support'],
    usageExample: 'Customer support, product documentation, or help sections'
  },

  'ContactUs': {
    path: 'src/views/pages/contact_us.vue',
    category: 'pages',
    dependencies: [],
    assets: ['src/assets/sass/pages/contact_us.scss'],
    description: 'Contact form with location map and company information',
    features: ['Contact form', 'Location map', 'Company details', 'Social media links'],
    usageExample: 'Business contact pages, support requests, or location information'
  },

  'ComingSoon': {
    path: 'src/views/pages/coming_soon.vue',
    category: 'pages',
    dependencies: [],
    assets: ['src/assets/sass/pages/coming-soon/style.scss'],
    description: 'Coming soon page with countdown and email signup',
    features: ['Countdown timer', 'Email subscription', 'Social media links', 'Progress indicator'],
    usageExample: 'Product launches, website maintenance, or feature announcements'
  },

  // ===== USERS CATEGORY =====
  'UserProfile': {
    path: 'src/views/users/profile.vue',
    category: 'users',
    dependencies: [],
    assets: ['src/assets/sass/users/user-profile.scss'],
    description: 'User profile page with activity timeline and statistics',
    features: ['Profile information', 'Activity timeline', 'Statistics display', 'Social links'],
    usageExample: 'User profiles, team member pages, or personal dashboards'
  },

  'AccountSettings': {
    path: 'src/views/users/account_setting.vue',
    category: 'users',
    dependencies: [],
    assets: ['src/assets/sass/users/account-setting.scss'],
    description: 'Account settings page with tabbed interface',
    features: ['Profile editing', 'Password change', 'Notification settings', 'Privacy controls'],
    usageExample: 'User account management, preferences, or security settings'
  }
};

/**
 * Get components by category
 */
export const getComponentsByCategory = (category) => {
  return Object.entries(templateComponents)
    .filter(([, component]) => component.category === category)
    .reduce((acc, [key, component]) => {
      acc[key] = component;
      return acc;
    }, {});
};

/**
 * Get all available categories
 */
export const getCategories = () => {
  const categories = [...new Set(Object.values(templateComponents).map(c => c.category))];
  return categories.sort();
};

/**
 * Search components by name or description
 */
export const searchComponents = (query) => {
  const searchTerm = query.toLowerCase();
  return Object.entries(templateComponents)
    .filter(([name, component]) => 
      name.toLowerCase().includes(searchTerm) ||
      component.description.toLowerCase().includes(searchTerm) ||
      component.features.some(feature => feature.toLowerCase().includes(searchTerm))
    )
    .reduce((acc, [key, component]) => {
      acc[key] = component;
      return acc;
    }, {});
};

/**
 * Get components that require specific dependencies
 */
export const getComponentsByDependency = (dependency) => {
  return Object.entries(templateComponents)
    .filter(([, component]) => component.dependencies.includes(dependency))
    .reduce((acc, [key, component]) => {
      acc[key] = component;
      return acc;
    }, {});
};

/**
 * Get all unique dependencies across all components
 */
export const getAllDependencies = () => {
  const dependencies = new Set();
  Object.values(templateComponents).forEach(component => {
    component.dependencies.forEach(dep => dependencies.add(dep));
  });
  return Array.from(dependencies).sort();
};

export default templateComponents;