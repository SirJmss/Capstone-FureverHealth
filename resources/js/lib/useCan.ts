import { usePage } from '@inertiajs/react';

export function useCan(permission: string): boolean {
  const authUser = usePage<{ auth?: { user?: { roles?: string[]; permissions?: string[] } } }>()
    .props.auth?.user;

  if (authUser?.roles?.includes('admin')) return true;

  return authUser?.permissions?.includes(permission) ?? false;
}
