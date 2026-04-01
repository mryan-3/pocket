'use client';

import AdminGuard from '@/components/admin/admin-guard';
import AdminSidebar from '@/components/admin/admin-sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-accent/20">
        <AdminSidebar />
        <main className="flex-1 p-8 md:p-12 overflow-y-auto">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
