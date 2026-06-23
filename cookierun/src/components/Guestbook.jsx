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
    <section className="section-block gap-8">
      <div className="text-center">
        <h2 className="point-text paint-title-heading text-[22px] font-semibold leading-[1.2] tracking-[-0.04em]">
          <span className="paint-title">방명록</span>
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="guestbook-form space-y-4">
        <input
          type="text"
          placeholder="이름"
          className="guestbook-input w-full px-1 py-3 text-[13px] text-black outline-none transition"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <textarea
          placeholder="축하 메시지를 남겨주세요"
          className="guestbook-input h-28 w-full resize-none px-1 py-3 text-[13px] text-black outline-none transition"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="guestbook-submit-button inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-[13px] transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send size={16} />
          {loading ? '보내는 중...' : '축하메시지 보내기'}
        </button>
      </form>

      <div className="space-y-4">
        {fetching ? (
          <div className="guestbook-empty px-5 py-10 text-center text-black/45">
            로딩 중...
          </div>
        ) : messages.length > 0 ? (
          <>
            {messages.map((message) => (
              <article
                key={message.id}
                className="guestbook-message px-1 py-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="guestbook-avatar flex h-10 w-10 items-center justify-center rounded-full text-black/50">
                      <User size={16} />
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-black">{message.name}</p>
                      <p className="text-xs text-black/35">
                        {new Date(message.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="mt-4 whitespace-pre-wrap text-[13px] leading-relaxed text-black/70">
                  {message.content}
                </p>
              </article>
            ))}
            {hasMore && (
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="guestbook-more-button w-full rounded-full py-3 text-[13px] text-black/55 transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loadingMore ? '불러오는 중..' : `더보기 (${totalCount - fetchedOffset}개 남음)`}
              </button>
            )}
          </>
        ) : (
          <div className="guestbook-empty px-5 py-10 text-center text-black/45">
            <MessageSquare size={28} className="mx-auto mb-3 opacity-40" />
            첫 번째 축하 메시지를 남겨주세요.
          </div>
        )}
      </div>
    </section>
  );
};

export default Guestbook;
