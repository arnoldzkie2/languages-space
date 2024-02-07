import { create } from 'zustand'
import useGlobalStore from '../globalStore'
import { signIn } from 'next-auth/react'
import axios from 'axios'
import { toast } from 'sonner'
interface LoginForm {
    username: string
    password: string
}

interface SignupForm {
    username: string
    password: string
    confirm_password: string
}

const loginFormValue = {
    username: '',
    password: ''
}

const signupFormValue = {
    username: '',
    password: '',
    confirm_password: ''
}

export { loginFormValue, signupFormValue }
export type { SignupForm, LoginForm }

interface AuthProps {

    loginForm: LoginForm
    setLoginForm: (form: LoginForm) => void
    handleLoginForm: (e: React.ChangeEvent<HTMLInputElement>) => void
    loginUser: (event: any) => Promise<void>
    signupForm: SignupForm
    setSignupForm: (form: SignupForm) => void
    signupUser: (event: React.FormEvent, data: {
        agent: string | undefined;
        department: string | undefined;
    }) => Promise<void>
    handleSignupForm: (e: React.ChangeEvent<HTMLInputElement>) => void
    authPage: string
    setAuthPage: (page: string) => void
}

const useAuthStore = create<AuthProps>((set, get) => ({
    loginForm: loginFormValue,
    setLoginForm: (form: LoginForm) => set({ loginForm: form }),
    handleLoginForm: (e: React.ChangeEvent<HTMLInputElement>) => {
        const { setLoginForm, loginForm } = get()
        const { name, value } = e.target
        setLoginForm({ ...loginForm, [name]: value })
    },
    loginUser: async (event: React.FormEvent) => {

        event.preventDefault()
        const { setErr, setIsLoading, setOkMsg } = useGlobalStore.getState()
        const loginForm = get().loginForm

        const { username, password } = loginForm
        if (!username) return setErr('Phone number is required')
        if (!password) return setErr('Password cannot be empty')
        try {

            setIsLoading(true)
            const result = await signIn('credentials', {
                username, password, redirect: false
            })
            setIsLoading(false)

            if (result?.error) {
                setErr('Invalid Credentials.')
            } else {
                toast('Success redirecting...', {
                    position: 'bottom-center'
                })
            }

        } catch (error: any) {
            setIsLoading(false)
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            alert('Something went wrong')
        }
    },
    signupForm: signupFormValue,
    setSignupForm: (form: SignupForm) => set({ signupForm: form }),
    handleSignupForm: (e: React.ChangeEvent<HTMLInputElement>) => {
        const { setSignupForm, signupForm } = get()
        const { name, value } = e.target
        setSignupForm({ ...signupForm, [name]: value })
    },
    signupUser: async (event: React.FormEvent, data: {
        agent: string | undefined
        department: string | undefined
    }) => {
        event.preventDefault()
        const { department, agent } = data
        const { setErr, setOkMsg, setIsLoading } = useGlobalStore.getState()
        const { signupForm, setAuthPage } = get()
        const { username, password, confirm_password } = signupForm

        if (!username) return setErr('Username is required')
        if (!password) return setErr('Password is required')
        if (username.length > 20) return setErr('Username is to long maximum 20 characters.')
        if (password && !confirm_password) return setErr('Confirm your password')
        if (password !== confirm_password) return setErr('Password did not matched!')
        if (password.length < 6) return setErr('Password is to short minimum 6 characters.')
        if (password.length > 30) return setErr('Password is to long maximum 30 characters.')

        try {
            setIsLoading(true)
            const { data } = await axios.post('/api/auth/signup', {
                username,
                password,
                departmentName: department || null,
                agentID: agent || null
            })

            if (data.ok) {
                setIsLoading(false)
                toast('Your account has been created successfully', {
                    position: 'bottom-center'
                })
                setAuthPage('signin')
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error)
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            alert('Something went wrong')
        }
    },
    authPage: 'signin',
    setAuthPage: (page: string) => set({ authPage: page })
}))


export default useAuthStore