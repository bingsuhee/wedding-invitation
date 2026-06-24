import React, { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  Camera,
  Check,
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
import { supabase } from './lib/supabaseClient';
import { weddingInfo } from '@shared/data/info';

const HERO_IMAGE = `${import.meta.env.BASE_URL}images/cookierun-hero.png`;
const BRIDE_ROOM_IMAGE = `${import.meta.env.BASE_URL}images/bride-room.jpg`;
const BANQUET_IMAGE = `${import.meta.env.BASE_URL}images/banquet-hall.jpg`;
const BRIDE_INTRO_IMAGE = `${import.meta.env.BASE_URL}images/cookierun-bride.png`;
const GROOM_INTRO_IMAGE = `${import.meta.env.BASE_URL}images/cookierun-groom.png`;
const HERO_MESSAGE_BLOCKS = [
  { text: '긴 여정 끝에 최고의 파티원을 만났습니다.' },
  { text: '인생이라는 모험의 다음 챕터를\n이제는 같은 팀으로 함께합니다.' },
  { text: '서로의 하루를 가장 가까이에서 응원하며 살아가겠습니다.', bold: true },
  { text: '새로운 시작을 축복해주실 여러분을 초대합니다.' },
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
  const lockDateLabel = `${weddingInfo.year}년 ${weddingInfo.month}월 ${weddingInfo.day}일`;
  const lockTimeLabel = `${String(weddingInfo.hour).padStart(2, '0')}:${String(weddingInfo.minute).padStart(2, '0')}`;

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
        <p className="lock-date">{lockDateLabel}</p>
        <p className="lock-time">{lockTimeLabel}</p>
        <h1>{`${weddingInfo.groom.name} ♥ ${weddingInfo.bride.name}`}</h1>
        <p className="lock-subcopy">
          파티 모집 완료! 이제부터 같은 팀입니다.
          <br />
          위로 스와이프 해 새로운 모험을 시작해주세요.
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
        <p className="home-widget-label">Wedding invitation</p>
        <h2>{`${weddingInfo.groom.name} ♥ ${weddingInfo.bride.name}`}</h2>
        <p>아이콘을 눌러 결혼식의 상세 정보를 확인해보세요!</p>
      </div>

      <div className="home-bottom-stack">
        <div className="home-app-grid">
          <AppIcon appKey="invitation" label="초대장" onOpen={onOpen} />
          <AppIcon appKey="profile" label="우리 이야기" onOpen={onOpen} />
          <AppIcon appKey="gallery" label="갤러리" onOpen={onOpen} />
          <AppIcon appKey="map" label="길 안내" onOpen={onOpen} />
          <AppIcon appKey="guestbook" label="방명록" onOpen={onOpen} />
          <AppIcon appKey="account" label="축의금" onOpen={onOpen} />
          <AppIcon appKey="rsvp" label="참석 여부" onOpen={onOpen} />
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
          <button type="button" className="dock-button" onClick={() => onOpen('rsvp')}>
            <CalendarDays size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}

function CountdownChip() {
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
              <span className="hero-main-copy-name">{groomGivenName}</span>과
              <span className="hero-main-copy-name"> {brideGivenName}</span>의
            </span>
            <span className="hero-main-copy-line">결혼식에 초대합니다.</span>
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
                {line.text.split('\n').map((segment, index) => (
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
              <p className="summary-label">예식 시간</p>
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
      <ScreenTitle>우리 이야기</ScreenTitle>
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
      <ScreenTitle>길 안내</ScreenTitle>
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
              피로연장
            </button>
          </div>
          <img src={infoImage} alt="" className="info-photo" />
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
      <ScreenTitle>축의금</ScreenTitle>
      <section className="screen-stack">
        <article className="ios-card text-card">
          <p className="message-block small">
            축하의 마음을 전해주시는 분들을 위해
            <br />
            계좌 정보를 함께 안내드립니다.
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
      <ScreenTitle>참석 여부</ScreenTitle>
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

function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeApp, setActiveApp] = useState('');
  const currentStage = !isUnlocked ? 'lock' : activeApp ? 'detail' : 'home';

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

  useEffect(() => {
    // 모바일에서 단계 전환 중 페이지 전체가 스크롤되지 않도록 고정합니다.
    document.body.classList.add('iphone-body-lock');
    document.documentElement.classList.add('iphone-html-lock');

    return () => {
      document.body.classList.remove('iphone-body-lock');
      document.documentElement.classList.remove('iphone-html-lock');
    };
  }, []);

  const appContent = {
    invitation: <InvitationScreen />,
    profile: <ProfileScreen />,
    gallery: <GalleryScreen />,
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
          backgroundImage: `linear-gradient(180deg, rgba(11, 19, 28, 0.08), rgba(11, 19, 28, 0.42)), url(${HERO_IMAGE})`,
        }}
      >
        <PhoneStatus />

        {!isUnlocked ? (
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
              <button type="button" className="close-app-button" onClick={() => setActiveApp('')}>
                <X size={18} />
              </button>
              <div className="opened-app-title">
                <MoonStar size={14} />
                <span>iPhone Invitation</span>
              </div>
              <div className="opened-app-spacer" />
            </div>
            <div className="opened-app-body">{appContent[activeApp]}</div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
