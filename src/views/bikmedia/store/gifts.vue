<template>
    <div class="layout-px-spacing app-contacts">
        <teleport to="#breadcrumb">
            <ul class="navbar-nav flex-row">
                <li>
                    <div class="page-header">
                        <nav class="breadcrumb-one" aria-label="breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="javascript:;"
                                        x-html="$t('bikmedia.navigation.breadcrumb.store')"></a></li>
                                <li class="breadcrumb-item active" aria-current="page"><span
                                        x-html="$t('bikmedia.navigation.breadcrumb.gifts')"></span></li>
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
                        <div
                            class="col-xl-4 col-lg-5 col-md-5 col-sm-7 filtered-list-search layout-spacing align-self-center">

                            <!-- Serach componentn -->
                            <form class="form-inline my-2 my-lg-0">
                                <div class="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" class="feather feather-search">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    </svg>
                                    <input type="text" v-model.trim="search_text" class="product-search form-control"
                                        @input="onSearchInput"
                                        :placeholder="$t('bikmedia.forms.placeholder.searchGifts')" />
                                </div>

                            </form>
                        </div>

                        <div
                            class="col-xl-8 col-lg-7 col-md-7 col-sm-5 text-sm-end text-center layout-spacing align-self-center">
                            <div class="d-flex justify-content-sm-end justify-content-center">
                                <!-- Create New Gift Button -->
                                <button type="button" class="btn btn-primary me-2" @click="handleCreate">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" class="feather feather-plus-circle">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="8" x2="12" y2="16"></line>
                                        <line x1="8" y1="12" x2="16" y2="12"></line>
                                    </svg>
                                    <span class="ms-1">{{ $t('bikmedia.actions.new') }} {{ $t('bikmedia.store.gifts')
                                    }}</span>
                                </button>

                                <!-- Filters Dropdown -->
                                <div class="dropdown me-2">
                                    <button class="btn btn-outline-primary dropdown-toggle" type="button"
                                        data-bs-toggle="dropdown" aria-expanded="false">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round"
                                            class="feather feather-filter">
                                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                                        </svg>
                                        {{ $t('bikmedia.actions.filters') }}
                                    </button>
                                    <ul class="dropdown-menu" style="min-width: 250px; padding: 15px;">
                                        <li class="mb-3">
                                            <label class="form-label">{{ $t('bikmedia.filters.giftType') }}</label>
                                            <select class="form-select"
                                                :value="filters.type === null ? '' : filters.type"
                                                @change="onTypeFilterChange">
                                                <option value="">{{ $t('bikmedia.filters.allTypes') }}</option>
                                                <option value="0">{{ $t('bikmedia.types.gift.default') }}</option>
                                                <option value="1">{{ $t('bikmedia.types.gift.standard') }}</option>
                                                <option value="2">{{ $t('bikmedia.types.gift.premium') }}</option>
                                                <option value="3">{{ $t('bikmedia.types.gift.video') }}</option>
                                                <option value="4">{{ $t('bikmedia.types.gift.special') }}</option>
                                            </select>
                                        </li>
                                        <li class="mb-3">
                                            <label class="form-label">{{ $t('bikmedia.forms.language') }}</label>
                                            <select class="form-select" v-model="filters.lang" @change="fetchGifts">
                                                <option value="en">{{ $t('bikmedia.filters.english') }}</option>
                                                <option value="ar">{{ $t('bikmedia.filters.arabic') }}</option>
                                            </select>
                                        </li>
                                        <li>
                                            <label class="form-label">{{ $t('bikmedia.filters.itemsPerPage') }}</label>
                                            <select class="form-select" v-model.number="filters.limit"
                                                @change="onLimitChange">
                                                <option :value="10">10 {{ $t('bikmedia.table.pagination.items') }}
                                                </option>
                                                <option :value="25">25 {{ $t('bikmedia.table.pagination.items') }}
                                                </option>
                                                <option :value="50">50 {{ $t('bikmedia.table.pagination.items') }}
                                                </option>
                                                <option :value="100">100 {{ $t('bikmedia.table.pagination.items') }}
                                                </option>
                                            </select>
                                        </li>
                                    </ul>
                                </div>
                                <!-- Grid Switch -->
                                <div class="switch align-self-center">
                                    <a href="javascript:;" @click="grid_type = 'list'">
                                        <svg :class="{ 'active-view': grid_type == 'list' }"
                                            xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round"
                                            class="feather feather-list view-list me-1">
                                            <line x1="8" y1="6" x2="21" y2="6"></line>
                                            <line x1="8" y1="12" x2="21" y2="12"></line>
                                            <line x1="8" y1="18" x2="21" y2="18"></line>
                                            <line x1="3" y1="6" x2="3" y2="6"></line>
                                            <line x1="3" y1="12" x2="3" y2="12"></line>
                                            <line x1="3" y1="18" x2="3" y2="18"></line>
                                        </svg>
                                    </a>
                                    <a href="javascript:;" @click="grid_type = 'grid'">
                                        <svg :class="{ 'active-view': grid_type == 'grid' }"
                                            xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round"
                                            class="feather feather-grid view-grid">
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
                        <p class="mt-2">{{ $t('bikmedia.messages.loadingGifts') }}</p>
                    </div>

                    <!-- Empty State -->
                    <div v-else-if="!loading && filterd_gifts_list.length === 0" class="text-center py-5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"
                            class="feather feather-inbox text-muted">
                            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                            <path
                                d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z">
                            </path>
                        </svg>
                        <h5 class="mt-3">{{ $t('bikmedia.table.empty.noGifts') }}</h5>
                        <p class="text-muted">{{ $t('bikmedia.table.empty.tryAdjusting') }}</p>
                    </div>

                    <div v-else class="searchable-items" :class="[grid_type]">
                        <div class="items items-header-section">
                            <div class="item-content">
                                <div class="">
                                    <h4>{{ $t('bikmedia.table.headers.gift') }}</h4>
                                </div>
                                <div class="user-email">
                                    <h4>{{ $t('bikmedia.table.headers.coins') }}</h4>
                                </div>
                                <div class="user-location">
                                    <h4 style="margin-left: 0">{{ $t('bikmedia.table.headers.type') }}</h4>
                                </div>
                                <div class="user-phone">
                                    <h4 style="margin-left: 3px">{{ $t('bikmedia.forms.level') }}</h4>
                                </div>

                                <div>

                                    <h4>{{ $t('bikmedia.table.headers.goallserver') }}</h4>
                                </div>
                                <div class="action-btn">
                                    <h4>{{ $t('bikmedia.table.headers.actions') }}</h4>
                                </div>
                            </div>
                        </div>

                        <div v-for="(gift, index) in filterd_gifts_list" class="items" :key="gift.id">
                            <div class="item-content">
                                <div class="user-profile">
                                    <img :src="gift.icon || gift.img || defaultAvatar" alt="gift"
                                        style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;" />
                                    <div class="user-meta-info">
                                        <div class="d-flex align-items-center gap-2">
                                            <p class="user-name mb-0">{{ gift.name || 'N/A' }}</p>
                                            <span v-if="gift.icons && gift.icons.length" class="badge bg-secondary">{{
                                                gift.icons.length }}</span>
                                            <button v-if="gift.icons && gift.icons.length"
                                                class="btn btn-sm btn-link p-0" title="Show sub gifts"
                                                @click="toggleSubGifts(gift)">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                                    :class="{ 'rotate-90': isExpanded(gift.id) }">
                                                    <polyline points="9 18 15 12 9 6"></polyline>
                                                </svg>
                                            </button>
                                        </div>
                                        <p class="user-work">{{ $t('bikmedia.table.headers.id') }}: {{ gift.id }}</p>
                                    </div>
                                </div>
                                <div class="user-email">
                                    <p class="info-title">{{ $t('bikmedia.table.headers.coins') }}:</p>
                                    <p class="usr-email-addr">{{ formatNumber(gift.coin) }}</p>
                                </div>
                                <div class="user-location">
                                    <p class="info-title">{{ $t('bikmedia.table.headers.type') }}:</p>
                                    <p class="usr-location">
                                        <span class="badge" :class="getTypeBadgeClass(normalizeTypeValue(gift))">{{
                                            getTypeDisplay(gift) }}</span>
                                    </p>
                                </div>
                                <div class="user-phone">
                                    <p class="info-title">{{ $t('bikmedia.forms.level') }}:</p>
                                    <p class="usr-ph-no">{{ gift.lvl || 0 }}</p>
                                </div>

                                <div class="d-flex justify-content-end">

                                    <label class="switch s-icons s-outline s-outline-primary mb-4 me-2">
                                        <input @change="handelChangeLiveServere($event, gift)" type="checkbox" />
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                                <!-- Action For the gift -->

                                <div class="action-btn">

                                    <a href="javascript:;" class="me-1" @click="handleView(gift)"
                                        :title="$t('bikmedia.table.actions.view')">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    </a>
                                    <a href="javascript:;" class="me-1" @click="handleEdit(gift)"
                                        :title="$t('bikmedia.table.actions.edit')">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round"
                                            class="feather feather-edit-2 edit">
                                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                        </svg>
                                    </a>
                                    <a href="javascript:;" class="me-1" @click="handleDelete(gift)"
                                        :title="$t('bikmedia.table.actions.delete')"
                                        :class="{ 'opacity-50': isDeleting && deletingItemId === gift.id }">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round"
                                            class="feather feather-trash-2 text-danger">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path
                                                d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                                            </path>
                                            <line x1="10" y1="11" x2="10" y2="17"></line>
                                            <line x1="14" y1="11" x2="14" y2="17"></line>
                                        </svg>
                                    </a>
                                </div>

                            </div>

                            <!-- Sub-gift carousel -->
                            <div v-if="isExpanded(gift.id)" class="w-100 px-4 py-3 bg-light border-top">
                                <SubGiftCarousel :sub-gifts="subgifts[gift.id] || []" :gift-id="gift.id"
                                    :is-visible="isExpanded(gift.id)" :is-loading="subgiftsLoading[gift.id] || false"
                                    :has-error="subgiftsError[gift.id] || false"
                                    :error-message="$t('bikmedia.components.carousel.errorLoading')"
                                    container-height="280px" card-height="200px" @retry="retrySubGifts(gift.id)" />
                            </div>
                        </div>
                    </div>

                    <!-- Pagination -->
                    <div v-if="!loading && pagination.pages > 1"
                        class="d-flex justify-content-between align-items-center mt-4 px-3 pb-3">
                        <div class="text-muted">
                            {{ $t('bikmedia.table.pagination.showing') }} {{ ((pagination.page - 1) * pagination.limit)
                                + 1 }} {{ $t('bikmedia.table.pagination.to') }} {{ Math.min(pagination.page
                                * pagination.limit, pagination.total) }} {{ $t('bikmedia.table.pagination.of') }} {{
                                pagination.total }} {{ $t('bikmedia.table.pagination.entries') }}
                        </div>
                        <nav>
                            <ul class="pagination mb-0">
                                <li class="page-item" :class="{ disabled: pagination.page === 1 }">
                                    <a class="page-link" href="javascript:;" @click="changePage(pagination.page - 1)"
                                        :disabled="pagination.page === 1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round">
                                            <polyline points="15 18 9 12 15 6"></polyline>
                                        </svg>
                                    </a>
                                </li>
                                <li v-for="page in visiblePages" :key="page" class="page-item"
                                    :class="{ active: page === pagination.page }">
                                    <a class="page-link" href="javascript:;" @click="changePage(page)">{{ page }}</a>
                                </li>
                                <li class="page-item" :class="{ disabled: pagination.page === pagination.pages }">
                                    <a class="page-link" href="javascript:;" @click="changePage(pagination.page + 1)"
                                        :disabled="pagination.page === pagination.pages">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round">
                                            <polyline points="9 18 15 12 9 6"></polyline>
                                        </svg>
                                    </a>
                                </li>
                            </ul>
                        </nav>
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

