"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { FaComments, FaPaperPlane, FaTimes, FaUser, FaRobot, FaClock } from "react-icons/fa"

type Message = {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

export function ChatbotOverlay() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const toggleChat = () => setIsOpen(!isOpen)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      // Replace this with actual API call to your chatbot backend
      const response = await mockChatbotResponse(inputValue)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble responding right now. Please try again later.",
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messagesEndRef])

  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-4 right-4 w-16 h-16 rounded-full bg-[#4A90E2] hover:bg-[#3A7BC2] transition-colors duration-200 shadow-lg z-50"
        onClick={toggleChat}
        aria-label="Open chat"
      >
        <FaComments className="w-8 h-8 text-white" />
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl h-[80vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold flex items-center">
            <FaRobot className="mr-2" />
            AI Assistant
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={toggleChat} aria-label="Close chat">
            <FaTimes className="h-6 w-6" />
          </Button>
        </CardHeader>
        <CardContent className="flex-grow flex overflow-hidden">
          {/* Chat History Sidebar */}
          <div className="w-1/4 border-r pr-4 hidden md:block">
            <h3 className="font-semibold mb-2">Chat History</h3>
            <ScrollArea className="h-[calc(100%-2rem)]">
              {messages.map((message, index) => (
                <div key={message.id} className="mb-2 text-sm truncate">
                  {message.isUser ? "You: " : "AI: "}
                  {message.text}
                </div>
              ))}
            </ScrollArea>
          </div>

          {/* Main Chat Area */}
          <div className="flex-grow flex flex-col ml-4">
            <ScrollArea className="flex-grow pr-4">
              {messages.map((message) => (
                <div key={message.id} className={`mb-4 ${message.isUser ? "text-right" : "text-left"}`}>
                  <div
                    className={`inline-block max-w-[70%] ${
                      message.isUser ? "bg-[#4A90E2] text-white" : "bg-[#eef3f9] text-[#333333]"
                    } px-4 py-2 rounded-lg shadow`}
                  >
                    <div className="flex items-center mb-1">
                      {message.isUser ? <FaUser className="mr-2" /> : <FaRobot className="mr-2" />}
                      <span className="font-semibold">{message.isUser ? "You" : "AI Assistant"}</span>
                    </div>
                    <p>{message.text}</p>
                    <div className="text-xs mt-1 flex items-center justify-end">
                      <FaClock className="mr-1" />
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </ScrollArea>

            <Separator className="my-4" />

            <form onSubmit={handleSubmit} className="mt-auto">
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={handleInputChange}
                  className="flex-grow"
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FaPaperPlane className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Mock function to simulate chatbot response
async function mockChatbotResponse(input: string): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay
  return `This is a mock response to: "${input}". In a real implementation, this would be replaced with an actual API call to your AI backend.`
}

