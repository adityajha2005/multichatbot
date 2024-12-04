'use client'

// import { useParams } from 'next/navigation'
import { useParams } from 'next/navigation'
import Chat from '@/app/page'

export default function ChatPage() {
  const { chatId } = useParams()

  return <Chat initialChatId={chatId as string} />
}

