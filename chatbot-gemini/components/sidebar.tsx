import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageSquare, Plus, Search, Code, Coffee, Lightbulb, Zap } from 'lucide-react'
import { Input } from '@/components/ui/input'

const segments = [
  { name: 'Code Debug', icon: Code },
  { name: 'Normal Chat', icon: Coffee },
  { name: 'Creative Ideas', icon: Lightbulb },
  { name: 'Quick Answers', icon: Zap },
]


interface SidebarProps {
  onNewChat: () => void
  isOpen: boolean
  recentChats: Array<{ id: string; title: string; preview: string }>
}

export default function Sidebar({ onNewChat, isOpen, recentChats }: SidebarProps) {
  const router = useRouter()
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSegmentClick = (segmentName: string) => {
    setSelectedSegment(segmentName === selectedSegment ? null : segmentName)
  }

  const handleChatClick = (chatId: string) => {
    router.push(`/chat/${chatId}`)
  }

  const filteredChats = recentChats.filter(chat => 
    (selectedSegment ? chat.segment === selectedSegment : true) &&
    (searchQuery ? chat.title.toLowerCase().includes(searchQuery.toLowerCase()) : true)
  )

  return (
    <div className={`w-80 border-r flex flex-col bg-background transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span className="font-semibold">My Chats</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onNewChat}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search chats" 
            className="pl-8" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <h2 className="text-xs uppercase text-muted-foreground font-semibold">Segments</h2>
            {segments.map((segment) => (
              <Button
                key={segment.name}
                variant="ghost"
                className={`w-full justify-start transition-colors duration-200 ${
                  selectedSegment === segment.name ? 'bg-muted' : ''
                }`}
                onClick={() => handleSegmentClick(segment.name)}
              >
                <segment.icon className="h-4 w-4 mr-2" />
                {segment.name}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <h2 className="text-xs uppercase text-muted-foreground font-semibold">Recent Chats</h2>
            {recentChats.map((chat) => (
              <Button
                key={chat.id}
                variant="ghost"
                className="w-full justify-start text-left transition-colors duration-200 hover:bg-muted"
                onClick={() => handleChatClick(chat.id)}
              >
                <div className="truncate">
                  <div className="font-medium">{chat.title}</div>
                  <div className="text-sm text-muted-foreground truncate">
                    {chat.preview}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <Button className="w-full" onClick={onNewChat}>
          <Plus className="h-4 w-4 mr-2" />
          New chat
        </Button>
      </div>
    </div>
  )
}

