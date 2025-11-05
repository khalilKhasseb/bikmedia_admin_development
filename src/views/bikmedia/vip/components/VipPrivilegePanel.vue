<template>
  <div 
    v-if="show && vipPackage" 
    class="privilege-panel-overlay"
    @click.self="handleClose"
  >
    <div class="privilege-panel">
      <!-- Header -->
      <div class="privilege-panel-header">
        <h4 class="mb-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" 
               fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" 
               stroke-linejoin="round" class="me-2">
            <path d="M9 12l2 2 4-4"></path>
            <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
            <path d="M3 12c1 0 3-1-3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
            <path d="M13 12h3"></path>
            <path d="M8 12H5"></path>
          </svg>
          {{ $t('bikmedia.vip.privilegeManagement') }}: {{ vipPackage.name }}
        </h4>
        <button 
          type="button" 
          class="btn-close" 
          @click="handleClose"
          aria-label="Close"
          :disabled="isLoading"
        ></button>
      </div>
      
      <!-- Body -->
      <div class="privilege-panel-body"> 
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">{{ $t('bikmedia.messages.loading') }}</span>
          </div>
          <p class="mt-2 text-muted">{{ $t('bikmedia.messages.loadingPrivileges') }}</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="alert alert-danger" role="alert">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" 
               fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" 
               stroke-linejoin="round" class="me-2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {{ error }}
        </div>

        <!-- Privilege Content -->
        <template v-else>
          <!-- Summary Statistics -->
          <PrivilegeSummary 
            :privileges="privileges"
            class="mb-4"
          />

          <!-- Search and Filter -->
          <div class="privilege-controls mb-4">
            <div class="row g-3">
              <div class="col-md-6">
                <div class="input-group">
                  <span class="input-group-text">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" 
                         fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" 
                         stroke-linejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.35-4.35"></path>
                    </svg>
                  </span>
                  <input 
                    type="text" 
                    class="form-control" 
                    :placeholder="$t('bikmedia.actions.search') + ' ' + $t('bikmedia.vip.privileges')"
                    v-model="searchQuery"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <select class="form-select" v-model="filterStatus">
                  <option value="all">{{ $t('bikmedia.filters.allPrivileges') }}</option>
                  <option value="active">{{ $t('bikmedia.filters.activeOnly') }}</option>
                  <option value="inactive">{{ $t('bikmedia.filters.inactiveOnly') }}</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Bulk Actions -->
          <div class="bulk-actions mb-4" v-if="filteredPrivileges.length > 0">
            <div class="d-flex gap-2">
              <button 
                type="button" 
                class="btn btn-sm btn-outline-success"
                @click="bulkToggle(true)"
                :disabled="isBulkOperating"
              >
                <span v-if="isBulkOperating" class="spinner-border spinner-border-sm me-1"></span>
                {{ $t('bikmedia.actions.enableAll') }}
              </button>
              <button 
                type="button" 
                class="btn btn-sm btn-outline-secondary"
                @click="bulkToggle(false)"
                :disabled="isBulkOperating"
              >
                <span v-if="isBulkOperating" class="spinner-border spinner-border-sm me-1"></span>
                {{ $t('bikmedia.actions.disableAll') }}
              </button>
              

            </div>
          </div>

          <!-- Privilege List -->
          <PrivilegeList 
            :privileges="filteredPrivileges"
            :updating-privileges="updatingPrivileges"
            @privilege-toggled="handlePrivilegeToggle"
          />

          <!-- Empty State -->
          <div v-if="filteredPrivileges.length === 0 && privileges.length > 0" class="text-center py-5">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" 
                 fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" 
                 stroke-linejoin="round" class="text-muted mb-3">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <h6 class="text-muted">{{ $t('bikmedia.messages.noPrivilegesFound') }}</h6>
            <p class="text-muted small">{{ $t('bikmedia.messages.tryDifferentSearch') }}</p>
          </div>
        </template>
      </div>
      
      <!-- Footer -->
      <div class="privilege-panel-footer">
        <div class="d-flex justify-content-between align-items-center">
          <div class="privilege-stats text-muted small">
            {{ $t('bikmedia.vip.showingPrivileges', { 
              count: filteredPrivileges.length, 
              total: privileges.length 
            }) }}
          </div>
          <button 
            type="button" 
            class="btn btn-secondary"
            @click="handleClose"
            :disabled="isLoading"
          >
            {{ $t('bikmedia.actions.close') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import PrivilegeSummary from './PrivilegeSummary.vue';
import PrivilegeList from './PrivilegeList.vue';
import vipService from '@/services/api/vip.service';
import { bikMediaNotifications } from '@/utils/notification-handler';

// Composables
const { t } = useI18n();

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  vipPackage: {
    type: Object,
    default: null
  }
});

