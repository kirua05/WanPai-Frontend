<script setup>
import { useRouter } from 'vue-router'
import Button from 'primevue/button'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.go(-1)
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 flex items-center justify-center px-4 py-8">
    <div class="max-w-lg w-full text-center -mt-16">
      <div class="bg-surface-0 rounded-xl shadow-lg border border-surface-200 p-6 md:p-8">
        <div class="mb-6">
          <h1 class="text-6xl md:text-8xl font-bold text-primary-500 leading-none tracking-tight">
            404
          </h1>
        </div>
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-surface-900 mb-3">
            糟糕！頁面不見了
          </h2>
          <p class="text-surface-600 mb-2">
            您尋找的頁面可能已經移動、刪除或輸入了錯誤的網址
          </p>
        </div>
        <div class="flex flex-col sm:flex-row gap-3 justify-center mb-4">
          <Button
            @click="goHome"
            icon="pi pi-home"
            label="返回首頁"
            class="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 font-medium shadow-md hover:shadow-lg transition-all duration-200"
          />
          <Button
            @click="goBack"
            icon="pi pi-arrow-left"
            label="返回上頁"
            outlined
            class="border border-primary-500 text-primary-500 hover:bg-primary-50 px-6 py-2 font-medium transition-all duration-200"
          />
        </div>
        <div class="text-surface-400 text-sm">
          <p>錯誤代碼：404 | 頁面未找到</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 640px) {
  .text-6xl {
    font-size: 4rem;
  }
}
</style>
