# Template Component Usage Examples

This document provides practical examples of how to adopt and customize template components for common use cases. Each example includes the adoption process, customization steps, and integration patterns.

## Form Components Examples

### Example 1: User Registration Wizard

**Scenario**: Create a multi-step user registration process using the FormWizard component.

#### Adoption Process
```bash
# Copy the template component
cp src/views/forms/wizards.vue src/components/forms/UserRegistrationWizard.vue
```

#### Customized Implementation
```vue
<!-- src/components/forms/UserRegistrationWizard.vue -->
<template>
  <div class="user-registration-wizard">
    <form-wizard 
      @on-complete="handleRegistration"
      @on-change="handleStepChange"
      color="#4f46e5"
      :start-index="0"
    >
      <!-- Step 1: Personal Information -->
      <tab-content title="Personal Info" icon="ti-user">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label>First Name *</label>
              <input 
                v-model="formData.firstName" 
                type="text" 
                class="form-control"
                :class="{ 'is-invalid': errors.firstName }"
                required
              >
              <div v-if="errors.firstName" class="invalid-feedback">
                {{ errors.firstName }}
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label>Last Name *</label>
              <input 
                v-model="formData.lastName" 
                type="text" 
                class="form-control"
                :class="{ 'is-invalid': errors.lastName }"
                required
              >
              <div v-if="errors.lastName" class="invalid-feedback">
                {{ errors.lastName }}
              </div>
            </div>
          </div>
        </div>
      </tab-content>

      <!-- Step 2: Account Details -->
      <tab-content title="Account" icon="ti-settings">
        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <label>Email Address *</label>
              <input 
                v-model="formData.email" 
                type="email" 
                class="form-control"
                :class="{ 'is-invalid': errors.email }"
                required
              >
              <div v-if="errors.email" class="invalid-feedback">
                {{ errors.email }}
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label>Password *</label>
              <input 
                v-model="formData.password" 
                type="password" 
                class="form-control"
                :class="{ 'is-invalid': errors.password }"
                required
              >
              <div v-if="errors.password" class="invalid-feedback">
                {{ errors.password }}
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label>Confirm Password *</label>
              <input 
                v-model="formData.confirmPassword" 
                type="password" 
                class="form-control"
                :class="{ 'is-invalid': errors.confirmPassword }"
                required
              >
              <div v-if="errors.confirmPassword" class="invalid-feedback">
                {{ errors.confirmPassword }}
              </div>
            </div>
          </div>
        </div>
      </tab-content>

      <!-- Step 3: Confirmation -->
      <tab-content title="Confirm" icon="ti-check">
        <div class="registration-summary">
          <h5>Registration Summary</h5>
          <div class="summary-item">
            <strong>Name:</strong> {{ formData.firstName }} {{ formData.lastName }}
          </div>
          <div class="summary-item">
            <strong>Email:</strong> {{ formData.email }}
          </div>
          <div class="form-check mt-3">
            <input 
              v-model="formData.acceptTerms" 
              type="checkbox" 
              class="form-check-input"
              id="acceptTerms"
              required
            >
            <label class="form-check-label" for="acceptTerms">
              I accept the <a href="#" @click.prevent="showTerms">Terms and Conditions</a>
            </label>
          </div>
        </div>
      </tab-content>
    </form-wizard>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { FormWizard, TabContent } from 'vue3-form-wizard';
import 'vue3-form-wizard/dist/style.css';

const emit = defineEmits(['registration-complete']);

const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
});

const errors = ref({});

const validateStep = (stepIndex) => {
  errors.value = {};
  
  if (stepIndex === 0) {
    if (!formData.firstName) errors.value.firstName = 'First name is required';
    if (!formData.lastName) errors.value.lastName = 'Last name is required';
  } else if (stepIndex === 1) {
    if (!formData.email) errors.value.email = 'Email is required';
    if (!formData.password) errors.value.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      errors.value.confirmPassword = 'Passwords do not match';
    }
  }
  
  return Object.keys(errors.value).length === 0;
};

const handleStepChange = (prevIndex, nextIndex) => {
  return validateStep(prevIndex);
};

const handleRegistration = async () => {
  if (!formData.acceptTerms) {
    alert('Please accept the terms and conditions');
    return;
  }
  
  try {
    // API call to register user
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if (response.ok) {
      emit('registration-complete', formData);
    }
  } catch (error) {
    console.error('Registration failed:', error);
  }
};

const showTerms = () => {
  // Show terms modal or navigate to terms page
};
</script>

<style lang="scss" scoped>
.user-registration-wizard {
  max-width: 600px;
  margin: 0 auto;
  
  .registration-summary {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    
    .summary-item {
      margin-bottom: 10px;
    }
  }
}
</style>
```

