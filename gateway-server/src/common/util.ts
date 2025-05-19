import { HttpException } from '@nestjs/common'
import { AxiosInstance, AxiosRequestConfig } from 'axios'

export function axiosErrorHandler(error: any): never {
  if (!error.isAxiosError) {
    console.error('예상치 못한 에러:', error)
    throw error
  }

  if (error.response) {
    const { status, data } = error.response
    throw new HttpException(data, status)
  }

  if (error.request) {
    throw new HttpException('외부 서버에서 응답이 없습니다', 504)
  }

  throw error
}

export function buildRequestConfig(user: any): AxiosRequestConfig {
  return {
    headers: {
      'X-User-Data': user ? JSON.stringify(user) : undefined,
    },
  }
}

export async function executeRequest(
  method: string,
  url: string,
  body: any,
  axiosInstance: AxiosInstance,
  config: AxiosRequestConfig,
) {
  const requestMap = {
    GET: () => axiosInstance.get(url, config),
    POST: () => axiosInstance.post(url, body, config),
    PUT: () => axiosInstance.put(url, body, config),
    PATCH: () => axiosInstance.patch(url, body, config),
    DELETE: () => axiosInstance.delete(url, config),
  }

  const requestMethod = requestMap[method]
  if (!requestMethod) {
    throw new Error('Invalid HTTP method')
  }

  const response = await requestMethod()
  return response.data
}
