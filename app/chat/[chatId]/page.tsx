'use client'

import { useParams } from 'next/navigation'
import Chat from '@/app/page'

export default function ChatPage() {
  const { chatId } = useParams()
  
  // Ensure chatId is a string and not undefined
  if (!chatId || typeof chatId !== 'string') {
    return <div>Invalid Chat ID</div>
  }

  return <Chat initialChatId={chatId} />
}