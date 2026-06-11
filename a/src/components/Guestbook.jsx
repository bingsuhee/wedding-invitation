import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Send, User, MessageSquare } from 'lucide-react';
import ScrollAnimationWrapper from './ScrollAnimationWrapper';

const Guestbook = () => {
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchMessages();

    // Listen to global subscription events from App.jsx
    const handleNewMessage = (e) => {
      const newMessage = e.detail;
      setMessages((prev) => [newMessage, ...prev]);
    };

    window.addEventListener('new-guestbook-message', handleNewMessage);

    return () => {
      window.removeEventListener('new-guestbook-message', handleNewMessage);
    };
  }, []);

  const fetchMessages = async () => {
    setFetching(true);
    try {
      const { data, error } = await supabase
        .from('guestbook')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching guestbook:', error.message);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('guestbook')
        .insert([{ name: name.trim(), content: content.trim() }]);

      if (error) throw error;

      setName('');
      setContent('');
      // No need to call fetchMessages() as Realtime subscription handles it
    } catch (error) {
      console.error('Error adding message:', error.message);
      alert('메시지 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full min-h-dvh flex flex-col items-center py-20 px-6 overflow-hidden">
      <ScrollAnimationWrapper amount={0.05} className="w-full max-w-sm">
      <div className="flex flex-col">
      <h3 className="text-xl mb-12 text-wedding-accent text-center font-bold">방명록</h3>

      <form onSubmit={handleSubmit} className="mb-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 shrink-0">
        <div className="mb-4">
          <input
            type="text"
            placeholder="이름"
            className="w-full px-4 py-2 rounded-xl border border-gray-100 bg-gray-50/50 focus:outline-none focus:ring-1 focus:ring-wedding-accent/30 text-base"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="축하 메시지를 남겨주세요"
            className="w-full h-16 px-4 py-2 rounded-xl border border-gray-100 bg-gray-50/50 focus:outline-none focus:ring-1 focus:ring-wedding-accent/30 text-base resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-wedding-accent text-white rounded-xl text-base font-bold transition hover:opacity-90 disabled:bg-gray-200 shadow-md shadow-wedding-accent/10"
        >
          <Send size={14} /> {loading ? '보내는 중...' : '축하메시지 보내기'}
        </button>
      </form>

      <div className="space-y-4 guestbook-list pb-10">
        {fetching ? (
          <div className="text-center py-10 text-gray-300 text-[10px]">로딩 중...</div>
        ) : messages.length > 0 ? (
          messages.map((msg) => (
            <div key={msg.id} className="bg-white p-4 rounded-xl border border-gray-50 flex gap-4 shadow-sm">
              <div className="flex-shrink-0 w-10 h-10 bg-wedding-accent/5 rounded-full flex items-center justify-center text-wedding-accent/30">
                <User size={20} />
              </div>
              <div className="flex-1 text-left">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-base text-gray-700">{msg.name}</span>
                  <span className="text-sm text-gray-300">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-base text-gray-500 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-300">
            <MessageSquare size={32} className="mx-auto mb-4 opacity-10" />
            <p className="text-base italic">첫 번째 축하 메시지를 남겨주세요.</p>
          </div>
        )}
      </div>
    </div>
    </ScrollAnimationWrapper>
  </section>
  );
};

export default Guestbook;
