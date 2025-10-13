import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head} from '@inertiajs/react';


const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Create User',
    href: '/create',
  },
];

export default function Create() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create" />
    </AppLayout>
  );
}
