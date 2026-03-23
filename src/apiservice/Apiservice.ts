type AppEnv = ImportMetaEnv & {
	VITE_API_BASE_URL?: string
}

const env = import.meta.env as AppEnv

export const API_BASE_URL = (env.VITE_API_BASE_URL ?? 'http://localhost:8000/api').replace(/\/$/, '')


export const createApiUrl = (endpoint: string) => {
	const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
	return `${API_BASE_URL}${normalizedEndpoint}`
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
