import React, { useEffect, useState } from 'react';
import { MessageSquare, Send, User } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const PAGE_SIZE = 10;

const Guestbook = () => {
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [fetchedOffset, setFetchedOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchMessages(0, false);
  }, []);

  const fetchMessages = async (offset, append) => {
    if (!append) setFetching(true);
    else setLoadingMore(true);

    try {
      const { data, error, count } = await supabase
        .from('guestbook')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);

      if (error) throw error;

      const fetched = data || [];
      setMessages((prev) => (append ? [...prev, ...fetched] : fetched));
      setFetchedOffset(offset + fetched.length);
      setTotalCount(count ?? 0);
    } catch (error) {
      console.error('Error fetching guestbook:', error.message);
    } finally {
      setFetching(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    fetchMessages(fetchedOffset, true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim() || !content.trim()) return;
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('guestbook')
        .insert([{ name: name.trim(), content: content.trim() }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setMessages((prev) => [data, ...prev]);
        setTotalCount((prev) => prev + 1);
      }
      setName('');
      setContent('');
    } catch (error) {
      console.error('Error adding message:', error.message);
      alert('메시지 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const hasMore = fetchedOffset < totalCount;

  return (
    <section className="px-8 py-10">
      <div className="text-center mb-8">
        <p className="font-garamyeon text-[22px] text-[#2d1f14]">방명록</p>
        <p className="text-[9px] tracking-[0.3em] uppercase text-[#8b6b4a] mt-1">GUESTBOOK</p>
      </div>

      <form onSubmit={handleSubmit} className="paper-card p-5 mb-6 space-y-4">
        <input
          type="text"
          placeholder="이름"
          className="ink-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="축하 메시지를 남겨주세요"
          className="ink-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 bg-[#2d1f14] text-white text-[12px] tracking-[0.08em] py-3 rounded-sm hover:bg-[#b07d64] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={14} />
          {loading ? '보내는 중...' : '축하메시지 보내기'}
        </button>
      </form>

      <div className="space-y-4">
        {fetching ? (
          <div className="text-center py-10 text-[12px] text-[#8b6b4a]">로딩 중...</div>
        ) : messages.length > 0 ? (
          <>
            {messages.map((message) => (
              <article key={message.id} className="paper-card px-5 py-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0e8db] text-[#8b6b4a]">
                    <User size={14} />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-[#2d1f14]">{message.name}</p>
                    <p className="text-[10px] text-[#8b6b4a]">
                      {new Date(message.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-[12px] leading-relaxed text-[#5a3e2b] whitespace-pre-wrap">
                  {message.content}
                </p>
              </article>
            ))}
            {hasMore && (
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="w-full py-3 text-[12px] text-[#8b6b4a] border border-[#2d1f14]/12 rounded-sm bg-white hover:bg-[#f0e8db] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingMore ? '불러오는 중...' : `더 보기 (${totalCount - fetchedOffset}개 남음)`}
              </button>
            )}
          </>
        ) : (
          <div className="text-center py-10 text-[12px] text-[#8b6b4a]">
            <MessageSquare size={24} className="mx-auto mb-3 opacity-40" />
            첫 번째 축하 메시지를 남겨주세요.
          </div>
        )}
      </div>
    </section>
  );
};

export default Guestbook;
