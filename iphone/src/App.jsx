import React, { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  Camera,
  ChevronDown,
  ChevronUp,
  Heart,
  Image as ImageIcon,
  Mail,
  MapPinned,
  MessageCircleMore,
  MoonStar,
  UserRound,
  WalletCards,
  X,
} from 'lucide-react';
import Map from '../../cookierun/src/components/Map';
import Guestbook from '../../cookierun/src/components/Guestbook';
import { weddingInfo } from '@shared/data/info';

const HERO_IMAGE = `${import.meta.env.BASE_URL}images/cookierun-hero.png`;
const BRIDE_ROOM_IMAGE = `${import.meta.env.BASE_URL}images/bride-room.jpg`;
const BANQUET_IMAGE = `${import.meta.env.BASE_URL}images/banquet-hall.jpg`;
const BRIDE_INTRO_IMAGE = `${import.meta.env.BASE_URL}images/cookierun-bride.png`;
const GROOM_INTRO_IMAGE = `${import.meta.env.BASE_URL}images/cookierun-groom.png`;
const HERO_MESSAGE_BLOCKS = [
  { text: '긴 여정 끝에 최고의 파티원을 만났습니다.' },
  { text: '인생의 솔로 플레이를 마치고,\n이제는 둘이 함께 새로운 퀘스트에 도전합니다.' },
  { text: '*퀘스트: 행복하고 예쁘게 살기 (진행 중)', bold: true },
  { text: '저희의 새로운 모험이 시작되는 날을 함께 응원해 주세요.' },
];
const APP_ICONS = {
  invitation: Mail,
  profile: UserRound,
  gallery: ImageIcon,
  map: MapPinned,
  guestbook: MessageCircleMore,
  account: WalletCards,
};

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

