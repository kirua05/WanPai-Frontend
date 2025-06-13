<script setup>
  import Tabs from '@/volt/Tabs.vue'
  import TabList from '@/volt/TabList.vue'
  import Tab from '@/volt/Tab.vue'
  import TabPanels from '@/volt/TabPanels.vue'
  import TabPanel from '@/volt/TabPanel.vue'
  import DataTable from '@/volt/DataTable.vue'
  import Column from 'primevue/column'
  import { ref, computed } from 'vue'

  const selectedRows = ref([])
  const activeTab = ref('all')
  const filteredData = computed(() => {
    return activeTab.value === 'all'
      ? props.value
      : props.value.filter((item) => item.status === activeTab.value)
  })

  const props = defineProps({
    tabs: {
      type: Array,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
    value: {
      type: Array,
      required: true,
    },
    scrollable: { type: Boolean, default: true },
    scrollHeight: { type: String, default: '500px' },
    selectable: { type: Boolean, default: true },
  })
</script>

<template>
  <div class="card">
    <Tabs v-model:value="activeTab">
      <TabList>
        <Tab v-for="tab in tabs" :key="tab.title" :value="tab.value">
          {{ tab.title }}
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel v-for="tab in tabs" :key="tab.value" :value="tab.value">
          <div class="card">
            <DataTable
              v-model:selection="selectedRows"
              :value="filteredData"
              removable-sort
              data-key="id"
              scrollable
              scroll-height="500px"
            >
              <Column
                selection-mode="multiple"
                header-style="width: 3rem"
              ></Column>
              <Column
                v-for="col in columns"
                :key="col.field"
                :field="col.field"
                :header="col.header"
                :sortable="col.sortable"
                :style="col.style"
              >
                <template #body="slotProps">
                  <slot :name="`body-${col.field}`" :data="slotProps.data">
                    {{ slotProps.data[col.field] }}
                  </slot>
                </template>
              </Column>
            </DataTable>
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>
