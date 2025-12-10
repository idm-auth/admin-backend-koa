import axios, { AxiosInstance } from 'axios';
import { IHttpClient, HttpOptions } from '@idm-auth/client';

export class AxiosHttpClient implements IHttpClient {
  private axiosInstance: AxiosInstance;

  constructor(timeout = 5000) {
    this.axiosInstance = axios.create({ timeout });
  }

  async post<T>(url: string, data: unknown, options?: HttpOptions): Promise<T> {
    const response = await this.axiosInstance.post(url, data, {
      headers: options?.headers,
    });
    return response.data;
  }

  async get<T>(url: string, options?: HttpOptions): Promise<T> {
    const response = await this.axiosInstance.get(url, {
      headers: options?.headers,
    });
    return response.data;
  }
}
