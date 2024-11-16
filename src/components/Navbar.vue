<template>
  <div class="bg-gray-300 py-4">
    <UContainer>
      <div class="flex justify-between">
        <p class="text-lg font-bold">Kawan Lama</p>
        <div class="flex items-center space-x-4">
          <div v-if="user" class="flex flex-col items-start">
            <p class="text-sm font-semibold">{{ user.name }}</p>
            <p class="text-xs text-gray-500">{{ user.email }}</p>
          </div>
          <UButton @click="logout" color="red" size="sm">Logout</UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useAuthStore } from '~/stores/authStore'
import { storeToRefs } from 'pinia'

export default defineComponent({
  setup() {
    const authStore = useAuthStore()
    const { user } = storeToRefs(authStore)

    const logout = () => {
      authStore.logout()
    }

    return {
      user,
      logout
    }
  }
})
</script>
