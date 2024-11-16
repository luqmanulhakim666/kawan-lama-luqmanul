export default defineNuxtRouteMiddleware((to, from) => {
  const cookies = useCookie('token')

  // Check if the authToken cookie exists
  if (!cookies.value) {
    // If no auth token, redirect to login page
    return navigateTo('/login')
  }
})
