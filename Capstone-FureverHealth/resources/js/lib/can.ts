import { usePage } from '@inertiajs/react';

export function can(permission: string): boolean {
  const { auth } = usePage<{ auth?: { permissions?: string[] } }>().props;
  return auth?.permissions?.includes(permission) ?? false;
}