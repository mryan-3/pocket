'use client';

import { Calendar, Clock, MapPin, CaretRight, ChatTeardropText, XCircle } from '@phosphor-icons/react';
import Link from 'next/link';
import { format } from 'date-fns';
import { useState } from 'react';
import FeedbackDialog from '@/components/feedback/feedback-form';

interface Visit {
  _id: string;
  restaurant: {
    _id: string;
    name: string;
    location: { address: string; city: string };
  };
  visitDate: string;
  status: string;
  notes?: string;
}

interface VisitListProps {
  visits: Visit[];
  type?: 'upcoming' | 'feedback';
  emptyMessage: string;
}

export default function VisitList({ visits, type = 'upcoming', emptyMessage }: VisitListProps) {
  const [feedbackVisit, setFeedbackVisit] = useState<Visit | null>(null);

  if (visits.length === 0) {
    return (
      <div className="p-12 border-2 border-dashed border-border/60 rounded-[2.5rem] text-center">
        <p className="text-muted-foreground italic">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {visits.map((visit) => (
        <div 
          key={visit._id} 
          className="group p-6 glass-card rounded-[2rem] border border-border/40 hover:border-primary/30 transition-all flex flex-col md:flex-row md:items-center gap-6"
        >
          <div className="flex-1 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <h4 className="text-xl font-bold group-hover:text-primary transition-colors">
                {visit.restaurant.name}
              </h4>
              <span className="flex items-center gap-1.5 text-muted-foreground text-sm font-medium">
                <MapPin size={16} />
                {visit.restaurant.location.address || visit.restaurant.location.city}
              </span>
            </div>

            <div className="flex flex-wrap gap-4">
               <div className="flex items-center gap-2 bg-accent px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider">
                 <Calendar size={16} weight="bold" className="text-primary" />
                 {format(new Date(visit.visitDate), 'MMM dd, yyyy')}
               </div>
               <div className="flex items-center gap-2 bg-accent px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider">
                 <Clock size={16} weight="bold" className="text-primary" />
                 {format(new Date(visit.visitDate), 'hh:mm a')}
               </div>
            </div>
            
            {visit.notes && (
              <p className="text-sm text-muted-foreground italic line-clamp-1">
                "{visit.notes}"
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {type === 'feedback' ? (
              <button 
                onClick={() => setFeedbackVisit(visit)}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95 flex items-center gap-2"
              >
                <ChatTeardropText size={18} weight="bold" />
                Leave Feedback
              </button>
            ) : (
              <>
                <Link 
                  href={`/restaurants/${visit.restaurant._id}`}
                  className="p-3 bg-accent rounded-2xl hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <CaretRight size={20} weight="bold" />
                </Link>
                <button className="p-3 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                  <XCircle size={20} weight="bold" />
                </button>
              </>
            )}
          </div>
        </div>
      ))}

      {feedbackVisit && (
        <FeedbackDialog 
          isOpen={!!feedbackVisit}
          onClose={() => setFeedbackVisit(null)}
          visitId={feedbackVisit._id}
          restaurantId={feedbackVisit.restaurant._id}
          restaurantName={feedbackVisit.restaurant.name}
        />
      )}
    </div>
  );
}