### Example 2: File Upload with Preview

**Scenario**: Create a document upload component with drag & drop and preview functionality.

#### Adoption Process
```bash
# Copy the template component
cp src/views/forms/fileupload.vue src/components/forms/DocumentUpload.vue
```

#### Customized Implementation
```vue
<!-- src/components/forms/DocumentUpload.vue -->
<template>
  <div class="document-upload">
    <div class="upload-section">
      <h5>{{ title }}</h5>
      <p class="text-muted">{{ description }}</p>
      
      <div class="custom-file-container" :data-upload-id="uploadId">
        <label>
          Upload Files 
          <a href="javascript:void(0)" class="custom-file-container__image-clear" title="Clear Image">×</a>
        </label>
        <label class="custom-file-container__custom-file">
          <input 
            type="file" 
            class="custom-file-container__custom-file__custom-file-input" 
            :accept="acceptedTypes"
            :multiple="allowMultiple"
            @change="handleFileSelect"
          >
          <input type="hidden" name="MAX_FILE_SIZE" :value="maxFileSize">
          <span class="custom-file-container__custom-file__custom-file-control"></span>
        </label>
        <div class="custom-file-container__image-preview"></div>
      </div>
      
      <div v-if="uploadedFiles.length > 0" class="uploaded-files mt-3">
        <h6>Uploaded Files:</h6>
        <div class="file-list">
          <div 
            v-for="file in uploadedFiles" 
            :key="file.id"
            class="file-item d-flex justify-content-between align-items-center"
          >
            <div class="file-info">
              <i :class="getFileIcon(file.type)"></i>
              <span class="file-name">{{ file.name }}</span>
              <small class="file-size text-muted">({{ formatFileSize(file.size) }})</small>
            </div>
            <div class="file-actions">
              <button 
                @click="downloadFile(file)" 
                class="btn btn-sm btn-outline-primary me-2"
                title="Download"
              >
                <i class="ti-download"></i>
              </button>
              <button 
                @click="removeFile(file.id)" 
                class="btn btn-sm btn-outline-danger"
                title="Remove"
              >
                <i class="ti-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { FileUploadWithPreview } from 'file-upload-with-preview';
import 'file-upload-with-preview/dist/style.css';

const props = defineProps({
  title: {
    type: String,
    default: 'Upload Documents'
  },
  description: {
    type: String,
    default: 'Drag and drop files here or click to browse'
  },
  acceptedTypes: {
    type: String,
    default: '.pdf,.doc,.docx,.jpg,.jpeg,.png'
  },
  maxFileSize: {
    type: Number,
    default: 10485760 // 10MB
  },
  allowMultiple: {
    type: Boolean,
    default: true
  },
  uploadEndpoint: {
    type: String,
    default: '/api/upload'
  }
});

const emit = defineEmits(['files-uploaded', 'file-removed']);

const uploadId = ref('document-upload');
const uploadedFiles = ref([]);
let fileUpload = null;

onMounted(async () => {
  await nextTick();
  
  fileUpload = new FileUploadWithPreview(uploadId.value, {
    showDeleteButtonOnImages: true,
    text: {
      chooseFile: 'Choose files',
      browse: 'Browse',
      selectedCount: 'files selected'
    },
    maxFileCount: props.allowMultiple ? 10 : 1
  });
  
  // Listen for file selection
  fileUpload.emitter.on('filesAdded', handleFilesAdded);
});

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files);
  uploadFiles(files);
};

const handleFilesAdded = (files) => {
  uploadFiles(files);
};

const uploadFiles = async (files) => {
  for (const file of files) {
    if (file.size > props.maxFileSize) {
      alert(`File ${file.name} is too large. Maximum size is ${formatFileSize(props.maxFileSize)}`);
      continue;
    }
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(props.uploadEndpoint, {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const result = await response.json();
        const uploadedFile = {
          id: result.id || Date.now(),
          name: file.name,
          size: file.size,
          type: file.type,
          url: result.url
        };
        
        uploadedFiles.value.push(uploadedFile);
        emit('files-uploaded', uploadedFile);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert(`Failed to upload ${file.name}`);
    }
  }
};

const removeFile = async (fileId) => {
  const fileIndex = uploadedFiles.value.findIndex(f => f.id === fileId);
  if (fileIndex > -1) {
    const file = uploadedFiles.value[fileIndex];
    
    try {
      await fetch(`${props.uploadEndpoint}/${fileId}`, {
        method: 'DELETE'
      });
      
      uploadedFiles.value.splice(fileIndex, 1);
      emit('file-removed', file);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  }
};

const downloadFile = (file) => {
  const link = document.createElement('a');
  link.href = file.url;
  link.download = file.name;
  link.click();
};

const getFileIcon = (fileType) => {
  if (fileType.includes('pdf')) return 'ti-file-text text-danger';
  if (fileType.includes('image')) return 'ti-image text-success';
  if (fileType.includes('word') || fileType.includes('document')) return 'ti-file text-primary';
  return 'ti-file text-secondary';
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
</script>

<style lang="scss" scoped>
.document-upload {
  .upload-section {
    border: 2px dashed #dee2e6;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    
    &:hover {
      border-color: #4f46e5;
      background-color: #f8f9ff;
    }
  }
  
  .file-list {
    .file-item {
      padding: 10px;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      margin-bottom: 8px;
      
      .file-info {
        display: flex;
        align-items: center;
        gap: 8px;
        
        .file-name {
          font-weight: 500;
        }
      }
    }
  }
}
</style>
```

