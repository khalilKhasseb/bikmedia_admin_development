<template>
    <div class="layout-px-spacing my-4">
        <div class="container">
            <div class="row">

                <!-- Options columnd layout -->
                <div class="col-lg-4 option-side">
                    <!-- Loading State -->
                    <div v-if="isLoading" class="col-12 text-center py-4">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <p class="mt-2 text-muted">Loading VIP packages...</p>
                    </div>

                    <!-- Error State -->
                    <div v-else-if="error" class="col-12 text-center py-4">
                        <div class="alert alert-danger" role="alert">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            {{ error }}
                        </div>
                        <button type="button" class="btn btn-outline-primary" @click="loadVipData">
                            <i class="fas fa-redo me-2"></i>Retry
                        </button>
                    </div>

                    <!-- VIP List -->
                    <div class="col-12" v-for="vip in vips" :key="vip.id" v-else>

                        <div class="card component-card_1 mb-1" @click="handelVipOptionLoad(vip.id)">
                            <div class="card-body">
                                <div class="icon-svg py-4 my-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" class="feather feather-edit-2 ms-1">
                                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                    </svg>
                                </div>
                                <h5 class="card-title mb-2">{{ vip.name }}</h5>
                                <div class="action">
                                    <button type="button" class="btn btn-primary mb-2 me-1">Edit</button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>



                <!-- End option side -->

                <!-- OPtions side panel -->

                <div class="col-lg-8 bg-white p-5"
                    v-if="selectedVip && selectedVip.privileges && selectedVip.privileges.length > 0">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h3>{{ selectedVip.name }}</h3>
                        <button type="button" class="btn btn-secondary" disabled
                            title="Adding new privileges is not supported">
                            <i class="fas fa-plus me-2"></i>
                            Add Privilege (Not Available)
                        </button>
                    </div>

                    <!-- API Limitation Notice -->
                    <div class="alert alert-info mb-4" role="alert">
                        <i class="fas fa-info-circle me-2"></i>
                        <strong>Note:</strong> You can only toggle privileges on/off. Adding new privileges or editing
                        privilege details requires backend configuration.
                    </div>
                    <div class="table-responsive">
                        <table role="table" aria-busy="false" aria-colcount="5" class="table table-bordered"
                            id="__BVID__415">
                            <thead role="rowgroup">
                                <tr role="row">
                                    <th role="columnheader" scope="col" aria-colindex="1">
                                        <div>Name</div>
                                    </th>
                                    <th role="columnheader" scope="col" aria-colindex="2">
                                        <div>Activate Privilege</div>
                                    </th>
                                    <!-- <th role="columnheader" scope="col" aria-colindex="3">
                                        <div>Sale</div>
                                    </th>
                                    <th role="columnheader" scope="col" aria-colindex="4" class="text-center">
                                        <div>status</div>
                                    </th> -->
                                    <th role="columnheader" scope="col" aria-colindex="5" aria-label="Action"
                                        class="text-center">
                                        <div></div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody role="rowgroup">
                                <tr v-for="item in selectedVip.privileges" :key="item.id + item.name" role="row">
                                    <td aria-colindex="1" role="cell">{{ item.name || 'Unknown Privilege' }}</td>

                                    <td class="text-center">
                                        <VipOptionToggle v-if="item.id !== undefined && item.id !== null"
                                            v-model="item.isActive" :option-id="item.id"
                                            :option-name="item.name || 'Unknown Privilege'"
                                            @toggle-success="handleToggleSuccess" @toggle-error="handleToggleError" />
                                        <span v-else class="text-muted">Invalid Privilege</span>
                                    </td>

                                    <td class="text-center">
                                        <button type="button" class="btn btn-sm btn-outline-secondary" disabled
                                            title="Editing privilege details is not supported">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                                stroke-linecap="round" stroke-linejoin="round"
                                                class="feather feather-edit">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7">
                                                </path>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z">
                                                </path>
                                            </svg>
                                        </button>
                                    </td>

                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- No VIP Selected or No Privileges Available -->
                <div class="col-lg-8 bg-white p-5 d-flex align-items-center justify-content-center"
                    v-else-if="selectedVip && (!selectedVip.privileges || selectedVip.privileges.length === 0)">
                    <div class="text-center">
                        <div class="mb-3">
                            <i class="fas fa-inbox fa-3x text-muted"></i>
                        </div>
                        <h5 class="text-muted">No Privileges Available</h5>
                        <p class="text-muted mb-4">This VIP package doesn't have any privileges configured yet.</p>
                        <button type="button" class="btn btn-secondary" disabled
                            title="Adding new privileges is not supported">
                            <i class="fas fa-plus me-2"></i>Add First Privilege (Not Available)
                        </button>
                    </div>
                </div>

                <!-- No VIP Selected -->
                <div class="col-lg-8 bg-white p-5 d-flex align-items-center justify-content-center" v-else>
                    <div class="text-center">
                        <div class="mb-3">
                            <i class="fas fa-arrow-left fa-3x text-muted"></i>
                        </div>
                        <h5 class="text-muted">Select a VIP Package</h5>
                        <p class="text-muted">Choose a VIP package from the left panel to view and manage its options.
                        </p>
                    </div>
                </div>


            </div>
        </div>
    </div>


    <!-- VIP Option Modal -->
    <VipOptionModal ref="vipOptionModalRef" modal-id="vipOptionModal" :vip-id="selectedVipId"
        :existing-data="editingOption" @option-created="handleOptionCreated" @option-updated="handleOptionUpdated"
        @modal-closed="handleModalClosed" />

