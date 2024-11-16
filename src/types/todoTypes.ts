export interface Todo {
  id: string
  activityNo: string
  subject: string
  description: string
  status: 'unmarked' | 'done' | 'canceled'
}