.rotate-90 {
    transform: rotate(90deg);
    transition: transform 0.2s ease-in-out;
}
</style>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import giftService from "@services/api/gift.service";
import "/src/assets/sass/apps/contacts.scss";
import { sanitizeInput, sanitizeObject } from '/src/utils/sanitize.js';
import defaultAvatar from '/src/assets/images/profile-30.png';
import SmartIcon from '@/views/bikmedia/components/SmartIcon.vue';
import SubGiftCarousel from '@/views/bikmedia/components/SubGiftCarousel.vue';

import { useMeta } from "/src/composables/use-meta";
const { t } = useI18n();
useMeta({ title: t('bikmedia.pages.gifts.title') });

const router = useRouter();

const gifts_list = ref([]);
const filterd_gifts_list = ref([]);
const search_text = ref("");
const grid_type = ref("list");
const loading = ref(false);
const expanded = ref({});
const subgifts = ref({});
const subgiftsLoading = ref({});
const subgiftsError = ref({});
const isDeleting = ref(false);
const deletingItemId = ref(null);
const switchActive = ref(null);
let searchTimeout = null;



// Filters
const filters = ref({
    lang: "en",
    search: "",
    type: null, // null for API, will display as "All Types" in select
    limit: 25,
    p: 1
});

// Pagination
const pagination = ref({
    total: 0,
    page: 1,
    limit: 25,
    pages: 1
});

