import React, { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import { X, Send, User, Bot, Minimize2, Maximize2 } from 'lucide-react';

type Message = {
    id: number;
    text: string;
    sender: 'user' | 'agent';
    timestamp: string;
};

const LiveChatComponent: React.FC = () => {
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
    const [isMinimized, setIsMinimized] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "Hello! How can I help you today?",
            sender: 'agent',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
    ]);
    const [inputMessage, setInputMessage] = useState<string>('');
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [unreadCount, setUnreadCount] = useState<number>(0);

    // Refs
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    // Focus input when chat is opened and not minimized
    useEffect(() => {
        if (isChatOpen && !isMinimized) {
            setUnreadCount(0);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isChatOpen, isMinimized]);

    // Handle outside clicks to minimize (optional)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const chatWindow = document.querySelector('.chat-window');
            const chatButton = document.querySelector('.chat-toggle-button');

            if (isChatOpen && !isMinimized &&
                chatWindow && !chatWindow.contains(event.target as Node) &&
                chatButton && !chatButton.contains(event.target as Node)) {
                setIsMinimized(true);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isChatOpen, isMinimized]);

    const handleSendMessage = () => {
        if (inputMessage.trim() === '') return;

        const newMessage: Message = {
            id: Date.now(),
            text: inputMessage,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages(prev => [...prev, newMessage]);
        setInputMessage('');
        setIsTyping(true);

        // Simulate agent response
        setTimeout(() => {
            const agentResponse: Message = {
                id: Date.now(),
                text: getAgentResponse(inputMessage),
                sender: 'agent',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages(prev => [...prev, agentResponse]);
            setIsTyping(false);

            // If chat is minimized, increment unread count
            if (isMinimized || !isChatOpen) {
                setUnreadCount(prev => prev + 1);
            }
        }, 1000 + Math.random() * 2000);
    };

    const getAgentResponse = (userMessage: string): string => {
        const lower = userMessage.toLowerCase();
        console.log("user msg", lower);

        if (lower.includes('hello') || lower.includes('hey')) {
            return "Hello! Welcome to our live chat. How can I assist you today?";
        } else if (lower.includes('bye') || lower.includes('goodbye')) {
            return "Thank you for chatting with us. Have a great day!";
        } else if (lower.includes('thank')) {
            return "You're welcome! Is there anything else I can help you with?";
        } else if (lower.includes('help')) {
            return "I'm here to help! What specific information or assistance do you need?";
        } else if (lower.includes('product') || lower.includes('item') || lower.includes('buy')) {
            return "I'd be happy to help you find the right product. What are you looking for specifically?";
        } else if (lower.includes('price') || lower.includes('cost')) {
            return "Our pricing varies depending on the product. Could you specify which product you're interested in?";
        } else if (lower.includes('support') || lower.includes('problem') || lower.includes('issue')) {
            return "I'm sorry to hear you're experiencing an issue. Can you please describe the problem in more detail?";
        } else if (lower.includes('hours') || lower.includes('open') || lower.includes('time')) {
            return "Our customer service hours are Monday to Friday, 9 AM to 6 PM EST.";
        } else if (lower.includes('contact') || lower.includes('phone') || lower.includes('email')) {
            return "You can reach us at dhaneri16@gmail.com during business hours.";
        } else if (lower.includes('return') || lower.includes('refund')) {
            return "We have a 30-day return policy. Do you need help with a specific return?";
        } else if (lower.includes('shipping') || lower.includes('delivery')) {
            return "Standard shipping takes 3-5 business days. We also offer expedited shipping options.";
        }

        // Default responses for other queries
        const responses = [
            "Thanks for reaching out! I'm here to help you with any questions.",
            "That's a great question. Let me help you with that.",
            "I understand your concern. Here's what I can do for you...",
            "Perfect! I have some information that might help you.",
            "Thanks for contacting us. I'll be happy to assist you with that.",
            "I see what you're looking for. Let me guide you through this.",
            "Great question! Here's what I recommend...",
            "I'm here to help! Let me provide you with the best solution."
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputMessage(e.target.value);
    };

    const toggleChat = () => {
        if (isChatOpen) {
            setIsChatOpen(false);
        } else {
            setIsChatOpen(true);
            setIsMinimized(false);
            setUnreadCount(0);
        }
    };

    const toggleMinimize = () => {
        setIsMinimized(prev => {
            const newState = !prev;
            if (!newState) {
                setUnreadCount(0);
            }
            return newState;
        });
    };

    return (
        <>
            {/* Floating Action Buttons */}
            <div className="fixed bottom-4 right-4 space-y-2 z-40">
                <button
                    onClick={toggleChat}
                    className="chat-toggle-button flex items-center bg-black text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors relative"
                >
                    🗨 Live Chat
                    {unreadCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            {unreadCount}
                        </span>
                    )}
                </button>
                {/* <button className="flex items-center bg-green-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-green-700 transition-colors">
                    🛍 Live Shopping
                </button> */}
            </div>

            {/* Chat Window */}
            {isChatOpen && (
                <div className={`chat-window fixed bottom-20 right-4 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 transition-all duration-300 ${isMinimized ? 'w-80 h-12' : 'w-80 h-96'
                    }`}>
                    {/* Chat Header */}
                    <div className="bg-black text-white p-3 rounded-t-lg flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="font-medium">Live Support</span>
                            {isMinimized && unreadCount > 0 && (
                                <span className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                    {unreadCount}
                                </span>
                            )}
                        </div>
                        <div className="flex space-x-1">
                            <button
                                onClick={toggleMinimize}
                                className="hover:bg-blue-700 p-1 rounded transition-colors"
                                aria-label={isMinimized ? 'Maximize chat window' : 'Minimize chat window'}
                            >
                                {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                            </button>
                            <button
                                onClick={toggleChat}
                                className="hover:bg-blue-700 p-1 rounded transition-colors"
                                aria-label="Close chat window"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {!isMinimized && (
                        <>
                            {/* Messages Area */}
                            <div
                                ref={messagesContainerRef}
                                className="h-64 overflow-y-auto p-3 bg-gray-50"
                            >
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`mb-3 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`flex items-start space-x-2 max-w-xs ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                                            }`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.sender === 'user' ? 'bg-black text-white' : 'bg-gray-300 text-gray-600'
                                                }`}>
                                                {message.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                                            </div>
                                            <div className={`p-3 rounded-lg max-w-[70%] ${message.sender === 'user'
                                                ? 'bg-black text-white rounded-br-sm'
                                                : 'bg-white text-gray-800 rounded-bl-sm border border-gray-200'
                                                }`}>
                                                <p className="text-sm break-words">{message.text}</p>
                                                <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                                                    }`}>
                                                    {message.timestamp}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {isTyping && (
                                    <div className="mb-3 flex justify-start">
                                        <div className="flex items-start space-x-2">
                                            <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center flex-shrink-0">
                                                <Bot size={16} />
                                            </div>
                                            <div className="bg-white text-gray-800 rounded-lg rounded-bl-sm border border-gray-200 p-3">
                                                <div className="flex space-x-1">
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-3 border-t border-gray-200 bg-white rounded-b-lg">
                                <div className="flex space-x-2">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={inputMessage}
                                        onChange={handleInputChange}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Type your message..."
                                        className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        aria-label="Type your message"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={inputMessage.trim() === ''}
                                        className="bg-black text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        aria-label="Send message"
                                    >
                                        <Send size={16} />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default LiveChatComponent;