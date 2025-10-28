<template>
  <div class="statbox panel box box-shadow my-2">
    <!-- Non-Collapsible Mode -->
    <template v-if="!collapsible">
      <div class="panel-heading">
        <div class="row">
          <div class="col-xl-12 col-md-12 col-sm-12 col-12">
            <h4>{{ title }}</h4>
            <p v-if="description" class="text-muted mb-0">{{ description }}</p>
          </div>
        </div>
      </div>
      <div class="panel-body">
        <slot></slot>
      </div>
    </template>

    <!-- Collapsible Mode -->
    <template v-else>
      <div class="panel-heading">
        <div class="row">
          <div class="col-xl-12 col-md-12 col-sm-12 col-12">
            <div 
              :id="headerId"
              :class="{ collapsed: !isExpanded }" 
              role="button" 
              data-bs-toggle="collapse" 
              :data-bs-target="'#' + sectionId" 
              :aria-expanded="isExpanded" 
              :aria-controls="sectionId"
              style="cursor: pointer;"
            >
              <h4 class="d-inline">{{ title }}</h4>
              <div class="icons float-end">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="feather feather-chevron-down"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
            <p v-if="description" class="text-muted mb-0 mt-2">{{ description }}</p>
          </div>
        </div>
      </div>
      <div 
        :id="sectionId" 
        class="collapse" 
        :class="{ 'show': isExpanded }" 
        :aria-labelledby="headerId"
      >
        <div class="panel-body">
          <slot></slot>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  collapsible: {
    type: Boolean,
    default: false
  },
  defaultExpanded: {
    type: Boolean,
    default: true
  }
});

// Generate unique IDs for collapse functionality
const uniqueSuffix = Math.random().toString(36).substr(2, 9);
const sectionId = ref('section-' + uniqueSuffix);
const headerId = ref('header-' + uniqueSuffix);

// Track collapse state for aria-expanded attribute
const isExpanded = ref(props.defaultExpanded);

// Store event handlers for cleanup
let collapseEl = null;
const handleShow = () => {
  isExpanded.value = true;
};
const handleHide = () => {
  isExpanded.value = false;
};

// Set up Bootstrap collapse event listeners
onMounted(() => {
  if (props.collapsible) {
    collapseEl = document.getElementById(sectionId.value);
    if (collapseEl) {
      collapseEl.addEventListener('show.bs.collapse', handleShow);
      collapseEl.addEventListener('hide.bs.collapse', handleHide);
    }
  }
});

// Clean up event listeners
onBeforeUnmount(() => {
  if (collapseEl) {
    collapseEl.removeEventListener('show.bs.collapse', handleShow);
    collapseEl.removeEventListener('hide.bs.collapse', handleHide);
  }
});
</script>

<style scoped>
.panel-heading [data-bs-toggle="collapse"] {
  cursor: pointer;
}

.panel-heading .icons svg {
  transition: transform 0.3s ease;
}

.panel-heading [aria-expanded="true"] .icons svg {
  transform: rotate(180deg);
}
</style>
