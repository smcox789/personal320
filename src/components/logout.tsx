import { Button } from "@/components/ui/button"
import { useRouter } from "next/router"
import { AUTH } from "@/lib/auth"

export default function Logout() {
  const router = useRouter()
  function logout() {
    AUTH.clear()
    router.push({
      pathname: "/",
    })
  }

  return (
    <Button variant="outline" onClick={logout}>
      Logout
    </Button>
  )
}