onMounted(() => {
    fetchGifts();
});

// Computed for visible pagination pages
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

// Fetch gifts from API
const fetchGifts = async () => {
    loading.value = true;
    try {
        // Sanitize search input to prevent XSS attacks
        const sanitizedSearch = filters.value.search ? sanitizeInput(filters.value.search) : undefined;

        const requestParams = {
            lang: filters.value.lang,
            search: sanitizedSearch,
            limit: filters.value.limit,
            p: filters.value.p
        };

        // Only include type if it's not null
        if (filters.value.type !== null && filters.value.type !== undefined) {
            requestParams.type = filters.value.type;
        }

        // TODO: BACKEND ISSUE - The type filter is not working correctly on the API side
        // The API returns all gifts regardless of the type parameter sent
        // Tested with Postman: POST /gifts with body { type: 0 } returns all types
        // Expected: Should filter gifts by the specified type (0, 1, 2, 3, 4)
        // Please fix the backend API to properly filter by type parameter

        console.log('Fetching gifts with params:', requestParams);
        console.log('Current filters.value.type:', filters.value.type, 'Type:', typeof filters.value.type);

        const response = await giftService.getAll(requestParams);

        console.log('API Response:', response);

        // Extract items from response.items (now correctly transformed)
        gifts_list.value = response.items || [];
        filterd_gifts_list.value = gifts_list.value;

        // Update pagination from response.pagination (now correctly transformed)
        pagination.value = {
            total: response.pagination?.total || 0,
            page: response.pagination?.page || 1,
            limit: response.pagination?.limit || filters.value.limit,
            pages: response.pagination?.pages || 1
        };

        // Update filters.p to match current page
        filters.value.p = pagination.value.page;

        console.log('Gifts loaded:', gifts_list.value.length, 'items, Total:', pagination.value.total);
    } catch (error) {
        console.error("Failed to fetch gifts:", error);
        showMessage(error.message || t('bikmedia.messages.errors.loadGifts'), "error");
        gifts_list.value = [];
        filterd_gifts_list.value = [];
    } finally {
        loading.value = false;
    }
};

