import { Therapist } from '@/types/database';

export const DUMMY_THERAPISTS: Therapist[] = [
  {
    id: 'therapist_001',
    name: 'Ichinose',
    photoUrl: '/images/therapist-1.jpg',
    bio: 'あなたの本音に寄り添い、深層心理から癒やしを導き出します。サロン全体のマネジメントとカウンセリングを担当。',
    specialties: ['Empathy', 'Psychology', 'Gap Analysis'],
    tags: {
      stressTypes: ['work', 'relationship', 'mental'],
      treatmentStyle: ['gentle', 'intuitive'],
      communication: ['active', 'empathetic'],
    },
    availability: [],
    active: true,
  },
  {
    id: 'therapist_002',
    name: 'Takuya',
    photoUrl: '/images/therapist-2.jpg',
    bio: '解剖学に基づいた確かな技術で、体の芯から疲れを解きほぐします。',
    specialties: ['Deep Tissue', 'Anatomy', 'Skillful Touch'],
    tags: {
      stressTypes: ['exhaustion', 'muscle_pain'],
      treatmentStyle: ['technical', 'rhythmic'],
      communication: ['minimal', 'polite'],
    },
    availability: [],
    active: true,
  },
  {
    id: 'therapist_003',
    name: 'Ren',
    photoUrl: '/images/therapist-3.jpg',
    bio: '穏やかな時間の中で、五感を研ぎ澄ます至福のひとときを提供します。',
    specialties: ['Gentle Flow', 'Aroma Therapy', 'Natural Healing'],
    tags: {
      stressTypes: ['stress', 'exhaustion'],
      treatmentStyle: ['gentle', 'soft'],
      communication: ['minimal', 'empathetic'],
    },
    availability: [],
    active: true,
  },
];
