import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  CalendarDays,
  Camera,
  ChevronDown,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Heart,
  Image as ImageIcon,
  Mail,
  MapPinned,
  MessageCircleMore,
  Send,
  User,
  UserRound,
  WalletCards,
  X,
} from 'lucide-react';
import Map from '../../cookierun/src/components/Map';
import { supabase } from '@shared/lib/supabaseClient';
import { weddingInfo } from '@shared/data/info';
import { WebpImage } from '@shared/components/WebpImage';
import { toWebpSrc } from '@shared/lib/image';

const HERO_IMAGE = `${import.meta.env.BASE_URL}images/cookierun-hero.png`;
const BRIDE_ROOM_IMAGE = `${import.meta.env.BASE_URL}images/bride-room.jpg`;
const BANQUET_IMAGE = `${import.meta.env.BASE_URL}images/banquet-hall.jpg`;
const BRIDE_INTRO_IMAGE = `${import.meta.env.BASE_URL}images/cookierun-bride.png`;
const GROOM_INTRO_IMAGE = `${import.meta.env.BASE_URL}images/cookierun-groom.png`;
const PAGE_SIZE = 10;
const OPENING_PRELOAD_MIN_MS = 1200;
const INVITATION_MESSAGE_HTML = [
  '긴 여정 끝에 최고의 파티원을 만났습니다.',
  '인생의 솔로 플레이를 마치고,<br />이제는 둘이 함께 새로운 퀘스트에 도전합니다.',
  '*퀘스트: 행복하고 예쁘게 살기 (진행 중)*',
  '저희의 새로운 모험이 시작되는 날을 함께 응원해주세요.',
];

const APP_ICONS = {
  invitation: Mail,
  profile: UserRound,
  gallery: ImageIcon,
  map: MapPinned,
  guestbook: MessageCircleMore,
  account: WalletCards,
  rsvp: CalendarDays,
};

const APP_TITLES = {
  invitation: '초대장',
  profile: '우리 이야기',
  gallery: '갤러리',
  map: '예식장 안내',
  guestbook: '방명록',
  account: '축의금',
  rsvp: '참석 여부',
};

function preloadImage(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = toWebpSrc(src);
  });
}

function AppIcon({ appKey, label, onOpen }) {
  const Icon = APP_ICONS[appKey];

  return (
    <button type="button" className="home-app-button" onClick={() => onOpen(appKey)}>
      <span className={`home-app-icon app-${appKey}`}>
        <Icon size={22} strokeWidth={2.1} />
      </span>
      <span className="home-app-label">{label}</span>
    </button>
  );
}

function PhoneStatus() {
  const topLabel = `${weddingInfo.month}.${String(weddingInfo.day).padStart(2, '0')}`;

  return (
    <div className="phone-statusbar" aria-hidden="true">
      <span>{topLabel}</span>
      <div className="phone-status-icons">
        <span>5G</span>
        <span className="battery-pill">
          <span className="battery-fill" />
        </span>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="loading-screen" aria-label="Opening screen">
      <div className="loading-spinner-wrap">
        <div className="loading-spinner" />
      </div>
    </div>
  );
}

