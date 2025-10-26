import React, { useState, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useContract } from '../hooks/useContract';
import MessageItem from './MessageItem';
import UserList from './UserList';
import '../styles/ChatRoom.css';

function ChatRoom({ onOpenPrivateChat }) {
  const { address } = useAccount();
  const { sendMessage, getLatestMessages, getTotalMessages, listenToMessages } = useContract();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showUserList, setShowUserList] = useState(false);
  const [totalMessages, setTotalMessages] = useState(0);
  
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load initial messages
  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Listen to new messages event
  useEffect(() => {
    const unsubscribe = listenToMessages((newMsg) => {
      setMessages(prev => {
        // Check if message already exists
        const exists = prev.some(m => m.messageId === newMsg.messageId);
        if (exists) return prev;
        return [...prev, newMsg];
      });
      scrollToBottom();
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const total = await getTotalMessages();
      setTotalMessages(Number(total));
      
      // Load last 100 messages
      const msgs = await getLatestMessages(100);
      setMessages(msgs);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    if (newMessage.length > 1000) {
      alert('Message is too long (max 1000 characters)');
      return;
    }

    setIsSending(true);
    
    try {
      await sendMessage(newMessage);
      setNewMessage('');
      
      // Reload messages after a short delay
      setTimeout(loadMessages, 2000);
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="chat-room">
      <div className="chat-header">
        <div className="chat-header-info">
          <h2 className="chat-title">Global Chat</h2>
          <span className="message-count">
            {totalMessages} message{totalMessages !== 1 ? 's' : ''} on-chain
          </span>
        </div>
        <button 
          className="users-toggle-btn"
          onClick={() => setShowUserList(!showUserList)}
        >
          <span className="icon">👥</span>
          {showUserList ? 'Hide' : 'Show'} Users
        </button>
      </div>

      <div className="chat-container">
        <div className="chat-messages-wrapper">
          <div className="chat-messages" ref={chatContainerRef}>
            {isLoading ? (
              <div className="loading-messages">
                <div className="spinner"></div>
                <p>Loading messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="no-messages">
                <span className="no-messages-icon">💬</span>
                <p>No messages yet. Be the first to say something!</p>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <MessageItem
                    key={`${message.messageId}-${index}`}
                    message={message}
                    isOwnMessage={message.sender?.toLowerCase() === address?.toLowerCase()}
                    onUserClick={onOpenPrivateChat}
                  />
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="message-input-form">
            <div className="message-input-container">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message... (Shift+Enter for new line)"
                className="message-input"
                disabled={isSending}
                rows={1}
                maxLength={1000}
              />
              <div className="input-actions">
                <span className="char-count">
                  {newMessage.length}/1000
                </span>
                <button
                  type="submit"
                  className="send-btn"
                  disabled={isSending || !newMessage.trim()}
                >
                  {isSending ? (
                    <span className="spinner small"></span>
                  ) : (
                    <span className="send-icon">➤</span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {showUserList && (
          <div className="chat-sidebar">
            <UserList onUserClick={onOpenPrivateChat} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatRoom;

