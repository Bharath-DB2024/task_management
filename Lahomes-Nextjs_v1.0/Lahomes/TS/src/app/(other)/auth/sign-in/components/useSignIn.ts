
'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNotificationContext } from '@/context/useNotificationContext'
import useQueryParams from '@/hooks/useQueryParams'

const useSignIn = () => {
  const [loading, setLoading] = useState(false)
  const { push } = useRouter()
  const { showNotification } = useNotificationContext()
  const queryParams = useQueryParams()

  const loginFormSchema = yup.object({
    email: yup.string().email('Please enter a valid email').required('Please enter your email'),
    password: yup.string().required('Please enter your password'),
  })

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(loginFormSchema),
    defaultValues: {
      email: '', 
      password: '',
    },
  })

  type LoginFormFields = yup.InferType<typeof loginFormSchema>

  const login = handleSubmit(async (values: LoginFormFields) => {
    setLoading(true)
    
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email, password: values.password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token) 
        showNotification({ message: 'Successfully logged in. Redirecting...', variant: 'success' })
        push(queryParams['redirectTo'] ?? '/dashboards/analytics')
      } else {
        showNotification({ message: data.error, variant: 'danger' })
      }
    } catch (error) {
      showNotification({ message: 'Login failed. Please try again.', variant: 'danger' })
    }

    setLoading(false)
  })

  return { loading, login, control }
}

export default useSignIn