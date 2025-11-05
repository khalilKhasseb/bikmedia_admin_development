# Template Component Catalog

This catalog provides detailed information about all available template components, organized by category. Each component includes its location, dependencies, features, and recommended use cases.

## 📱 Apps Category

### Calendar
- **Path**: `src/views/apps/calendar.vue`
- **Dependencies**: `@fullcalendar/core`, `@fullcalendar/daygrid`, `@fullcalendar/interaction`, `@fullcalendar/timegrid`, `@fullcalendar/vue3`
- **Assets**: `src/assets/sass/apps/calendar.scss`
- **Features**:
  - Event creation and editing
  - Drag & drop events
  - Month/Week/Day views
  - Event filtering
- **Use Case**: Perfect for scheduling systems, appointment booking, or event management

### Chat
- **Path**: `src/views/apps/chat.vue`
- **Dependencies**: `vue3-perfect-scrollbar`
- **Assets**: `src/assets/sass/apps/chat.scss`
- **Features**:
  - Message threads
  - User status indicators
  - File attachments
  - Search functionality
- **Use Case**: Ideal for customer support, team communication, or messaging features

### Contacts
- **Path**: `src/views/apps/contacts.vue`
- **Dependencies**: `@suadelabs/vue3-multiselect`
- **Assets**: `src/assets/sass/apps/contacts.scss`
- **Features**:
  - Contact search
  - Category filtering
  - Contact details modal
  - Bulk actions
- **Use Case**: Great for CRM systems, address books, or customer databases

### Mailbox
- **Path**: `src/views/apps/mailbox.vue`
- **Dependencies**: `vue3-perfect-scrollbar`
- **Assets**: `src/assets/sass/apps/mailbox.scss`
- **Features**:
  - Email composition
  - Folder organization
  - Email search
  - Attachment handling
- **Use Case**: Perfect for internal messaging systems or email management tools

### Notes
- **Path**: `src/views/apps/notes.vue`
- **Dependencies**: `vue3-perfect-scrollbar`
- **Assets**: `src/assets/sass/apps/notes.scss`
- **Features**:
  - Note categories
  - Search functionality
  - Rich text editing
  - Note archiving
- **Use Case**: Ideal for documentation systems, personal notes, or knowledge bases

### Scrumboard
- **Path**: `src/views/apps/scrumboard.vue`
- **Dependencies**: `vue-draggable-next`
- **Assets**: `src/assets/sass/apps/scrumboard.scss`
- **Features**:
  - Drag & drop cards
  - Multiple columns
  - Task assignment
  - Progress tracking
- **Use Case**: Perfect for project management, task tracking, or workflow visualization

### TodoList
- **Path**: `src/views/apps/todo_list.vue`
- **Dependencies**: `vue-draggable-next`
- **Assets**: `src/assets/sass/apps/todolist.scss`
- **Features**:
  - Task priorities
  - Category organization
  - Completion tracking
  - Task search
- **Use Case**: Great for personal productivity, team tasks, or project milestones

## 🔐 Authentication Category

### LoginBoxed
- **Path**: `src/views/auth/login_boxed.vue`
- **Dependencies**: None
- **Assets**: `src/assets/sass/authentication/auth-boxed.scss`
- **Features**:
  - Form validation
  - Remember me option
  - Forgot password link
  - Social login buttons
- **Use Case**: Alternative login design for applications requiring boxed layout

### RegisterBoxed
- **Path**: `src/views/auth/register_boxed.vue`
- **Dependencies**: None
- **Assets**: `src/assets/sass/authentication/auth-boxed.scss`
- **Features**:
  - Multi-field validation
  - Terms acceptance
  - Password strength indicator
  - Social registration
- **Use Case**: User registration with boxed design layout

### PasswordRecovery
- **Path**: `src/views/auth/pass_recovery.vue`
- **Dependencies**: None
- **Assets**: `src/assets/sass/authentication/auth.scss`
- **Features**:
  - Email validation
  - Success feedback
  - Back to login link
- **Use Case**: Password reset functionality for user authentication flows

### LockScreen
- **Path**: `src/views/auth/lockscreen.vue`
- **Dependencies**: None
- **Assets**: `src/assets/sass/authentication/auth.scss`
- **Features**:
  - User avatar display
  - Password unlock
  - Session timeout handling
