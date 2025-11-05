<template>
    <div class="layout-px-spacing">
        <!-- Breadcrumb Navigation -->
        <teleport to="#breadcrumb">
            <ul class="navbar-nav flex-row">
                <li>
                    <div class="page-header">
                        <nav class="breadcrumb-one" aria-label="breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item">
                                    <a href="javascript:;" @click="router.push('/dashboard')">
                                        {{ $t('bikmedia.navigation.breadcrumb.dashboard') }}
                                    </a>
                                </li>
                                <li class="breadcrumb-item active" aria-current="page">
                                    <span>{{ $t('bikmedia.navigation.breadcrumb.vipPackages') }}</span>
                                </li>
                            </ol>
                        </nav>
                    </div>
                </li>
            </ul>
        </teleport>

        <!-- Page Header -->
        <div class="row layout-top-spacing">
            <div class="col-xl-12 col-lg-12 col-sm-12 layout-spacing">
                <div class="widget-content widget-content-area br-8">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h4 class="mb-1">{{ $t('bikmedia.pages.vip.title') }}</h4>
                            <p class="text-muted mb-0">{{ $t('bikmedia.pages.vip.subtitle') }}</p>
                        </div>
                        <div class="d-flex gap-2">
                            <button type="button" class="btn btn-outline-primary" @click="loadVipPackages"
                                :disabled="isLoading">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="me-1">
                                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                                    <path d="M21 3v5h-5"></path>
                                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                                    <path d="M3 21v-5h5"></path>
                                </svg>
                                {{ $t('bikmedia.actions.refresh') }}
                            </button>
                        </div>
                    </div>

                    <!-- Loading State -->
                    <div v-if="isLoading" class="text-center py-5">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">{{ $t('bikmedia.messages.loading') }}</span>
                        </div>
                        <p class="mt-2 text-muted">{{ $t('bikmedia.messages.loadingVipPackages') }}</p>
                    </div>

                    <!-- Error State -->
                    <div v-else-if="error" class="text-center py-5">
                        <div class="alert alert-danger" role="alert">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="me-2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            {{ error }}
                        </div>
                        <button type="button" class="btn btn-primary" @click="loadVipPackages">
                            {{ $t('bikmedia.actions.retry') }}
                        </button>
                    </div>

                    <!-- VIP Packages Grid -->
                    <div v-else-if="vipPackages.length > 0" class="row g-4">
                        <div v-for="vipPackage in vipPackages" :key="vipPackage?.id || vipPackage.id + vipPackage.name"
                            class="col-xl-4 col-lg-6 col-md-6 col-sm-12">
                            <div class="card vip-package-card h-100" :class="{ 'inactive': !vipPackage.isActive }">
                                <!-- Package Image -->
                                <div class="card-img-wrapper">
                                    <img :src="getImageSrc(vipPackage.img)" :alt="vipPackage.name" class="card-img-top"
                                        @error="handleImageError" />
                                    <!-- <div class="package-status-badge">
                                        <span class="badge"
                                            :class="vipPackage.isActive ? 'bg-success' : 'bg-secondary'">
                                            {{ vipPackage.isActive ? $t('bikmedia.status.active') :
                                                $t('bikmedia.status.inactive') }}
                                        </span>
                                    </div> -->
                                </div>

                                <!-- Package Details -->
                                <div class="card-body d-flex flex-column">
                                    <div class="flex-grow-1">
                                        <h5 class="card-title mb-2">{{ vipPackage.name }}</h5>
                                        <p class="card-text text-muted small mb-3" v-if="vipPackage.content">
                                            {{ truncateText(vipPackage.content, 100) }}
                                        </p>

                                        <!-- Package Info -->
                                        <div class="package-info mb-3">
                                            <div class="info-item">
                                                <span class="label">{{ $t('bikmedia.vip.fields.coin') }}:</span>
                                                <span class="value">{{ formatNumber(vipPackage.coin) }}</span>
                                            </div>
                                            <div class="info-item">
                                                <span class="label">{{ $t('bikmedia.vip.fields.days') }}:</span>
                                                <span class="value">{{ vipPackage.days }} {{ $t('bikmedia.common.days')
                                                }}</span>
                                            </div>
                                            <div class="info-item" v-if="vipPackage.renew_coin">
                                                <span class="label">{{ $t('bikmedia.vip.fields.renewCoin') }}:</span>
                                                <span class="value">{{ formatNumber(vipPackage.renew_coin) }}</span>
                                            </div>
                                            <div class="info-item">
                                                <span class="label">{{ $t('bikmedia.vip.privileges') }}:</span>
                                                <span class="value">
                                                    <span class="privilege-count">{{ vipPackage.privilegeCount || 0
                                                    }}</span>
                                                    <span class="text-muted">/ {{ vipPackage.totalPrivileges || 0
                                                    }}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Package Actions -->
                                    <div class="card-actions">
                                        <div class="d-flex justify-content-between align-items-center">


                                            <!-- Action Buttons -->
                                            <div class="d-flex gap-2">
                                                <button type="button" class="btn btn-outline-primary btn-sm"
                                                    @click="openEditModal(vipPackage)"
                                                    :disabled="isUpdatingStatus[vipPackage.id]">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                                        class="me-1">
                                                        <path
                                                            d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7">
                                                        </path>
                                                        <path
                                                            d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z">
                                                        </path>
                                                    </svg>
                                                    {{ $t('bikmedia.actions.edit') }}
                                                </button>

                                                <button type="button" class="btn btn-outline-success btn-sm"
                                                    @click="openPrivilegePanel(vipPackage)"
                                                    :disabled="isUpdatingStatus[vipPackage.id]">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                                        class="me-1">
                                                        <path d="M9 12l2 2 4-4"></path>
                                                        <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
                                                        <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
                                                        <path d="M13 12h3"></path>
                                                        <path d="M8 12H5"></path>
                                                    </svg>
                                                    {{ $t('bikmedia.actions.privileges') }}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Empty State -->
                    <div v-else class="text-center py-5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"
                            class="text-muted mb-3">
                            <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"></path>
                            <line x1="8" y1="1" x2="8" y2="4"></line>
                            <line x1="16" y1="1" x2="16" y2="4"></line>
                        </svg>
                        <h5 class="text-muted">{{ $t('bikmedia.messages.noVipPackages') }}</h5>
                        <p class="text-muted">{{ $t('bikmedia.messages.noVipPackagesDesc') }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- VIP Edit Modal -->
        <VipEditModal ref="vipEditModalRef" :vip-package="selectedVipPackage" @package-updated="handlePackageUpdated"
            @modal-closed="handleModalClosed" />

        <!-- Privilege Management Panel -->
        <VipPrivilegePanel :show="showPrivilegePanel" :vip-package="selectedVipPackage" @close="closePrivilegePanel"
            @privilege-updated="handlePrivilegeUpdated" />
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useMeta } from '@/composables/use-meta';
import VipEditModal from './components/VipEditModal.vue';
import VipPrivilegePanel from './components/VipPrivilegePanel.vue';
import vipService from '@/services/api/vip.service';
import { bikMediaNotifications } from '@/utils/notification-handler';

