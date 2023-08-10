import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useMenusStore = defineStore('menus', () => {
  const page = ref(0)
  // const doubleCount = computed(() => count.value * 2)

  return { page }
})
