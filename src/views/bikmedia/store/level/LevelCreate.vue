<template>
  <div class="layout-px-spacing level-create">
    <!-- Breadcrumb Navigation -->
    <teleport to="#breadcrumb">
      <ul class="navbar-nav flex-row">
        <li>
          <div class="page-header">
            <nav class="breadcrumb-one" aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="javascript:;" @click="router.push('/store/levels')">{{ $t('bikmedia.navigation.breadcrumb.store') }}</a></li>
                <li class="breadcrumb-item"><a href="javascript:;" @click="router.push('/store/levels')">{{ $t('bikmedia.navigation.breadcrumb.levels') }}</a></li>
                <li class="breadcrumb-item active" aria-current="page"><span>{{ $t('bikmedia.navigation.breadcrumb.create') }}</span></li>
              </ol>
            </nav>
          </div>
        </li>
      </ul>
    </teleport>

    <!-- Not Supported Message -->
    <div class="row layout-top-spacing layout-spacing">
      <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
        <div class="doc-container">
          <div class="text-center py-5">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-warning">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h5 class="mt-3">{{ $t('bikmedia.messages.errors.operationNotSupported') }}</h5>
            <p class="text-muted">{{ $t('bikmedia.messages.errors.levelCreateNotSupported') }}</p>
            <button class="btn btn-primary" @click="router.push('/store/levels')">
              {{ $t('bikmedia.actions.backToList') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useMeta } from '@/composables/use-meta';

// i18n
const { t } = useI18n();

// Meta
useMeta({ title: t('bikmedia.pages.levels.create.title') });

// Router
const router = useRouter();
</script>

<style scoped>
/* Component-specific styles */
</style>