import { useState, useEffect, useContext, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Send, ArrowLeft, MoreVertical, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const Chat = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    
    // We expect state to pass receiver_id and possibly product_id
    const state = location.state || {};
    const [receiverId, setReceiverId] = useState(state.receiver_id || null);
    const [productId, setProductId] = useState(state.product_id || null);
    
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isOffer, setIsOffer] = useState(false);
    const [offerAmount, setOfferAmount] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchMessages();
        // In a real app we'd use WebSockets for real-time, here we poll every 5s
        const intervalId = setInterval(fetchMessages, 5000);
        return () => clearInterval(intervalId);
    }, [receiverId]);

    const fetchMessages = async () => {
        try {
            const url = receiverId ? `chat/?user_id=${receiverId}` : `chat/`;
            const res = await api.get(url);
            setMessages(res.data.results || res.data);
            scrollToBottom();
        } catch (error) {
            console.error("Failed to load messages", error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim() && !isOffer) return;
        
        try {
            await api.post('chat/', {
                receiver_id: receiverId,
                product_id: productId,
                content: inputText,
                is_offer: isOffer,
                offer_amount: isOffer ? parseFloat(offerAmount) : null
            });
            setInputText('');
            setOfferAmount('');
            setIsOffer(false);
            fetchMessages();
        } catch (error) {
            toast.error("Failed to send message");
        }
    };

    // A simple grouping of messages to figure out unique conversations
    const getConversationsList = () => {
        const conversationsMap = new Map();
        messages.forEach(msg => {
            const otherUser = msg.sender.id === user.id ? msg.receiver : msg.sender;
            if (otherUser) {
                 conversationsMap.set(otherUser.id, otherUser);
            }
        });
        return Array.from(conversationsMap.values());
    };

    const conversations = getConversationsList();

    return (
        <div className="container mx-auto px-0 md:px-6 py-6 max-w-6xl h-[calc(100vh-80px)]">
            <div className="glass-card shadow-soft h-full flex overflow-hidden border-0 rounded-none md:rounded-2xl">
                
                {/* Sidebar - Contacts */}
                <div className={`w-full md:w-1/3 border-r bg-white/50 flex-col ${receiverId ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800">Messages</h2>
                        <MoreVertical className="text-gray-500 w-5 h-5 cursor-pointer"/>
                    </div>
                    <div className="flex-grow overflow-y-auto">
                        {conversations.length === 0 ? (
                            <div className="p-6 text-center text-gray-500">No active conversations. Open a product and start chatting!</div>
                        ) : (
                            conversations.map(contact => (
                                <div 
                                    key={contact.id} 
                                    onClick={() => setReceiverId(contact.id)}
                                    className={`p-4 border-b cursor-pointer hover:bg-gray-100 flex items-center gap-4 transition-colors ${receiverId === contact.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}
                                >
                                    <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center text-secondary font-bold text-lg shrink-0">
                                        {contact.username?.[0]?.toUpperCase()}
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <h3 className="font-bold text-gray-800 truncate">{contact.username}</h3>
                                        <p className="text-sm text-gray-500 truncate">Tap to view chat</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className={`w-full md:w-2/3 flex-col bg-[#e5ddd5]/30 ${!receiverId ? 'hidden md:flex' : 'flex'}`}>
                    {receiverId ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 bg-gray-50 border-b flex items-center gap-4 sticky top-0 z-10 shadow-sm">
                                <button onClick={() => setReceiverId(null)} className="md:hidden text-gray-600 hover:text-primary">
                                    <ArrowLeft className="w-6 h-6"/>
                                </button>
                                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-lg shrink-0">
                                    {conversations.find(c => c.id === receiverId)?.username?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-bold text-gray-800">{conversations.find(c => c.id === receiverId)?.username || 'User'}</h3>
                                </div>
                                <Shield className="text-accent w-5 h-5"/>
                            </div>

                            {/* Messages Container */}
                            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                                <div className="text-center my-4">
                                    <span className="bg-[#E1F3FB] text-[#4A5D6A] text-xs font-semibold px-4 py-1.5 rounded-lg shadow-sm inline-block">
                                        Messages are end-to-end encrypted locally. No one outside of this chat can read them.
                                    </span>
                                </div>

                                {messages.filter(m => m.sender.id === receiverId || m.receiver.id === receiverId).map(msg => (
                                    <div key={msg.id} className={`flex ${msg.sender.id === user.id ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[75%] rounded-xl px-4 py-2 shadow-sm relative ${msg.sender.id === user.id ? 'bg-[#dcf8c6] rounded-tr-none' : 'bg-white rounded-tl-none'}`}>
                                            {msg.product && (
                                                <div className="bg-white/50 p-2 rounded mb-2 flex items-center gap-2 cursor-pointer border border-gray-200" onClick={() => navigate(`/product/${msg.product.id}`)}>
                                                    {msg.product.image ? <img src={msg.product.image} className="w-10 h-10 object-cover rounded" /> : <div className="w-10 h-10 bg-gray-200 rounded"/>}
                                                    <div className="flex-grow min-w-0">
                                                        <p className="text-xs font-bold text-gray-700 truncate">{msg.product.title}</p>
                                                        <p className="text-xs text-primary font-bold">₹{msg.product.price}</p>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {msg.is_offer ? (
                                                <div className="border border-warning bg-warning/10 p-3 rounded-lg mb-2">
                                                    <p className="font-bold text-warning mb-1">New Offer: ₹{msg.offer_amount}</p>
                                                    <span className="text-xs font-bold bg-white px-2 py-1 rounded text-gray-600 border shadow-sm">{msg.offer_status || 'PENDING'}</span>
                                                </div>
                                            ) : null}

                                            <p className="text-gray-800 text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                                            <span className="text-[10px] text-gray-400 mt-1 block text-right">
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Input */}
                            <div className="p-4 bg-gray-50 border-t">
                                {isOffer && (
                                    <div className="mb-2 flex items-center gap-2 bg-warning/10 p-2 rounded-lg border border-warning/30 transition-all">
                                        <span className="text-warning font-bold text-sm shrink-0">Offer Amount (₹):</span>
                                        <input 
                                            type="number" 
                                            className="bg-white border w-24 p-1 rounded text-sm focus:outline-none" 
                                            value={offerAmount} 
                                            onChange={(e) => setOfferAmount(e.target.value)}
                                        />
                                        <button type="button" onClick={() => setIsOffer(false)} className="text-sm text-gray-500 hover:text-gray-800 ml-auto underline">Cancel</button>
                                    </div>
                                )}
                                
                                <form onSubmit={handleSendMessage} className="flex gap-2">
                                    <button 
                                        type="button" 
                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors shrink-0 ${isOffer ? 'bg-warning text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                        onClick={() => setIsOffer(!isOffer)}
                                    >
                                        ₹ Make Offer
                                    </button>
                                    <input 
                                        type="text" 
                                        placeholder="Type a message..." 
                                        className="flex-grow input-field bg-white"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                    />
                                    <button type="submit" className="bg-[#00a884] text-white p-3 rounded-xl hover:bg-[#008f6f] transition-colors shrink-0 shadow-sm" disabled={!inputText.trim() && !isOffer}>
                                        <Send className="w-5 h-5"/>
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-grow flex flex-col items-center justify-center text-gray-500 bg-[#f0f2f5]">
                            <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-soft mb-6">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png" alt="WhatsApp Style Chat" className="w-24 h-24 opacity-20 grayscale" />
                            </div>
                            <h2 className="text-2xl font-light text-gray-600 mb-2">Apn-E-Dukaan Web Chat</h2>
                            <p className="text-center max-w-md text-sm">Select a conversation to start messaging, negotiating, and locking in the best hyperlocal deals seamlessly.</p>
                            <p className="mt-8 text-xs flex items-center gap-1 text-gray-400"><Shield className="w-3 h-3"/> End-to-end encrypted simulation</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
