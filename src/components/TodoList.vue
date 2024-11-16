<template>
  <div class="mx-auto" v-if="!fetchLoading">
    <h1 class="text-2xl font-bold mb-4 text-gray-700">To-Do List</h1>
    <UCard class="p-6 bg-white shadow-lg rounded-lg">
      <!-- ...existing Select All and Action Buttons... -->
      <div class="flex items-center space-x-4 mb-4">
        <UCheckbox
          v-if="todoStore.todos.length > 0 && !todoStore.allDone"
          :checked="todoStore.isAllSelected"
          @change="todoStore.toggleSelectAll"
          class="text-indigo-600"
          :label="!todoStore.isAllSelected ? 'Select All' : 'Unselect All'"
        >
          Select All
        </UCheckbox>

        <UButton
          v-if="todoStore.selectedTodos.length > 0"
          icon="i-heroicons-check-circle"
          @click="markSelectedAsDone"
          color="primary"
          size="sm"
        >
          Mark Selected as Done
        </UButton>

        <UButton
          v-if="todoStore.selectedTodos.length > 0"
          icon="i-heroicons-trash"
          @click="deleteSelectedTodos"
          color="red"
          size="sm"
        >
          Delete Selected
        </UButton>
      </div>

      <div v-if="todoStore.todos.length > 0">
        <hr />
        <div
          v-for="todo in todoStore.todos"
          :key="todo.id"
          class="flex flex-col space-y-4 p-4 border-b border-gray-200 hover:bg-gray-50 transition duration-200"
        >
          <div v-if="!todo.isEditing" class="flex items-center justify-between">
            <!-- Display content when not in editing mode -->
            <div class="flex items-center space-x-4">
              <UCheckbox
                v-if="todo.status !== 'done'"
                :value="todo.id"
                :checked="todoStore.selectedTodos.includes(todo)"
                @change="todoStore.selectTodo(todo.id)"
                class="text-indigo-600 mr-2"
              />
              <div>
                <div class="flex items-center">
                  <h2 class="text-lg font-semibold text-gray-800">
                    {{ todo.subject }}
                  </h2>
                  <UIcon
                    v-if="todo.status === 'done'"
                    style="color: green"
                    name="i-heroicons-check-circle"
                    class="w-5 h-5 ml-2 text-orange-5"
                  />
                </div>
                <p class="text-sm text-gray-600">{{ todo.description }}</p>
                <p class="text-xs text-gray-400">
                  Activity No: {{ todo.activityNo }}
                </p>
              </div>
            </div>

            <div class="space-y-1 text-right">
              <UButton
                icon="i-heroicons-pencil"
                v-if="todo.status === 'unmarked'"
                @click="startEditing(todo)"
                color="teal"
              />
              <UButton
                icon="i-heroicons-arrow-uturn-left"
                v-if="todo.status === 'done'"
                @click="todoStore.markAsCanceled(todo.id)"
                color="orange"
                size="xs"
                class="text-sm font-semibold"
              >
                Undo
              </UButton>
            </div>
          </div>

          <!-- Edit Mode -->
          <div v-else class="space-y-4">
            <UForm
              :state="todo"
              :schema="editTodoSchema"
              class="space-y-4"
              @submit="saveEdit(todo)"
            >
              <UFormGroup label="Edit Subject">
                <UInput v-model="todo.tempSubject" />
              </UFormGroup>
              <UFormGroup label="Edit Description">
                <UTextarea v-model="todo.tempDescription" />
              </UFormGroup>

              <div class="flex space-x-2">
                <UButton
                  :disabled="!todo.tempSubject"
                  type="submit"
                  color="green"
                  :loading="loading"
                >
                  Save
                </UButton>
                <UButton color="gray" @click="cancelEdit(todo)">
                  Cancel
                </UButton>
              </div>
            </UForm>
          </div>
        </div>
      </div>
      <p v-else class="text-gray-500 text-center">
        <img
          class="img-empty text-center flex m-auto"
          src="/assets/images/empty.svg"
          alt=""
        />
        No to-do items found. Add a new to-do above.
      </p>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTodoStore } from '~/stores/todoStore'
import { defineProps, defineEmits } from 'vue'
import { editTodoSchema } from '/schemas/todoSchemas'

const props = defineProps({
  state: Object,
  schema: Object,
  loading: Boolean,
  fetchLoading: Boolean
})

const todoStore = useTodoStore()

const startEditing = (todo: any) => {
  // Store current values before editing
  todo.isEditing = true
  todo.tempSubject = todo.subject
  todo.tempDescription = todo.description
}

const saveEdit = (todo: any) => {
  // Save the changes
  todoStore.editTodo(todo.id, todo.tempSubject, todo.tempDescription)
  todo.isEditing = false
}

const cancelEdit = (todo: any) => {
  // Revert to original values
  todo.tempSubject = todo.subject
  todo.tempDescription = todo.description
  todo.isEditing = false
}

const markSelectedAsDone = () => {
  todoStore.selectedTodos.forEach((id: string) => {
    todoStore.markAsDone(id)
  })
  todoStore.clearSelectedTodos()
}

const deleteSelectedTodos = () => {
  todoStore.selectedTodos.forEach((id: string) => {
    todoStore.deleteTodo(id)
  })
  todoStore.clearSelectedTodos()
}
</script>

<style scoped>
.img-empty {
  max-width: 300px;
}
</style>
