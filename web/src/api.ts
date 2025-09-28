import axios from "axios"

const baseURL = import.meta.env.VITE_API_BASE || "http://localhost:3000/api"
export const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export async function login(email: string, password: string) {
  const { data } = await api.post("/auth/login", { email, password })
  localStorage.setItem("token", data.access_token)
  return data
}

export async function getItems(): Promise<import("./types").Item[]> {
  const { data } = await api.get("/items")
  return data
}

export async function getLocations(): Promise<import("./types").Location[]> {
  const { data } = await api.get("/locations")
  return data
}

export async function createMovement(payload: Partial<import("./types").Movement>) {
  const { data } = await api.post("/movements", payload)
  return data
}

export async function getMovements(params?: Record<string, any>): Promise<import("./types").Movement[]> {
  const { data } = await api.get("/movements", { params })
  return data
}

export function logout() {
  localStorage.removeItem("token")
  window.location.reload()
}
