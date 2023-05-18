import Cookies from "js-cookie"
import { ACCESS_TOKEN_COOKIE_NAME } from "./consts"

// [AUTH] handles management of the authentication token
export const AUTH = {
  get() {
    return Cookies.get(ACCESS_TOKEN_COOKIE_NAME)
  },
  set(token: string) {
    return Cookies.set(ACCESS_TOKEN_COOKIE_NAME, token)
  },
  clear() {
    return Cookies.remove(ACCESS_TOKEN_COOKIE_NAME)
  },
}
