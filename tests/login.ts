import React from 'react'
import { render, fireEvent, waitFor } from "@testing-library/react"
import index from "@/pages"
import { handleSubmit } from "@/pages/index"
import { useRouter } from "next/router"
import router from "next/dist/server/router"
import signin from "@/lib/api"

// Mock the API functions used in the component
jest.mock("@/lib/api", () => ({
  signin: jest.fn(),
}))

//  the useRouter hook
// jest.mock("next/router", () => ({
//   useRouter: () => ({
//     push: jest.fn().mockResolvedValueOnce("default"),
//     reload: jest.fn(),
//   }),
// }))

describe("Login", () => {
  it("submits the login form and redirects to the appropriate dashboard", async () => {
    
    const { getByLabelText, getByText } = render(<index/>)
    const usernameInput = getByLabelText("username")
    const passwordInput = getByLabelText("password")
    const loginButton = getByText("Login")

    const fakeAccessToken = "fake-access-token"
    const fakeIsStudent = true

    // Mock the successful login response
    signin.mockResolvedValueOnce({
      access_token: fakeAccessToken,
      isStudent: fakeIsStudent,
    })

    fireEvent.change(usernameInput, { target: { value: "testuser" } })
    fireEvent.change(passwordInput, { target: { value: "testpassword" } })
    fireEvent.click(loginButton)

    await waitFor(() => {
      expect().toHaveBeenCalledWith({
        email: "testuser",
        password: "testpassword",
      })
    })

    expect(document.cookie).toContain(`access_token=${fakeAccessToken}`)

    // Check if the appropriate router.push function was called
    if (fakeIsStudent) {
      expect(router.push).toHaveBeenCalledWith({
        pathname: "/studentdashboard",
      })
    } else {
      expect(router.push).toHaveBeenCalledWith({
        pathname: "/dashboard",
      })
    }

    // Check if router.reload was called
    expect(router.reload).toHaveBeenCalled()
  })
})