## Table Components Examples

### Example 3: User Management Table

**Scenario**: Create a user management interface with actions, filtering, and bulk operations.

#### Adoption Process
```bash
# Copy the advanced datatable component
cp src/views/tables/vue3-datatable/actions.vue src/components/tables/UserManagementTable.vue
```

#### Customized Implementation
```vue
<!-- src/components/tables/UserManagementTable.vue -->
<template>
  <div class="user-management-table">
    <div class="table-header d-flex justify-content-between align-items-center mb-3">
      <div class="table-actions">
        <button 
          @click="showCreateModal = true" 
          class="btn btn-primary"
        >
          <i class="ti-plus"></i> Add User
        </button>
        <button 
          v-if="selectedUsers.length > 0"
          @click="bulkDelete" 
          class="btn btn-danger ms-2"
        >
          <i class="ti-trash"></i> Delete Selected ({{ selectedUsers.length }})
        </button>
      </div>
      
      <div class="table-filters">
        <select v-model="roleFilter" class="form-select me-2" style="width: auto;">
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="moderator">Moderator</option>
        </select>
        
        <input 
          v-model="searchQuery"
          type="text" 
          class="form-control" 
          placeholder="Search users..."
          style="width: 200px;"
        >
      </div>
    </div>
    
    <div class="table-container">
      <vue3-datatable 
        :rows="filteredUsers" 
        :columns="columns" 
        :totalRows="filteredUsers?.length"
        :isServerMode="false"
        :search="searchQuery"
        skin="table-hover table-striped"
        :rowsPerPage="10"
        :rowsPerPageOptions="[5, 10, 25, 50]"
        @row-click="handleRowClick"
      >
        <!-- Custom checkbox column -->
        <template #checkbox="data">
          <input 
            type="checkbox" 
            :checked="selectedUsers.includes(data.value.id)"
            @change="toggleUserSelection(data.value.id)"
            class="form-check-input"
          >
        </template>
        
        <!-- Custom status column -->
        <template #status="data">
          <span 
            :class="getStatusClass(data.value.status)"
            class="badge"
          >
            {{ data.value.status }}
          </span>
        </template>
        
        <!-- Custom actions column -->
        <template #actions="data">
          <div class="action-buttons">
            <button 
              @click.stop="editUser(data.value)"
              class="btn btn-sm btn-outline-primary me-1"
              title="Edit"
            >
              <i class="ti-pencil"></i>
            </button>
            <button 
              @click.stop="toggleUserStatus(data.value)"
              :class="data.value.status === 'active' ? 'btn-outline-warning' : 'btn-outline-success'"
              class="btn btn-sm me-1"
              :title="data.value.status === 'active' ? 'Deactivate' : 'Activate'"
            >
              <i :class="data.value.status === 'active' ? 'ti-pause' : 'ti-play'"></i>
            </button>
            <button 
              @click.stop="deleteUser(data.value)"
              class="btn btn-sm btn-outline-danger"
              title="Delete"
            >
              <i class="ti-trash"></i>
            </button>
          </div>
        </template>
      </vue3-datatable>
    </div>
    
    <!-- User Modal -->
    <div v-if="showCreateModal || editingUser" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ editingUser ? 'Edit User' : 'Create User' }}
            </h5>
            <button @click="closeModal" class="btn-close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveUser">
              <div class="mb-3">
                <label class="form-label">Name *</label>
                <input 
                  v-model="userForm.name" 
                  type="text" 
                  class="form-control" 
                  required
                >
              </div>
              <div class="mb-3">
                <label class="form-label">Email *</label>
                <input 
                  v-model="userForm.email" 
                  type="email" 
                  class="form-control" 
                  required
                >
              </div>
              <div class="mb-3">
                <label class="form-label">Role *</label>
                <select v-model="userForm.role" class="form-select" required>
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Status</label>
                <select v-model="userForm.status" class="form-select">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button @click="closeModal" class="btn btn-secondary">Cancel</button>
            <button @click="saveUser" class="btn btn-primary">
              {{ editingUser ? 'Update' : 'Create' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import Vue3Datatable from '@bhplugin/vue3-datatable';

const emit = defineEmits(['user-created', 'user-updated', 'user-deleted']);

const users = ref([]);
const selectedUsers = ref([]);
const searchQuery = ref('');
const roleFilter = ref('');
const showCreateModal = ref(false);
const editingUser = ref(null);

const userForm = reactive({
  name: '',
  email: '',
  role: '',
  status: 'active'
});

const columns = ref([
  { 
    field: 'checkbox', 
    title: '', 
    width: '50px',
    sortable: false
  },
  { field: 'id', title: 'ID', width: '80px' },
  { field: 'name', title: 'Name' },
  { field: 'email', title: 'Email' },
  { field: 'role', title: 'Role', width: '120px' },
  { 
    field: 'status', 
    title: 'Status', 
    width: '100px'
  },
  { field: 'created_at', title: 'Created', width: '120px' },
  { 
    field: 'actions', 
    title: 'Actions', 
    width: '150px',
    sortable: false
  }
]);

const filteredUsers = computed(() => {
  let filtered = users.value;
  
  if (roleFilter.value) {
    filtered = filtered.filter(user => user.role === roleFilter.value);
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  }
  
  return filtered;
});

onMounted(() => {
  loadUsers();
});

const loadUsers = async () => {
  try {
    const response = await fetch('/api/users');
    users.value = await response.json();
  } catch (error) {
    console.error('Failed to load users:', error);
  }
};

const toggleUserSelection = (userId) => {
  const index = selectedUsers.value.indexOf(userId);
  if (index > -1) {
    selectedUsers.value.splice(index, 1);
  } else {
    selectedUsers.value.push(userId);
  }
};

const handleRowClick = (row) => {
  // Optional: Handle row click for user details
  console.log('User clicked:', row);
};

const editUser = (user) => {
  editingUser.value = user;
  Object.assign(userForm, user);
};

const deleteUser = async (user) => {
  if (confirm(`Are you sure you want to delete ${user.name}?`)) {
    try {
      await fetch(`/api/users/${user.id}`, { method: 'DELETE' });
      users.value = users.value.filter(u => u.id !== user.id);
      emit('user-deleted', user);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  }
};

const toggleUserStatus = async (user) => {
  const newStatus = user.status === 'active' ? 'inactive' : 'active';
  
  try {
    const response = await fetch(`/api/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    
    if (response.ok) {
      user.status = newStatus;
    }
  } catch (error) {
    console.error('Status update failed:', error);
  }
};

