import React, { useState } from "react"
import styles from "@/styles/login.module.css"
import { useMutation } from "react-query"
import { useRouter } from "next/router"
import { AUTH } from "@/lib/auth"
import { API } from "@/lib/api"

// The home page is the login screen. This is the entry point of the application.
// The user is directed to the student or professor dashboard on successful login.
export default function Home() {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const studentDashboard = "/studentdashboard"
  const profDashboard = "/dashboard"
  //retrieval of components

  const mutation = useMutation({
    mutationFn: API.signin,
    onSuccess: async (data) => {
      // Invalidate and refetch
      AUTH.set(data.access_token)

      // If the user is a student, we redirect to the student dashboard.
      // Otherwise, redirect to the student dashboard.
      const pathname = data.isStudent ? studentDashboard : profDashboard

      router.push({ pathname }).then(() => {
        router.reload()
      })
    },
    onError: (error: any) => {
      //error handler
      setErrorMessage(error.response.data.message)
    },
  })

  //setting username
  const handleUsernameChange = (event: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setUsername(event.target.value)
  }

  //setting password
  const handlePasswordChange = (event: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setPassword(event.target.value)
  }

  //storage
  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    return mutation.mutate({
      email: username,
      password: password,
    })
  }

  return (
    //HTML hard code for login page structures using the login.modules.css file
    <>
      <main className={styles.body}>
        <p>
          <title>CS320 Geocities Login GUI</title>
        </p>
        <form onSubmit={handleSubmit}>
          <div className={styles.center}>
            <div className={styles.wrapper}>
              <h2>Sign-In</h2>
              <br />
              <div className={styles.username}>
                <h3>Username</h3>
                <input
                  id="myUsername"
                  defaultValue={"username"}
                  value={username}
                  onChange={handleUsernameChange}
                />
                <br />
              </div>
              <div className={styles.password}>
                <h3>Password</h3>
                <input
                  type="password"
                  defaultValue={"password"}
                  onChange={handlePasswordChange}
                  value={password}
                />
              </div>
              <button
                onClick={handleSubmit}
                type="button"
                id="myBtn"
                className={styles.button}
              >
                Login
              </button>
              {errorMessage && (
                <div className={styles.error}>
                  <p>Wrong Username or Password</p>
                </div>
              )}
            </div>
          </div>
        </form>
        <p />
      </main>
    </>
  )
}
