'use client';

import useSWR, { type SWRConfiguration } from 'swr';
import { api, type Pagination } from './api';
import type { Event, Booking } from '@/types/api';

const SKIP_AUTH = { skipAuth: true } as const;

function isPublicEventsPath(path: string): boolean {
  return path.startsWith('/api/v1/events') && !path.includes('/bookings');
}

async function fetchWithPagination<T>(path: string): Promise<{ data: T; pagination?: Pagination }> {
  const opts = isPublicEventsPath(path) ? SKIP_AUTH : {};
  const res = await api<T>(path, opts as RequestInit & { skipAuth?: boolean });
  if ('error' in res && res.error) throw new Error(res.error.message || 'Request failed');
  if (!('data' in res) || !res.success) throw new Error('Unknown response');
  return { data: res.data as T, pagination: 'pagination' in res ? res.pagination : undefined };
}

const defaultConfig: SWRConfiguration = {
  revalidateOnFocus: true,
  dedupingInterval: 2000,
  errorRetryCount: 2,
};

export type EventsParams = { page?: number; limit?: number; sort_by?: string; order?: 'asc' | 'desc' };

function buildEventsKey(params: EventsParams): string {
  const p = new URLSearchParams();
  p.set('page', String(params.page ?? 1));
  p.set('limit', String(params.limit ?? 12));
  if (params.sort_by) p.set('sort_by', params.sort_by);
  if (params.order) p.set('order', params.order);
  return `/api/v1/events?${p.toString()}`;
}

export function useEvents(params: EventsParams = {}, options?: SWRConfiguration) {
  const key = buildEventsKey(params);
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    key,
    (url) => fetchWithPagination<Event[]>(url).then((r) => ({ data: r.data, pagination: r.pagination })),
    { ...defaultConfig, ...options }
  );
  return {
    events: data?.data ?? [],
    pagination: data?.pagination ?? null,
    isLoading,
    isValidating,
    error: error?.message ?? null,
    mutate,
  };
}

export function useEvent(id: string | number | null, options?: SWRConfiguration) {
  const key = id != null ? `/api/v1/events/${id}` : null;
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    key,
    (url) => fetchWithPagination<Event>(url).then((r) => r.data),
    { ...defaultConfig, ...options }
  );
  return {
    event: data ?? null,
    isLoading,
    isValidating,
    error: error?.message ?? null,
    mutate,
  };
}

export function useBookings(page: number = 1, limit: number = 10, options?: SWRConfiguration) {
  const key = `/api/v1/bookings?page=${page}&limit=${limit}`;
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    key,
    (url) => fetchWithPagination<Booking[]>(url).then((r) => ({ data: r.data, pagination: r.pagination })),
    { ...defaultConfig, ...options }
  );
  return {
    bookings: Array.isArray(data?.data) ? data.data : [],
    pagination: data?.pagination ?? null,
    isLoading,
    isValidating,
    error: error?.message ?? null,
    mutate,
  };
}

export type AllEventsParams = { sort_by?: string; order?: 'asc' | 'desc'; pageSize?: number };

export function useAllEvents(params: AllEventsParams = {}, options?: SWRConfiguration) {
  const pageSize = params.pageSize ?? 12;
  const sort_by = params.sort_by ?? 'created_at';
  const order = params.order ?? 'desc';
  const key = `all-events:${sort_by}:${order}:${pageSize}`;

  const fetcher = async (): Promise<{ data: Event[]; total: number }> => {
    const all: Event[] = [];
    let page = 1;
    let hasNext = true;
    while (hasNext) {
      const url = buildEventsKey({ page, limit: pageSize, sort_by, order });
      const res = await fetchWithPagination<Event[]>(url);
      const list = Array.isArray(res.data) ? res.data : [];
      all.push(...list);
      hasNext = (res.pagination?.has_next ?? false) && list.length === pageSize;
      page += 1;
    }
    return { data: all, total: all.length };
  };

  const { data, error, isLoading, isValidating, mutate } = useSWR(key, fetcher, {
    ...defaultConfig,
    revalidateOnFocus: false,
    ...options,
  });

  return {
    events: data?.data ?? [],
    total: data?.total ?? 0,
    isLoading,
    isValidating,
    error: error?.message ?? null,
    mutate,
  };
}
