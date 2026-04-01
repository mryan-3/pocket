'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { format } from 'date-fns';
import { Trash, ShieldCheck, User as UserIcon } from '@phosphor-icons/react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export default function UserTable({ users }: { users: User[] }) {
  const queryClient = useQueryClient();

  const toggleRoleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      const newRole = role === 'admin' ? 'user' : 'admin';
      return (await apiClient.patch(`/admin/users/${id}/role`, { role: newRole })).data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      return (await apiClient.delete(`/admin/users/${id}`)).data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  return (
    <div className="overflow-x-auto glass-card rounded-[2.5rem] border border-border/40">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border/40">
            <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-muted-foreground">User</th>
            <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-muted-foreground">Role</th>
            <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-muted-foreground">Joined</th>
            <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/40">
          {users.map((user) => (
            <tr key={user._id} className="group hover:bg-accent/30 transition-colors">
              <td className="px-8 py-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-8 py-6">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-accent text-muted-foreground'
                }`}>
                  {user.role === 'admin' ? <ShieldCheck size={14} weight="bold" /> : <UserIcon size={14} weight="bold" />}
                  {user.role}
                </span>
              </td>
              <td className="px-8 py-6 text-sm font-medium text-muted-foreground">
                {format(new Date(user.createdAt), 'MMM dd, yyyy')}
              </td>
              <td className="px-8 py-6">
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => toggleRoleMutation.mutate({ id: user._id, role: user.role })}
                    className="p-2.5 hover:bg-primary/10 hover:text-primary rounded-xl transition-all"
                    title="Change Role"
                  >
                    <ShieldCheck size={20} weight="bold" />
                  </button>
                  <button 
                    onClick={() => { if(confirm('Delete user?')) deleteUserMutation.mutate(user._id) }}
                    className="p-2.5 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
                    title="Delete User"
                  >
                    <Trash size={20} weight="bold" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