</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
//App Imports
import services from "@services/api"
import VipOptionModal from './components/VipOptionModal.vue';
import VipOptionToggle from './components/VipOptionToggle.vue';


const store = useStore();

const vips = ref([]);
const selectedVip = ref({});
const editingOption = ref(null);
const vipOptionModalRef = ref(null);
const isOperationInProgress = ref(false);
const isLoading = ref(false);
const error = ref(null);


// Computed property to safely get the selected VIP ID
const selectedVipId = computed(() => {
    return selectedVip.value?.id || null;
});

const handelVipOptionLoad = (id) => {
    if (!id) {
        console.warn('Invalid VIP ID provided');
        return;
    }

    const vip = vips.value.find(item => item.id === id);

    if (vip) {
        selectedVip.value = vip;
        console.log('Selected VIP:', vip);
    } else {
        console.warn('VIP not found with ID:', id);
        showErrorMessage('VIP package not found');
    }
}

// Modal handlers
const openAddModal = () => {
    if (!selectedVip.value || !selectedVip.value.id) {
        showErrorMessage('Please select a VIP package first');
        return;
    }
    editingOption.value = null;
};

const openEditModal = (option) => {
    if (!option || !option.id) {
        showErrorMessage('Invalid option selected');
        return;
    }
    editingOption.value = option;
};

const handleModalClosed = () => {
    editingOption.value = null;
};

// Helper functions for modal management and user feedback
const closeModal = () => {
    const modal = document.getElementById('vipOptionModal');
    const bootstrapModal = bootstrap.Modal.getInstance(modal);
    if (bootstrapModal) {
        bootstrapModal.hide();
    }
};

const showSuccessMessage = (message) => {
    // TODO: Replace with actual toast notification system when available
    console.log('✓ Success:', message);

    // For now, you could use a simple alert or implement a toast system
    // Example with browser notification:
    // if (Notification.permission === 'granted') {
    //     new Notification('Success', { body: message, icon: '/favicon.png' });
    // }
};

const showErrorMessage = (message) => {
    // TODO: Replace with actual toast notification system when available
    console.error('✗ Error:', message);

    // For now, you could use a simple alert or implement a toast system
    // Example with browser alert (not recommended for production):
    // alert(message);
};

// Option CRUD handlers - Updated to use new VIP service
const handleOptionCreated = async ({ vipId, formData }) => {
    isOperationInProgress.value = true;
    try {
        // Note: The new VIP service doesn't support creating new privileges
        // This functionality would need to be implemented in the Noble API
        // For now, show a message that this feature is not available
        showErrorMessage('Creating new privileges is not supported. Please contact your administrator.');

        // Close modal
        closeModal();

    } catch (error) {
        console.error('Failed to create option:', error);
        showErrorMessage('Failed to create option. Please try again.');

        // Reset modal loading state on error
        if (vipOptionModalRef.value) {
            vipOptionModalRef.value.isLoading = false;
        }
    } finally {
        isOperationInProgress.value = false;
    }
};

const handleOptionUpdated = async ({ optionId, formData }) => {
    isOperationInProgress.value = true;
    try {
        // Note: The new VIP service doesn't support updating privilege metadata
        // Only toggling privilege state is supported via updatePrivilege method
        // For now, show a message that this feature is not available
        showErrorMessage('Updating privilege details is not supported. Only toggling on/off is available.');

        // Close modal
        closeModal();

    } catch (error) {
        console.error('Failed to update option:', error);
        showErrorMessage('Failed to update option. Please try again.');

        // Reset modal loading state on error
        if (vipOptionModalRef.value) {
            vipOptionModalRef.value.isLoading = false;
        }
    } finally {
        isOperationInProgress.value = false;
    }
};