- **Use Case**: Security feature for applications requiring session locking

## 📊 Charts Category

### ApexCharts
- **Path**: `src/views/charts/apex_chart.vue`
- **Dependencies**: `apexcharts`, `vue3-apexcharts`
- **Assets**: None
- **Features**:
  - Line charts
  - Area charts
  - Bar charts
  - Donut charts
  - Mixed charts
  - Interactive tooltips
- **Use Case**: Perfect for dashboards, analytics, and data visualization

## 🎨 UI Components Category

### Accordions
- **Path**: `src/views/components/accordions.vue`
- **Dependencies**: None
- **Assets**: `src/assets/sass/components/tabs-accordian/custom-accordions.scss`
- **Features**:
  - Multiple accordion styles
  - Icon indicators
  - Smooth animations
  - Nested accordions
- **Use Case**: FAQ sections, content organization, or space-saving layouts

### Cards
- **Path**: `src/views/components/cards.vue`
- **Dependencies**: None
- **Assets**: `src/assets/sass/components/cards/card.scss`
- **Features**:
  - Multiple card designs
  - Image cards
  - Action buttons
  - Card overlays
- **Use Case**: Product displays, user profiles, or content previews

### Carousel
- **Path**: `src/views/components/carousel.vue`
- **Dependencies**: `vue3-carousel`
- **Assets**: `src/assets/sass/components/custom-carousel.scss`
- **Features**:
  - Auto-play
  - Navigation arrows
  - Dot indicators
  - Touch/swipe support
- **Use Case**: Image galleries, product showcases, or featured content

### Countdown
- **Path**: `src/views/components/countdown.vue`
- **Dependencies**: None
- **Assets**: `src/assets/sass/components/custom-countdown.scss`
- **Features**:
  - Multiple time formats
  - Custom styling
  - Event callbacks
  - Responsive design
- **Use Case**: Event countdowns, sale timers, or deadline tracking

### Counter
- **Path**: `src/views/components/counter.vue`
- **Dependencies**: `vue-countup-v3`
- **Assets**: `src/assets/sass/components/custom-counter.scss`
- **Features**:
  - Count-up animations
  - Custom formatting
  - Trigger on scroll
  - Decimal support
- **Use Case**: Statistics display, achievement counters, or metric dashboards

### Lightbox
- **Path**: `src/views/components/lightbox.vue`
- **Dependencies**: `vue-easy-lightbox`
- **Assets**: `src/assets/sass/components/custom-lightbox.scss`
- **Features**:
  - Image zoom
  - Gallery navigation
  - Thumbnail preview
  - Fullscreen mode
- **Use Case**: Photo galleries, product images, or media showcases

### Modals
- **Path**: `src/views/components/modals.vue`
- **Dependencies**: None
- **Assets**: `src/assets/sass/components/custom-modal.scss`
- **Features**:
  - Multiple sizes
  - Animation effects
  - Custom styling
  - Video modals
- **Use Case**: Confirmations, forms, content display, or media playback

### Timeline
- **Path**: `src/views/components/timeline.vue`
- **Dependencies**: None
- **Assets**: `src/assets/sass/components/timeline/custom-timeline.scss`
- **Features**:
  - Vertical timeline
  - Event markers
  - Custom icons
  - Responsive design
- **Use Case**: Project milestones, company history, or process flows

### Toast
- **Path**: `src/views/components/toast.vue`
- **Dependencies**: None
- **Assets**: None
- **Features**:
  - Multiple notification types
  - Auto-dismiss
  - Custom positioning
  - Action buttons
- **Use Case**: User feedback, success messages, or error notifications

### SweetAlert
- **Path**: `src/views/components/sweetalert.vue`
- **Dependencies**: `sweetalert2`
- **Assets**: `src/assets/sass/components/custom-sweetalert.scss`
- **Features**:
  - Custom styling
  - Input prompts
  - Confirmation dialogs
  - Success/error states
- **Use Case**: User confirmations, input prompts, or important notifications

## 🧩 Elements Category

### Alerts
- **Path**: `src/views/elements/alerts.vue`
- **Dependencies**: None
- **Assets**: `src/assets/sass/elements/alert.scss`
- **Features**:
  - Multiple alert types
  - Dismissible alerts
  - Icon support
  - Custom styling