// Emits
const emit = defineEmits(['close', 'privilege-updated']);

// Reactive State
const privileges = ref([]);
const isLoading = ref(false);
const error = ref(null);
const searchQuery = ref('');
const filterStatus = ref('all');
const updatingPrivileges = ref(new Set());
const isBulkOperating = ref(false);

// Computed Properties
const filteredPrivileges = computed(() => {
  let filtered = privileges.value;

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    filtered = filtered.filter(privilege => 
      privilege.name.toLowerCase().includes(query) ||
      privilege.description.toLowerCase().includes(query)
    );
  }

  // Apply status filter
  if (filterStatus.value === 'active') {
    filtered = filtered.filter(privilege => privilege.isActive);
  } else if (filterStatus.value === 'inactive') {
    filtered = filtered.filter(privilege => !privilege.isActive);
  }

  return filtered;
});

// Methods
const loadPrivileges = async () => {
  if (!props.vipPackage?.id) return;

  isLoading.value = true;
  error.value = null;

  try {
    const { privileges: packagePrivileges } = await vipService.getPrivilegesForVip(props.vipPackage.id);
    privileges.value = packagePrivileges;
  } catch (err) {
    error.value = err.message || t('bikmedia.errors.failedToLoadPrivileges');
  } finally {
    isLoading.value = false;
  }
};

const handlePrivilegeToggle = async ({ privilegeId, newState, privilegeName }) => {
  updatingPrivileges.value.add(privilegeId);

  try {
    await vipService.updatePrivilege({
      vipId: props.vipPackage.id,
      privilegeId: privilegeId,
      isActive: newState
    });

    // Update local state
    const privilegeIndex = privileges.value.findIndex(p => p.id === privilegeId);
    if (privilegeIndex !== -1) {
      privileges.value[privilegeIndex].isActive = newState;
    }

    // Emit update event for parent component
    emit('privilege-updated', {
      vipPackageId: props.vipPackage.id,
      privilegeId,
      newState,
      privilegeName
    });

    // Show success message
    const statusText = newState ? t('bikmedia.status.activated') : t('bikmedia.status.deactivated');
    bikMediaNotifications.general.success(
      t('bikmedia.messages.privilegeUpdated', { name: privilegeName, status: statusText })
    );

  } catch (err) {
    console.log(err);
    bikMediaNotifications.general.error(
      err.message || t('bikmedia.errors.failedToUpdatePrivilege')
    );
  } finally {
    updatingPrivileges.value.delete(privilegeId);
  }
};

