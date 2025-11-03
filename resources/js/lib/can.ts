import { usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';

interface AuthUser {
  id: number;
  name: string;
  permissions: string[];
  roles?: string[];
}

interface PageProps extends InertiaPageProps {
  auth?: {
    user?: AuthUser;
  };
}

export function can(permission: string): boolean {
  const page = usePage<PageProps>();
  const user = page.props.auth?.user;

  if (!user || !user.permissions) return false;

  return user.permissions.includes(permission);
}