function ScreenTitle({ children }) {
  return (
    <div className="screen-title-wrap">
      <h2 className="paint-title-heading text-[20px] font-semibold leading-[1.2] tracking-[-0.04em]">
        <span className="paint-title">{children}</span>
      </h2>
    </div>
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

function LockScreen({ onUnlock }) {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const unlockThreshold = 110;

  const handlePointerDown = (event) => {
    const startY = event.clientY;
    let latestOffset = 0;

    const handlePointerMove = (moveEvent) => {
      const deltaY = Math.max(0, startY - moveEvent.clientY);
      latestOffset = Math.min(deltaY, 150);
      setSwipeOffset(latestOffset);
      setIsDragging(true);
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);

      if (latestOffset >= unlockThreshold) {
        onUnlock();
      }

      setSwipeOffset(0);
      setIsDragging(false);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  };

  return (
    <div className="lock-screen">
      <div className="lock-screen-copy">
        <p className="lock-date">{weddingInfo.dateLabel}</p>
        <p className="lock-time">{weddingInfo.timeLabel}</p>
        <h1>{`${weddingInfo.groom.name} ♥ ${weddingInfo.bride.name}`}</h1>
        <p className="lock-subcopy">
          긴 여정 끝에 최고의 파티원을 만났습니다.
          <br />
          위로 스와이프해 새로운 모험을 시작해 주세요.
        </p>
      </div>

      <button
        type="button"
        className={`swipe-unlock ${isDragging ? 'is-dragging' : ''}`}
        style={{ transform: `translateY(${-swipeOffset}px)` }}
        onPointerDown={handlePointerDown}
        onClick={onUnlock}
        aria-label="위로 스와이프해 잠금 해제"
      >
        <span className="swipe-unlock-pill" />
        <span className="swipe-unlock-text">
          <ChevronUp size={16} />
          위로 스와이프
        </span>
      </button>
    </div>
  );
}

function HomeScreen({ onOpen }) {
  return (
    <div className="home-screen">
      <div className="home-widget-card">
        <p className="home-widget-label">WEDDING APPS</p>
        <h2>{weddingInfo.groom.name} ♥ {weddingInfo.bride.name}</h2>
        <p>
          아이콘을 눌러 초대장, 소개, 갤러리,
          <br />
          길안내와 마음 전할 곳을 확인해 보세요.
        </p>
      </div>

      <div className="home-app-grid">
        <AppIcon appKey="invitation" label="초대장" onOpen={onOpen} />
        <AppIcon appKey="profile" label="소개" onOpen={onOpen} />
        <AppIcon appKey="gallery" label="갤러리" onOpen={onOpen} />
        <AppIcon appKey="map" label="길안내" onOpen={onOpen} />
        <AppIcon appKey="guestbook" label="방명록" onOpen={onOpen} />
        <AppIcon appKey="account" label="마음전달" onOpen={onOpen} />
      </div>

      <div className="home-dock">
        <button type="button" className="dock-button" onClick={() => onOpen('invitation')}>
          <Mail size={22} />
        </button>
        <button type="button" className="dock-button" onClick={() => onOpen('gallery')}>
          <Camera size={22} />
        </button>
        <button type="button" className="dock-button" onClick={() => onOpen('map')}>
          <MapPinned size={22} />
        </button>
        <button type="button" className="dock-button" onClick={() => onOpen('guestbook')}>
          <Heart size={22} />
        </button>
      </div>
    </div>
  );
}

function CountdownChip() {
  const ceremonyDate = useMemo(
    () => new Date(
      weddingInfo.year,
      weddingInfo.month - 1,
      weddingInfo.day,
      weddingInfo.hour,
      weddingInfo.minute,
      0
    ),
    []
  );
  const [remainingText, setRemainingText] = useState('');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diffMs = Math.max(0, ceremonyDate.getTime() - now.getTime());
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      setRemainingText(`D-${String(days).padStart(3, '0')}`);
    };

    updateCountdown();
    const intervalId = window.setInterval(updateCountdown, 60000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [ceremonyDate]);

  return (
    <div className="countdown-chip">
      <CalendarDays size={14} />
      <span>{remainingText}</span>
    </div>
  );
}

function InvitationScreen() {
  const groomGivenName = weddingInfo.groom.name.slice(1);
  const brideGivenName = weddingInfo.bride.name.slice(1);

  return (
    <div className="app-screen-content">
      <ScreenTitle>초대장</ScreenTitle>
      <section className="screen-stack">
        <article className="ios-card hero-copy-card">
          <p className="eyebrow-text">PARTY INVITATION</p>
          <p className="party-copy-label">파티 모집 완료! 이제부터 같은 팀입니다.</p>
          <h3 className="hero-main-copy">
            <span className="hero-main-copy-line">
              <span className="hero-main-copy-name">{groomGivenName}</span>이와
              <span className="hero-main-copy-name"> {brideGivenName}</span>의
            </span>
            <span className="hero-main-copy-line">결혼식에 초대드립니다.</span>
          </h3>
          <p className="hero-sub-copy">
            {weddingInfo.dateLabel} {weddingInfo.timeLabel}
            <br />
            {weddingInfo.location.name}
          </p>
          <CountdownChip />
        </article>

        <article className="ios-card text-card">
          <div className="message-stack">
            {HERO_MESSAGE_BLOCKS.map((line) => (
              <p key={line.text} className={`message-block ${line.bold ? 'is-emphasis' : ''}`}>
                {line.text.replace('*', '').split('\n').map((segment, index) => (
                  <React.Fragment key={`${line.text}-${segment}`}>
                    {index > 0 ? <br /> : null}
                    {segment}
                  </React.Fragment>
                ))}
              </p>
            ))}
          </div>
        </article>

        <article className="ios-card summary-grid-card">
          <div className="summary-grid">
            <div>
              <p className="summary-label">예식일</p>
              <p className="summary-value">{weddingInfo.dateLabel}</p>
            </div>
            <div>
              <p className="summary-label">예식시간</p>
              <p className="summary-value">{weddingInfo.timeLabel}</p>
            </div>
            <div>
              <p className="summary-label">예식장</p>
              <p className="summary-value">{weddingInfo.location.name}</p>
            </div>
            <div>
              <p className="summary-label">주소</p>
              <p className="summary-value">{weddingInfo.location.address}</p>
            </div>
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
      <ScreenTitle>우리의 소개</ScreenTitle>
      <section className="screen-stack">
        <article className="ios-card profile-card">
          <img
            src={BRIDE_INTRO_IMAGE}
            alt={`신부 ${weddingInfo.bride.name}`}
            className="profile-image"
          />
          <div className="profile-copy">
            <span className="profile-role">신부</span>
            <h3>{brideGivenName}</h3>
            <p>
              {weddingInfo.bride.father.name}, {weddingInfo.bride.mother.name}의 장녀
            </p>
            <p>{weddingInfo.bride.profile.birthDate}</p>
            <div className="tag-list">
              {weddingInfo.bride.profile.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </article>

        <article className="ios-card profile-card">
          <img
            src={GROOM_INTRO_IMAGE}
            alt={`신랑 ${weddingInfo.groom.name}`}
            className="profile-image"
          />
          <div className="profile-copy">
            <span className="profile-role">신랑</span>
            <h3>{groomGivenName}</h3>
            <p>
              {weddingInfo.groom.father.name}, {weddingInfo.groom.mother.name}의 장남
            </p>
            <p>{weddingInfo.groom.profile.birthDate}</p>
            <div className="tag-list">
              {weddingInfo.groom.profile.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </article>

        <article className="ios-card">
          <p className="card-caption">우리의 이야기</p>
          <div className="story-list">
            {weddingInfo.loveStory.slice(0, 3).map((item) => (
              <div key={`${item.date}-${item.title}`} className="story-row">
                <div className="story-dot" aria-hidden="true" />
                <div>
                  <p className="story-date">{item.date}</p>
                  <p className="story-title">Q. {item.question}</p>
                  <div className="story-answer-card">
                    <p className="story-speaker">{groomGivenName}</p>
                    <p className="story-desc">{item.groomAnswer}</p>
                  </div>
                  <div className="story-answer-card">
                    <p className="story-speaker">{brideGivenName}</p>
                    <p className="story-desc">{item.brideAnswer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}

function GalleryScreen() {
  return (
    <div className="app-screen-content">
      <ScreenTitle>갤러리</ScreenTitle>
      <section className="screen-stack">
        <div className="gallery-grid">
          {weddingInfo.gallery.slice(0, 8).map((image, index) => (
            <figure key={image.src} className={`gallery-tile ${index === 0 ? 'is-large' : ''}`}>
              <img
                src={`${import.meta.env.BASE_URL}${image.src}`}
                alt={image.caption}
                className="gallery-photo"
                loading="lazy"
              />
              <figcaption>{image.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}

function MapScreen() {
  const [infoTab, setInfoTab] = useState('bride-room');
  const infoImage = infoTab === 'bride-room' ? BRIDE_ROOM_IMAGE : BANQUET_IMAGE;

  return (
    <div className="app-screen-content">
      <section className="screen-stack">
        <Map />
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
              연회장
            </button>
          </div>
          <img src={infoImage} alt="" className="info-photo" />
          <div className="info-copy">
            {infoTab === 'bride-room' ? (
              <>
                <p>신부대기실은 4층 계단으로 올라오시면 됩니다.</p>
                <p>계단 이용이 어려우신 분들은 직원 안내에 따라 엘리베이터로 올라오실 수 있어요.</p>
              </>
            ) : (
              <>
                <p>연회장은 예식장 바로 옆에 위치하고 있으며 예식 30분 전부터 이용 가능합니다.</p>
                <p>다양한 뷔페 메뉴와 디저트 코너를 편하게 즐겨주세요.</p>
              </>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}

function GuestbookScreen() {
  return (
    <div className="app-screen-content">
      <Guestbook />
    </div>
  );
}

function AccountSection({ title, people }) {
  const [open, setOpen] = useState(false);
  const [copiedValue, setCopiedValue] = useState('');

  const handleCopy = async (account) => {
    try {
      await navigator.clipboard.writeText(account);
      setCopiedValue(account);
      window.setTimeout(() => setCopiedValue(''), 1500);
    } catch (error) {
      console.error('계좌 복사 실패:', error);
    }
  };

  return (
    <article className="ios-card">
      <button type="button" className="account-toggle" onClick={() => setOpen((prev) => !prev)}>
        <span>{title}</span>
        <ChevronDown size={18} className={open ? 'rotate-180' : ''} />
      </button>
      {open ? (
        <div className="account-list">
          {people.map((person) => (
            <div key={`${title}-${person.label}`} className="account-row">
              <div>
                <p className="account-label">{person.label}</p>
                <p className="account-name">{person.name}</p>
                <p className="account-number">{person.account}</p>
              </div>
              <button type="button" className="copy-button" onClick={() => handleCopy(person.account)}>
                {copiedValue === person.account ? '복사됨' : '복사'}
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </article>
  );
}

function AccountScreen() {
  return (
    <div className="app-screen-content">
      <ScreenTitle>마음 전하실 곳</ScreenTitle>
      <section className="screen-stack">
        <article className="ios-card text-card">
          <p className="message-block small">
            비대면으로 축하를 전하고자 하시는 분들을 위해 기재하였습니다.
            <br />
            너그러운 마음으로 양해 부탁드립니다.
          </p>
        </article>

        <AccountSection
          title="신랑측"
          people={[
            { label: '신랑', name: weddingInfo.groom.name, account: weddingInfo.groom.account },
            { label: '부', name: weddingInfo.groom.father.name, account: weddingInfo.groom.father.account },
            { label: '모', name: weddingInfo.groom.mother.name, account: weddingInfo.groom.mother.account },
          ]}
        />

        <AccountSection
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

function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeApp, setActiveApp] = useState('');

  useEffect(() => {
    document.title = `${weddingInfo.groom.name} and ${weddingInfo.bride.name} | Wedding Invitation`;

    const description = `${weddingInfo.dateLabel} ${weddingInfo.timeLabel}, ${weddingInfo.location.name}`;

    const updateMeta = (name, content, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector);

      if (!element) {
        element = document.createElement('meta');
        if (property) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
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

  const appContent = {
    invitation: <InvitationScreen />,
    profile: <ProfileScreen />,
    gallery: <GalleryScreen />,
    map: <MapScreen />,
    guestbook: <GuestbookScreen />,
    account: <AccountScreen />,
  };

  return (
    <div className="iphone-page-shell">
      <main
        className={`phone-screen mobile-phone-screen ${activeApp ? 'is-detail-open' : ''}`}
        style={{ backgroundImage: `linear-gradient(180deg, rgba(11, 19, 28, 0.08), rgba(11, 19, 28, 0.42)), url(${HERO_IMAGE})` }}
      >
        <PhoneStatus />

        {!isUnlocked ? (
          <LockScreen onUnlock={() => setIsUnlocked(true)} />
        ) : !activeApp ? (
          <HomeScreen onOpen={setActiveApp} />
        ) : (
          <div className="opened-app-shell">
            <div className="opened-app-header">
              <button type="button" className="close-app-button" onClick={() => setActiveApp('')}>
                <X size={18} />
              </button>
              <div className="opened-app-title">
                <MoonStar size={14} />
                <span>iPhone Invitation</span>
              </div>
              <div className="opened-app-spacer" />
            </div>
            <div className="opened-app-body" key={activeApp}>
              {appContent[activeApp]}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