// Toggle success handler - called when toggle component succeeds
const handleToggleSuccess = async ({ optionId, optionName, newValue }) => {
    try {
        // Use the new VIP service updatePrivilege method
        await services.vip.updatePrivilege({
            vipId: selectedVip.value.id,
            privilegeId: optionId,
            isActive: newValue
        });

        // Update local state
        if (selectedVip.value && selectedVip.value.privileges) {
            const privilegeIndex = selectedVip.value.privileges.findIndex(priv => priv.id === optionId);
            if (privilegeIndex !== -1) {
                selectedVip.value.privileges[privilegeIndex].isActive = newValue;
            }
        }

        // Show success feedback
        const status = newValue ? 'activated' : 'deactivated';
        console.log(`✓ ${optionName} ${status} successfully`);
        showSuccessMessage(`${optionName} ${status} successfully`);

    } catch (error) {
        console.error('Failed to persist toggle status:', error);

        // Trigger error handling in toggle component
        handleToggleError({ optionId, optionName, error });

        // Revert the local state
        if (selectedVip.value && selectedVip.value.privileges) {
            const privilegeIndex = selectedVip.value.privileges.findIndex(priv => priv.id === optionId);
            if (privilegeIndex !== -1) {
                selectedVip.value.privileges[privilegeIndex].isActive = !newValue;
            }
        }
    }
};

// Toggle error handler - called when toggle component encounters an error
const handleToggleError = ({ optionId, optionName, error }) => {
    console.error(`✗ Failed to toggle ${optionName}:`, error);

    // Show user-friendly error message
    const errorMessage = error?.message || 'An unexpected error occurred';
    console.error(`Failed to toggle ${optionName}. ${errorMessage}`);

    // TODO: Replace with actual toast notification when available
    // toast.error(`Failed to toggle ${optionName}. Please try again.`);

    // Optional: You could also trigger a retry mechanism here
    // or show a more detailed error dialog
};


// Load VIP data function
const loadVipData = async () => {
    isLoading.value = true;
    error.value = null;

    try {
        // Load VIP data from the new unified service
        const { items } = await services.vip.getAll();
        vips.value = items;
        console.log('Loaded VIPs:', items);

        // Set initial selected VIP if available
        if (vips.value && vips.value.length > 0) {
            selectedVip.value = vips.value[0];
        }
    } catch (err) {
        console.error('Failed to load VIP data:', err);
        error.value = err.message || 'Failed to load VIP data';
        showErrorMessage('Failed to load VIP data. Please refresh the page.');
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    loadVipData();
});




</script>

<style scoped>
/* Toggle loading states and visual feedback */
.toggle-wrapper {
    display: inline-block;
    position: relative;
}

.toggle-loading {
    opacity: 0.7;
    pointer-events: none;
}

.toggle-spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
}

.toggle-spinner .spinner-border-sm {
    width: 1rem;
    height: 1rem;
}

/* Enhanced switch styling for better visual feedback */
.switch.s-outline.s-outline-primary input:checked+.slider {
    background-color: var(--bs-primary);
    border-color: var(--bs-primary);
}

.switch.s-outline.s-outline-primary input:disabled+.slider {
    opacity: 0.6;
    cursor: not-allowed;
}

.switch.s-outline.s-outline-primary .slider {
    transition: all 0.3s ease;
}

/* Hover effects for better UX */
.switch.s-outline.s-outline-primary:not(.toggle-loading):hover .slider {
    box-shadow: 0 0 0 0.2rem rgba(var(--bs-primary-rgb), 0.25);
}

/* Success/error visual feedback classes (for future enhancement) */
.toggle-success {
    animation: toggleSuccess 0.6s ease;
}

.toggle-error {
    animation: toggleError 0.6s ease;
}

@keyframes toggleSuccess {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.1);
        box-shadow: 0 0 0 0.3rem rgba(40, 167, 69, 0.3);
    }

    100% {
        transform: scale(1);
    }
}

@keyframes toggleError {
    0% {
        transform: scale(1);
    }

    25% {
        transform: translateX(-2px);
    }

    50% {
        transform: translateX(2px);
        box-shadow: 0 0 0 0.3rem rgba(220, 53, 69, 0.3);
    }

    75% {
        transform: translateX(-2px);
    }

    100% {
        transform: scale(1);
    }
}
</style>
