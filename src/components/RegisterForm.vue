<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
      <h2 class="text-2xl font-semibold text-center text-gray-700">Register</h2>

      <UForm
        :state="state"
        :schema="userRegisterSchema"
        @submit="handleRegister"
        class="space-y-4"
      >
        <!-- Username Input -->
        <UFormGroup label="Full Name" name="name">
          <UInput v-model="state.name" />
        </UFormGroup>

        <UFormGroup label="Email" name="email">
          <UInput v-model="state.email" />
        </UFormGroup>

        <UFormGroup label="Password" name="password">
          <UInput v-model="state.password" type="password" />
        </UFormGroup>

        <UButton type="submit" label="Register" block :loading="getLoading()" />

        <!-- Login Link -->
        <div class="text-center">
          <p class="text-sm text-gray-600">
            Already have an account?
            <NuxtLink to="/login" class="text-indigo-600 hover:underline">
              Login here
            </NuxtLink>
          </p>
        </div>
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/authStore'
import { userRegisterSchema } from '~/schemas/authSchemas'

const { register, getLoading, error } = useAuthStore()

const state = reactive({
  name: undefined,
  email: undefined,
  password: undefined
})

const router = useRouter()

const handleRegister = async (): Promise<void> => {
  try {
    const res = await register(state.name, state.email, state.password)

    if (res.data?.error) {
      alert(res.data.error)
      return
    }

    router.push('/login')
  } catch (e) {
    console.log(e)
  }
}
</script>
