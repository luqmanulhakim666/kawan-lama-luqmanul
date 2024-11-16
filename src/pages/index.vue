<template>
  <UContainer class="my-6">
    <p class="text-center" v-if="authStore.getLoading()">...loading</p>

    <div v-if="!authStore.getLoading()">
      <TodoForm
        :state="formState"
        @submit="handleAddTodo"
        :loading="todoStore.getLoading()"
        :fetchLoading="todoStore.getFetchLoading()"
      />
      <TodoList
        :todos="filteredTodos"
        :selectedTodos="selectedTodos"
        :isAllSelected="isAllSelected"
        :allDone="allDone"
        :loading="todoStore.getLoading()"
        :fetchLoading="todoStore.getFetchLoading()"
        @toggleSelectAll="toggleSelectAll"
        @deleteSelected="deleteSelectedTodos"
        @markSelectedDone="markSelectedAsDone"
      />
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/authStore'
import { useTodoStore } from '~/stores/todoStore'

const authStore = useAuthStore()
const todoStore = useTodoStore()

const formState = reactive({
  subject: '',
  description: ''
})

const selectedTodos = reactive(new Set<string>())

definePageMeta({
  middleware: 'auth'
})

onMounted(() => {
  authStore.getMe()
  todoStore.fetchTodos()
})

const isAllSelected = computed(() => {
  return (
    todoStore.todos.length > 0 &&
    selectedTodos.size ===
      todoStore.todos.filter((todo) => todo.status !== 'done').length
  )
})

const allDone = computed(() =>
  todoStore.todos.every((todo) => todo.status === 'done')
)

const filteredTodos = computed(() => {
  return todoStore.todos.filter((todo) => todo.status !== 'canceled')
})

const handleAddTodo = () => {
  todoStore.addTodo(formState.subject, formState.description)
  formState.subject = ''
  formState.description = ''
}

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedTodos.clear()
  } else {
    todoStore.todos
      .filter((todo) => todo.status !== 'done')
      .forEach((todo) => selectedTodos.add(todo.activityNo))
  }
}

const deleteSelectedTodos = () => {
  selectedTodos.forEach((activityNo) => {
    todoStore.deleteTodo(activityNo)
    selectedTodos.delete(activityNo)
  })
}

const markSelectedAsDone = () => {
  selectedTodos.forEach((activityNo) => {
    todoStore.markAsDone(activityNo)
    selectedTodos.delete(activityNo)
  })
}
</script>
