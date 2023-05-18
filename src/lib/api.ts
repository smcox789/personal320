import { AUTH } from "./auth"

// Returns common headers for all API calls.
function buildBaseHeaders() {
  const headers = new Headers()

  // Check if user is authenticated.
  const token = AUTH.get()
  if (token != undefined) {
    // If the user is authenticated, add it to the headers.
    headers.set("Authorization", `Bearer ${token}`)
  }

  return headers
}

// Helper function for all GET requests.
function get(pathname: string) {
  const headers = buildBaseHeaders()

  return fetch(`http://localhost:3000${pathname}`, {
    method: "GET",
    headers,
  })
}

// Helper function for all POST requests.
function post(pathname: string, body: Record<string, any>) {
  const headers = buildBaseHeaders()

  // POST requests for our API are all JSON.
  headers.set("Content-Type", "application/json")

  return fetch(`http://localhost:3000${pathname}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  })
}

// Full API specification for the backend.
export const API = {
  // Submit a student application.
  async submitStudentApplication(body: {
    email: string
    CS320taken: boolean
    references: string[]
    cs320grade: string
    preference: string[]
  }) {
    const response = await post("/studentApps/submit", body)
    return await response.json()
  },

  // Retrieve all student applications.
  async getAllStudentApplications() {
    const response = await get("/studentApps/allApplications")
    return await response.json()
  },

  // Accept or reject an application.
  async accept(body: {
    accept: boolean
    studEmail: string
    profEmail: string
  }) {
    const response = await post("/accept", body)
    return await response.json()
  },

  // Change capacity of a section.
  async changeCap(body: { capChange: number; profEmail: string }) {
    const response = await post("/changeCap", body)
    return await response.text()
  },

  // Get all sections.
  async getSections() {
    const response = await get("/sections")
    return await response.json()
  },

  // Get the manager pool.
  async getManagerPool() {
    const response = await get("/manager-pool")
    return await response.json()
  },

  // Get user information.
  async getProfile() {
    const response = await get("/profile")
    return await response.json()
  },

  // Login.
  async signin(body: any) {
    const response = await post("/signin", body)
    return await response.json()
  },
}
