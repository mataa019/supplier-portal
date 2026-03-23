type AppEnv = ImportMetaEnv & {
	VITE_API_BASE_URL?: string
}

const env = import.meta.env as AppEnv

export const API_BASE_URL = (env.VITE_API_BASE_URL ?? 'http://localhost:8000/api').replace(/\/$/, '')

export const createApiUrl = (endpoint: string) => {
	const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
	return `${API_BASE_URL}${normalizedEndpoint}`
}