const bulkDelete = async () => {
  if (confirm(`Delete ${selectedUsers.value.length} selected users?`)) {
    try {
      await Promise.all(
        selectedUsers.value.map(id => 
          fetch(`/api/users/${id}`, { method: 'DELETE' })
        )
      );
      
      users.value = users.value.filter(u => !selectedUsers.value.includes(u.id));
      selectedUsers.value = [];
    } catch (error) {
      console.error('Bulk delete failed:', error);
    }
  }
};

const saveUser = async () => {
  try {
    const method = editingUser.value ? 'PUT' : 'POST';
    const url = editingUser.value ? `/api/users/${editingUser.value.id}` : '/api/users';
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userForm)
    });
    
    if (response.ok) {
      const savedUser = await response.json();
      
      if (editingUser.value) {
        const index = users.value.findIndex(u => u.id === editingUser.value.id);
        users.value[index] = savedUser;
        emit('user-updated', savedUser);
      } else {
        users.value.push(savedUser);
        emit('user-created', savedUser);
      }
      
      closeModal();
    }
  } catch (error) {
    console.error('Save failed:', error);
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  editingUser.value = null;
  Object.assign(userForm, {
    name: '',
    email: '',
    role: '',
    status: 'active'
  });
};

const getStatusClass = (status) => {
  return {
    'badge-success': status === 'active',
    'badge-secondary': status === 'inactive'
  };
};
</script>

