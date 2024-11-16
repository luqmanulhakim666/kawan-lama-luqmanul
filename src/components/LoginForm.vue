<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
      <h2 class="text-2xl font-semibold text-center text-gray-700">Login</h2>
      <UForm
        :schema="userLoginSchema"
        :state="state"
        @submit.prevent="handleLogin"
        class="space-y-4"
      >
        <UFormGroup label="Email" name="email">
          <UInput v-model="state.email" />
        </UFormGroup>

        <UFormGroup label="Password" name="password">
          <UInput v-model="state.password" type="password" />
        </UFormGroup>

        <div>
          <UButton
            :loading="getLoading()"
            type="submit"
            color="primary"
            block
            label="Login"
          />
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-600">
            Don’t have an account?
            <NuxtLink to="/register" class="text-indigo-600 hover:underline"
              >Register here</NuxtLink
            >
          </p>
        </div>
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/authStore'
import { userLoginSchema } from '~/schemas/authSchemas'

const { login, getLoading, error } = useAuthStore()

const state = reactive({
  email: undefined,
  password: undefined
})

const router = useRouter()

const handleLogin = async (): Promise<void> => {
  try {
    const res = await login(state.email, state.password)

    if (res.data?.error) {
      alert(res.data.error)
      return
    }

    router.push('/')
  } catch (e) {
    console.log(e)
  }
}
</script>
