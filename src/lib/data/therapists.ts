import { Therapist } from '@/types/database';

export const DUMMY_THERAPISTS: Therapist[] = [
  {
    id: 'therapist_001',
    name: 'Aoi',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    bio: '心と体の緊張を解きほぐす、静かな寄り添い。国際ライセンス保持。',
    specialties: ['Deep Relaxation', 'Emotional Care'],
    tags: {
      stressTypes: ['work', 'relationship'],
      treatmentStyle: ['gentle', 'intuitive'],
      communication: ['minimal', 'empathetic'],
    },
    availability: [
      { date: '2026-02-10', slots: ['19:00', '21:00'] },
    ],
    active: true,
  },
  {
    id: 'therapist_002',
    name: 'Saki',
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    bio: '明るい笑顔と確かな技術で、日常の疲れをポジティブなエネルギーへ。',
    specialties: ['Energizing Touch', 'Mindfulness'],
    tags: {
      stressTypes: ['family', 'exhaustion'],
      treatmentStyle: ['cheerful', 'rhythmic'],
      communication: ['active', 'empathetic'],
    },
    availability: [
      { date: '2026-02-10', slots: ['14:00', '16:00'] },
    ],
    active: true,
  },
];
