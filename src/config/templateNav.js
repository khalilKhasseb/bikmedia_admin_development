export default  {
        id: 'templateComponents',
        type: 'group',
        label: 'Template Components',
        icon: icons.box,
        children: [
            // Apps
            {
                id: 'apps',
                type: 'group',
                label: 'apps',
                icon: icons.cpu,
                children: [
                    { type: 'single', label: 'Chat', to: '/apps/chat' },
                    { type: 'single', label: 'Mailbox', to: '/apps/mailbox' },
                    { type: 'single', label: 'Todo List', to: '/apps/todo-list' },
                    { type: 'single', label: 'Notes', to: '/apps/notes' },
                    { type: 'single', label: 'Scrumboard', to: '/apps/scrumboard' },
                    { type: 'single', label: 'Contacts', to: '/apps/contacts' },
                    {
                        id: 'invoice',
                        type: 'group',
                        label: 'Invoice',
                        children: [
                            { type: 'single', label: 'List', to: '/apps/invoice/list' },
                            { type: 'single', label: 'Preview', to: '/apps/invoice/preview' },
                            { type: 'single', label: 'Add', to: '/apps/invoice/add' },
                            { type: 'single', label: 'Edit', to: '/apps/invoice/edit' }
                        ]
                    },
                    { type: 'single', label: 'Calendar', to: '/apps/calendar' }
                ]
            },
            // Components
            {
                id: 'components',
                type: 'group',
                label: 'components',
                icon: icons.box,
                children: [
                    { type: 'single', label: 'Tabs', to: '/components/tabs' },
                    { type: 'single', label: 'Accordions', to: '/components/accordions' },
                    { type: 'single', label: 'Modals', to: '/components/modals' },
                    { type: 'single', label: 'Cards', to: '/components/cards' },
                    { type: 'single', label: 'Carousel', to: '/components/carousel' },
                    { type: 'single', label: 'Countdown', to: '/components/countdown' },
                    { type: 'single', label: 'Counter', to: '/components/counter' },
                    { type: 'single', label: 'Sweet Alerts', to: '/components/sweetalert' },
                    { type: 'single', label: 'Timeline', to: '/components/timeline' },
                    { type: 'single', label: 'Notifications', to: '/components/notifications' },
                    { type: 'single', label: 'Media Object', to: '/components/media-object' },
                    { type: 'single', label: 'List Group', to: '/components/list-group' },
                    { type: 'single', label: 'Pricing Tables', to: '/components/pricing-table' },
                    { type: 'single', label: 'Lightbox', to: '/components/lightbox' }
                ]
            },
            // Elements
            {
                id: 'elements',
                type: 'group',
                label: 'elements',
                icon: icons.zap,
                children: [
                    { type: 'single', label: 'Alerts', to: '/elements/alerts' },
                    { type: 'single', label: 'Avatar', to: '/elements/avatar' },
                    { type: 'single', label: 'Badges', to: '/elements/badges' },
                    { type: 'single', label: 'Breadcrumbs', to: '/elements/breadcrumbs' },
                    { type: 'single', label: 'Buttons', to: '/elements/buttons' },
                    { type: 'single', label: 'Button Groups', to: '/elements/buttons-group' },
                    { type: 'single', label: 'Color Library', to: '/elements/color-library' },
                    { type: 'single', label: 'Dropdown', to: '/elements/dropdown' },
                    { type: 'single', label: 'Infobox', to: '/elements/infobox' },
                    { type: 'single', label: 'Jumbotron', to: '/elements/jumbotron' },
                    { type: 'single', label: 'Loader', to: '/elements/loader' },
                    { type: 'single', label: 'Pagination', to: '/elements/pagination' },
                    { type: 'single', label: 'Popovers', to: '/elements/popovers' },
                    { type: 'single', label: 'Progress Bar', to: '/elements/progress-bar' },
                    { type: 'single', label: 'Search', to: '/elements/search' },
                    { type: 'single', label: 'Tooltips', to: '/elements/tooltips' },
                    { type: 'single', label: 'Treeview', to: '/elements/treeview' },
                    { type: 'single', label: 'Typography', to: '/elements/typography' }
                ]
            },
            // Font Icons
            { type: 'single', label: 'font_icons', icon: icons.target, to: '/font-icons' },
            // Widgets
            { type: 'single', label: 'widgets', icon: icons.airplay, to: '/widgets' },
            // Tables
            { type: 'single', label: 'tables', icon: icons.layout, to: '/tables' },
            // Datatables
            {
                id: 'datatables',
                type: 'group',
                label: 'datatables',
                icon: icons.layers,
                children: [
                    {
                        id: 'vue3Datatable',
                        type: 'group',
                        label: 'vue3-datatable',
                        children: [
                            { type: 'single', label: 'Basic', to: '/tables/vue3-datatable/basic' },
                            { type: 'single', label: 'Advanced', to: '/tables/vue3-datatable/advance' },
                            { type: 'single', label: 'Order Sorting', to: '/tables/vue3-datatable/order-sorting' },
                            { type: 'single', label: 'Alt. Pagination', to: '/tables/vue3-datatable/alt-pagination' },
                            { type: 'single', label: 'Search', to: '/tables/vue3-datatable/search' },
                            { type: 'single', label: 'Checkbox', to: '/tables/vue3-datatable/checkbox' },
                            { type: 'single', label: 'Slot', to: '/tables/vue3-datatable/slot' },
                            { type: 'single', label: 'Column Filter', to: '/tables/vue3-datatable/column-filter' },
                            { type: 'single', label: 'Actions', to: '/tables/vue3-datatable/actions' },
                            { type: 'single', label: 'Sticky Header', to: '/tables/vue3-datatable/sticky-header' },
                            { type: 'single', label: 'Column Chooser', to: '/tables/vue3-datatable/column-chooser' }
                        ]
                    },
                    {
                        id: 'v3Table',
                        type: 'group',
                        label: 'v3-table',
                        children: [
                            { type: 'single', label: 'Basic', to: '/tables/v3-table/basic' },
                            { type: 'single', label: 'Striped Table', to: '/tables/v3-table/striped' },
                            { type: 'single', label: 'Order Sorting', to: '/tables/v3-table/order-sorting' },
                            { type: 'single', label: 'Multi Column', to: '/tables/v3-table/multi-column' },
                            { type: 'single', label: 'Multiple Tables', to: '/tables/v3-table/multiple-tables' },
                            { type: 'single', label: 'Alt. Pagination', to: '/tables/v3-table/alt-pagination' },
                            { type: 'single', label: 'Custom', to: '/tables/v3-table/custom' },
                            { type: 'single', label: 'Range Search', to: '/tables/v3-table/range-search' },
                            { type: 'single', label: 'Export', to: '/tables/v3-table/export' },
                            { type: 'single', label: 'Live DOM ordering', to: '/tables/v3-table/live-dom-ordering' },
                            { type: 'single', label: 'Miscellaneous', to: '/tables/v3-table/miscellaneous' }
                        ]
                    }
                ]
            },
            // Forms
            {
                id: 'forms',
                type: 'group',
                label: 'forms',
                icon: icons.clipboard,
                children: [
                    { type: 'single', label: 'Basic', to: '/forms/basic' },
                    { type: 'single', label: 'Input Group', to: '/forms/input-group' },
                    { type: 'single', label: 'Layouts', to: '/forms/layouts' },
                    { type: 'single', label: 'Validation', to: '/forms/validation' },
                    { type: 'single', label: 'Input Mask', to: '/forms/input-mask' },
                    { type: 'single', label: 'Select2', to: '/forms/select2' },
                    { type: 'single', label: 'Touchspin', to: '/forms/touchspin' },
                    { type: 'single', label: 'Checkbox & Radio', to: '/forms/checkbox-radio' },
                    { type: 'single', label: 'Switches', to: '/forms/switches' },
                    { type: 'single', label: 'Wizards', to: '/forms/wizards' },
                    { type: 'single', label: 'File Upload', to: '/forms/file-upload' },
                    { type: 'single', label: 'Quill Editor', to: '/forms/quill-editor' },
                    { type: 'single', label: 'Markdown Editor', to: '/forms/markdown-editor' },
                    { type: 'single', label: 'Date & Range Picker', to: '/forms/date-picker' },
                    { type: 'single', label: 'Clipboard', to: '/forms/clipboard' }
                ]
            },
            // Users
            {
                id: 'users',
                type: 'group',
                label: 'users',
                icon: icons.users,
                children: [
                    { type: 'single', label: 'Profile', to: '/users/profile' },
                    { type: 'single', label: 'Account Settings', to: '/users/account-setting' }
                ]
            },
            // Pages
            {
                id: 'pages',
                type: 'group',
                label: 'pages',
                icon: icons.fileText,
                children: [
                    { type: 'single', label: 'Helpdesk', to: '/pages/helpdesk' },
                    { type: 'single', label: 'Contact Form', to: '/pages/contact-us' },
                    { type: 'single', label: 'FAQ', to: '/pages/faq' },
                    { type: 'single', label: 'Privacy Policy', to: '/pages/privacy-policy' },
                    { type: 'single', label: 'Coming Soon', to: '/pages/coming-soon', external: true },
                    {
                        id: 'error',
                        type: 'group',
                        label: 'Error',
                        children: [
                            { type: 'single', label: '404', to: '/pages/error404', external: true },
                            { type: 'single', label: '500', to: '/pages/error500', external: true },
                            { type: 'single', label: '503', to: '/pages/error503', external: true }
                        ]
                    },
                    { type: 'single', label: 'Maintanence', to: '/pages/maintenence', external: true },
                    { type: 'single', label: 'Blank Page', to: '/pages/blank-page' },
                    { type: 'single', label: 'Sample Page', to: '/pages/sample' }
                ]
            },
            // Authentication
            {
                id: 'authentication',
                type: 'group',
                label: 'authentication',
                icon: icons.lock,
                children: [
                    { type: 'single', label: 'Login Boxed', to: '/auth/login-boxed', external: true },
                    { type: 'single', label: 'Register Boxed', to: '/auth/register-boxed', external: true },
                    { type: 'single', label: 'Unlock Boxed', to: '/auth/lockscreen-boxed', external: true },
                    { type: 'single', label: 'Recover ID Boxed', to: '/auth/pass-recovery-boxed', external: true },
                    { type: 'single', label: 'Login Cover', to: '/auth/login', external: true },
                    { type: 'single', label: 'Register Cover', to: '/auth/register', external: true },
                    { type: 'single', label: 'Unlock Cover', to: '/auth/lockscreen', external: true },
                    { type: 'single', label: 'Recover ID Cover', to: '/auth/pass-recovery', external: true }
                ]
            },
            // Drag and Drop
            { type: 'single', label: 'drag_and_drop', icon: icons.move, to: '/dragndrop' },
            // Charts
            { type: 'single', label: 'charts', icon: icons.pieChart, to: '/charts/apex-chart' },
            // Documentation
            { type: 'single', label: 'documentation', icon: icons.book, to: 'https://cork-vue.sbthemes.com', external: true }
        ]
    }