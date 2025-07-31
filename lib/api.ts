import axios from 'axios'
import { useAuthStore } from '../store/auth'

const api = axios.create({
  baseURL: 'http://localhost:8000',
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().session?.access_token
  //console.log('Token before request:', token)
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


// THREADS
export async function getThreads() {
  const response = await api.get('/api/emails/threads/')
  return response.data
}

export async function getThreadById(threadId) {
  const response = await api.get(`/api/emails/threads/${threadId}/`)
  return response.data
}

// Attachments
export async function listAttachments() {
  const response = await api.get('/api/emails/attachments/')
  return response.data
}

export async function getAttachmentById(attachmentId) {
  const response = await api.get(`/api/emails/attachments/${attachmentId}/`)
  return response.data
}

export async function downloadAttachmentById(attachmentId) {
  const response = await api.get(`/api/emails/attachments/${attachmentId}/download`)
  return response.data
}


// EMAILS
export async function listEmails() {
  const response = await api.get('/api/emails/')
  return response.data
}

// CONTACTS
export async function listContacts() {
  const response = await api.get('/api/users/contacts/')
  return response.data
}

export async function getContact(id: string) {
  const response = await api.get(`/api/users/contacts/${id}/`)
  return response.data
}

export async function getEmailsForContact(id: string) {
  const response = await api.get(`/api/users/contacts/${id}/emails/`)
  return response.data
}

// USER PROFILE
export async function getUserProfile() {
  const response = await api.get('/api/users/')
  return response.data
}

export default api
