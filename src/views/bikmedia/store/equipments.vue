<template>
    <div class="layout-px-spacing app-contacts">
        <teleport to="#breadcrumb">
            <ul class="navbar-nav flex-row">
                <li>
                    <div class="page-header">
                        <nav class="breadcrumb-one" aria-label="breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="javascript:;">Store</a></li>
                                <li class="breadcrumb-item active" aria-current="page"><span>Equipments</span></li>
                            </ol>
                        </nav>
                    </div>
                </li>
            </ul>
        </teleport>

        <div class="row layout-spacing layout-top-spacing" id="cancel-row">
            <div class="col-lg-12">
                <div class="panel-body searchable-container" :class="[grid_type]">
                    <div class="row">
                        <div class="col-xl-4 col-lg-5 col-md-5 col-sm-7 filtered-list-search layout-spacing align-self-center">
                            <form class="form-inline my-2 my-lg-0">
                                <div class="">
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
                                        class="feather feather-search"
                                    >
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    </svg>
                                    <input type="text" v-model.trim="search_text" class="product-search form-control" @input="onSearchInput" placeholder="Search Equipments..." />
                                </div>
                            </form>
                        </div>

                        <div class="col-xl-8 col-lg-7 col-md-7 col-sm-5 text-sm-end text-center layout-spacing align-self-center">
                            <div class="d-flex justify-content-sm-end justify-content-center">
                                <!-- Create New Equipment Button -->
                                <button type="button" class="btn btn-primary me-2" @click="handleCreate">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus-circle">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="8" x2="12" y2="16"></line>
                                        <line x1="8" y1="12" x2="16" y2="12"></line>
                                    </svg>
                                    <span class="ms-1">New Equipment</span>
                                </button>
                                
                                <!-- Filters Dropdown -->
                                <div class="dropdown me-2">
                                    <button class="btn btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-filter">
                                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                                        </svg>
                                        Filters
                                    </button>
                                    <ul class="dropdown-menu" style="min-width: 250px; padding: 15px;">
                                        <li class="mb-3">
                                            <label class="form-label">Equipment Type</label>
                                            <select class="form-select" :value="filters.type === null ? '' : filters.type" @change="onTypeFilterChange">
                                                <option value="">All Types</option>
                                                <option value="1">Frame</option>
                                                <option value="2">Entry Effect</option>
                                                <option value="3">Badge</option>
                                                <option value="4">Theme</option>
                                            </select>
                                        </li>
                                    </ul>
                                </div>

                                <div class="switch align-self-center">
                                    <a href="javascript:;" @click="grid_type = 'list'">
                                        <svg
                                            :class="{ 'active-view': grid_type == 'list' }"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            class="feather feather-list view-list me-1"
                                        >
                                            <line x1="8" y1="6" x2="21" y2="6"></line>
                                            <line x1="8" y1="12" x2="21" y2="12"></line>
                                            <line x1="8" y1="18" x2="21" y2="18"></line>
                                            <line x1="3" y1="6" x2="3" y2="6"></line>
                                            <line x1="3" y1="12" x2="3" y2="12"></line>
                                            <line x1="3" y1="18" x2="3" y2="18"></line>
                                        </svg>
                                    </a>
                                    <a href="javascript:;" @click="grid_type = 'grid'">
                                        <svg
                                            :class="{ 'active-view': grid_type == 'grid' }"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            class="feather feather-grid view-grid"
                                        >
                                            <rect x="3" y="3" width="7" height="7"></rect>
                                            <rect x="14" y="3" width="7" height="7"></rect>
                                            <rect x="14" y="14" width="7" height="7"></rect>
                                            <rect x="3" y="14" width="7" height="7"></rect>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Loading State -->
                    <div v-if="loading" class="text-center py-5">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <p class="mt-2">Loading equipments...</p>
                    </div>

                    <!-- Empty State -->
                    <div v-else-if="!loading && filterd_equipments_list.length === 0" class="text-center py-5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="feather feather-inbox text-muted">
                            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                        </svg>
                        <h5 class="mt-3">No equipments found</h5>
                        <p class="text-muted">Try adjusting your search or filters</p>
                    </div>

                    <div v-else class="searchable-items" :class="[grid_type]">
                        <div class="items items-header-section">
                            <div class="item-content">
                                <div class="">
                                    <h4>Equipment</h4>
                                </div>
                                <div class="user-email">
                                    <h4>Coins</h4>
                                </div>
                                <div class="user-location">
                                    <h4 style="margin-left: 0">Type</h4>
                                </div>
                                <div class="user-phone">
                                    <h4 style="margin-left: 3px">Days</h4>
                                </div>
                                <div class="action-btn">
                                    <h4>Actions</h4>
                                </div>
                            </div>
                        </div>

                        <div v-for="(equipment, index) in filterd_equipments_list" class="items" :key="equipment.id">
                            <div class="item-content">
                                <div class="user-profile">
                                    <img :src="equipment.icon || defaultAvatar" alt="equipment" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;" />
                                    <div class="user-meta-info">
                                        <p class="user-name">{{ equipment.name || equipment.typeName || 'N/A' }}</p>
                                        <p class="user-work">ID: {{ equipment.id }}</p>
                                    </div>
                                </div>
                                <div class="user-email">
                                    <p class="info-title">Coins:</p>
                                    <p class="usr-email-addr">{{ formatNumber(equipment.coin) }}</p>
                                </div>
                                <div class="user-location">
                                    <p class="info-title">Type:</p>
                                    <p class="usr-location">
                                        <span class="badge" :class="getTypeBadgeClass(equipment.type)">{{ getTypeLabel(equipment.type) }}</span>
                                    </p>
                                </div>
                                <div class="user-phone">
                                    <p class="info-title">Days:</p>
                                    <p class="usr-ph-no">{{ equipment.days || 0 }}</p>
                                </div>
                                <div class="action-btn">
                                    <a href="javascript:;" class="me-1" @click="handleView(equipment)" title="View">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    </a>
                                    <a href="javascript:;" @click="handleEdit(equipment)" title="Edit">
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
                                            class="feather feather-edit-2 edit"
                                        >
                                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped>
    .searchable-container .switch {
        width: auto;
        height: auto;
    }
    .searchable-container .searchable-items.grid .items .user-profile .custom-checkbox {
        display: none !important;
    }
