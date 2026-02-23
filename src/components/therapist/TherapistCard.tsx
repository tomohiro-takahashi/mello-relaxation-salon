import Link from 'next/link';
import { Therapist } from '@/types/database';
import { Sparkles, Calendar } from 'lucide-react';

export function TherapistCard({ therapist }: { therapist: Therapist }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-slate-800/50 border border-slate-700/50 transition-all hover:bg-slate-800 hover:border-[#D4AF37]/50">
      <div className="aspect-4/5 relative overflow-hidden">
        <img 
          src={therapist.photoUrl} 
          alt={therapist.name}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent opacity-60" />
      </div>
      
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-2xl font-light text-[#D4AF37]">{therapist.name}</h3>
            <p className="text-xs text-slate-400 mt-1">{therapist.specialties.join(' / ')}</p>
          </div>
          <div className="flex gap-1 text-[#D4AF37]">
            <Sparkles size={16} />
          </div>
        </div>
        
        <p className="text-sm text-slate-300 font-sans line-clamp-3 leading-relaxed">
          {therapist.bio}
        </p>
        
        <div className="flex flex-wrap gap-2 pt-2">
          {therapist.tags.treatmentStyle.map(tag => (
            <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase tracking-wider text-slate-400">
              #{tag}
            </span>
          ))}
        </div>

        <Link 
          href={`/booking?therapistId=${therapist.id}`}
          className="flex items-center justify-center gap-2 w-full py-3 bg-transparent border border-[#D4AF37]/30 text-[#D4AF37] rounded-xl text-sm font-medium transition-all hover:bg-[#D4AF37] hover:text-slate-900 group/btn"
        >
          <Calendar size={16} />
          このセラピストを予約する
        </Link>
      </div>
    </div>
  );
}