<style lang="scss" scoped>
.user-management-table {
  .table-header {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px 8px 0 0;
    border: 1px solid #dee2e6;
    border-bottom: none;
  }
  
  .table-container {
    border: 1px solid #dee2e6;
    border-radius: 0 0 8px 8px;
  }
  
  .action-buttons {
    display: flex;
    gap: 4px;
  }
  
  .badge-success {
    background-color: #28a745;
  }
  
  .badge-secondary {
    background-color: #6c757d;
  }
}
</style>
```

## Chart Components Examples

### Example 4: Sales Dashboard Chart

**Scenario**: Create a sales analytics chart with multiple data series and interactive features.

#### Adoption Process
```bash
# Copy the chart component
cp src/views/charts/apex_chart.vue src/components/charts/SalesDashboardChart.vue
```

#### Customized Implementation
```vue
<!-- src/components/charts/SalesDashboardChart.vue -->
<template>
  <div class="sales-dashboard-chart">
    <div class="chart-header d-flex justify-content-between align-items-center mb-3">
      <div>
        <h5 class="mb-1">{{ title }}</h5>
        <p class="text-muted mb-0">{{ subtitle }}</p>
      </div>
      
      <div class="chart-controls">
        <select v-model="selectedPeriod" @change="updateChart" class="form-select me-2">
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="1y">Last Year</option>
        </select>
        
        <div class="btn-group" role="group">
          <button 
            v-for="type in chartTypes" 
            :key="type.value"
            @click="changeChartType(type.value)"
            :class="{ active: selectedChartType === type.value }"
            class="btn btn-outline-primary btn-sm"
          >
            {{ type.label }}
          </button>
        </div>
      </div>
    </div>
    
    <div class="chart-container">
      <apexchart 
        :type="selectedChartType"
        :options="chartOptions" 
        :series="chartSeries"
        :height="chartHeight"
      />
    </div>
    
    <div v-if="showSummary" class="chart-summary mt-3">
      <div class="row">
        <div class="col-md-3">
          <div class="summary-card">
            <div class="summary-value">{{ formatCurrency(totalSales) }}</div>
            <div class="summary-label">Total Sales</div>
            <div class="summary-change" :class="salesChangeClass">
              <i :class="salesChangeIcon"></i>
              {{ salesChangePercent }}%
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="summary-card">
            <div class="summary-value">{{ totalOrders }}</div>
            <div class="summary-label">Total Orders</div>
            <div class="summary-change" :class="ordersChangeClass">
              <i :class="ordersChangeIcon"></i>
              {{ ordersChangePercent }}%
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="summary-card">
            <div class="summary-value">{{ formatCurrency(averageOrderValue) }}</div>
            <div class="summary-label">Avg Order Value</div>
            <div class="summary-change" :class="aovChangeClass">
              <i :class="aovChangeIcon"></i>
              {{ aovChangePercent }}%
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="summary-card">
            <div class="summary-value">{{ conversionRate }}%</div>
            <div class="summary-label">Conversion Rate</div>
            <div class="summary-change" :class="conversionChangeClass">
              <i :class="conversionChangeIcon"></i>
              {{ conversionChangePercent }}%
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: 'Sales Analytics'
  },
  subtitle: {
    type: String,
    default: 'Track your sales performance over time'
  },
  chartHeight: {
    type: Number,
    default: 350
  },
  showSummary: {
    type: Boolean,
    default: true
  },
  apiEndpoint: {
    type: String,
    default: '/api/analytics/sales'
  }
});

