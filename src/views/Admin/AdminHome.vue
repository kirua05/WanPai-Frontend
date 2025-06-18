<script setup>
  import InputText from '@/volt/InputText.vue'
  import Menu from '@/volt/Menu.vue'
  import { ref } from 'vue'
  const search = ref('')
  const items = ref([
    {
      label: '商品列表',
      icon: 'pi pi-palette',
      route: '/admin/products',
    },
    {
      label: '訂單管理',
      icon: 'pi pi-palette',
      route: '/admin/orders',
    },
    {
      label: '庫存管理',
      icon: 'pi pi-palette',
      route: '/admin/inventory',
    },
  ])
</script>

<template>
  <header class="w-full fixed top-0 left-0 right-0 p-4 z-20 bg-amber-950">
    <div class="w-2/3 flex justify-between items-center">
      <div>
        <img src="" alt="logo" />
      </div>
      <div>
        <InputText
          v-model="search"
          type="text"
          placeholder=" 搜尋"
          :pt="{ root: 'w-lg text-white p-2 outline rounded-lg' }"
        />
      </div>
    </div>
  </header>

  <div class="w-3xs fixed top-20 left-2">
    <Menu :model="items" class="h-screen">
      <template #item="{ item, props }">
        <router-link
          v-if="item.route"
          v-slot="{ href, navigate }"
          :to="item.route"
          custom
        >
          <a :href="href" v-bind="props.action" @click="navigate">
            <span>{{ item.label }}</span>
          </a>
        </router-link>
      </template>
    </Menu>
  </div>
  <div class="mt-16 ml-80">
    <router-view />
  </div>
</template>
