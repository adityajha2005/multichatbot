'use client'

import { useState, useEffect } from 'react'
import { useChat } from 'ai/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Mic, Send, Menu, Moon, Sun, Code, Coffee, Lightbulb, Zap } from 'lucide-react'
import Sidebar from '@/components/sidebar'
import FeatureCard from '@/components/feature-card'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { useTheme } from 'next-themes'

interface ChatProps {
  initialChatId: string;
}

const segments = [
  { name: 'Code Debug', icon: Code },
  { name: 'Normal Chat', icon: Coffee },
  { name: 'Creative Ideas', icon: Lightbulb },
  { name: 'Quick Answers', icon: Zap },
]

const Chat = ({ initialChatId }: ChatProps) => {
  const router = useRouter()
  const [chatId, setChatId] = useState<string | null>(initialChatId)
  const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat({
    api: '/api/chat',
  })
  const [selectedTab, setSelectedTab] = useState('all')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { theme, setTheme } = useTheme()
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null)
  const [recentChats, setRecentChats] = useState<Array<{ id: string; title: string; preview: string }>>([])

  useEffect(() => {
    if (!chatId) {
      handleNewChat()
    }
  }, [])

  const handleNewChat = () => {
    const newChatId = uuidv4()
    setChatId(newChatId)
    setMessages([])
    setSelectedSegment(null)
    router.push(`/chat/${newChatId}`)

    // Add the current chat to recent chats if it's not empty
    if (messages.length > 0) {
      const newRecentChat = {
        id: chatId!,
        title: messages[0].content.substring(0, 30) + '...',
        preview: messages[messages.length - 1].content.substring(0, 50) + '...',
      }
      setRecentChats(prevChats => [newRecentChat, ...prevChats.slice(0, 4)])
    }
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const handleSegmentSelect = (segment: string) => {
    setSelectedSegment(segment)
  }

  return (
    <div className="flex h-screen bg-background text-foreground transition-colors duration-300">
      <Sidebar onNewChat={handleNewChat} isOpen={sidebarOpen} recentChats={recentChats} />
      
      <main className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        <header className="flex items-center justify-between p-4 border-b transition-all duration-300">
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            {segments.map((segment) => (
              <Button
                key={segment.name}
                variant={selectedSegment === segment.name ? "secondary" : "ghost"}
                size="sm"
                onClick={() => handleSegmentSelect(segment.name)}
                className="transition-all duration-300"
              >
                <segment.icon className="h-4 w-4 mr-2" />
                {segment.name}
              </Button>
            ))}
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </header>
        <ScrollArea className="flex-1 p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-8 animate-fade-in">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-semibold">How can I help you today?</h1>
                <p className="text-sm text-muted-foreground">
                  Select a chat segment or start typing to begin your conversation.
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
                {segments.map((segment) => (
                  <FeatureCard
                    key={segment.name}
                    title={segment.name}
                    description={`Start a ${segment.name.toLowerCase()} conversation`}
                    icon={segment.name}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  } animate-slide-in`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    } transition-all duration-300 ease-in-out hover:scale-105`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="p-4 border-t animate-slide-up">
          <Tabs defaultValue="all" className="mb-4">
            <TabsList>
              {['all', 'text', 'image', 'video', 'music', 'analytics'].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  onClick={() => setSelectedTab(tab)}
                  className="capitalize transition-all duration-300"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder={`Type your ${selectedSegment ? selectedSegment.toLowerCase() : ''} prompt here...`}
              className="flex-1 transition-all duration-300"
            />
            <Button size="icon" variant="ghost" type="button" className="transition-all duration-300">
              <Mic className="h-4 w-4" />
            </Button>
            <Button size="icon" type="submit" className="transition-all duration-300">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default Chat

