'use client';

import { ChatInterface } from '@/components/chat/ChatInterface';
import { motion } from 'framer-motion';

export default function ChatPage() {
  return (
    <main className="fixed inset-0 flex flex-col bg-[#1A1A2E]">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex-1"
      >
        <ChatInterface />
      </motion.div>
    </main>
  );
}
