'use client';

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import UserTable from '@/components/admin/user-table';
import { Spinner, MagnifyingGlass } from '@phosphor-icons/react';
import { useState } from 'react';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => (await apiClient.get('/admin/users')).data.data,
  });

  const filteredUsers = data?.data?.filter((u: any) => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
            User <span className="text-primary italic">Base</span>
          </h1>
          <p className="text-muted-foreground text-lg">Manage permissions and monitor account activity.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <MagnifyingGlass size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" weight="bold" />
          <input 
            type="text" 
            placeholder="Search by name or email..."
            className="w-full pl-12 pr-6 py-4 bg-card/50 border border-border/40 rounded-2xl focus:border-primary outline-none transition-all font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[40vh]">
          <Spinner size={48} className="animate-spin text-primary" weight="bold" />
        </div>
      ) : (
        <UserTable users={filteredUsers || []} />
      )}
    </div>
  );
}