// Composables
const router = useRouter();
const { t } = useI18n();

// Meta Setup
useMeta({ title: t('bikmedia.pages.vip.title') });

// Reactive State
const vipPackages = ref([]);
const selectedVipPackage = ref(null);
const isLoading = ref(false);
const error = ref(null);
const isUpdatingStatus = reactive({})

const vipEditModalRef = ref(null);

// Reactive State for Privileges
const allPrivileges = ref([]);
const showPrivilegePanel = ref(false);

// Methods
const loadVipPackages = async () => {
    isLoading.value = true;
    error.value = null;

    try {
        const { items, allPrivileges: privileges } = await vipService.getAll();

        // Store all privileges for later use
        allPrivileges.value = privileges || [];

        // Process VIP packages
        vipPackages.value = items.map(pkg => ({
            ...pkg,
            isActive: pkg.state === 1, // Convert state to boolean
            privilegeCount: pkg.privileges ? pkg.privileges.filter(p => p.isActive).length : 0,
            totalPrivileges: privileges ? privileges.length : 0
        }));

        console.log('Loaded VIP packages:', vipPackages.value);
        console.log('Available privileges:', allPrivileges.value);
    } catch (err) {
        console.error('Failed to load VIP packages:', err);
        error.value = err.message || t('bikmedia.messages.errors.failedToLoadVipPackages');
        bikMediaNotifications.general.error(error.value);
    } finally {

        console.log( "isLoadein", isLoading )
        isLoading.value = false;
    }
};



const openEditModal = (vipPackage) => {
    selectedVipPackage.value = { ...vipPackage };

    // Open the modal using Bootstrap 5 modal API
    const modalElement = document.getElementById('vipEditModal');
    if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    }
};

const openPrivilegePanel = (vipPackage) => {
    selectedVipPackage.value = { ...vipPackage };
    showPrivilegePanel.value = true;
};