function LockScreen({ onUnlock }) {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const unlockThreshold = 110;
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const ceremonyWeekday =
    weekdays[new Date(weddingInfo.year, weddingInfo.month - 1, weddingInfo.day).getDay()];
  const lockDateLabel = `${weddingInfo.year}.${String(weddingInfo.month).padStart(2, '0')}.${String(weddingInfo.day).padStart(2, '0')} (${ceremonyWeekday})`;
  const lockTimeLabel = `${String(weddingInfo.hour).padStart(2, '0')}:${String(weddingInfo.minute).padStart(2, '0')}`;

  const beginSwipeTracking = (startY, moveEventName, endEventNames) => {
    let latestOffset = 0;

    const getClientY = (event) => {
      if ('touches' in event && event.touches.length > 0) {
        return event.touches[0].clientY;
      }

      if ('changedTouches' in event && event.changedTouches.length > 0) {
        return event.changedTouches[0].clientY;
      }

      return event.clientY;
    };

    const handleSwipeMove = (moveEvent) => {
      const deltaY = Math.max(0, startY - getClientY(moveEvent));
      latestOffset = Math.min(deltaY, 150);
      setSwipeOffset(latestOffset);
      setIsDragging(true);
    };

    const handleSwipeEnd = () => {
      window.removeEventListener(moveEventName, handleSwipeMove);
      endEventNames.forEach((eventName) => {
        window.removeEventListener(eventName, handleSwipeEnd);
      });

      if (latestOffset >= unlockThreshold) {
        onUnlock();
      }

      setSwipeOffset(0);
      setIsDragging(false);
    };

    window.addEventListener(moveEventName, handleSwipeMove, { passive: true });
    endEventNames.forEach((eventName) => {
      window.addEventListener(eventName, handleSwipeEnd, { passive: true });
    });
  };

  const handlePointerDown = (event) => {
    beginSwipeTracking(event.clientY, 'pointermove', ['pointerup', 'pointercancel']);
  };

  const handleTouchStart = (event) => {
    if (event.touches.length === 0) {
      return;
    }

    beginSwipeTracking(event.touches[0].clientY, 'touchmove', ['touchend', 'touchcancel']);
  };

  return (
    <div className="lock-screen">
      <div className="lock-screen-copy">
        <p className="lock-date">{lockDateLabel}</p>
        <p className="lock-time">{lockTimeLabel}</p>
      </div>

      <div
        className={`lock-bottom-stack ${isDragging ? 'is-dragging' : ''}`}
        style={{ transform: `translateY(${-swipeOffset}px)` }}
      >
        <div className="lock-widget-card">
          <div className="lock-widget-meta">
            <p className="lock-widget-label">Wedding invitation</p>
            <p className="lock-widget-time">1분 전</p>
          </div>
          <h1>{`${weddingInfo.groom.name} ♥ ${weddingInfo.bride.name}`}</h1>
          <p className="lock-subcopy">
            수빈이와 소희의 결혼식에 초대드립니다.
            <br />
            2026년 10월 11일 오후 12시 JK아트컨벤션 아트리움홀
          </p>
        </div>

        <button
          type="button"
          className="swipe-unlock"
          onPointerDown={handlePointerDown}
          onTouchStart={handleTouchStart}
          aria-label="위로 스와이프해 잠금 해제"
        >
          <span className="swipe-unlock-pill" />
          <span className="swipe-unlock-text">
            <ChevronUp size={16} />
            위로 스와이프
          </span>
        </button>
      </div>
    </div>
  );
}

function HomeScreen({ onOpen }) {
  const ceremonyDate = useMemo(
    () =>
      new Date(
        weddingInfo.year,
        weddingInfo.month - 1,
        weddingInfo.day,
        weddingInfo.hour,
        weddingInfo.minute,
        0
      ),
    []
  );
  const [remainingDaysText, setRemainingDaysText] = useState('000');

  useEffect(() => {
    const updateRemainingDays = () => {
      const now = new Date();
      const diffMs = Math.max(0, ceremonyDate.getTime() - now.getTime());
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      setRemainingDaysText(String(days).padStart(3, '0'));
    };

    updateRemainingDays();
    const intervalId = window.setInterval(updateRemainingDays, 60000);
    return () => window.clearInterval(intervalId);
  }, [ceremonyDate]);

  return (
    <div className="home-screen">
      <div className="home-widget-card">
        <div className="home-widget-content">
          <div className="home-widget-copy">
            <p className="home-widget-label">Notice</p>
            <h2>
              수빈<span className="widget-heart-text">♥</span>소희 결혼식까지
              <br />
              {remainingDaysText}일 남았습니다.
            </h2>
            <p>앱 아이콘을 눌러 상세 정보를 확인하세요</p>
          </div>
          <div className="home-widget-image-wrap" aria-hidden="true">
            <WebpImage src={HERO_IMAGE} alt="" className="home-widget-image" fetchPriority="high" />
          </div>
        </div>
      </div>

      <div className="home-bottom-stack">
        <div className="home-app-grid">
          <AppIcon appKey="invitation" label="초대장" onOpen={onOpen} />
          <AppIcon appKey="profile" label="우리 이야기" onOpen={onOpen} />
          <AppIcon appKey="gallery" label="갤러리" onOpen={onOpen} />
          <AppIcon appKey="map" label="예식장 안내" onOpen={onOpen} />
          <AppIcon appKey="guestbook" label="방명록" onOpen={onOpen} />
          <AppIcon appKey="account" label="축의금" onOpen={onOpen} />
          <AppIcon appKey="rsvp" label="참석 여부" onOpen={onOpen} />
        </div>

        <div className="home-dock">
          <button type="button" className="dock-button" onClick={() => onOpen('invitation')}>
            <Mail size={20} strokeWidth={2.1} />
          </button>
          <button type="button" className="dock-button" onClick={() => onOpen('gallery')}>
            <ImageIcon size={20} strokeWidth={2.1} />
          </button>
          <button type="button" className="dock-button" onClick={() => onOpen('map')}>
            <MapPinned size={20} strokeWidth={2.1} />
          </button>
          <button type="button" className="dock-button" onClick={() => onOpen('rsvp')}>
            <CalendarDays size={20} strokeWidth={2.1} />
          </button>
        </div>
      </div>
    </div>
  );
}

