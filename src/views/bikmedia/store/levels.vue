<template>
    <div class="layout-px-spacing app-contacts">
        <teleport to="#breadcrumb">
            <ul class="navbar-nav flex-row">
                <li>
                    <div class="page-header">
                        <nav class="breadcrumb-one" aria-label="breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="javascript:;">{{ $t('bikmedia.navigation.breadcrumb.store') }}</a></li>
                                <li class="breadcrumb-item active" aria-current="page"><span>{{ $t('bikmedia.navigation.breadcrumb.levels') }}</span></li>
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
                                    <input type="text" v-model.trim="search_text" class="product-search form-control" @input="onSearchInput" :placeholder="$t('bikmedia.forms.placeholder.searchLevels')" />
                                </div>
                            </form>
                        </div>

                        <div class="col-xl-8 col-lg-7 col-md-7 col-sm-5 text-sm-end text-center layout-spacing align-self-center">
                            <div class="d-flex justify-content-sm-end justify-content-center">
                                <!-- Filters Dropdown -->
                                <div class="dropdown me-2">
                                    <button class="btn btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-filter">
                                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                                        </svg>
                                        {{ $t('bikmedia.actions.filters') }}
                                    </button>
                                    <ul class="dropdown-menu" style="min-width: 250px; padding: 15px;">
                                        <li class="mb-3">
                                            <label class="form-label">{{ $t('bikmedia.filters.levelRange') }}</label>
                                            <select class="form-select" v-model="filters.levelRange" @change="onFilterChange">
                                                <option value="">{{ $t('bikmedia.filters.allLevels') }}</option>
                                                <option value="1-10">{{ $t('bikmedia.forms.level') }} 1-10</option>
                                                <option value="11-20">{{ $t('bikmedia.forms.level') }} 11-20</option>
                                                <option value="21-30">{{ $t('bikmedia.forms.level') }} 21-30</option>
                                                <option value="31-40">{{ $t('bikmedia.forms.level') }} 31-40</option>
                                                <option value="41-50">{{ $t('bikmedia.forms.level') }} 41-50</option>
                                                <option value="51-60">{{ $t('bikmedia.forms.level') }} 51-60</option>
                                                <option value="61-70">{{ $t('bikmedia.forms.level') }} 61-70</option>
                                                <option value="71-80">{{ $t('bikmedia.forms.level') }} 71-80</option>
                                                <option value="81-90">{{ $t('bikmedia.forms.level') }} 81-90</option>
                                                <option value="91-100">{{ $t('bikmedia.forms.level') }} 91-100</option>
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
                            <span class="visually-hidden">{{ $t('bikmedia.messages.loading') }}</span>
                        </div>
                        <p class="mt-2">{{ $t('bikmedia.messages.loadingLevels') }}</p>
                    </div>

                    <!-- Empty State -->
                    <div v-else-if="!loading && levels_list.length === 0" class="text-center py-5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="feather feather-inbox text-muted">
                            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                        </svg>
                        <h5 class="mt-3">{{ $t('bikmedia.table.empty.noLevels') }}</h5>
                        <p class="text-muted">{{ $t('bikmedia.table.empty.tryAdjusting') }}</p>
                    </div>

                    <div v-else class="searchable-items" :class="[grid_type]">
                        <div class="items items-header-section">
                            <div class="item-content">
                                <div class="">
                                    <h4>{{ $t('bikmedia.forms.level') }}</h4>
                                </div>
                                <div class="user-email">
                                    <h4>{{ $t('bikmedia.forms.levelId') }}</h4>
                                </div>
                                <div class="user-location">
                                    <h4 style="margin-left: 0">{{ $t('bikmedia.forms.name') }}</h4>
                                </div>
                                <div class="user-phone">
                                    <h4 style="margin-left: 3px">{{ $t('bikmedia.forms.target') }}</h4>
                                </div>
                                <div class="action-btn">
                                    <h4>{{ $t('bikmedia.table.headers.actions') }}</h4>
                                </div>
                            </div>
                        </div>

                        <div v-for="(level, index) in levels_list" class="items" :key="level.id">
                            <div class="item-content">
                                <div class="user-profile">
                                    <img :src="level.level?.icon || defaultAvatar" alt="level" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;" />
                                    <div class="user-meta-info">
                                        <p class="user-name">{{ $t('bikmedia.forms.level') }} {{ level.lvl }}</p>
                                        <p class="user-work">{{ $t('bikmedia.table.headers.id') }}: {{ level.id }}</p>
                                    </div>
                                </div>
                                <div class="user-email">
                                    <p class="info-title">{{ $t('bikmedia.forms.levelId') }}:</p>
                                    <p class="usr-email-addr">{{ level.lid }}</p>
                                </div>
                                <div class="user-location">
                                    <p class="info-title">{{ $t('bikmedia.forms.name') }}:</p>
                                    <p class="usr-location">{{ level.level?.name || 'N/A' }}</p>
                                </div>
                                <div class="user-phone">
                                    <p class="info-title">{{ $t('bikmedia.forms.target') }}:</p>
                                    <p class="usr-ph-no">{{ formatNumber(level.target) }}</p>
                                </div>
                                <div class="action-btn">
                                    <div class="d-flex align-items-center gap-2">
                                        <a href="javascript:;" class="me-1" @click="handleView(level)" :title="$t('bikmedia.table.actions.view')">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                        </a>
                                        <!-- Conditional Edit Button - Shows even if not supported (will show appropriate message) -->
                                        <a href="javascript:;" class="me-1" @click="handleEdit(level)" :title="$t('bikmedia.table.actions.edit')">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-2 edit">
                                                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                            </svg>
                                        </a>

                                        <a href="javascript:;" class="me-1" @click="handleDelete(level)" :title="$t('bikmedia.table.actions.delete')" 
                                           :class="{ 'opacity-50': isDeleting && deletingItemId === level.id }">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                                stroke-linecap="round" stroke-linejoin="round"
                                                class="feather feather-trash-2 text-danger">
                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                                <line x1="14" y1="11" x2="14" y2="17"></line>
                                            </svg>
                                        </a>
                                        <div class="d-flex gap-1">
                                            <img v-if="level.level?.icon" :src="level.level.icon" alt="icon" :title="$t('bikmedia.forms.activeIcon')" style="width: 30px; height: 30px; object-fit: cover; border-radius: 4px; border: 2px solid #4361ee;" />
                                            <img v-if="level.level?.icon_disable" :src="level.level.icon_disable" alt="icon_disable" :title="$t('bikmedia.forms.disabledIcon')" style="width: 30px; height: 30px; object-fit: cover; border-radius: 4px; border: 2px solid #ccc;" />
                                            <img v-if="level.level?.icon_anim" :src="level.level.icon_anim" alt="icon_anim" :title="$t('bikmedia.forms.animatedIcon')" style="width: 30px; height: 30px; object-fit: cover; border-radius: 4px; border: 2px solid #1abc9c;" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Pagination Controls -->
                    <div v-if="!loading && levels_list.length > 0" class="row mt-4">
                        <div class="col-md-6">
                            <div class="d-flex align-items-center">
                                <label class="me-2">{{ $t('bikmedia.filters.itemsPerPage') }}:</label>
                                <select class="form-select" style="width: auto;" v-model.number="pagination.limit" @change="onLimitChange">
                                    <option :value="10">10 {{ $t('bikmedia.table.pagination.items') }}</option>
                                    <option :value="25">25 {{ $t('bikmedia.table.pagination.items') }}</option>
                                    <option :value="50">50 {{ $t('bikmedia.table.pagination.items') }}</option>
                                    <option :value="100">100 {{ $t('bikmedia.table.pagination.items') }}</option>
                                </select>
                                <span class="ms-3 text-muted">
                                    {{ $t('bikmedia.table.pagination.showing') }} {{ startIndex + 1 }} {{ $t('bikmedia.table.pagination.to') }} {{ endIndex }} {{ $t('bikmedia.table.pagination.of') }} {{ pagination.total }} {{ $t('bikmedia.store.levels') }}
                                </span>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <nav aria-label="Page navigation">
                                <ul class="pagination justify-content-end mb-0">
                                    <li class="page-item" :class="{ disabled: pagination.page === 1 }">
                                        <a class="page-link" href="javascript:;" @click="changePage(pagination.page - 1)">{{ $t('bikmedia.table.pagination.previous') }}</a>
                                    </li>
                                    <li v-for="page in visiblePages" :key="page" class="page-item" :class="{ active: page === pagination.page, disabled: page === '...' }">
                                        <a class="page-link" href="javascript:;" @click="page !== '...' && changePage(page)">{{ page }}</a>
                                    </li>
                                    <li class="page-item" :class="{ disabled: pagination.page === pagination.pages }">
                                        <a class="page-link" href="javascript:;" @click="changePage(pagination.page + 1)">{{ $t('bikmedia.table.pagination.next') }}</a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>

                <!-- TODO: Edit Modal - Ready for future implementation when API supports edit -->
                <!-- 
                <div id="editLevelModal" class="modal fade" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-md modal-dialog-centered">
                        <div class="modal-content mailbox-popup">
                            <div class="modal-header">
                                <h5 class="modal-title">{{ $t('bikmedia.pages.levels.edit.title') }} #{{ params.id }}</h5>
                                <button type="button" data-dismiss="modal" data-bs-dismiss="modal" aria-label="Close" class="btn-close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="add-contact-box">
                                    <div class="add-contact-content">
                                        <form id="editLevelForm">
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <div class="form-group mb-4">
                                                        <label>Level</label>
                                                        <input type="number" v-model.number="params.lvl" class="form-control" placeholder="Level" />
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="form-group mb-4">
                                                        <label>Target</label>
                                                        <input type="number" v-model.number="params.target" class="form-control" placeholder="Target Points" />
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-default" data-dismiss="modal" data-bs-dismiss="modal">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                    Cancel
                                </button>
                                <button type="button" class="btn btn-primary" @click="save_level()">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-save">
                                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                        <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                        <polyline points="7 3 7 8 15 8"></polyline>
                                    </svg>
                                    Update Level
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                -->
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
    import { useI18n } from 'vue-i18n';
    import levelService from "@services/api/level.service";
    import "/src/assets/sass/apps/contacts.scss";
    import { sanitizeInput } from '/src/utils/sanitize.js';
    import defaultAvatar from '/src/assets/images/profile-30.png';

    import { useMeta } from "/src/composables/use-meta";

    const { t } = useI18n();
    useMeta({ title: t('bikmedia.pages.levels.title') });

    const router = useRouter();
    const levels_list = ref([]);
    const search_text = ref("");
    const grid_type = ref("list");
    const loading = ref(false);
    const isDeleting = ref(false);
    const deletingItemId = ref(null);
    let searchTimeout = null;

    // Filters
    const filters = ref({
        levelRange: '' // Empty string to show "All Levels" as default
    });

    // Server-side pagination
    const pagination = ref({
        page: 1,
        limit: 25,
        pages: 1,
        total: 0
    });

    // Computed properties for server-side pagination
    const startIndex = computed(() => {
        return (pagination.value.page - 1) * pagination.value.limit;
    });

    const endIndex = computed(() => {
        const end = pagination.value.page * pagination.value.limit;
        return end > pagination.value.total ? pagination.value.total : end;
    });

    const visiblePages = computed(() => {
        const pages = [];
        const total = pagination.value.pages;
        const current = pagination.value.page;
        
        if (total <= 7) {
            for (let i = 1; i <= total; i++) {
                pages.push(i);
            }
        } else {
            if (current <= 4) {
                for (let i = 1; i <= 5; i++) pages.push(i);
                pages.push('...');
                pages.push(total);
            } else if (current >= total - 3) {
                pages.push(1);
                pages.push('...');
                for (let i = total - 4; i <= total; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = current - 1; i <= current + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(total);
            }
        }
        return pages.filter(p => p !== '...' || pages.indexOf(p) === pages.lastIndexOf(p));
    });

    onMounted(() => {
        // TODO: Initialize modal when edit functionality is added
        // initPopup();
        fetchLevels();
    });

    // TODO: Initialize modal for future edit functionality
    // const initPopup = () => {
    //     editLevelModal = new window.bootstrap.Modal(document.getElementById("editLevelModal"));
    // };

    // Fetch levels from API with server-side pagination
    const fetchLevels = async (resetPage = false) => {
        loading.value = true;
        try {
            // Reset to page 1 if requested (for new searches/filters)
            if (resetPage) {
                pagination.value.page = 1;
            }

            // Prepare API parameters
            const params = {
                p: pagination.value.page,
                limit: pagination.value.limit
            };

            // Add search parameter if provided
            if (search_text.value.trim()) {
                params.search = sanitizeInput(search_text.value.trim());
            }

            // Add level range filter if selected
            if (filters.value.levelRange) {
                params.levelRange = filters.value.levelRange;
            }

            console.log('Fetching levels with params:', params);

            const response = await levelService.getAll(params);
            
            console.log('API Response:', response);

            // Update levels list and pagination from server response
            levels_list.value = response.items || [];
            
            // Update pagination metadata from server
            if (response.pagination) {
                pagination.value = {
                    page: response.pagination.page || pagination.value.page,
                    limit: response.pagination.limit || pagination.value.limit,
                    pages: response.pagination.pages || 1,
                    total: response.pagination.total || 0
                };
            }

            console.log('Levels loaded:', levels_list.value.length, 'items');
            console.log('Pagination:', pagination.value);
        } catch (error) {
            console.error("Failed to fetch levels:", error);
            showMessage(error.message || t('bikmedia.messages.errors.loadLevels'), "error");
            levels_list.value = [];
            pagination.value.total = 0;
            pagination.value.pages = 1;
        } finally {
            loading.value = false;
        }
    };

    // Handle filter change - triggers server-side filtering
    const onFilterChange = () => {
        fetchLevels(true); // Reset to page 1 and fetch with new filters
    };

    // Change page - triggers server-side pagination
    const changePage = (page) => {
        if (page < 1 || page > pagination.value.pages || page === pagination.value.page) {
            return;
        }
        pagination.value.page = page;
        fetchLevels(); // Fetch new page from server
    };

    // Handle limit change - triggers server-side pagination
    const onLimitChange = () => {
        fetchLevels(true); // Reset to page 1 and fetch with new limit
    };

    // Handle search input with debounce - triggers server-side search
    const onSearchInput = () => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        searchTimeout = setTimeout(() => {
            fetchLevels(true); // Reset to page 1 and fetch with search term
        }, 300); // 300ms debounce
    };

    onBeforeUnmount(() => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
    });

    // Helper function to format numbers with commas
    const formatNumber = (num) => {
        if (!num) return '0';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    // Navigation handlers
    const handleView = (level) => {
        if (!level || !level.id) {
            showMessage(t('bikmedia.messages.errors.invalidLevelId'), 'error');
            return;
        }
        router.push({ name: 'level-view', params: { id: level.id } });
    };

    const handleEdit = (level) => {
        if (!level || !level.id) {
            showMessage(t('bikmedia.messages.errors.invalidLevelId'), 'error');
            return;
        }
        router.push({ name: 'level-edit', params: { id: level.id } });
    };



    // Delete functionality
    const handleDelete = async (level) => {
        if (!level || !level.id) {
            showMessage(t('bikmedia.messages.errors.invalidLevelId'), 'error');
            return;
        }

        const result = await window.Swal.fire({
            title: t('bikmedia.messages.confirmations.deleteLevel'),
            html: `<div class="text-center"><h4 class="mb-3">${t('bikmedia.forms.level')} ${level.lvl} (${level.level?.name || t('bikmedia.forms.level') + ' #' + level.id})</h4><p class="text-muted">${t('bikmedia.messages.confirmations.cannotUndo')}</p></div>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: t('bikmedia.actions.delete'),
            confirmButtonColor: '#dc3545',
            cancelButtonText: t('bikmedia.actions.cancel'),
            reverseButtons: true
        });

        if (result.isConfirmed) {
            await performDelete(level.id);
        }
    };

    const performDelete = async (itemId) => {
        try {
            isDeleting.value = true;
            deletingItemId.value = itemId;
            
            const response = await levelService.delete(itemId);
            
            // Check for success based on API response structure
            if (response.data?.code === 200 && response.data?.err === null && response.data?.data?.success === 1) {
                showMessage(t('bikmedia.messages.success.levelDeleted'), 'success');
                // Refresh the current page
                await fetchLevels();
            } else if (response.data?.code === 201 && response.data?.err === 'notFound') {
                throw new Error(t('bikmedia.messages.errors.notFound'));
            } else if (response.data?.err) {
                throw new Error(response.data.err);
            } else {
                throw new Error(t('bikmedia.messages.errors.failedToDelete'));
            }
        } catch (error) {
            console.error('Delete error:', error);
            showMessage(error.message || t('bikmedia.messages.errors.failedToDelete'), 'error');
        } finally {
            isDeleting.value = false;
            deletingItemId.value = null;
        }
    };

    // TODO: Edit level function for future implementation
    // const edit_level = async (level) => {
    //     console.log('=== EDIT LEVEL CLICKED ===');
    //     console.log('Level object received:', JSON.stringify(level, null, 2));
    //     
    //     if (level) {
    //         params.value = {
    //             id: level.id,
    //             lvl: Number(level.lvl) || 0,
    //             target: Number(level.target) || 0,
    //             lid: Number(level.lid) || 0
    //         };
    //         
    //         console.log('Params after assignment:', JSON.stringify(params.value, null, 2));
    //         
    //         await nextTick();
    //     }
    //  
    //     editLevelModal.show();
    // };

    // TODO: Save level function for future implementation
    // const save_level = async () => {
    //     if (!params.value.id) {
    //         showMessage("Level ID is required.", "error");
    //         return;
    //     }
    //
    //     try {
    //         loading.value = true;
    //         
    //         // TODO: Implement API call when backend provides edit endpoint
    //         // const response = await levelService.update(params.value.id, {
    //         //     lvl: params.value.lvl,
    //         //     target: params.value.target,
    //         //     lid: params.value.lid
    //         // });
    //
    //         showMessage("Level updated successfully.", "success");
    //         editLevelModal.hide();
    //         
    //         // Refresh the list
    //         await fetchLevels();
    //     } catch (error) {
    //         console.error("Failed to update level:", error);
    //         showMessage(error.message || "Failed to update level", "error");
    //     } finally {
    //         loading.value = false;
    //     }
    // };

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
