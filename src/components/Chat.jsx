import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserById, sendMessage, getMessages } from '../utils/api';
import './Chat.css';

const Chat = ({ productId, sellerId, currentUserId, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sellerData = await getUserById(sellerId);
                setSeller(sellerData);
                const chatMessages = await getMessages(currentUserId, sellerId, productId);
                setMessages(chatMessages);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching chat data:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, [sellerId, currentUserId, productId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() && attachments.length === 0) return;

        try {
            const messageData = {
                senderId: currentUserId,
                receiverId: sellerId,
                productId: productId,
                content: newMessage,
                attachments: attachments,
                timestamp: new Date().toISOString()
            };

            await sendMessage(messageData);
            setMessages([...messages, messageData]);
            setNewMessage('');
            setAttachments([]);
            setShowEmojiPicker(false);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleInputChange = (e) => {
        setNewMessage(e.target.value);
        setIsTyping(true);
        // Simulate seller typing indicator
        setTimeout(() => setIsTyping(false), 1500);
    };

    const handleFileAttachment = (e) => {
        const files = Array.from(e.target.files);
        setAttachments([...attachments, ...files]);
    };

    const removeAttachment = (index) => {
        setAttachments(attachments.filter((_, i) => i !== index));
    };

    const handleEmojiSelect = (emoji) => {
        setNewMessage(prev => prev + emoji);
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };

    const handleBack = () => {
        if (onClose) {
            onClose();
        } else {
            navigate('/dashboard');
        }
    };

    if (loading) {
        return (
            <div className="chat-loading">
                <div className="loading-spinner"></div>
                <p>Loading conversation...</p>
            </div>
        );
    }

    return (
        <div className="chat-container">
            <div className="chat-header">
                <div className="chat-header-info">
                    <button className="back-btn" onClick={handleBack}>
                        <i className="fas fa-arrow-left"></i>
                    </button>
                    <div className="seller-avatar">
                        {seller?.profileImage ? (
                            <img src={seller.profileImage} alt={seller.name} />
                        ) : (
                            <div className="avatar-placeholder">
                                {seller?.name?.charAt(0) || 'U'}
                            </div>
                        )}
                    </div>
                    <div className="seller-details">
                        <h3>{seller?.name || 'User'}</h3>
                        <p className="seller-status">
                            {isTyping ? 'typing...' : 'online'}
                        </p>
                    </div>
                </div>
                <div className="chat-header-actions">
                    <button onClick={handleBack} className="close-chat-btn">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            </div>

            <div className="messages-container">
                {messages.length === 0 ? (
                    <div className="no-messages">
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((message, index) => {
                        const showDate = index === 0 ||
                            formatDate(messages[index].timestamp) !== formatDate(messages[index - 1].timestamp);

                        return (
                            <React.Fragment key={index}>
                                {showDate && (
                                    <div className="message-date-divider">
                                        <span>{formatDate(message.timestamp)}</span>
                                    </div>
                                )}
                                <div
                                    className={`message ${message.senderId === currentUserId ? 'sent' : 'received'}`}
                                >
                                    {message.senderId !== currentUserId && (
                                        <div className="message-avatar">
                                            {seller?.profileImage ? (
                                                <img src={seller.profileImage} alt={seller.name} />
                                            ) : (
                                                <div className="avatar-placeholder">
                                                    {seller?.name?.charAt(0) || 'U'}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div className="message-bubble">
                                        {message.attachments?.length > 0 && (
                                            <div className="message-attachments">
                                                {message.attachments.map((attachment, i) => (
                                                    <div key={i} className="attachment-preview">
                                                        {attachment.type.startsWith('image/') ? (
                                                            <img src={URL.createObjectURL(attachment)} alt="attachment" />
                                                        ) : (
                                                            <div className="file-attachment">
                                                                <i className="fas fa-file"></i>
                                                                <span>{attachment.name}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <div className="message-content">
                                            {message.content}
                                        </div>
                                        <div className="message-timestamp">
                                            {formatTime(message.timestamp)}
                                            {message.senderId === currentUserId && (
                                                <span className="message-status">
                                                    <i className="fas fa-check-double"></i>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {attachments.length > 0 && (
                <div className="attachments-preview">
                    {attachments.map((file, index) => (
                        <div key={index} className="attachment-item">
                            {file.type.startsWith('image/') ? (
                                <img src={URL.createObjectURL(file)} alt="preview" />
                            ) : (
                                <div className="file-preview">
                                    <i className="fas fa-file"></i>
                                    <span>{file.name}</span>
                                </div>
                            )}
                            <button
                                className="remove-attachment"
                                onClick={() => removeAttachment(index)}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <form onSubmit={handleSendMessage} className="message-input-form">
                <div className="message-input-wrapper">
                    <button
                        type="button"
                        className="attachment-btn"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <i className="fas fa-paperclip"></i>
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileAttachment}
                        multiple
                        style={{ display: 'none' }}
                    />
                    <input
                        type="text"
                        value={newMessage}
                        onChange={handleInputChange}
                        placeholder="Type a message..."
                        className="message-input"
                    />
                    <button
                        type="button"
                        className="emoji-btn"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                        <i className="far fa-smile"></i>
                    </button>
                </div>
                <button type="submit" className="send-message-btn">
                    <i className="fas fa-paper-plane"></i>
                </button>
            </form>
        </div>
    );
};

export default Chat; 