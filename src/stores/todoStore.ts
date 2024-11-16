import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Todo } from '@/types/todoTypes'

export const useTodoStore = defineStore('todoStore', () => {
  const axios: any = useNuxtApp().$axios
  const todos = ref([] as Todo[])
  const selectedTodos = ref([] as string[])
  const loading = ref(false)
  const fetchLoading = ref(false)

  // Get all todos for the authenticated user
  const fetchTodos = async () => {
    try {
      fetchLoading.value = true
      const response = await axios.get('/todos')
      todos.value = response.data
    } catch (error) {
      console.error('Error fetching todos:', error)
    } finally {
      fetchLoading.value = false
    }
  }

  // Add a new Todo
  const addTodo = async (subject: string, description: string) => {
    try {
      loading.value = true
      const response = await axios.post('/todos', { subject, description })
      todos.value.push(response.data)
    } catch (error) {
      console.error('Error adding todo:', error)
    } finally {
      loading.value = false
    }
  }

  // Mark a Todo as done
  const markAsDone = async (id: string) => {
    const todo = todos.value.find((t) => t.id === id)
    if (todo) {
      try {
        loading.value = true
        const response = await axios.put(`/todos/${todo.id}`, {
          status: 'done'
        })
        todo.status = response.data.status
      } catch (error) {
        console.error('Error marking todo as done:', error)
      } finally {
        loading.value = false
      }
    }
  }

  // Mark a Todo as canceled
  const markAsCanceled = async (id: string) => {
    const todo = todos.value.find((t) => t.id === id)
    if (todo) {
      try {
        loading.value = true

        const response = await axios.put(`/todos/${todo.id}`, {
          status: 'canceled'
        })
        todo.status = response.data.status
      } catch (error) {
        console.error('Error marking todo as canceled:', error)
      } finally {
        loading.value = false
      }
    }
  }

  // Edit a Todo
  const editTodo = async (
    id: string,
    subject: string,
    description: string,
    icon?: string
  ) => {
    const todo = todos.value.find((t) => t.id === id)

    if (todo && todo.status === 'unmarked') {
      try {
        loading.value = true

        const response = await axios.put(`/todos/${todo.id}`, {
          subject,
          description,
          icon
        })
        todo.subject = response.data.subject
        todo.description = response.data.description
        todo.icon = response.data.icon
      } catch (error) {
        console.error('Error editing todo:', error)
      } finally {
        loading.value = false
      }
    }
  }

  // Delete a Todo
  const deleteTodo = async (id: string) => {
    console.log('fored')
    const todo = todos.value.find((t) => t.id === id)
    if (todo) {
      try {
        loading.value = true

        await axios.delete(`/todos/${todo.id}`)
        todos.value = todos.value.filter((t) => t.id !== id)
      } catch (error) {
        console.error('Error deleting todo:', error)
      } finally {
        loading.value = false
      }
    }
  }

  // Select Todo
  const selectTodo = (id: string) => {
    if (selectedTodos.value.includes(id)) {
      selectedTodos.value = selectedTodos.value.filter((id) => id !== id)
    } else {
      selectedTodos.value.push(id)
    }
  }

  // Toggle Select All
  const toggleSelectAll = () => {
    if (isAllSelected.value) {
      selectedTodos.value = []
    } else {
      selectedTodos.value = todos.value
        .filter((todo) => todo.status !== 'done')
        .map((todo) => todo.id)
    }
  }

  // Clear Selected Todos
  const clearSelectedTodos = () => {
    selectedTodos.value = []
  }

  // Getters
  const isAllSelected = computed(() => {
    return (
      todos.value.length > 0 &&
      selectedTodos.value.length ===
        todos.value.filter((todo) => todo.status !== 'done').length
    )
  })

  const allDone = computed(() =>
    todos.value.every((todo) => todo.status === 'done')
  )

  // Getters
  const getLoading = () => loading.value
  const getFetchLoading = () => fetchLoading.value

  return {
    todos,
    selectedTodos,
    addTodo,
    markAsDone,
    markAsCanceled,
    editTodo,
    deleteTodo,
    selectTodo,
    toggleSelectAll,
    clearSelectedTodos,
    fetchTodos,
    getLoading,
    getFetchLoading,
    isAllSelected,
    allDone
  }
})