- **Use Case**: Status messages, warnings, or informational content

### Buttons
- **Path**: `src/views/elements/buttons.vue`
- **Dependencies**: None
- **Assets**: None
- **Features**:
  - Multiple button styles
  - Size variations
  - Icon buttons
  - Loading states
- **Use Case**: Form actions, navigation, or call-to-action elements

### Badges
- **Path**: `src/views/elements/badges.vue`
- **Dependencies**: None
- **Assets**: None
- **Features**:
  - Various badge styles
  - Notification badges
  - Pill badges
  - Custom colors
- **Use Case**: Status indicators, notification counts, or category labels

### Pagination
- **Path**: `src/views/elements/pagination.vue`
- **Dependencies**: None
- **Assets**: None
- **Features**:
  - Multiple pagination styles
  - Page size options
  - Jump to page
  - Responsive design
- **Use Case**: Table navigation, search results, or content browsing

### ProgressBar
- **Path**: `src/views/elements/progress_bar.vue`
- **Dependencies**: None
- **Assets**: None
- **Features**:
  - Linear progress
  - Circular progress
  - Animated progress
  - Custom colors
- **Use Case**: Loading states, completion tracking, or skill indicators

## 📝 Forms Category

### FormWizard
- **Path**: `src/views/forms/wizards.vue`
- **Dependencies**: `vue3-form-wizard`
- **Assets**: None
- **Features**:
  - Step navigation
  - Form validation
  - Progress indicator
  - Custom styling
- **Use Case**: Registration processes, surveys, or complex data entry

### FormValidation
- **Path**: `src/views/forms/validation.vue`
- **Dependencies**: `@vuelidate/core`, `@vuelidate/validators`
- **Assets**: None
- **Features**:
  - Real-time validation
  - Custom validators
  - Error messaging
  - Field highlighting
- **Use Case**: User input validation, data quality assurance, or form security

### FileUpload
- **Path**: `src/views/forms/fileupload.vue`
- **Dependencies**: `file-upload-with-preview`
- **Assets**: `src/assets/sass/forms/file-upload-with-preview.min.css`
- **Features**:
  - Drag & drop upload
  - File preview
  - Multiple file support
  - Progress tracking
- **Use Case**: Document uploads, image galleries, or media management

### DateRangePicker
- **Path**: `src/views/forms/date_range_picker.vue`
- **Dependencies**: `vue-flatpickr-component`
- **Assets**: `src/assets/sass/forms/custom-flatpickr.css`
- **Features**:
  - Date range selection
  - Time picker
  - Custom formatting
  - Localization support
- **Use Case**: Booking systems, report filtering, or event scheduling

### RichTextEditor
- **Path**: `src/views/forms/quill_editor.vue`
- **Dependencies**: `vue3-quill`
- **Assets**: None
- **Features**:
  - Text formatting
  - Image insertion
  - Link creation
  - Custom toolbar
- **Use Case**: Content management, blog posts, or document editing

### MarkdownEditor
- **Path**: `src/views/forms/markdown_editor.vue`
- **Dependencies**: `vue3-easymde`
- **Assets**: None
- **Features**:
  - Markdown syntax
  - Live preview
  - Toolbar shortcuts
  - Full-screen mode
- **Use Case**: Documentation, blog writing, or technical content creation

### Select2
- **Path**: `src/views/forms/select2.vue`
- **Dependencies**: `@suadelabs/vue3-multiselect`
- **Assets**: None
- **Features**:
  - Search functionality
  - Multi-select
  - Custom options
  - Ajax loading
- **Use Case**: Category selection, user assignment, or tag management

### Switches
- **Path**: `src/views/forms/switches.vue`
- **Dependencies**: None
- **Assets**: `src/assets/sass/forms/switches.scss`
- **Features**:
  - Toggle switches
  - Custom styling
  - Size variations
  - Disabled states
- **Use Case**: Settings toggles, feature flags, or boolean inputs

## 📋 Tables Category

### DataTableBasic
- **Path**: `src/views/tables/vue3-datatable/basic.vue`
- **Dependencies**: `@bhplugin/vue3-datatable`
- **Assets**: `src/assets/sass/tables/table-basic.scss`
- **Features**:
  - Column sorting
  - Pagination
  - Row selection
  - Responsive design