const selectedPeriod = ref('30d');
const selectedChartType = ref('line');
const salesData = ref([]);
const ordersData = ref([]);
const loading = ref(false);

const chartTypes = [
  { value: 'line', label: 'Line' },
  { value: 'area', label: 'Area' },
  { value: 'bar', label: 'Bar' }
];

const chartSeries = computed(() => [
  {
    name: 'Sales',
    data: salesData.value,
    color: '#4f46e5'
  },
  {
    name: 'Orders',
    data: ordersData.value,
    color: '#10b981'
  }
]);

const chartOptions = computed(() => ({
  chart: {
    type: selectedChartType.value,
    toolbar: {
      show: true,
      tools: {
        download: true,
        selection: true,
        zoom: true,
        zoomin: true,
        zoomout: true,
        pan: true,
        reset: true
      }
    },
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: selectedChartType.value === 'line' ? 3 : 2
  },
  xaxis: {
    type: 'datetime',
    labels: {
      format: 'MMM dd'
    }
  },
  yaxis: [
    {
      title: {
        text: 'Sales ($)'
      },
      labels: {
        formatter: (value) => formatCurrency(value)
      }
    },
    {
      opposite: true,
      title: {
        text: 'Orders'
      }
    }
  ],
  tooltip: {
    shared: true,
    intersect: false,
    y: [
      {
        formatter: (value) => formatCurrency(value)
      },
      {
        formatter: (value) => `${value} orders`
      }
    ]
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right'
  },
  grid: {
    borderColor: '#e7e7e7',
    row: {
      colors: ['#f3f3f3', 'transparent'],
      opacity: 0.5
    }
  },
  fill: {
    type: selectedChartType.value === 'area' ? 'gradient' : 'solid',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.9,
      stops: [0, 90, 100]
    }
  }
}));

// Summary calculations
const totalSales = computed(() => 
  salesData.value.reduce((sum, point) => sum + point.y, 0)
);

const totalOrders = computed(() => 
  ordersData.value.reduce((sum, point) => sum + point.y, 0)
);

const averageOrderValue = computed(() => 
  totalOrders.value > 0 ? totalSales.value / totalOrders.value : 0
);

const conversionRate = computed(() => {
  // Mock calculation - replace with actual logic
  return 3.2;
});

