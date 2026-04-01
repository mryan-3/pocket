'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Spinner, Plus, PencilSimple, Trash, Storefront } from '@phosphor-icons/react';
import { useState } from 'react';
import RestaurantFormDialog from '@/components/admin/restaurant-form-dialog';

export default function AdminRestaurantsPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-restaurants'],
    queryFn: async () => (await apiClient.get('/restaurants')).data.data,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return (await apiClient.delete(`/restaurants/${id}`)).data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-restaurants'] });
    },
  });

  const handleEdit = (restaurant: any) => {
    setEditingRestaurant(restaurant);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingRestaurant(null);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
            Restaurant <span className="text-primary italic">Vault</span>
          </h1>
          <p className="text-muted-foreground text-lg">Curate and manage the system's culinary catalog.</p>
        </div>
        
        <button 
          onClick={handleAdd}
          className="bg-foreground text-background px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-primary hover:text-primary-foreground transition-all active:scale-95"
        >
          <Plus size={20} weight="bold" />
          <span>Add Restaurant</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[40vh]">
          <Spinner size={48} className="animate-spin text-primary" weight="bold" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data?.map((restaurant: any) => (
            <div key={restaurant._id} className="group glass-card border border-border/40 rounded-[2.5rem] p-8 hover:border-primary/40 transition-all duration-500 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-accent/50 rounded-2xl group-hover:bg-primary/10 transition-colors">
                  <Storefront size={28} weight="bold" className="text-primary" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(restaurant)} className="p-2 hover:bg-accent rounded-xl transition-all"><PencilSimple size={20} weight="bold" /></button>
                  <button onClick={() => { if(confirm('Delete?')) deleteMutation.mutate(restaurant._id) }} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"><Trash size={20} weight="bold" /></button>
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-2xl font-black tracking-tight mb-2 group-hover:text-primary transition-colors">{restaurant.name}</h3>
                <span className="inline-block px-3 py-1 bg-accent rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">{restaurant.category}</span>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-6 font-medium leading-relaxed">{restaurant.description}</p>
              </div>

              <div className="pt-6 border-t border-border/40 flex justify-between items-center mt-auto">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Price Range</p>
                  <p className="font-bold">KES {restaurant.priceRange.min} - {restaurant.priceRange.max}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Rating</p>
                  <p className="font-bold flex items-center justify-end gap-1">{restaurant.rating.average} <span className="text-muted-foreground font-medium">({restaurant.rating.count})</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <RestaurantFormDialog 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        restaurant={editingRestaurant} 
      />
    </div>
  );
}
