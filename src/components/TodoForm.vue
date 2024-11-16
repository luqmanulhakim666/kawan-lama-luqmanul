<template>
  <div class="mx-auto">
    <UCard class="mb-8 bg-white shadow-md rounded-lg">
      <h1 class="text-2xl font-bold mb-4 text-gray-700">To-Do</h1>
      <UForm
        :state="state"
        :schema="addTodoSchema"
        class="space-y-4"
        @submit="handleSubmit"
      >
        <UFormGroup label="Subject" name="subject">
          <UInput v-model="state.subject" placeholder="Enter subject" />
        </UFormGroup>
        <UFormGroup label="Description" name="description">
          <UTextarea
            v-model="state.description"
            placeholder="Enter description"
          />
        </UFormGroup>
        <UButton
          :loading="loading"
          type="submit"
          color="primary"
          size="lg"
          block
        >
          <div class="flex items-center justify-center">
            <UIcon name="i-heroicons-plus-circle" class="mr-1 w-5 h-5" />
            <span class="font-bold">Submit</span>
          </div>
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { addTodoSchema } from '/schemas/todoSchemas'

const props = defineProps({
  state: Object,
  schema: Object,
  loading: Boolean
})

const emit = defineEmits(['addToDo'])

const handleSubmit = () => {
  emit('addToDo')
}
</script>