// Change calculations (mock data - replace with actual previous period comparison)
const salesChangePercent = ref(12.5);
const ordersChangePercent = ref(8.3);
const aovChangePercent = ref(4.1);
const conversionChangePercent = ref(-1.2);

const salesChangeClass = computed(() => 
  salesChangePercent.value >= 0 ? 'text-success' : 'text-danger'
);
const ordersChangeClass = computed(() => 
  ordersChangePercent.value >= 0 ? 'text-success' : 'text-danger'
);
const aovChangeClass = computed(() => 
  aovChangePercent.value >= 0 ? 'text-success' : 'text-danger'
);
const conversionChangeClass = computed(() => 
  conversionChangePercent.value >= 0 ? 'text-success' : 'text-danger'
);

const salesChangeIcon = computed(() => 
  salesChangePercent.value >= 0 ? 'ti-trending-up' : 'ti-trending-down'
);
const ordersChangeIcon = computed(() => 
  ordersChangePercent.value >= 0 ? 'ti-trending-up' : 'ti-trending-down'
);
const aovChangeIcon = computed(() => 
  aovChangePercent.value >= 0 ? 'ti-trending-up' : 'ti-trending-down'
);
const conversionChangeIcon = computed(() => 
  conversionChangePercent.value >= 0 ? 'ti-trending-up' : 'ti-trending-down'
);

onMounted(() => {
  loadChartData();
});

watch(selectedPeriod, () => {
  loadChartData();
});

const loadChartData = async () => {
  loading.value = true;
  
  try {
    const response = await fetch(`${props.apiEndpoint}?period=${selectedPeriod.value}`);
    const data = await response.json();
    
    salesData.value = data.sales.map(item => ({
      x: new Date(item.date).getTime(),
      y: item.value
    }));
    
    ordersData.value = data.orders.map(item => ({
      x: new Date(item.date).getTime(),
      y: item.count
    }));
    
  } catch (error) {
    console.error('Failed to load chart data:', error);
    // Use mock data for demo
    generateMockData();
  } finally {
    loading.value = false;
  }
};

const generateMockData = () => {
  const days = selectedPeriod.value === '7d' ? 7 : 
               selectedPeriod.value === '30d' ? 30 : 
               selectedPeriod.value === '90d' ? 90 : 365;
  
  const now = new Date();
  salesData.value = [];
  ordersData.value = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    salesData.value.push({
      x: date.getTime(),
      y: Math.floor(Math.random() * 10000) + 5000
    });
    
    ordersData.value.push({
      x: date.getTime(),
      y: Math.floor(Math.random() * 50) + 20
    });
  }
};

const updateChart = () => {
  loadChartData();
};

const changeChartType = (type) => {
  selectedChartType.value = type;
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};
</script>

<style lang="scss" scoped>
.sales-dashboard-chart {
  .chart-header {
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 15px;
  }
  
  .chart-container {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .chart-summary {
    .summary-card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      
      .summary-value {
        font-size: 2rem;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 5px;
      }
      
      .summary-label {
        color: #6b7280;
        font-size: 0.875rem;
        margin-bottom: 10px;
      }
      
      .summary-change {
        font-size: 0.875rem;
        font-weight: 600;
        
        i {
          margin-right: 4px;
        }
      }
    }
  }
  
  .btn-group .btn.active {
    background-color: #4f46e5;
    border-color: #4f46e5;
    color: white;
  }
}
</style>
```

These examples demonstrate how to adopt and customize template components for real-world use cases. Each example shows:

1. **Adoption Process**: How to copy and set up the component
2. **Customization**: How to modify the component for specific needs
3. **Integration**: How to connect the component with APIs and data
4. **Styling**: How to customize the appearance
5. **Functionality**: How to add business logic and user interactions

The key principles for successful component adoption are:
- Start with the original template component
- Remove template-specific elements (breadcrumbs, navigation)
- Add your business logic and data integration
- Customize styling to match your design system
- Maintain the component's core functionality while adapting it to your needs