const closePrivilegePanel = () => {
    showPrivilegePanel.value = false;
    selectedVipPackage.value = null;
};

const handlePrivilegeUpdated = (updateData) => {
    // Update the package privilege count in the main list
    if (updateData.vipPackageId) {
        const packageIndex = vipPackages.value.findIndex(p => p.id === updateData.vipPackageId);
        if (packageIndex !== -1) {
            // Reload the package data to get updated privilege count
            loadVipPackages();
        }
    }
};

const handlePackageUpdated = (updatedPackage) => {
    // Find and update the package in the list
    const index = vipPackages.value.findIndex(pkg => pkg.id === updatedPackage.id);
    if (index !== -1) {
        vipPackages.value[index] = {
            ...updatedPackage,
            isActive: updatedPackage.state === 1
        };
    }

    // Show success message
    bikMediaNotifications.general.success(
        t('bikmedia.messages.vipPackageUpdated', { name: updatedPackage.name })
    );

    // Close modal
    const modalElement = document.getElementById('vipEditModal');
    if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        }
    }
};

const handleModalClosed = () => {
    selectedVipPackage.value = null;
};

const getImageSrc = (imgUrl) => {
    if (imgUrl && imgUrl.trim() !== '') {
        return imgUrl;
    }

    // Return a data URL placeholder to avoid 404 errors
    const placeholderSvg = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="#f8f9fa"/>
      <g transform="translate(100,100)">
        <circle cx="0" cy="-20" r="25" fill="#dee2e6"/>
        <path d="M-30,10 L30,10 L25,40 L-25,40 Z" fill="#dee2e6"/>
        <text x="0" y="65" text-anchor="middle" font-family="Arial" font-size="12" fill="#6c757d">VIP Package</text>
      </g>
    </svg>
  `)}`;

    return placeholderSvg;
};

const handleImageError = (event) => {
    // Prevent infinite loop by checking if we're already using the fallback
    if (event.target.src.includes('data:image/svg+xml')) {
        return;
    }

    // Use the same placeholder as getImageSrc
    event.target.src = getImageSrc(null);
};

const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const formatNumber = (number) => {
    return new Intl.NumberFormat().format(number || 0);
};

// Lifecycle
onMounted(() => {
    loadVipPackages();
});
</script>

<style scoped>
.vip-package-card {
    transition: all 0.3s ease;
    border: 1px solid #e0e6ed;
}

.vip-package-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.vip-package-card.inactive {
    opacity: 0.7;
}

.card-img-wrapper {
    position: relative;
    height: 200px;
    overflow: hidden;
}

.card-img-top {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.vip-package-card:hover .card-img-top {
    transform: scale(1.05);
}

.package-status-badge {
    position: absolute;
    top: 10px;
    right: 10px;
}

.package-info {
    font-size: 0.875rem;
}

.info-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.25rem;
}

.info-item .label {
    font-weight: 500;
    color: #6c757d;
}

.info-item .value {
    font-weight: 600;
    color: #495057;
}

.card-actions {
    border-top: 1px solid #e9ecef;
    padding-top: 1rem;
    margin-top: 1rem;
}

.form-check-input:checked {
    background-color: #28a745;
    border-color: #28a745;
}

.form-check-input:disabled {
    opacity: 0.6;
}

.btn-outline-primary:hover {
    transform: none;
}

/* Privilege count styling */
.privilege-count {
    font-weight: 600;
    color: #28a745;
}

/* Form switch improvements for package status toggles */
.form-check-input:checked {
    background-color: #28a745;
    border-color: #28a745;
}

.form-check-input:focus {
    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .card-actions {
        flex-direction: column;
        gap: 0.5rem;
    }

    .card-actions .d-flex {
        flex-direction: column;
        align-items: stretch !important;
    }

    .form-check {
        margin-bottom: 0.5rem;
    }

    .privilege-panel {
        margin: 0.5rem;
        max-height: 95vh;
    }

    .privilege-item {
        flex-direction: column;
        align-items: flex-start;
        text-align: left;
    }

    .privilege-toggle {
        margin-left: 0;
        margin-top: 0.75rem;
        align-self: flex-end;
    }
}

/* Loading animation for status toggles */
.form-check-input[disabled]+.form-check-label::after {
    content: '';
    position: absolute;
    right: -20px;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    border: 2px solid #f3f3f3;
    border-top: 2px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: translateY(-50%) rotate(0deg);
    }

    100% {
        transform: translateY(-50%) rotate(360deg);
    }
}
</style>