- **Use Case**: Simple data display, user lists, or basic reporting

### DataTableAdvanced
- **Path**: `src/views/tables/vue3-datatable/advance.vue`
- **Dependencies**: `@bhplugin/vue3-datatable`
- **Assets**: `src/assets/sass/tables/table-custom.scss`
- **Features**:
  - Global search
  - Column filtering
  - Export functionality
  - Custom actions
- **Use Case**: Complex data management, reporting, or admin interfaces

### DataTableActions
- **Path**: `src/views/tables/vue3-datatable/actions.vue`
- **Dependencies**: `@bhplugin/vue3-datatable`
- **Assets**: `src/assets/sass/tables/table-custom.scss`
- **Features**:
  - Row actions
  - Bulk operations
  - Confirmation dialogs
  - Custom buttons
- **Use Case**: User management, content moderation, or bulk data operations

### V3TableBasic
- **Path**: `src/views/tables/v3-table/basic.vue`
- **Dependencies**: `v-tables-3`
- **Assets**: `src/assets/sass/tables/table-basic.scss`
- **Features**:
  - Server-side processing
  - Custom templates
  - Event handling
  - Flexible configuration
- **Use Case**: Large datasets, server-side pagination, or custom table layouts

## 📄 Pages Category

### Error404
- **Path**: `src/views/pages/error404.vue`
- **Dependencies**: None
- **Assets**: `src/assets/sass/pages/error/style-400.scss`
- **Features**:
  - Custom error message
  - Navigation links
  - Search functionality
  - Responsive design
- **Use Case**: Handle missing pages, broken links, or unauthorized access

### Error500
- **Path**: `src/views/pages/error500.vue`
- **Dependencies**: None
- **Assets**: `src/assets/sass/pages/error/style-500.scss`
- **Features**:
  - Error reporting
  - Support contact
  - Retry functionality
  - Professional design
- **Use Case**: Server errors, maintenance mode, or system failures

### FAQ
- **Path**: `src/views/pages/faq.vue`
- **Dependencies**: None
- **Assets**: `src/assets/sass/pages/faq/faq.scss`
- **Features**:
  - Question search
  - Category filtering
  - Expandable answers
  - Contact support
- **Use Case**: Customer support, product documentation, or help sections

### ContactUs
- **Path**: `src/views/pages/contact_us.vue`
- **Dependencies**: None
- **Assets**: `src/assets/sass/pages/contact_us.scss`
- **Features**:
  - Contact form
  - Location map
  - Company details
  - Social media links
- **Use Case**: Business contact pages, support requests, or location information

### ComingSoon
- **Path**: `src/views/pages/coming_soon.vue`
- **Dependencies**: None
- **Assets**: `src/assets/sass/pages/coming-soon/style.scss`
- **Features**:
  - Countdown timer
  - Email subscription
  - Social media links
  - Progress indicator
- **Use Case**: Product launches, website maintenance, or feature announcements

## 👤 Users Category

### UserProfile
- **Path**: `src/views/users/profile.vue`
- **Dependencies**: None
- **Assets**: `src/assets/sass/users/user-profile.scss`
- **Features**:
  - Profile information
  - Activity timeline
  - Statistics display
  - Social links
- **Use Case**: User profiles, team member pages, or personal dashboards

### AccountSettings
- **Path**: `src/views/users/account_setting.vue`
- **Dependencies**: None
- **Assets**: `src/assets/sass/users/account-setting.scss`
- **Features**:
  - Profile editing
  - Password change
  - Notification settings
  - Privacy controls
- **Use Case**: User account management, preferences, or security settings

---

## Summary Statistics

- **Total Components**: 47
- **Categories**: 8
- **Components with Dependencies**: 19
- **Components with Assets**: 25
- **Zero-Dependency Components**: 28

## Dependency Overview

Most commonly required dependencies:
- `@bhplugin/vue3-datatable` (3 components)
- `vue3-perfect-scrollbar` (3 components)
- `@suadelabs/vue3-multiselect` (2 components)
- `vue-draggable-next` (2 components)
- `@vuelidate/core` & `@vuelidate/validators` (1 component each)

All dependencies are already included in the project's package.json, so no additional installations are required for most components.