/**
 * Template Preview Generator
 * 
 * Utility for generating interactive previews of template components
 * without requiring full component instantiation.
 */

/**
 * Generate preview HTML for a component
 * @param {string} componentName - Name of the component
 * @param {Object} componentInfo - Component information from inventory
 * @returns {string} HTML string for preview
 */
export function generateComponentPreview(componentName, componentInfo) {
  const previewTemplates = {
    // Apps Category
    'Calendar': () => `
      <div class="calendar-preview">
        <div class="calendar-header">
          <button class="nav-btn">‹</button>
          <h3>January 2024</h3>
          <button class="nav-btn">›</button>
        </div>
        <div class="calendar-grid">
          <div class="day-header">Sun</div>
          <div class="day-header">Mon</div>
          <div class="day-header">Tue</div>
          <div class="day-header">Wed</div>
          <div class="day-header">Thu</div>
          <div class="day-header">Fri</div>
          <div class="day-header">Sat</div>
          <div class="day-cell"></div>
          <div class="day-cell">1</div>
          <div class="day-cell">2</div>
          <div class="day-cell">3</div>
          <div class="day-cell">4</div>
          <div class="day-cell">5</div>
          <div class="day-cell">6</div>
          <div class="day-cell">7</div>
          <div class="day-cell">8</div>
          <div class="day-cell">9</div>
          <div class="day-cell">10</div>
          <div class="day-cell">11</div>
          <div class="day-cell">12</div>
          <div class="day-cell">13</div>
          <div class="day-cell has-event" onclick="showEventDetails()">14</div>
          <div class="day-cell">15</div>
          <div class="day-cell">16</div>
          <div class="day-cell">17</div>
          <div class="day-cell">18</div>
          <div class="day-cell">19</div>
          <div class="day-cell">20</div>
        </div>
        <div class="event-popup" id="eventPopup" style="display: none;">
          <strong>Team Meeting</strong><br>
          <small>2:00 PM - 3:00 PM</small>
        </div>
      </div>
    `,

    'Chat': () => `
      <div class="chat-preview">
        <div class="chat-header">
          <div class="user-info">
            <div class="avatar">👤</div>
            <div class="user-details">
              <strong>John Doe</strong>
              <span class="status online">Online</span>
            </div>
          </div>
        </div>
        <div class="chat-messages">
          <div class="message received">
            <div class="message-content">Hey! How's the project going?</div>
            <div class="message-time">10:30 AM</div>
          </div>
          <div class="message sent">
            <div class="message-content">Great! Just finished the preview system.</div>
            <div class="message-time">10:32 AM</div>
          </div>
          <div class="message received">
            <div class="message-content">Awesome! Can't wait to see it 🎉</div>
            <div class="message-time">10:33 AM</div>
          </div>
        </div>
        <div class="chat-input">
          <input type="text" placeholder="Type a message..." class="message-input">
          <button class="send-btn" onclick="sendMessage()">Send</button>
        </div>
      </div>
    `,

    'Contacts': () => `
      <div class="contacts-preview">
        <div class="contacts-header">
          <input type="text" placeholder="Search contacts..." class="search-input">
          <button class="add-btn">+ Add Contact</button>
        </div>
        <div class="contacts-list">
          <div class="contact-item" onclick="selectContact(this)">
            <div class="contact-avatar">👨‍💼</div>
            <div class="contact-info">
              <strong>John Smith</strong>
              <div class="contact-email">john.smith@company.com</div>
              <div class="contact-role">Project Manager</div>
            </div>
            <div class="contact-actions">
              <button class="action-btn">📧</button>
              <button class="action-btn">📞</button>
            </div>
          </div>
          <div class="contact-item">
            <div class="contact-avatar">👩‍💻</div>
            <div class="contact-info">
              <strong>Sarah Johnson</strong>
              <div class="contact-email">sarah.j@company.com</div>
              <div class="contact-role">Developer</div>
            </div>
            <div class="contact-actions">
              <button class="action-btn">📧</button>
              <button class="action-btn">📞</button>
            </div>
          </div>
        </div>
      </div>
    `,

    'Scrumboard': () => `
      <div class="scrumboard-preview">
        <div class="board-columns">
          <div class="column">
            <div class="column-header">
              <h4>To Do</h4>
              <span class="task-count">3</span>
            </div>
            <div class="task-list">
              <div class="task-card" draggable="true" ondragstart="dragStart(event)">
                <div class="task-title">Design Homepage</div>
                <div class="task-meta">
                  <span class="priority high">High</span>
                  <span class="assignee">👤 John</span>
                </div>
              </div>
              <div class="task-card" draggable="true">
                <div class="task-title">Setup Database</div>
                <div class="task-meta">
                  <span class="priority medium">Medium</span>
                  <span class="assignee">👤 Sarah</span>
                </div>
              </div>
            </div>
          </div>
          <div class="column" ondrop="drop(event)" ondragover="allowDrop(event)">
            <div class="column-header">
              <h4>In Progress</h4>
              <span class="task-count">2</span>
            </div>
            <div class="task-list">
              <div class="task-card">
                <div class="task-title">API Development</div>
                <div class="task-meta">
                  <span class="priority high">High</span>
                  <span class="assignee">👤 Mike</span>
                </div>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="column-header">
              <h4>Done</h4>
              <span class="task-count">1</span>
            </div>
            <div class="task-list">
              <div class="task-card completed">
                <div class="task-title">Project Setup</div>
                <div class="task-meta">
                  <span class="priority low">Low</span>
                  <span class="assignee">👤 Team</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,

    // Form Components
    'FormWizard': () => `
      <div class="wizard-preview">
        <div class="wizard-steps">
          <div class="step active" onclick="goToStep(1)">1. Personal Info</div>
          <div class="step" onclick="goToStep(2)">2. Account Details</div>
          <div class="step" onclick="goToStep(3)">3. Confirmation</div>
        </div>
        <div class="wizard-content">
          <div class="step-content active" id="step1">
            <h3>Step 1: Personal Information</h3>
            <form class="wizard-form">
              <input type="text" placeholder="Full Name" class="form-input" value="John Doe">
              <input type="email" placeholder="Email Address" class="form-input" value="john@example.com">
              <input type="tel" placeholder="Phone Number" class="form-input" value="+1 234 567 8900">
              <button type="button" class="btn-next" onclick="nextStep()">Next Step →</button>
            </form>
          </div>
          <div class="step-content" id="step2">
            <h3>Step 2: Account Details</h3>
            <form class="wizard-form">
              <input type="text" placeholder="Username" class="form-input">
              <input type="password" placeholder="Password" class="form-input">
              <input type="password" placeholder="Confirm Password" class="form-input">
              <button type="button" class="btn-prev" onclick="prevStep()">← Previous</button>
              <button type="button" class="btn-next" onclick="nextStep()">Next Step →</button>
            </form>
          </div>
          <div class="step-content" id="step3">
            <h3>Step 3: Confirmation</h3>
            <div class="confirmation-summary">
              <p>✅ Personal information completed</p>
              <p>✅ Account details configured</p>
              <p>Ready to create your account!</p>
              <button type="button" class="btn-prev" onclick="prevStep()">← Previous</button>
              <button type="button" class="btn-submit" onclick="submitForm()">Create Account</button>
            </div>
          </div>
        </div>
      </div>
    `,

    'FileUpload': () => `
      <div class="file-upload-preview">
        <div class="upload-area" onclick="triggerFileUpload()" ondrop="handleDrop(event)" ondragover="handleDragOver(event)">
          <div class="upload-icon">📁</div>
          <p>Drag & drop files here or click to browse</p>
          <button class="upload-btn">Choose Files</button>
          <input type="file" id="fileInput" style="display: none;" multiple onchange="handleFileSelect(event)">
        </div>
        <div class="file-list" id="fileList">
          <div class="file-item">
            <div class="file-icon">📄</div>
            <div class="file-info">
              <span class="file-name">document.pdf</span>
              <span class="file-size">2.3 MB</span>
            </div>
            <div class="file-progress">
              <div class="progress-bar" style="width: 75%"></div>
            </div>
            <button class="remove-btn" onclick="removeFile(this)">×</button>
          </div>
          <div class="file-item">
            <div class="file-icon">🖼️</div>
            <div class="file-info">
              <span class="file-name">image.jpg</span>
              <span class="file-size">1.8 MB</span>
            </div>
            <div class="file-progress">
              <div class="progress-bar completed" style="width: 100%"></div>
            </div>
            <button class="remove-btn" onclick="removeFile(this)">×</button>
          </div>
        </div>
      </div>
    `,

    'DateRangePicker': () => `
      <div class="date-picker-preview">
        <div class="date-input-group">
          <input type="text" value="2024-01-15" class="date-input" readonly onclick="toggleCalendar()">
          <span class="date-separator">to</span>
          <input type="text" value="2024-01-30" class="date-input" readonly onclick="toggleCalendar()">
          <button class="calendar-btn" onclick="toggleCalendar()">📅</button>
        </div>
        <div class="date-shortcuts">
          <button class="shortcut-btn" onclick="setDateRange('today')">Today</button>
          <button class="shortcut-btn" onclick="setDateRange('week')">This Week</button>
          <button class="shortcut-btn active" onclick="setDateRange('month')">This Month</button>
          <button class="shortcut-btn" onclick="setDateRange('quarter')">This Quarter</button>
        </div>
        <div class="mini-calendar" id="miniCalendar" style="display: none;">
          <div class="calendar-header">
            <button onclick="prevMonth()">‹</button>
            <span>January 2024</span>
            <button onclick="nextMonth()">›</button>
          </div>
          <div class="calendar-days">
            <div class="day-name">S</div>
            <div class="day-name">M</div>
            <div class="day-name">T</div>
            <div class="day-name">W</div>
            <div class="day-name">T</div>
            <div class="day-name">F</div>
            <div class="day-name">S</div>
            <div class="day"></div>
            <div class="day">1</div>
            <div class="day">2</div>
            <div class="day">3</div>
            <div class="day">4</div>
            <div class="day">5</div>
            <div class="day">6</div>
            <div class="day">7</div>
            <div class="day">8</div>
            <div class="day">9</div>
            <div class="day">10</div>
            <div class="day">11</div>
            <div class="day">12</div>
            <div class="day">13</div>
            <div class="day selected">15</div>
            <div class="day">16</div>
            <div class="day">17</div>
            <div class="day">18</div>
            <div class="day">19</div>
            <div class="day">20</div>
            <div class="day selected">30</div>
          </div>
        </div>
      </div>
    `,

    // Table Components
    'DataTableBasic': () => `
      <div class="datatable-preview">
        <div class="table-controls">
          <div class="entries-control">
            Show 
            <select class="entries-select" onchange="changeEntries(this.value)">
              <option value="10">10</option>
              <option value="25" selected>25</option>
              <option value="50">50</option>
            </select>
            entries
          </div>
          <input type="text" placeholder="Search..." class="search-input" oninput="searchTable(this.value)">
        </div>
        <table class="preview-table" id="dataTable">
          <thead>
            <tr>
              <th onclick="sortTable(0)">Name <span class="sort-icon">↕</span></th>
              <th onclick="sortTable(1)">Email <span class="sort-icon">↕</span></th>
              <th onclick="sortTable(2)">Role <span class="sort-icon">↕</span></th>
              <th onclick="sortTable(3)">Status <span class="sort-icon">↕</span></th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Doe</td>
              <td>john@example.com</td>
              <td>Admin</td>
              <td><span class="status active">Active</span></td>
              <td>
                <button class="action-btn edit" onclick="editRow(this)">✏️</button>
                <button class="action-btn delete" onclick="deleteRow(this)">🗑️</button>
              </td>
            </tr>
            <tr>
              <td>Jane Smith</td>
              <td>jane@example.com</td>
              <td>User</td>
              <td><span class="status inactive">Inactive</span></td>
              <td>
                <button class="action-btn edit" onclick="editRow(this)">✏️</button>
                <button class="action-btn delete" onclick="deleteRow(this)">🗑️</button>
              </td>
            </tr>
            <tr>
              <td>Mike Johnson</td>
              <td>mike@example.com</td>
              <td>Manager</td>
              <td><span class="status active">Active</span></td>
              <td>
                <button class="action-btn edit" onclick="editRow(this)">✏️</button>
                <button class="action-btn delete" onclick="deleteRow(this)">🗑️</button>
              </td>
            </tr>
            <tr>
              <td>Sarah Wilson</td>
              <td>sarah@example.com</td>
              <td>Developer</td>
              <td><span class="status active">Active</span></td>
              <td>
                <button class="action-btn edit" onclick="editRow(this)">✏️</button>
                <button class="action-btn delete" onclick="deleteRow(this)">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="pagination">
          <button onclick="prevPage()" id="prevBtn">← Previous</button>
          <span id="pageInfo">Showing 1 to 4 of 4 entries</span>
          <button onclick="nextPage()" id="nextBtn">Next →</button>
        </div>
      </div>
    `,

    'DataTableAdvanced': () => `
      <div class="datatable-advanced-preview">
        <div class="table-toolbar">
          <div class="toolbar-left">
            <button class="btn-primary" onclick="addNewRecord()">+ Add New</button>
            <button class="btn-secondary" onclick="exportData()">📊 Export</button>
            <button class="btn-secondary" onclick="importData()">📥 Import</button>
          </div>
          <div class="toolbar-right">
            <input type="text" placeholder="Global search..." class="global-search" oninput="globalSearch(this.value)">
            <button class="filter-btn" onclick="toggleFilters()">🔍 Filters</button>
          </div>
        </div>
        <div class="column-filters" id="columnFilters" style="display: none;">
          <div class="filter-group">
            <label>Role:</label>
            <select onchange="filterByRole(this.value)">
              <option value="">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
              <option value="Manager">Manager</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Status:</label>
            <select onchange="filterByStatus(this.value)">
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Date Range:</label>
            <input type="date" onchange="filterByDate()">
          </div>
        </div>
        <table class="advanced-table">
          <thead>
            <tr>
              <th><input type="checkbox" onchange="selectAll(this)"></th>
              <th onclick="sortAdvanced(0)">ID <span class="sort-icon">↕</span></th>
              <th onclick="sortAdvanced(1)">Name <span class="sort-icon">↕</span></th>
              <th onclick="sortAdvanced(2)">Email <span class="sort-icon">↕</span></th>
              <th onclick="sortAdvanced(3)">Role <span class="sort-icon">↕</span></th>
              <th onclick="sortAdvanced(4)">Status <span class="sort-icon">↕</span></th>
              <th onclick="sortAdvanced(5)">Last Login <span class="sort-icon">↕</span></th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><input type="checkbox"></td>
              <td>#001</td>
              <td>John Doe</td>
              <td>john@example.com</td>
              <td><span class="role-badge admin">Admin</span></td>
              <td><span class="status active">Active</span></td>
              <td>2024-01-15 10:30</td>
              <td>
                <div class="action-dropdown">
                  <button class="dropdown-btn" onclick="toggleDropdown(this)">⋮</button>
                  <div class="dropdown-menu">
                    <a href="#" onclick="viewDetails()">👁️ View</a>
                    <a href="#" onclick="editRecord()">✏️ Edit</a>
                    <a href="#" onclick="deleteRecord()">🗑️ Delete</a>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td><input type="checkbox"></td>
              <td>#002</td>
              <td>Jane Smith</td>
              <td>jane@example.com</td>
              <td><span class="role-badge user">User</span></td>
              <td><span class="status inactive">Inactive</span></td>
              <td>2024-01-10 14:20</td>
              <td>
                <div class="action-dropdown">
                  <button class="dropdown-btn" onclick="toggleDropdown(this)">⋮</button>
                  <div class="dropdown-menu">
                    <a href="#" onclick="viewDetails()">👁️ View</a>
                    <a href="#" onclick="editRecord()">✏️ Edit</a>
                    <a href="#" onclick="deleteRecord()">🗑️ Delete</a>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="advanced-pagination">
          <div class="pagination-info">
            <span>Showing 1 to 2 of 25 entries</span>
            <select class="page-size" onchange="changePageSize(this.value)">
              <option value="10">10 per page</option>
              <option value="25" selected>25 per page</option>
              <option value="50">50 per page</option>
            </select>
          </div>
          <div class="pagination-controls">
            <button onclick="firstPage()">⏮️</button>
            <button onclick="prevPageAdv()">◀️</button>
            <span class="page-numbers">
              <button class="page-btn active">1</button>
              <button class="page-btn">2</button>
              <button class="page-btn">3</button>
            </span>
            <button onclick="nextPageAdv()">▶️</button>
            <button onclick="lastPage()">⏭️</button>
          </div>
        </div>
      </div>
    `,

    // Chart Components
    'ApexCharts': () => `
      <div class="chart-preview">
        <div class="chart-controls">
          <div class="chart-tabs">
            <button class="chart-tab active" onclick="switchChart('line')">Line Chart</button>
            <button class="chart-tab" onclick="switchChart('bar')">Bar Chart</button>
            <button class="chart-tab" onclick="switchChart('donut')">Donut Chart</button>
          </div>
          <div class="chart-options">
            <button class="option-btn" onclick="toggleDataLabels()">📊 Labels</button>
            <button class="option-btn" onclick="exportChart()">💾 Export</button>
          </div>
        </div>
        <div class="chart-container" id="chartContainer">
          <svg viewBox="0 0 400 200" class="mock-chart" id="lineChart">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#667eea;stop-opacity:0.3" />
                <stop offset="100%" style="stop-color:#667eea;stop-opacity:0" />
              </linearGradient>
            </defs>
            <path d="M0,150 Q50,120 100,80 T200,60 T300,40 T400,30" fill="url(#gradient)" stroke="#667eea" stroke-width="3"/>
            <circle cx="100" cy="80" r="4" fill="#667eea" class="data-point" onmouseover="showTooltip(event, 'Jan: $12,500')"/>
            <circle cx="200" cy="60" r="4" fill="#667eea" class="data-point" onmouseover="showTooltip(event, 'Feb: $15,200')"/>
            <circle cx="300" cy="40" r="4" fill="#667eea" class="data-point" onmouseover="showTooltip(event, 'Mar: $18,900')"/>
          </svg>
          <div class="chart-tooltip" id="chartTooltip"></div>
        </div>
        <div class="chart-legend">
          <div class="legend-item" onclick="toggleSeries('revenue')">
            <span class="legend-color" style="background: #667eea;"></span>
            <span>Sales Revenue</span>
            <span class="legend-toggle">👁️</span>
          </div>
          <div class="legend-item" onclick="toggleSeries('profit')">
            <span class="legend-color" style="background: #28a745;"></span>
            <span>Profit Margin</span>
            <span class="legend-toggle">👁️</span>
          </div>
        </div>
        <div class="chart-stats">
          <div class="stat-item">
            <span class="stat-label">Total Revenue</span>
            <span class="stat-value">$46,600</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Growth Rate</span>
            <span class="stat-value">+23.5%</span>
          </div>
        </div>
      </div>
    `,

    // UI Components
    'Modals': () => `
      <div class="modal-preview">
        <div class="modal-demo">
          <div class="modal-header">
            <h3>Confirmation</h3>
            <button class="close-btn">×</button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete this item?</p>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel">Cancel</button>
            <button class="btn-confirm">Delete</button>
          </div>
        </div>
      </div>
    `,

    'Timeline': () => `
      <div class="timeline-preview">
        <div class="timeline-item">
          <div class="timeline-marker"></div>
          <div class="timeline-content">
            <h4>Project Started</h4>
            <p>Initial project setup and planning phase</p>
            <small>2 hours ago</small>
          </div>
        </div>
        <div class="timeline-item">
          <div class="timeline-marker"></div>
          <div class="timeline-content">
            <h4>Development Phase</h4>
            <p>Core features implementation</p>
            <small>1 day ago</small>
          </div>
        </div>
        <div class="timeline-item">
          <div class="timeline-marker"></div>
          <div class="timeline-content">
            <h4>Testing Phase</h4>
            <p>Quality assurance and bug fixes</p>
            <small>3 days ago</small>
          </div>
        </div>
      </div>
    `,

    'Carousel': () => `
      <div class="carousel-preview">
        <div class="carousel-container">
          <div class="carousel-slide active">
            <div class="slide-content">
              <h3>Slide 1</h3>
              <p>Beautiful carousel component with smooth transitions</p>
            </div>
          </div>
          <button class="carousel-prev">‹</button>
          <button class="carousel-next">›</button>
        </div>
        <div class="carousel-indicators">
          <span class="indicator active"></span>
          <span class="indicator"></span>
          <span class="indicator"></span>
        </div>
      </div>
    `,

    // Default preview for components without specific templates
    'default': () => `
      <div class="default-preview">
        <div class="preview-placeholder">
          <div class="placeholder-icon">🎨</div>
          <h3>${componentName}</h3>
          <p>${componentInfo.description}</p>
          <div class="feature-highlights">
            ${componentInfo.features.slice(0, 3).map(feature => 
              `<span class="feature-highlight">${feature}</span>`
            ).join('')}
          </div>
        </div>
      </div>
    `
  };

  const template = previewTemplates[componentName] || previewTemplates['default'];
  
  // Add interactive JavaScript functions
  const interactiveScript = `
    <script>
      // Global variables for interactive functionality
      let currentStep = 1;
      let currentPage = 1;
      let sortDirection = {};
      
      // Wizard Functions
      function goToStep(step) {
        document.querySelectorAll('.step').forEach((el, index) => {
          el.classList.toggle('active', index + 1 === step);
        });
        document.querySelectorAll('.step-content').forEach((el, index) => {
          el.classList.toggle('active', index + 1 === step);
        });
        currentStep = step;
      }
      
      function nextStep() {
        if (currentStep < 3) goToStep(currentStep + 1);
      }
      
      function prevStep() {
        if (currentStep > 1) goToStep(currentStep - 1);
      }
      
      function submitForm() {
        alert('Form submitted successfully! 🎉');
      }
      
      // File Upload Functions
      function triggerFileUpload() {
        document.getElementById('fileInput')?.click();
      }
      
      function handleFileSelect(event) {
        const files = Array.from(event.target.files);
        files.forEach(file => addFileToList(file));
      }
      
      function handleDrop(event) {
        event.preventDefault();
        const files = Array.from(event.dataTransfer.files);
        files.forEach(file => addFileToList(file));
      }
      
      function handleDragOver(event) {
        event.preventDefault();
      }
      
      function addFileToList(file) {
        const fileList = document.getElementById('fileList');
        if (fileList) {
          const fileItem = document.createElement('div');
          fileItem.className = 'file-item';
          fileItem.innerHTML = \`
            <div class="file-icon">📄</div>
            <div class="file-info">
              <span class="file-name">\${file.name}</span>
              <span class="file-size">\${(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
            <div class="file-progress">
              <div class="progress-bar" style="width: 0%"></div>
            </div>
            <button class="remove-btn" onclick="removeFile(this)">×</button>
          \`;
          fileList.appendChild(fileItem);
          
          // Simulate upload progress
          const progressBar = fileItem.querySelector('.progress-bar');
          let progress = 0;
          const interval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress >= 100) {
              progress = 100;
              progressBar.classList.add('completed');
              clearInterval(interval);
            }
            progressBar.style.width = progress + '%';
          }, 200);
        }
      }
      
      function removeFile(button) {
        button.closest('.file-item').remove();
      }
      
      // Date Picker Functions
      function toggleCalendar() {
        const calendar = document.getElementById('miniCalendar');
        if (calendar) {
          calendar.style.display = calendar.style.display === 'none' ? 'block' : 'none';
        }
      }
      
      function setDateRange(range) {
        document.querySelectorAll('.shortcut-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        const startInput = document.querySelector('.date-input');
        const endInput = document.querySelectorAll('.date-input')[1];
        
        const today = new Date();
        let startDate, endDate;
        
        switch(range) {
          case 'today':
            startDate = endDate = today.toISOString().split('T')[0];
            break;
          case 'week':
            startDate = new Date(today.setDate(today.getDate() - 7)).toISOString().split('T')[0];
            endDate = new Date().toISOString().split('T')[0];
            break;
          case 'month':
            startDate = '2024-01-01';
            endDate = '2024-01-31';
            break;
          case 'quarter':
            startDate = '2024-01-01';
            endDate = '2024-03-31';
            break;
        }
        
        if (startInput) startInput.value = startDate;
        if (endInput) endInput.value = endDate;
      }
      
      // Table Functions
      function sortTable(column) {
        const table = document.getElementById('dataTable');
        if (!table) return;
        
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        const direction = sortDirection[column] === 'asc' ? 'desc' : 'asc';
        sortDirection[column] = direction;
        
        rows.sort((a, b) => {
          const aText = a.cells[column].textContent.trim();
          const bText = b.cells[column].textContent.trim();
          
          if (direction === 'asc') {
            return aText.localeCompare(bText);
          } else {
            return bText.localeCompare(aText);
          }
        });
        
        tbody.innerHTML = '';
        rows.forEach(row => tbody.appendChild(row));
        
        // Update sort icons
        table.querySelectorAll('.sort-icon').forEach(icon => icon.textContent = '↕');
        table.querySelectorAll('th')[column].querySelector('.sort-icon').textContent = direction === 'asc' ? '↑' : '↓';
      }
      
      function searchTable(query) {
        const table = document.getElementById('dataTable');
        if (!table) return;
        
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
          const text = row.textContent.toLowerCase();
          row.style.display = text.includes(query.toLowerCase()) ? '' : 'none';
        });
      }
      
      function editRow(button) {
        const row = button.closest('tr');
        const cells = row.querySelectorAll('td');
        
        // Toggle edit mode
        if (button.textContent === '✏️') {
          cells[0].innerHTML = \`<input type="text" value="\${cells[0].textContent}">\`;
          cells[1].innerHTML = \`<input type="email" value="\${cells[1].textContent}">\`;
          button.textContent = '💾';
          button.title = 'Save';
        } else {
          cells[0].textContent = cells[0].querySelector('input').value;
          cells[1].textContent = cells[1].querySelector('input').value;
          button.textContent = '✏️';
          button.title = 'Edit';
        }
      }
      
      function deleteRow(button) {
        if (confirm('Are you sure you want to delete this row?')) {
          button.closest('tr').remove();
        }
      }
      
      // Chat Functions
      function sendMessage() {
        const input = document.querySelector('.message-input');
        if (!input || !input.value.trim()) return;
        
        const messagesContainer = document.querySelector('.chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message sent';
        messageDiv.innerHTML = \`
          <div class="message-content">\${input.value}</div>
          <div class="message-time">\${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        \`;
        
        messagesContainer.appendChild(messageDiv);
        input.value = '';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
      
      // Contact Functions
      function selectContact(contactItem) {
        document.querySelectorAll('.contact-item').forEach(item => item.classList.remove('selected'));
        contactItem.classList.add('selected');
      }
      
      // Scrumboard Functions
      function dragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.outerHTML);
        event.target.style.opacity = '0.5';
      }
      
      function allowDrop(event) {
        event.preventDefault();
      }
      
      function drop(event) {
        event.preventDefault();
        const data = event.dataTransfer.getData('text/plain');
        const taskList = event.currentTarget.querySelector('.task-list');
        if (taskList) {
          taskList.innerHTML += data;
        }
      }
      
      // Chart Functions
      function switchChart(type) {
        document.querySelectorAll('.chart-tab').forEach(tab => tab.classList.remove('active'));
        event.target.classList.add('active');
        
        // Here you would switch between different chart types
        console.log('Switching to', type, 'chart');
      }
      
      function showTooltip(event, text) {
        const tooltip = document.getElementById('chartTooltip');
        if (tooltip) {
          tooltip.textContent = text;
          tooltip.style.display = 'block';
          tooltip.style.left = event.pageX + 10 + 'px';
          tooltip.style.top = event.pageY - 30 + 'px';
        }
      }
      
      function toggleSeries(series) {
        const legendItem = event.currentTarget;
        const toggle = legendItem.querySelector('.legend-toggle');
        
        if (toggle.textContent === '👁️') {
          toggle.textContent = '🚫';
          legendItem.style.opacity = '0.5';
        } else {
          toggle.textContent = '👁️';
          legendItem.style.opacity = '1';
        }
      }
      
      // Calendar Functions
      function showEventDetails() {
        const popup = document.getElementById('eventPopup');
        if (popup) {
          popup.style.display = 'block';
          setTimeout(() => popup.style.display = 'none', 3000);
        }
      }
      
      // Advanced Table Functions
      function toggleFilters() {
        const filters = document.getElementById('columnFilters');
        if (filters) {
          filters.style.display = filters.style.display === 'none' ? 'flex' : 'none';
        }
      }
      
      function toggleDropdown(button) {
        const dropdown = button.nextElementSibling;
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
      }
      
      // Close dropdowns when clicking outside
      document.addEventListener('click', function(event) {
        if (!event.target.matches('.dropdown-btn')) {
          document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.style.display = 'none';
          });
        }
      });
      
      // Hide tooltips when mouse leaves
      document.addEventListener('mouseleave', function() {
        const tooltip = document.getElementById('chartTooltip');
        if (tooltip) tooltip.style.display = 'none';
      });
    </script>
  `;
  
  return template() + interactiveScript;
}

/**
 * Generate CSS styles for component previews
 * @returns {string} CSS string
 */
export function generatePreviewStyles() {
  return `
    <style>
      .preview-container {
        padding: 20px;
        background: #f8f9fa;
        border-radius: 8px;
        font-family: 'Nunito', sans-serif;
        position: relative;
      }

      /* Calendar Preview Styles */
      .calendar-preview {
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }

      .calendar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        background: #667eea;
        color: white;
      }

      .calendar-header .nav-btn {
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 16px;
      }

      .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 1px;
        background: #e9ecef;
        padding: 1px;
      }

      .day-header {
        background: #f8f9fa;
        padding: 10px;
        text-align: center;
        font-weight: 600;
        font-size: 12px;
        color: #666;
      }

      .day-cell {
        background: white;
        padding: 10px;
        text-align: center;
        cursor: pointer;
        min-height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s;
      }

      .day-cell:hover {
        background: #f8f9fa;
      }

      .day-cell.has-event {
        background: #e3f2fd;
        color: #1976d2;
        font-weight: 600;
        position: relative;
      }

      .day-cell.has-event::after {
        content: '•';
        position: absolute;
        bottom: 2px;
        right: 50%;
        transform: translateX(50%);
        color: #667eea;
      }

      .event-popup {
        position: absolute;
        background: #333;
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 1000;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      /* Chat Preview Styles */
      .chat-preview {
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        height: 400px;
        display: flex;
        flex-direction: column;
      }

      .chat-header {
        padding: 15px;
        background: #667eea;
        color: white;
      }

      .user-info {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255,255,255,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
      }

      .status.online {
        color: #4caf50;
        font-size: 12px;
      }

      .chat-messages {
        flex: 1;
        padding: 15px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .message {
        max-width: 70%;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .message.sent {
        align-self: flex-end;
        align-items: flex-end;
      }

      .message.received {
        align-self: flex-start;
        align-items: flex-start;
      }

      .message-content {
        padding: 8px 12px;
        border-radius: 12px;
        font-size: 14px;
      }

      .message.sent .message-content {
        background: #667eea;
        color: white;
      }

      .message.received .message-content {
        background: #f1f3f4;
        color: #333;
      }

      .message-time {
        font-size: 11px;
        color: #999;
      }

      .chat-input {
        padding: 15px;
        border-top: 1px solid #e9ecef;
        display: flex;
        gap: 10px;
      }

      .message-input {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #e9ecef;
        border-radius: 20px;
        outline: none;
      }

      .send-btn {
        background: #667eea;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 20px;
        cursor: pointer;
      }

      /* Contacts Preview Styles */
      .contacts-preview {
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }

      .contacts-header {
        padding: 15px;
        border-bottom: 1px solid #e9ecef;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .add-btn {
        background: #28a745;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
      }

      .contacts-list {
        max-height: 300px;
        overflow-y: auto;
      }

      .contact-item {
        display: flex;
        align-items: center;
        padding: 15px;
        border-bottom: 1px solid #f8f9fa;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .contact-item:hover,
      .contact-item.selected {
        background: #f8f9fa;
      }

      .contact-avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #667eea;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 15px;
        font-size: 20px;
      }

      .contact-info {
        flex: 1;
      }

      .contact-email {
        color: #666;
        font-size: 14px;
      }

      .contact-role {
        color: #999;
        font-size: 12px;
      }

      .contact-actions {
        display: flex;
        gap: 5px;
      }

      .action-btn {
        background: none;
        border: 1px solid #e9ecef;
        padding: 6px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      }

      .action-btn:hover {
        background: #f8f9fa;
      }

      /* Scrumboard Preview Styles */
      .scrumboard-preview {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 20px;
        overflow-x: auto;
      }

      .board-columns {
        display: flex;
        gap: 20px;
        min-width: 800px;
      }

      .column {
        background: white;
        border-radius: 8px;
        min-width: 250px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }

      .column-header {
        padding: 15px;
        border-bottom: 1px solid #e9ecef;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .column-header h4 {
        margin: 0;
        color: #333;
      }

      .task-count {
        background: #667eea;
        color: white;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 12px;
      }

      .task-list {
        padding: 15px;
        min-height: 200px;
      }

      .task-card {
        background: white;
        border: 1px solid #e9ecef;
        border-radius: 6px;
        padding: 12px;
        margin-bottom: 10px;
        cursor: move;
        transition: transform 0.2s, box-shadow 0.2s;
      }

      .task-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }

      .task-card.completed {
        opacity: 0.7;
        text-decoration: line-through;
      }

      .task-title {
        font-weight: 600;
        margin-bottom: 8px;
      }

      .task-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
      }

      .priority {
        padding: 2px 6px;
        border-radius: 10px;
        font-weight: 600;
      }

      .priority.high {
        background: #ffebee;
        color: #c62828;
      }

      .priority.medium {
        background: #fff3e0;
        color: #ef6c00;
      }

      .priority.low {
        background: #e8f5e8;
        color: #2e7d32;
      }

      .assignee {
        font-size: 11px;
        color: #666;
      }

      /* Wizard Preview Styles */
      .wizard-preview {
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }

      .wizard-steps {
        display: flex;
        background: #f8f9fa;
        border-bottom: 1px solid #e9ecef;
      }

      .step {
        flex: 1;
        padding: 15px;
        text-align: center;
        font-weight: 600;
        color: #6c757d;
        border-right: 1px solid #e9ecef;
        cursor: pointer;
        transition: all 0.3s;
      }

      .step:last-child {
        border-right: none;
      }

      .step.active {
        background: #667eea;
        color: white;
      }

      .step:hover:not(.active) {
        background: #e9ecef;
      }

      .wizard-content {
        padding: 30px;
        min-height: 200px;
      }

      .step-content {
        display: none;
      }

      .step-content.active {
        display: block;
      }

      .wizard-form {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .form-input {
        padding: 12px;
        border: 2px solid #e9ecef;
        border-radius: 6px;
        font-size: 14px;
        transition: border-color 0.3s;
      }

      .form-input:focus {
        outline: none;
        border-color: #667eea;
      }

      .btn-next, .btn-prev, .btn-submit {
        padding: 12px 24px;
        border: none;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        margin-right: 10px;
        transition: all 0.3s;
      }

      .btn-next, .btn-submit {
        background: #667eea;
        color: white;
      }

      .btn-next:hover, .btn-submit:hover {
        background: #5a6fd8;
      }

      .btn-prev {
        background: #6c757d;
        color: white;
      }

      .btn-prev:hover {
        background: #5a6268;
      }

      .confirmation-summary {
        text-align: center;
        padding: 20px;
      }

      .confirmation-summary p {
        margin: 10px 0;
        font-size: 16px;
      }

      /* File Upload Preview Styles */
      .file-upload-preview {
        background: white;
        border-radius: 8px;
        padding: 20px;
      }

      .upload-area {
        border: 2px dashed #667eea;
        border-radius: 8px;
        padding: 40px;
        text-align: center;
        margin-bottom: 20px;
        cursor: pointer;
        transition: all 0.3s;
      }

      .upload-area:hover {
        border-color: #5a6fd8;
        background: #f8f9ff;
      }

      .upload-area.dragover {
        border-color: #28a745;
        background: #f8fff8;
      }

      .upload-icon {
        font-size: 48px;
        margin-bottom: 15px;
      }

      .upload-btn {
        background: #667eea;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        margin-top: 15px;
        transition: background-color 0.3s;
      }

      .upload-btn:hover {
        background: #5a6fd8;
      }

      .file-list {
        border-top: 1px solid #e9ecef;
        padding-top: 15px;
      }

      .file-item {
        display: flex;
        align-items: center;
        padding: 12px;
        background: #f8f9fa;
        border-radius: 6px;
        margin-bottom: 10px;
        transition: all 0.3s;
      }

      .file-item:hover {
        background: #e9ecef;
      }

      .file-icon {
        font-size: 24px;
        margin-right: 12px;
      }

      .file-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .file-name {
        font-weight: 600;
        color: #333;
      }

      .file-size {
        font-size: 12px;
        color: #666;
      }

      .file-progress {
        width: 100px;
        height: 6px;
        background: #e9ecef;
        border-radius: 3px;
        margin: 0 15px;
        overflow: hidden;
      }

      .progress-bar {
        height: 100%;
        background: #667eea;
        border-radius: 3px;
        transition: width 0.3s;
      }

      .progress-bar.completed {
        background: #28a745;
      }

      .remove-btn {
        background: #dc3545;
        color: white;
        border: none;
        border-radius: 50%;
        width: 28px;
        height: 28px;
        cursor: pointer;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.3s;
      }

      .remove-btn:hover {
        background: #c82333;
      }

      /* Date Picker Preview Styles */
      .date-picker-preview {
        background: white;
        border-radius: 8px;
        padding: 20px;
        position: relative;
      }

      .date-input-group {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 15px;
      }

      .date-input {
        padding: 10px;
        border: 2px solid #e9ecef;
        border-radius: 6px;
        font-size: 14px;
        cursor: pointer;
        transition: border-color 0.3s;
      }

      .date-input:hover {
        border-color: #667eea;
      }

      .date-separator {
        font-weight: 600;
        color: #666;
      }

      .calendar-btn {
        background: #667eea;
        color: white;
        border: none;
        padding: 10px;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.3s;
      }

      .calendar-btn:hover {
        background: #5a6fd8;
      }

      .date-shortcuts {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      .shortcut-btn {
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.3s;
      }

      .shortcut-btn:hover {
        background: #e9ecef;
      }

      .shortcut-btn.active {
        background: #667eea;
        color: white;
        border-color: #667eea;
      }

      .mini-calendar {
        position: absolute;
        top: 100%;
        left: 0;
        background: white;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        padding: 15px;
        min-width: 280px;
      }

      .calendar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
      }

      .calendar-header button {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        padding: 5px;
        border-radius: 4px;
      }

      .calendar-header button:hover {
        background: #f8f9fa;
      }

      .calendar-days {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 2px;
      }

      .day-name {
        text-align: center;
        font-weight: 600;
        font-size: 12px;
        color: #666;
        padding: 8px 4px;
      }

      .day {
        text-align: center;
        padding: 8px 4px;
        cursor: pointer;
        border-radius: 4px;
        font-size: 14px;
        transition: all 0.2s;
      }

      .day:hover {
        background: #f8f9fa;
      }

      .day.selected {
        background: #667eea;
        color: white;
      }

      /* DataTable Preview Styles */
      .datatable-preview {
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }

      .table-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        background: #f8f9fa;
        border-bottom: 1px solid #e9ecef;
      }

      .entries-control {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 14px;
        color: #666;
      }

      .search-input, .entries-select {
        padding: 8px 12px;
        border: 1px solid #e9ecef;
        border-radius: 4px;
        font-size: 14px;
      }

      .search-input {
        min-width: 200px;
      }

      .preview-table {
        width: 100%;
        border-collapse: collapse;
      }

      .preview-table th,
      .preview-table td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #e9ecef;
      }

      .preview-table th {
        background: #f8f9fa;
        font-weight: 600;
        cursor: pointer;
        user-select: none;
        transition: background-color 0.2s;
      }

      .preview-table th:hover {
        background: #e9ecef;
      }

      .sort-icon {
        margin-left: 5px;
        color: #999;
      }

      .status {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
      }

      .status.active {
        background: #d4edda;
        color: #155724;
      }

      .status.inactive {
        background: #f8d7da;
        color: #721c24;
      }

      .action-btn.edit {
        background: #ffc107;
        border: none;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        margin-right: 5px;
      }

      .action-btn.delete {
        background: #dc3545;
        color: white;
        border: none;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
      }

      .pagination {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        background: #f8f9fa;
        border-top: 1px solid #e9ecef;
      }

      .pagination button {
        background: #667eea;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;
      }

      .pagination button:hover {
        background: #5a6fd8;
      }

      .pagination button:disabled {
        background: #6c757d;
        cursor: not-allowed;
      }

      /* Advanced DataTable Styles */
      .datatable-advanced-preview {
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }

      .table-toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        background: #f8f9fa;
        border-bottom: 1px solid #e9ecef;
        flex-wrap: wrap;
        gap: 10px;
      }

      .toolbar-left, .toolbar-right {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .btn-primary {
        background: #667eea;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      }

      .btn-secondary {
        background: #6c757d;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      }

      .global-search {
        padding: 8px 12px;
        border: 1px solid #e9ecef;
        border-radius: 4px;
        min-width: 250px;
      }

      .filter-btn {
        background: #17a2b8;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
      }

      .column-filters {
        padding: 15px;
        background: #f8f9fa;
        border-bottom: 1px solid #e9ecef;
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
      }

      .filter-group {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }

      .filter-group label {
        font-size: 12px;
        font-weight: 600;
        color: #666;
      }

      .filter-group select,
      .filter-group input {
        padding: 6px 10px;
        border: 1px solid #e9ecef;
        border-radius: 4px;
        font-size: 14px;
      }

      .advanced-table {
        width: 100%;
        border-collapse: collapse;
      }

      .advanced-table th,
      .advanced-table td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #e9ecef;
      }

      .advanced-table th {
        background: #f8f9fa;
        font-weight: 600;
        cursor: pointer;
        user-select: none;
      }

      .role-badge {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
      }

      .role-badge.admin {
        background: #dc3545;
        color: white;
      }

      .role-badge.user {
        background: #28a745;
        color: white;
      }

      .action-dropdown {
        position: relative;
      }

      .dropdown-btn {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 4px;
      }

      .dropdown-btn:hover {
        background: #f8f9fa;
      }

      .dropdown-menu {
        position: absolute;
        right: 0;
        top: 100%;
        background: white;
        border: 1px solid #e9ecef;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 1000;
        min-width: 120px;
        display: none;
      }

      .dropdown-menu a {
        display: block;
        padding: 8px 12px;
        text-decoration: none;
        color: #333;
        font-size: 14px;
        transition: background-color 0.2s;
      }

      .dropdown-menu a:hover {
        background: #f8f9fa;
      }

      .advanced-pagination {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        background: #f8f9fa;
        border-top: 1px solid #e9ecef;
      }

      .pagination-info {
        display: flex;
        align-items: center;
        gap: 15px;
        font-size: 14px;
        color: #666;
      }

      .page-size {
        padding: 6px 10px;
        border: 1px solid #e9ecef;
        border-radius: 4px;
      }

      .pagination-controls {
        display: flex;
        align-items: center;
        gap: 5px;
      }

      .pagination-controls button {
        background: #667eea;
        color: white;
        border: none;
        padding: 6px 10px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      }

      .page-numbers {
        display: flex;
        gap: 2px;
        margin: 0 10px;
      }

      .page-btn {
        background: white;
        color: #667eea;
        border: 1px solid #e9ecef;
        padding: 6px 10px;
        border-radius: 4px;
        cursor: pointer;
      }

      .page-btn.active {
        background: #667eea;
        color: white;
      }

      /* Chart Preview Styles */
      .chart-preview {
        background: white;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }

      .chart-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        flex-wrap: wrap;
        gap: 10px;
      }

      .chart-tabs {
        display: flex;
        gap: 5px;
      }

      .chart-tab {
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.3s;
      }

      .chart-tab.active {
        background: #667eea;
        color: white;
        border-color: #667eea;
      }

      .chart-tab:hover:not(.active) {
        background: #e9ecef;
      }

      .chart-options {
        display: flex;
        gap: 10px;
      }

      .option-btn {
        background: #28a745;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        transition: background-color 0.3s;
      }

      .option-btn:hover {
        background: #218838;
      }

      .chart-container {
        margin-bottom: 20px;
        position: relative;
      }

      .mock-chart {
        width: 100%;
        height: 250px;
      }

      .data-point {
        cursor: pointer;
        transition: r 0.2s;
      }

      .data-point:hover {
        r: 6;
      }

      .chart-tooltip {
        position: absolute;
        background: #333;
        color: white;
        padding: 6px 10px;
        border-radius: 4px;
        font-size: 12px;
        pointer-events: none;
        z-index: 1000;
        display: none;
      }

      .chart-legend {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-bottom: 20px;
        flex-wrap: wrap;
      }

      .legend-item {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 4px;
        transition: all 0.3s;
      }

      .legend-item:hover {
        background: #f8f9fa;
      }

      .legend-color {
        width: 12px;
        height: 12px;
        border-radius: 2px;
      }

      .legend-toggle {
        font-size: 12px;
        opacity: 0.7;
      }

      .chart-stats {
        display: flex;
        justify-content: space-around;
        padding: 15px;
        background: #f8f9fa;
        border-radius: 6px;
        margin-top: 15px;
      }

      .stat-item {
        text-align: center;
      }

      .stat-label {
        display: block;
        font-size: 12px;
        color: #666;
        margin-bottom: 4px;
      }

      .stat-value {
        display: block;
        font-size: 18px;
        font-weight: 600;
        color: #333;
      }

      /* Modal Preview Styles */
      .modal-preview {
        background: rgba(0,0,0,0.5);
        border-radius: 8px;
        padding: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .modal-demo {
        background: white;
        border-radius: 8px;
        min-width: 300px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      }

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #e9ecef;
      }

      .modal-body {
        padding: 20px;
      }

      .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        padding: 20px;
        border-top: 1px solid #e9ecef;
      }

      .btn-cancel {
        background: #6c757d;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
      }

      .btn-confirm {
        background: #dc3545;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
      }

      /* Timeline Preview Styles */
      .timeline-preview {
        background: white;
        border-radius: 8px;
        padding: 20px;
      }

      .timeline-item {
        display: flex;
        margin-bottom: 20px;
        position: relative;
      }

      .timeline-item:not(:last-child)::after {
        content: '';
        position: absolute;
        left: 11px;
        top: 24px;
        width: 2px;
        height: calc(100% + 20px);
        background: #e9ecef;
      }

      .timeline-marker {
        width: 24px;
        height: 24px;
        background: #667eea;
        border-radius: 50%;
        margin-right: 15px;
        flex-shrink: 0;
        position: relative;
        z-index: 1;
      }

      .timeline-content h4 {
        margin: 0 0 5px 0;
        color: #333;
      }

      .timeline-content p {
        margin: 0 0 5px 0;
        color: #666;
      }

      .timeline-content small {
        color: #999;
      }

      /* Carousel Preview Styles */
      .carousel-preview {
        background: white;
        border-radius: 8px;
        overflow: hidden;
      }

      .carousel-container {
        position: relative;
        height: 200px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .carousel-slide {
        text-align: center;
        color: white;
      }

      .carousel-prev,
      .carousel-next {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255,255,255,0.2);
        color: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
      }

      .carousel-prev {
        left: 15px;
      }

      .carousel-next {
        right: 15px;
      }

      .carousel-indicators {
        display: flex;
        justify-content: center;
        gap: 8px;
        padding: 15px;
      }

      .indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #e9ecef;
        cursor: pointer;
      }

      .indicator.active {
        background: #667eea;
      }

      /* Default Preview Styles */
      .default-preview {
        background: white;
        border-radius: 8px;
        padding: 40px;
        text-align: center;
      }

      .placeholder-icon {
        font-size: 48px;
        margin-bottom: 15px;
      }

      .preview-placeholder h3 {
        margin: 0 0 10px 0;
        color: #333;
      }

      .preview-placeholder p {
        margin: 0 0 20px 0;
        color: #666;
      }

      .feature-highlights {
        display: flex;
        justify-content: center;
        gap: 10px;
        flex-wrap: wrap;
      }

      .feature-highlight {
        background: #f8f9fa;
        color: #495057;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        border: 1px solid #e9ecef;
      }
    </style>
  `;
}

/**
 * Create a complete preview HTML document
 * @param {string} componentName - Name of the component
 * @param {Object} componentInfo - Component information
 * @returns {string} Complete HTML document
 */
export function createPreviewDocument(componentName, componentInfo) {
  const previewHTML = generateComponentPreview(componentName, componentInfo);
  const styles = generatePreviewStyles();
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${componentName} Preview</title>
      <link href="https://fonts.googleapis.com/css?family=Nunito:400,600,700" rel="stylesheet" />
      ${styles}
    </head>
    <body>
      <div class="preview-container">
        ${previewHTML}
      </div>
    </body>
    </html>
  `;
}

export default {
  generateComponentPreview,
  generatePreviewStyles,
  createPreviewDocument
};