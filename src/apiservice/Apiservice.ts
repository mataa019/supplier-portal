type AppEnv = ImportMetaEnv & {
	VITE_API_BASE_URL?: string
}

const env = import.meta.env as AppEnv

export const API_BASE_URL = (env.VITE_API_BASE_URL ?? 'http://localhost:8000/api').replace(/\/$/, '')


export const createApiUrl = (endpoint: string) => {
	const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
	return `${API_BASE_URL}${normalizedEndpoint}`
}
const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  }
}

export interface RegisterPayload {
  companyName: string
  registrationNumber: string
  tpin: string
  phone: string
  email: string
  password: string
}

export const registerSupplier = async (payload: RegisterPayload) => {
  const response = await fetch(createApiUrl('/auth/register'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Registration failed')
  }

  return response.json()
}

export interface LoginPayload {
  email: string
  password: string
}

export const loginUser = async (payload: LoginPayload) => {
  const response = await fetch(createApiUrl('/auth/login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Login failed')
  }

  return response.json()
}

export interface VerifyOtpPayload {
  otp: string
  email?: string
}

export const verifyOtp = async (payload: VerifyOtpPayload) => {
  const response = await fetch(createApiUrl('/auth/verify-otp'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'OTP verification failed')
  }

  return response.json()
}

export interface ResendOtpPayload {
  email: string
}

export const resendOtp = async (payload: ResendOtpPayload) => {
  const response = await fetch(createApiUrl('/auth/resend-otp'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Resend OTP failed')
  }

  return response.json()
}



export const getUserProfile = async () => {
  const response = await fetch(createApiUrl('/auth/profile'), {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Failed to fetch profile')
  }

  return response.json()
}