const bulkToggle = async (enableAll) => {
  if (isBulkOperating.value) return;

  const targetPrivileges = filteredPrivileges.value.filter(p => p.isActive !== enableAll);
  
  if (targetPrivileges.length === 0) {
    const message = enableAll 
      ? t('bikmedia.messages.allPrivilegesAlreadyEnabled')
      : t('bikmedia.messages.allPrivilegesAlreadyDisabled');
    bikMediaNotifications.general.info(message);
    return;
  }

  isBulkOperating.value = true;

  try {
    const results = [];
    
    for (const privilege of targetPrivileges) {
      try {
        await vipService.updatePrivilege({
          vipId: props.vipPackage.id,
          privilegeId: privilege.id,
          isActive: enableAll
        });

        // Update local state
        const privilegeIndex = privileges.value.findIndex(p => p.id === privilege.id);
        if (privilegeIndex !== -1) {
          privileges.value[privilegeIndex].isActive = enableAll;
        }

        results.push({ success: true, privilege });
      } catch (err) {
        console.error(`Failed to toggle privilege ${privilege.name}:`, err);
        results.push({ success: false, privilege, error: err });
      }
    }

    // Show summary message
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.length - successCount;

    if (failureCount === 0) {
      const action = enableAll ? 'enabled' : 'disabled';
      bikMediaNotifications.general.success(
        t('bikmedia.messages.bulkPrivilegeSuccess', { count: successCount, action })
      );
    } else {
      bikMediaNotifications.general.warning(
        t('bikmedia.messages.bulkPrivilegePartial', { success: successCount, failed: failureCount })
      );
    }

    // Emit update event
    emit('privilege-updated', {
      vipPackageId: props.vipPackage.id,
      bulkUpdate: true,
      results
    });

  } catch (err) {
    console.error('Bulk privilege operation failed:', err);
    bikMediaNotifications.general.error(
      err.message || t('bikmedia.errors.bulkPrivilegeOperationFailed')
    );
  } finally {
    isBulkOperating.value = false;
  }
};


const handleClose = () => {
  // Reset state
  privileges.value = [];
  searchQuery.value = '';
  filterStatus.value = 'all';
  error.value = null;
  
  emit('close');
};

const handleKeydown = (event) => {
  if (event.key === 'Escape' && !isLoading.value) {
    handleClose();
  }
};

// Watch for vipPackage changes
watch(() => props.vipPackage, (newPackage) => {
  if (newPackage && props.show) {
    loadPrivileges();
  }
}, { immediate: true });

// Watch for show changes
watch(() => props.show, (show) => {
  if (show && props.vipPackage) {
    loadPrivileges();
    // Add keyboard listener
    nextTick(() => {
      document.addEventListener('keydown', handleKeydown);
    });
  } else {
    // Remove keyboard listener
    document.removeEventListener('keydown', handleKeydown);
  }
});

// Cleanup on unmount
import { onUnmounted } from 'vue';
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
/* Privilege Panel Overlay */
.privilege-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: 1rem;
  backdrop-filter: blur(2px);
}

.privilege-panel {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 700px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Header */
.privilege-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px 12px 0 0;
}

.privilege-panel-header h4 {
  color: white;
  margin: 0;
  flex: 1;
  font-weight: 600;
}

.privilege-panel-header .btn-close {
  filter: invert(1);
  opacity: 0.8;
}

.privilege-panel-header .btn-close:hover {
  opacity: 1;
}

/* Body */
.privilege-panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

/* Controls */
.privilege-controls .input-group-text {
  background: #f8f9fa;
  border-color: #e9ecef;
}

.privilege-controls .form-control,
.privilege-controls .form-select {
  border-color: #e9ecef;
}

.privilege-controls .form-control:focus,
.privilege-controls .form-select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

/* Bulk Actions */
.bulk-actions {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.bulk-actions .btn {
  font-size: 0.875rem;
}

/* Footer */
.privilege-panel-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
  border-radius: 0 0 12px 12px;
}

.privilege-stats {
  font-size: 0.875rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .privilege-panel {
    margin: 0.5rem;
    max-height: 95vh;
  }

  .privilege-panel-header {
    padding: 1rem;
  }

  .privilege-panel-body {
    padding: 1rem;
  }

  .privilege-panel-footer {
    padding: 1rem;
    flex-direction: column;
    gap: 0.75rem;
  }

  .privilege-panel-footer .d-flex {
    flex-direction: column;
    align-items: stretch !important;
  }

  .privilege-controls .row {
    --bs-gutter-x: 0.75rem;
  }

  .bulk-actions .d-flex {
    flex-direction: column;
    gap: 0.5rem;
  }

  .bulk-actions .btn {
    width: 100%;
  }
}

/* Custom scrollbar */
.privilege-panel-body::-webkit-scrollbar {
  width: 6px;
}

.privilege-panel-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.privilege-panel-body::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.privilege-panel-body::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>