// Handle search input with debounce
const onSearchInput = () => {
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }

    searchTimeout = setTimeout(() => {
        // Sanitize search input before storing in filters
        filters.value.search = sanitizeInput(search_text.value);
        filters.value.p = 1; // Reset to first page
        fetchGifts();
    }, 500); // 500ms debounce
};

onBeforeUnmount(() => {
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }
});

// Change page
const changePage = (page) => {
    if (page < 1 || page > pagination.value.pages || page === pagination.value.page) {
        return;
    }
    filters.value.p = page;
    fetchGifts();
};

// Handle limit change
const onLimitChange = () => {
    filters.value.p = 1; // Reset to first page when changing limit
    fetchGifts();
};

// Handle type filter change
const onTypeFilterChange = async (event) => {
    const selectedValue = event.target.value;

    console.log('Selected value from dropdown:', selectedValue);

    // Convert empty string to null for API, otherwise convert to number
    if (selectedValue === '') {
        filters.value.type = null;
    } else {
        filters.value.type = Number(selectedValue);
    }

    console.log("After conversion, filter type is:", filters.value.type);

    filters.value.p = 1; // Reset to first page

    await nextTick();
    console.log("After nextTick, filter type is:", filters.value.type);

    fetchGifts();
};

// Normalize numeric type from API item
const normalizeTypeValue = (gift) => {
    const raw = gift?.type;
    const n = Number(raw);
    return Number.isFinite(n) ? n : 0;
};

// Helper function to get type label (fallback)
const getTypeLabel = (type) => {
    const typeLabels = {
        0: 'Default',
        1: 'Standard',
        2: 'Premium',
        3: 'Video',
        4: 'Special'
    };
    return typeLabels[type] || `Type ${type}`;
};

