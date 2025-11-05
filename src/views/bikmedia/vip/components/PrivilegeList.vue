<template>
  <div class="privilege-list">
    <div 
      v-for="privilege in privileges" 
      :key="privilege.id"
      class="privilege-item"
      :class="{ 
        'privilege-active': privilege.isActive,
        'privilege-updating': updatingPrivileges.has(privilege.id)
      }"
    >
      <div class="privilege-content">
        <div class="privilege-info">
          <div class="privilege-header">
            <h6 class="privilege-name mb-1">{{ privilege.name }}</h6>
            <div class="privilege-badges">
              <span 
                v-if="privilege.isActive" 
                class="badge bg-success"
              >
                {{ $t('bikmedia.status.active') }}
              </span>
              <span 
                v-else 
                class="badge bg-secondary"
              >
                {{ $t('bikmedia.status.inactive') }}
              </span>

            </div>
          </div>
          <p class="privilege-description text-muted mb-0">{{ privilege.description }}</p>
        </div>

        <!-- <div class="privilege-media" v-if="privilege.icon || privilege.svga">
          <div class="media-preview">
            <img 
              v-if="privilege.icon" 
              :src="privilege.icon" 
              :alt="privilege.name"
              class="privilege-icon"
              @error="handleImageError"
            />
            <div v-else class="privilege-icon-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
                   fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" 
                   stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21,15 16,10 5,21"></polyline>
              </svg>
            </div>
          </div>
        </div> -->
      </div>

      <div class="privilege-actions">
        <PrivilegeToggle 
          :privilege-id="privilege.id"
          :privilege-name="privilege.name"
          :is-active="privilege.isActive"
          :is-updating="updatingPrivileges.has(privilege.id)"

          @toggle="handleToggle"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import PrivilegeToggle from './PrivilegeToggle.vue';

// Composables
const { t } = useI18n();

// Props
const props = defineProps({
  privileges: {
    type: Array,
    default: () => []
  },
  updatingPrivileges: {
    type: Set,
    default: () => new Set()
  }
});

// Emits
const emit = defineEmits(['privilege-toggled']);

// Methods
const handleToggle = ({ privilegeId, newState, privilegeName }) => {
  emit('privilege-toggled', { privilegeId, newState, privilegeName });
};

const handleImageError = (event) => {
  // Hide broken image
  event.target.style.display = 'none';
  
  // Show placeholder
  const placeholder = event.target.parentElement.querySelector('.privilege-icon-placeholder');
  if (placeholder) {
    placeholder.style.display = 'flex';
  }
};
</script>

<style scoped>
.privilege-list {
  max-height: 400px;
  overflow-y: auto;
}

.privilege-item {
  display: flex;
  align-items: center;
  padding: 1.25rem;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  margin-bottom: 0.75rem;
  background: white;
  transition: all 0.3s ease;
  position: relative;
}

.privilege-item:hover {
  border-color: #007bff;
}

.privilege-item.privilege-active {
  border-color: #28a745;
}

.privilege-item.privilege-updating {
  opacity: 0.7;
  pointer-events: none;
}

.privilege-item.privilege-updating::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.privilege-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.privilege-info {
  flex: 1;
}

.privilege-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.privilege-name {
  color: #495057;
  font-weight: 600;
  margin: 0;
}

.privilege-badges {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
}

.privilege-description {
  font-size: 0.875rem;
  line-height: 1.4;
}

.privilege-media {
  flex-shrink: 0;
}

.media-preview {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
}

.privilege-icon {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.privilege-icon-placeholder {
  width: 100%;
  height: 100%;
  display: none;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  background: #f8f9fa;
}

.privilege-actions {
  margin-left: 1rem;
  flex-shrink: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .privilege-item {
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem;
  }

  .privilege-content {
    width: 100%;
    margin-bottom: 1rem;
  }

  .privilege-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .privilege-actions {
    margin-left: 0;
    align-self: flex-end;
  }

  .media-preview {
    width: 40px;
    height: 40px;
  }
}

/* Custom scrollbar */
.privilege-list::-webkit-scrollbar {
  width: 6px;
}

.privilege-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.privilege-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.privilege-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}


</style>