function InvitationScreen() {
  const groomGivenName = weddingInfo.groom.name.slice(1);
  const brideGivenName = weddingInfo.bride.name.slice(1);
  const invitationImage = weddingInfo.gallery[0]
    ? `${import.meta.env.BASE_URL}${weddingInfo.gallery[0].src}`
    : HERO_IMAGE;

  return (
    <div className="app-screen-content">
      <section className="screen-stack">
        <article className="ios-card hero-copy-card">
          <div className="invitation-inline-image-wrap">
            <img src={invitationImage} alt="" className="invitation-inline-image" />
          </div>
          <h3 className="hero-main-copy">
            <span className="hero-main-copy-line">
              <span className="hero-main-copy-name">{groomGivenName}</span>
              <span className="hero-main-copy-name">♥{brideGivenName}</span>의
            </span>
            <span className="hero-main-copy-line">결혼식에 초대드립니다.</span>
          </h3>
          <p className="hero-sub-copy">
            {weddingInfo.dateLabel} {weddingInfo.timeLabel}
            <br />
            {weddingInfo.location.name}
          </p>
        </article>

        <article className="ios-card text-card">
          <p className="party-copy-label">파티 모집 완료! 이제부터 같은 팀입니다.</p>
          <div className="message-stack">
            {INVITATION_MESSAGE_HTML.map((line, index) => (
              <p
                key={`${line}-${index}`}
                className={`message-block ${line.startsWith('*') ? 'is-emphasis' : ''}`}
                dangerouslySetInnerHTML={{
                  __html: line ? line.replace(/\*(.+)\*/, '$1') : '&nbsp;',
                }}
              />
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}

function ProfileScreen() {
  const groomGivenName = weddingInfo.groom.name.slice(1);
  const brideGivenName = weddingInfo.bride.name.slice(1);

  return (
    <div className="app-screen-content">
      <section className="screen-stack">
        <div className="profile-duo-grid">
          <article className="ios-card profile-card compact profile-card-groom">
            <WebpImage
              src={GROOM_INTRO_IMAGE}
              alt={`신랑 ${weddingInfo.groom.name}`}
              className="profile-image"
            />
            <div className="profile-copy">
              <p className="profile-heading">
                <span className="profile-role">신랑</span>
                <span className="profile-name">{weddingInfo.groom.name}</span>
              </p>
              <p>
                {weddingInfo.groom.father.name}, {weddingInfo.groom.mother.name}의 아들
              </p>
              <p>{weddingInfo.groom.profile.birthDate}</p>
              <div className="tag-list">
                {(weddingInfo.groom.introTags ?? weddingInfo.groom.profile.tags).map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </article>

          <article className="ios-card profile-card compact profile-card-bride">
            <div className="profile-copy">
              <p className="profile-heading">
                <span className="profile-role">신부</span>
                <span className="profile-name">{weddingInfo.bride.name}</span>
              </p>
              <p>
                {weddingInfo.bride.father.name}, {weddingInfo.bride.mother.name}의 딸
              </p>
              <p>{weddingInfo.bride.profile.birthDate}</p>
              <div className="tag-list bride-tag-list">
                {(weddingInfo.bride.introTags ?? weddingInfo.bride.profile.tags).map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
            <WebpImage
              src={BRIDE_INTRO_IMAGE}
              alt={`신부 ${weddingInfo.bride.name}`}
              className="profile-image"
            />
          </article>
        </div>

        {weddingInfo.loveStory.slice(0, 3).map((item) => (
          <article key={`${item.date}-${item.question}`} className="ios-card story-card">
            <p className="story-question">Question</p>
            <h3 className="story-title">{item.question}</h3>
            {item.image ? (
              <WebpImage
                src={`${import.meta.env.BASE_URL}${item.image}`}
                alt=""
                className="story-feature-image"
                loading="lazy"
              />
            ) : null}
            <div className="story-answer-card">
              <p className="story-speaker">{groomGivenName}</p>
              <p className="story-desc">{item.groomAnswer}</p>
            </div>
            <div className="story-answer-card">
              <p className="story-speaker">{brideGivenName}</p>
              <p className="story-desc">{item.brideAnswer}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

function GalleryScreen({ onOpenViewer }) {
  const images = weddingInfo.gallery.slice(0, 12);

  return (
    <div className="app-screen-content">
      <section className="screen-stack">
        <div className="gallery-grid only-images">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              className={`gallery-tile button-tile ${index === 0 ? 'is-large' : ''}`}
              onClick={() => onOpenViewer(index)}
            >
              <WebpImage
                src={`${import.meta.env.BASE_URL}${image.src}`}
                alt={image.caption}
                className="gallery-photo"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function GalleryViewer({ images, selectedIndex, onClose, onPrev, onNext }) {
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);
  const activeImage = images[selectedIndex];

  useEffect(() => {
    if (selectedIndex < 0) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowLeft') {
        onPrev();
      } else if (event.key === 'ArrowRight') {
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev, selectedIndex]);

  if (!activeImage) {
    return null;
  }

  const handleTouchStart = (event) => {
    touchStartXRef.current = event.changedTouches[0]?.clientX ?? 0;
    touchEndXRef.current = touchStartXRef.current;
  };

  const handleTouchEnd = (event) => {
    touchEndXRef.current = event.changedTouches[0]?.clientX ?? touchStartXRef.current;
    const deltaX = touchEndXRef.current - touchStartXRef.current;

    if (Math.abs(deltaX) < 48) {
      return;
    }

    if (deltaX > 0) {
      onPrev();
    } else {
      onNext();
    }
  };

  return (
    <div
      className="gallery-viewer-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="갤러리 이미지 전체 보기"
      onClick={onClose}
    >
      <button
        type="button"
        className="gallery-viewer-close-button"
        onClick={onClose}
        aria-label="갤러리 전체 화면 닫기"
      >
        <X size={22} />
      </button>
      <button
        type="button"
        className="gallery-viewer-nav left"
        onClick={(event) => {
          event.stopPropagation();
          onPrev();
        }}
        aria-label="이전 이미지 보기"
      >
        <ChevronLeft size={24} />
      </button>
      <div
        className="gallery-viewer-image-wrap"
        onClick={(event) => event.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <WebpImage
          src={`${import.meta.env.BASE_URL}${activeImage.src}`}
          alt={activeImage.caption}
          className="gallery-viewer-image"
        />
        <p className="gallery-viewer-caption">{activeImage.caption}</p>
      </div>
      <button
        type="button"
        className="gallery-viewer-nav right"
        onClick={(event) => {
          event.stopPropagation();
          onNext();
        }}
        aria-label="다음 이미지 보기"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}

function MapScreen() {
  const [infoTab, setInfoTab] = useState('bride-room');
  const infoImage = infoTab === 'bride-room' ? BRIDE_ROOM_IMAGE : BANQUET_IMAGE;

  return (
    <div className="app-screen-content iphone-map-screen">
      <section className="screen-stack">
        <div className="map-embedded-card">
          <Map />
        </div>
        <article className="ios-card">
          <div className="segmented-tabs" role="tablist" aria-label="예식장 안내">
            <button
              type="button"
              className={`segment-button ${infoTab === 'bride-room' ? 'is-active' : ''}`}
              onClick={() => setInfoTab('bride-room')}
            >
              신부대기실
            </button>
            <button
              type="button"
              className={`segment-button ${infoTab === 'banquet' ? 'is-active' : ''}`}
              onClick={() => setInfoTab('banquet')}
            >
              피로연장
            </button>
          </div>
          <WebpImage src={infoImage} alt="" className="info-photo" />
          <div className="info-copy">
            {infoTab === 'bride-room' ? (
              <>
                <p>신부대기실은 4층 계단 옆 통로로 올라오시면 바로 찾으실 수 있습니다.</p>
                <p>직원 안내를 따라 이동하시면 보다 편하게 입장하실 수 있습니다.</p>
              </>
            ) : (
              <>
                <p>피로연장은 예식장 바로 옆에 위치해 있으며 예식 30분 전부터 이용 가능합니다.</p>
                <p>다양한 뷔페 메뉴와 음료 코너를 편하게 즐겨주세요.</p>
              </>
            )}
          </div>
          <div className="venue-copy">
            <p className="venue-name">{weddingInfo.location.name}</p>
            <p className="venue-address">{weddingInfo.location.address}</p>
          </div>
        </article>
      </section>
    </div>
  );
}

function GuestbookScreen() {
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [fetchedOffset, setFetchedOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
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

    fetchMessages(0, false);
  }, []);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      const { data, error, count } = await supabase
        .from('guestbook')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(fetchedOffset, fetchedOffset + PAGE_SIZE - 1);

      if (error) throw error;
      const fetched = data || [];
      setMessages((prev) => [...prev, ...fetched]);
      setFetchedOffset((prev) => prev + fetched.length);
      setTotalCount(count ?? 0);
    } catch (error) {
      console.error('Error loading more guestbook:', error.message);
    } finally {
      setLoadingMore(false);
    }
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
      window.alert('메시지 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const hasMore = fetchedOffset < totalCount;

  return (
    <div className="app-screen-content">
      <section className="screen-stack">
        <article className="ios-card guestbook-card">
          <form onSubmit={handleSubmit} className="guestbook-form-card">
            <input
              type="text"
              placeholder="이름"
              className="guestbook-input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
            <textarea
              placeholder="축하 메시지를 남겨주세요"
              className="guestbook-input textarea"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              required
            />
            <button type="submit" disabled={loading} className="guestbook-submit-button">
              <Send size={16} />
              {loading ? '보내는 중...' : '축하 메시지 보내기'}
            </button>
          </form>
        </article>

        <article className="ios-card guestbook-card">
          {fetching ? (
            <div className="guestbook-empty-state">로딩 중...</div>
          ) : messages.length > 0 ? (
            <div className="guestbook-message-list">
              {messages.map((message) => (
                <article key={message.id} className="guestbook-message-card">
                  <div className="guestbook-message-head">
                    <div className="guestbook-avatar">
                      <User size={16} />
                    </div>
                    <div>
                      <p className="guestbook-name">{message.name}</p>
                      <p className="guestbook-date">
                        {new Date(message.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="guestbook-body">{message.content}</p>
                </article>
              ))}
              {hasMore ? (
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="guestbook-more-button"
                >
                  {loadingMore ? '불러오는 중...' : `더보기 (${totalCount - fetchedOffset})`}
                </button>
              ) : null}
            </div>
          ) : (
            <div className="guestbook-empty-state with-icon">
              <MessageCircleMore size={24} />
              <span>첫 번째 축하 메시지를 남겨주세요.</span>
            </div>
          )}
        </article>
      </section>
    </div>
  );
}

function AccountContent({ title, people }) {
  const [copiedAccount, setCopiedAccount] = useState('');

  const handleCopyAccount = async (account) => {
    try {
      await navigator.clipboard.writeText(account);
      setCopiedAccount(account);
      window.setTimeout(() => {
        setCopiedAccount((current) => (current === account ? '' : current));
      }, 1800);
    } catch (error) {
      window.alert('계좌번호 복사에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  return (
    <article className="ios-card">
      <div className="account-static-title">{title}</div>
      <div className="account-list always-open">
        {people.map((person, index) => (
          <div
            key={`${title}-${person.label}`}
            className={`account-row ${index === 0 ? 'first-row' : ''}`}
          >
            <div>
              <p className="account-label">{person.label}</p>
              <p className="account-name">{person.name}</p>
              <p className="account-number">{person.account}</p>
            </div>
            <button
              type="button"
              className="copy-button"
              onClick={() => handleCopyAccount(person.account)}
            >
              {copiedAccount === person.account ? '복사됨' : '복사'}
            </button>
          </div>
        ))}
      </div>
    </article>
  );
}

function AccountScreen() {
  return (
    <div className="app-screen-content">
      <section className="screen-stack">
        <article className="ios-card text-card">
          <p className="message-block small">
            축하의 마음을 전해주시는 분들을 위해
            <br />
            계좌 정보를 함께 안내드립니다.
          </p>
        </article>

        <AccountContent
          title="신랑측"
          people={[
            { label: '신랑', name: weddingInfo.groom.name, account: weddingInfo.groom.account },
            { label: '부', name: weddingInfo.groom.father.name, account: weddingInfo.groom.father.account },
            { label: '모', name: weddingInfo.groom.mother.name, account: weddingInfo.groom.mother.account },
          ]}
        />

        <AccountContent
          title="신부측"
          people={[
            { label: '신부', name: weddingInfo.bride.name, account: weddingInfo.bride.account },
            { label: '부', name: weddingInfo.bride.father.name, account: weddingInfo.bride.father.account },
            { label: '모', name: weddingInfo.bride.mother.name, account: weddingInfo.bride.mother.account },
          ]}
        />
      </section>
    </div>
  );
}

function AttendanceScreen() {
  const [attendanceSide, setAttendanceSide] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState('');
  const [attendanceName, setAttendanceName] = useState('');
  const [attendanceMeal, setAttendanceMeal] = useState('');
  const [attendanceCompanionCount, setAttendanceCompanionCount] = useState('');
  const [attendanceNote, setAttendanceNote] = useState('');
  const [attendanceConsent, setAttendanceConsent] = useState(false);
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  const canSubmitAttendance =
    attendanceSide &&
    attendanceStatus &&
    attendanceMeal &&
    attendanceName.trim() &&
    attendanceConsent;

  const resetAttendanceForm = () => {
    setAttendanceSide('');
    setAttendanceStatus('');
    setAttendanceName('');
    setAttendanceMeal('');
    setAttendanceCompanionCount('');
    setAttendanceNote('');
    setAttendanceConsent(false);
  };

  const handleAttendanceSubmit = async () => {
    setAttendanceLoading(true);
    try {
      const { error } = await supabase.from('rsvp').insert([
        {
          name: attendanceName.trim(),
          side: attendanceSide,
          status: attendanceStatus,
          meal: attendanceMeal,
          companion_count: attendanceCompanionCount === '' ? null : Number(attendanceCompanionCount),
          note: attendanceNote.trim() || null,
        },
      ]);

      if (error) throw error;

      window.alert('참석 의사가 전달되었습니다. 감사합니다!');
      resetAttendanceForm();
    } catch (error) {
      console.error('참석 여부 전달 실패:', error);
      window.alert('전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setAttendanceLoading(false);
    }
  };

  return (
    <div className="app-screen-content">
      <section className="screen-stack">
        <article className="ios-card text-card">
          <p className="message-block small">
            참석 가능 여부를 미리 알려주시면
            <br />
            더 편안하게 예식을 준비할 수 있습니다.
          </p>
        </article>

        <article className="ios-card attendance-card">
          <div className="attendance-form-section">
            <p className="attendance-label">어느 측 하객이신가요? <span>*</span></p>
            <div className="attendance-segment-grid two-columns">
              <button
                type="button"
                onClick={() => setAttendanceSide('groom')}
                className={`attendance-segment-button ${attendanceSide === 'groom' ? 'is-active' : ''}`}
              >
                신랑측
              </button>
              <button
                type="button"
                onClick={() => setAttendanceSide('bride')}
                className={`attendance-segment-button ${attendanceSide === 'bride' ? 'is-active' : ''}`}
              >
                신부측
              </button>
            </div>
          </div>

          <div className="attendance-form-section">
            <p className="attendance-label">참석 여부 <span>*</span></p>
            <div className="attendance-segment-grid two-columns">
              <button
                type="button"
                onClick={() => setAttendanceStatus('attending')}
                className={`attendance-segment-button ${attendanceStatus === 'attending' ? 'is-active' : ''}`}
              >
                참석
              </button>
              <button
                type="button"
                onClick={() => setAttendanceStatus('absent')}
                className={`attendance-segment-button ${attendanceStatus === 'absent' ? 'is-active' : ''}`}
              >
                불참
              </button>
            </div>
          </div>

          <div className="attendance-form-section">
            <p className="attendance-label">식사 여부 <span>*</span></p>
            <div className="attendance-segment-grid three-columns">
              <button
                type="button"
                onClick={() => setAttendanceMeal('yes')}
                className={`attendance-segment-button ${attendanceMeal === 'yes' ? 'is-active' : ''}`}
              >
                가능
              </button>
              <button
                type="button"
                onClick={() => setAttendanceMeal('no')}
                className={`attendance-segment-button ${attendanceMeal === 'no' ? 'is-active' : ''}`}
              >
                불가
              </button>
              <button
                type="button"
                onClick={() => setAttendanceMeal('undecided')}
                className={`attendance-segment-button ${attendanceMeal === 'undecided' ? 'is-active' : ''}`}
              >
                미정
              </button>
            </div>
          </div>

          <div className="attendance-form-section">
            <p className="attendance-label">성함 <span>*</span></p>
            <input
              type="text"
              value={attendanceName}
              onChange={(event) => setAttendanceName(event.target.value)}
              placeholder="성함을 입력해주세요"
              className="attendance-text-input"
            />
          </div>

          <div className="attendance-form-section">
            <p className="attendance-label">동행 인원</p>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={attendanceCompanionCount}
              onChange={(event) => setAttendanceCompanionCount(event.target.value)}
              placeholder="본인 제외 추가 인원 수"
              className="attendance-text-input"
            />
          </div>

          <div className="attendance-form-section">
            <p className="attendance-label">전달사항</p>
            <textarea
              value={attendanceNote}
              onChange={(event) => setAttendanceNote(event.target.value)}
              placeholder="남기고 싶은 말씀을 적어주세요"
              className="attendance-textarea"
            />
          </div>

          <div className="attendance-consent-row">
            <button
              type="button"
              onClick={() => setAttendanceConsent((prev) => !prev)}
              className={`attendance-consent-box ${attendanceConsent ? 'is-active' : ''}`}
              aria-label="개인정보 수집 및 이용 동의"
            >
              <Check size={12} />
            </button>
            <div className="attendance-consent-copy">
              <span>개인정보 수집 및 이용에 동의합니다.</span>
              <button
                type="button"
                className="attendance-consent-link"
                onClick={() => window.alert('참석 의사 확인을 위한 최소한의 정보만 수집합니다.')}
              >
                자세히 보기
              </button>
            </div>
          </div>

          <button
            type="button"
            disabled={!canSubmitAttendance || attendanceLoading}
            onClick={handleAttendanceSubmit}
            className="attendance-submit-button"
          >
            {attendanceLoading ? '전달 중...' : '참석 여부 전달하기'}
          </button>
        </article>
      </section>
    </div>
  );
}

function MapScreenEnhanced() {
  const [infoTab, setInfoTab] = useState('bride-room');
  const infoImage = infoTab === 'bride-room' ? BRIDE_ROOM_IMAGE : BANQUET_IMAGE;

  return (
    <div className="app-screen-content iphone-map-screen">
      <section className="screen-stack">
        <div className="map-embedded-card">
          <Map />
        </div>
        <article className="ios-card">
          <div className="segmented-tabs" role="tablist" aria-label="예식장 안내">
            <button
              type="button"
              className={`segment-button ${infoTab === 'bride-room' ? 'is-active' : ''}`}
              onClick={() => setInfoTab('bride-room')}
            >
              신부대기실
            </button>
            <button
              type="button"
              className={`segment-button ${infoTab === 'banquet' ? 'is-active' : ''}`}
              onClick={() => setInfoTab('banquet')}
            >
              피로연장
            </button>
          </div>
          <WebpImage src={infoImage} alt="" className="info-photo" />
          <div className="info-copy">
            {infoTab === 'bride-room' ? (
              <p>직원 안내를 따라 이동하시면 보다 편하게 입장하실 수 있습니다.</p>
            ) : (
              <>
                <p>피로연장은 예식장 바로 옆에 위치해 있으며 예식 30분 전부터 이용 가능합니다.</p>
                <p>다양한 뷔페 메뉴와 음료 코너를 편하게 즐겨주세요.</p>
              </>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}

function App() {
  const [isBooting, setIsBooting] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeApp, setActiveApp] = useState('');
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState(-1);
  const galleryImages = useMemo(() => weddingInfo.gallery.slice(0, 12), []);
  const currentStage = isBooting ? 'loading' : !isUnlocked ? 'lock' : activeApp ? 'detail' : 'home';
  const activeAppTitle = activeApp ? APP_TITLES[activeApp] : '';
  const ActiveAppIcon = activeApp ? APP_ICONS[activeApp] : Mail;

  useEffect(() => {
    let isMounted = true;

    const prepareOpening = async () => {
      const startedAt = window.performance.now();

      await Promise.allSettled([
        preloadImage(HERO_IMAGE),
        preloadImage(BRIDE_INTRO_IMAGE),
        preloadImage(GROOM_INTRO_IMAGE),
      ]);

      const elapsed = window.performance.now() - startedAt;
      const remaining = Math.max(0, OPENING_PRELOAD_MIN_MS - elapsed);

      window.setTimeout(() => {
        if (isMounted) {
          setIsBooting(false);
        }
      }, remaining);
    };

    prepareOpening();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    document.title = `${weddingInfo.groom.name} and ${weddingInfo.bride.name} | Wedding Invitation`;

    const description = `${weddingInfo.dateLabel} ${weddingInfo.timeLabel}, ${weddingInfo.location.name}`;

    const updateMeta = (name, content, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector);

      if (!element) {
        element = document.createElement('meta');
        if (property) element.setAttribute('property', name);
        else element.setAttribute('name', name);
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    };

    updateMeta('description', description);
    updateMeta('og:title', document.title, true);
    updateMeta('og:description', description, true);
    updateMeta('twitter:title', document.title);
    updateMeta('twitter:description', description);
  }, []);

  useEffect(() => {
    document.body.classList.add('iphone-body-lock');
    document.documentElement.classList.add('iphone-html-lock');
    return () => {
      document.body.classList.remove('iphone-body-lock');
      document.documentElement.classList.remove('iphone-html-lock');
    };
  }, []);

  useEffect(() => {
    const isViewerOpen = selectedGalleryIndex >= 0;
    document.body.classList.toggle('gallery-viewer-open', isViewerOpen);
    document.documentElement.classList.toggle('gallery-viewer-open', isViewerOpen);

    return () => {
      document.body.classList.remove('gallery-viewer-open');
      document.documentElement.classList.remove('gallery-viewer-open');
    };
  }, [selectedGalleryIndex]);

  const closeViewer = () => setSelectedGalleryIndex(-1);
  const showPrevImage = () =>
    setSelectedGalleryIndex((prev) => (prev <= 0 ? galleryImages.length - 1 : prev - 1));
  const showNextImage = () =>
    setSelectedGalleryIndex((prev) => (prev >= galleryImages.length - 1 ? 0 : prev + 1));

  const appContent = {
    invitation: <InvitationScreen />,
    profile: <ProfileScreen />,
    gallery: <GalleryScreen onOpenViewer={setSelectedGalleryIndex} />,
    map: <MapScreen />,
    guestbook: <GuestbookScreen />,
    account: <AccountScreen />,
    rsvp: <AttendanceScreen />,
  };

  return (
    <div className="iphone-page-shell">
      <main
        className={`phone-screen mobile-phone-screen is-stage-${currentStage} ${activeApp ? 'is-detail-open' : ''}`}
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(11, 19, 28, 0.08), rgba(11, 19, 28, 0.42)), url(${toWebpSrc(HERO_IMAGE)})`,
        }}
      >
        <PhoneStatus />

        {isBooting ? (
          <div className="stage-panel stage-panel-loading" key="loading">
            <LoadingScreen />
          </div>
        ) : !isUnlocked ? (
          <div className="stage-panel stage-panel-lock" key="lock">
            <LockScreen onUnlock={() => setIsUnlocked(true)} />
          </div>
        ) : !activeApp ? (
          <div className="stage-panel stage-panel-home" key="home">
            <HomeScreen onOpen={setActiveApp} />
          </div>
        ) : (
          <div className="opened-app-shell stage-panel stage-panel-detail" key={activeApp}>
            <div className="opened-app-header">
              <div className="opened-app-spacer" />
              <div className="opened-app-title">
                <ActiveAppIcon size={18} strokeWidth={2.1} />
                <span>{activeAppTitle}</span>
              </div>
              <button type="button" className="close-app-button" onClick={() => setActiveApp('')}>
                <ChevronDown size={18} />
              </button>
            </div>
            <div className="opened-app-body">{appContent[activeApp]}</div>
          </div>
        )}
      </main>
      {selectedGalleryIndex >= 0 ? (
        <GalleryViewer
          images={galleryImages}
          selectedIndex={selectedGalleryIndex}
          onClose={closeViewer}
          onPrev={showPrevImage}
          onNext={showNextImage}
        />
      ) : null}
    </div>
  );
}

export default App;
