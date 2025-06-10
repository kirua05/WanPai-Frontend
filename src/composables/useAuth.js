import { useRouter } from 'vue-router'

export const useAuth = () => {
  const router = useRouter()

  const logout = () => {
    localStorage.clear()
    router.push('/loginsignup')
  }

  return { logout }
}