// Prefer backend-provided typeName when present
const getTypeDisplay = (gift) => {
    if (gift && typeof gift.typeName === 'string' && gift.typeName.trim() !== '') {
        return gift.typeName;
    }
    return getTypeLabel(normalizeTypeValue(gift));
};

// Helper function to get badge class for type
const getTypeBadgeClass = (type) => {
    const badgeClasses = {
        0: 'badge bg-secondary',
        1: 'badge bg-primary',
        2: 'badge bg-success',
        3: 'badge bg-warning text-dark',
        4: 'badge bg-info text-dark'
    };
    return badgeClasses[type] || 'badge bg-secondary';
};

// Helper function to format numbers with commas
const formatNumber = (num) => {
    if (!num) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Navigation handlers
const handleCreate = () => {
    router.push({ name: 'gift-create' });
};

const handleView = (gift) => {
    if (!gift || !gift.id) {
        showMessage(t('bikmedia.messages.errors.invalidGiftId'), 'error');
        return;
    }
    router.push({ name: 'gift-view', params: { id: gift.id } });
};

const handleEdit = (gift) => {
    if (!gift || !gift.id) {
        showMessage(t('bikmedia.messages.errors.invalidGiftId'), 'error');
        return;
    }
    router.push({ name: 'gift-edit', params: { id: gift.id } });
};

// Collapsible subgifts logic
const isExpanded = (id) => {
    return !!expanded.value[id];
};

const toggleSubGifts = async (gift) => {
    if (!gift?.id) return;
    const id = gift.id;
    // Toggle state
    expanded.value[id] = !expanded.value[id];
    // If expanding and not loaded yet, fetch subgifts
    if (expanded.value[id] && !subgifts.value[id]) {
        await fetchSubGifts(id);
    }
};

const fetchSubGifts = async (id) => {
    subgiftsLoading.value[id] = true;
    try {
        subgiftsError.value[id] = false;
        const { item: { list } } = await giftService.getById(id);
        console.log("Item form sercice", list)
        const one = list?.find?.(g => g.id === Number(id)) || item?.one || item || {};
        console.log("helloe m => ", one)
        subgifts.value[id] = one?.icons || [];
    } catch (e) {
        console.error('Failed to fetch sub-gifts:', e);
        subgiftsError.value[id] = true;
        subgifts.value[id] = [];
    } finally {
        subgiftsLoading.value[id] = false;
    }
};

const retrySubGifts = async (giftId) => {
    await fetchSubGifts(giftId);
};

// update live servire status
const handelChangeLiveServere = async (event, gift) => {

    // will make an update request to update with the new value all the givt but mutating the live server pro-
    if (!event || !gift) {
        showMessage(
            "No Gift Value nor A switch",
            "warning"

        );
    }


    const _chekced = event.target?.checked;

    gift.goLiveAllServer = Boolean(_chekced);

    const response = await giftService.update(gift.id, gift);

    // now we need to get the value from the change

    if (response && response.raw.err === null) {
        const { item: { one } } = response;
        console.log(one);
        // now show the update message
        showMessage(`The Gift ${one.name} has been set to ${_chekced ? 'view' : 'disable'}  All server`);
    }


}

// Delete functionality
const handleDelete = async (gift) => {
    if (!gift || !gift.id) {
        showMessage(t('bikmedia.messages.errors.invalidGiftId'), 'error');
        return;
    }

    const result = await window.Swal.fire({
        title: t('bikmedia.messages.confirmations.deleteGift'),
        html: `<div class="text-center"><h4 class="mb-3">${gift.name || 'Gift #' + gift.id}</h4><p class="text-muted">${t('bikmedia.messages.confirmations.cannotUndo')}</p></div>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: t('bikmedia.actions.delete'),
        confirmButtonColor: '#dc3545',
        cancelButtonText: t('bikmedia.actions.cancel'),
        reverseButtons: true
    });

    if (result.isConfirmed) {
        await performDelete(gift.id);
    }
};

const performDelete = async (itemId) => {
    try {
        isDeleting.value = true;
        deletingItemId.value = itemId;

        const response = await giftService.delete(itemId);

        // Check for success based on API response structure
        if (response.data?.code === 200 && response.data?.err === null && response.data?.data?.success === 1) {
            showMessage(t('bikmedia.messages.success.giftDeleted'), 'success');
            // Refresh the list
            await fetchGifts();
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
