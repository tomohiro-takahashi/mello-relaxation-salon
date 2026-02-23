import { DUMMY_THERAPISTS } from '@/lib/data/therapists';
import { TherapistCard } from '@/components/therapist/TherapistCard';

export default function TherapistsPage() {
  return (
    <div className="min-h-screen bg-[#1A1A2E] text-slate-100 font-serif pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-light tracking-widest">Therapists</h1>
          <p className="text-slate-400 font-sans max-w-xl mx-auto">
            厳選されたプロフェッショナルたちが、<br />
            あなたの心と体に深い癒やしを届けます。
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {DUMMY_THERAPISTS.map((therapist) => (
            <TherapistCard key={therapist.id} therapist={therapist} />
          ))}
        </div>
      </div>
    </div>
  );
}