</style>

<script setup>
    import { computed, onBeforeUnmount, onMounted, ref } from "vue";
    import { useRouter } from 'vue-router';
    import equipmentService from "@services/api/equipment.service";
    import "/src/assets/sass/apps/contacts.scss";
    import { sanitizeInput, sanitizeObject } from '/src/utils/sanitize.js';
    import defaultAvatar from '/src/assets/images/profile-30.png';

    import { useMeta } from "/src/composables/use-meta";
    useMeta({ title: "Equipments Management" });

    const router = useRouter();
    const equipments_list = ref([]);
    const filterd_equipments_list = ref([]);
    const search_text = ref("");
    const grid_type = ref("list");
    const loading = ref(false);
    let searchTimeout = null;

    // Filters
    const filters = ref({
        type: null // null for "All Types" as default
    });

    onMounted(() => {
        fetchEquipments();
    });

    // Fetch equipments from API
    const fetchEquipments = async () => {
        loading.value = true;
        try {
            // Build request params, omitting type if null or empty
            const params = { ...filters.value };
            if (params.type === null || params.type === '' || params.type === undefined) {
                delete params.type;
            }
            
            const response = await equipmentService.getAll(params);
            
            console.log('API Response:', response);

            // Extract items from response.items.list (same structure as gifts)
            equipments_list.value = response.items?.list || [];
            applyFilters();

            console.log('Equipments loaded:', equipments_list.value.length, 'items');
        } catch (error) {
            console.error("Failed to fetch equipments:", error);
            showMessage(error.message || "Failed to load equipments", "error");
            equipments_list.value = [];
            filterd_equipments_list.value = [];
        } finally {
            loading.value = false;
        }
    };

    // Handle type filter change
    const onTypeFilterChange = (event) => {
        const selectedValue = event.target.value;
        
        // Convert empty string to null for "All Types", otherwise convert to number
        if (selectedValue === '') {
            filters.value.type = null;
        } else {
            filters.value.type = Number(selectedValue);
        }
        fetchEquipments();
    };

    // Apply filters and search
    const applyFilters = () => {
        let filtered = Array.isArray(equipments_list.value) ? [...equipments_list.value] : [];

        console.log('Applying filters:', filters.value);
        console.log('Total equipments:', filtered.length);

        // Apply type filter
        if (filters.value.type !== null && filters.value.type !== undefined && filters.value.type !== '') {
            const filterType = Number(filters.value.type);
            console.log('Filtering by type:', filterType);
            filtered = filtered.filter(e => {
                console.log(`Equipment ${e.id} type: ${e.type} (${typeof e.type}), filter: ${filterType} (${typeof filterType}), match: ${e.type === filterType}`);
                return Number(e.type) === filterType;
            });
            console.log('After type filter:', filtered.length);
        }

        // Apply search filter
        if (search_text.value) {
            // Sanitize search input to prevent XSS attacks
            const sanitizedSearch = sanitizeInput(search_text.value);
            const searchLower = sanitizedSearch.toLowerCase();
            filtered = filtered.filter(e => 
                (e.name && e.name.toLowerCase().includes(searchLower)) ||
                (e.typeName && e.typeName.toLowerCase().includes(searchLower)) ||
                (e.id && e.id.toString().includes(searchLower))
            );
            console.log('After search filter:', filtered.length);
        }

        filterd_equipments_list.value = filtered;
        console.log('Final filtered list:', filterd_equipments_list.value.length);
    };

    // Handle search input with debounce
    const onSearchInput = () => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        searchTimeout = setTimeout(() => {
            applyFilters();
        }, 300); // 300ms debounce
    };

    onBeforeUnmount(() => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
    });

    // Helper function to get type label
    const getTypeLabel = (type) => {
        const typeLabels = {
            1: 'Frame',
            2: 'Entry Effect',
            3: 'Badge',
            4: 'Theme'
        };
        return typeLabels[type] || `Type ${type}`;
    };

    // Helper function to get badge class for type
    const getTypeBadgeClass = (type) => {
        const badgeClasses = {
            1: 'badge-light-primary',
            2: 'badge-light-success',
            3: 'badge-light-warning',
            4: 'badge-light-info'
        };
        return badgeClasses[type] || 'badge-light-secondary';
    };

    // Helper function to format numbers with commas
    const formatNumber = (num) => {
        if (!num) return '0';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    // Navigation handlers
    const handleCreate = () => {
        router.push({ name: 'equipment-create' });
    };

    const handleView = (equipment) => {
        if (!equipment || !equipment.id) {
            showMessage('Invalid equipment ID', 'error');
            return;
        }
        router.push({ name: 'equipment-view', params: { id: equipment.id } });
    };

    const handleEdit = (equipment) => {
        if (!equipment || !equipment.id) {
            showMessage('Invalid equipment ID', 'error');
            return;
        }
        router.push({ name: 'equipment-edit', params: { id: equipment.id } });
    };

    const showMessage = (msg = "", type = "success") => {
        const toast = window.Swal.mixin({
            toast: true,
            position: "top",
            showConfirmButton: false,
            timer: 3000,
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: "10px 20px",
        });
    };
</script>
