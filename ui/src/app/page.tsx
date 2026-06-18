'use client';

import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { ChatArea } from '@/components/ChatArea';
import { CognitivePanel } from '@/components/CognitivePanel';

export default function Home() {
  return (
    <>
      <Header />
      <Sidebar />
      <ChatArea />
      <CognitivePanel />
    </>
  );
}
