'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { X, Spinner } from '@phosphor-icons/react';

const restaurantSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  category: z.string().min(2, 'Category is required'),
  description: z.string().min(10, 'Description is too short'),
  location: z.object({
    address: z.string().min(5, 'Address is required'),
    city: z.string().min(2, 'City is required'),
  }),
  priceRange: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
  }),
});

type RestaurantValues = z.infer<typeof restaurantSchema>;

interface RestaurantFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant?: any;
}

export default function RestaurantFormDialog({ isOpen, onClose, restaurant }: RestaurantFormDialogProps) {
  const queryClient = useQueryClient();
  const isEditing = !!restaurant;

  const { register, handleSubmit, formState: { errors } } = useForm<RestaurantValues>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: restaurant || {
      name: '',
      category: '',
      description: '',
      location: { address: '', city: '' },
      priceRange: { min: 0, max: 0 },
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: RestaurantValues) => {
      if (isEditing) {
        return (await apiClient.put(`/restaurants/${restaurant._id}`, values)).data.data;
      }
      return (await apiClient.post('/restaurants', values)).data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-restaurants'] });
      onClose();
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-card w-full max-w-2xl rounded-[3rem] border border-border/40 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-8 border-b border-border/40">
          <h3 className="text-2xl font-black uppercase tracking-tighter">
            {isEditing ? 'Edit' : 'Add'} <span className="text-primary italic">Restaurant</span>
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-full transition-colors"><X size={24} weight="bold" /></button>
        </div>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Name</label>
              <input {...register('name')} className="w-full px-5 py-3.5 bg-accent/50 border border-border/40 rounded-2xl outline-none focus:border-primary transition-all font-medium" />
              {errors.name && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase tracking-wider">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Category</label>
              <input {...register('category')} className="w-full px-5 py-3.5 bg-accent/50 border border-border/40 rounded-2xl outline-none focus:border-primary transition-all font-medium" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Description</label>
            <textarea {...register('description')} rows={3} className="w-full px-5 py-3.5 bg-accent/50 border border-border/40 rounded-2xl outline-none focus:border-primary transition-all font-medium resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Address</label>
              <input {...register('location.address')} className="w-full px-5 py-3.5 bg-accent/50 border border-border/40 rounded-2xl outline-none focus:border-primary transition-all font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">City</label>
              <input {...register('location.city')} className="w-full px-5 py-3.5 bg-accent/50 border border-border/40 rounded-2xl outline-none focus:border-primary transition-all font-medium" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Min Price</label>
              <input type="number" {...register('priceRange.min', { valueAsNumber: true })} className="w-full px-5 py-3.5 bg-accent/50 border border-border/40 rounded-2xl outline-none focus:border-primary transition-all font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Max Price</label>
              <input type="number" {...register('priceRange.max', { valueAsNumber: true })} className="w-full px-5 py-3.5 bg-accent/50 border border-border/40 rounded-2xl outline-none focus:border-primary transition-all font-medium" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={mutation.isPending}
            className="w-full py-5 bg-primary text-primary-foreground rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            {mutation.isPending && <Spinner size={20} className="animate-spin" weight="bold" />}
            {isEditing ? 'Save Changes' : 'Create Restaurant'}
          </button>
        </form>
      </div>
    </div>
  );
}
