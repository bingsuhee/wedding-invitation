import React, { useEffect, useMemo, useState } from 'react';
import { Copy, Check, X } from 'lucide-react';
import Guestbook from './components/Guestbook';
import Map from './components/Map';
import ScrollAnimationWrapper from './components/ScrollAnimationWrapper';
import { weddingInfo } from './data/info';

const INTRO_PRIMARY_TEXT = '박수빈&김소희';
const INTRO_SECONDARY_TEXT = '저희의 결혼식에 초대드립니다.';
const INTRO_TYPE_SPEED_MS = 90;
const INTRO_SECONDARY_DELAY_MS = 250;
const INTRO_HOLD_MS = 1000;
const CEREMONY_DATE = new Date(2026, 9, 11, 12, 0, 0);
const HERO_IMAGE = `${import.meta.env.BASE_URL}images/hero-top.jpg`;

function SectionTitle({ children, bold = false }) {
  return (
    <h2
      className={`point-text text-[22px] leading-[1.2] tracking-[-0.04em] ${
        bold ? 'font-semibold' : 'font-normal'
      }`}
    >
      {children}
    </h2>
  );
}

function SectionHeading({ title, subtitle, bold = true }) {
  return (
    <div className="text-center">
      <div className="mb-4 flex items-center justify-center gap-3">
        <span className="h-px w-10 bg-black/14" />
        <span className="inline-flex items-center justify-center">
          <span className="h-2 w-2 rotate-45 border border-black/28 bg-white" />
        </span>
        <span className="h-px w-10 bg-black/14" />
      </div>
      <SectionTitle bold={bold}>{title}</SectionTitle>
      {subtitle ? (
        <p className="mt-2 text-[11px] uppercase tracking-[0.28em] text-black/35">{subtitle}</p>
      ) : null}
    </div>
  );
}

function AccountAccordion({ title, people }) {
  const [open, setOpen] = useState(false);
  const [copiedValue, setCopiedValue] = useState('');

  const copyText = async (account) => {
    try {
      await navigator.clipboard.writeText(account);
      setCopiedValue(account);
      window.setTimeout(() => setCopiedValue(''), 1600);
    } catch (error) {
      console.error('Failed to copy account:', error);
    }
  };

  return (
    <div className="soft-card-strong rounded-[28px]">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-[13px] font-medium text-black">{title} 계좌번호</span>
        <span className="text-[11px] text-black/50">{open ? '닫기' : '열기'}</span>
      </button>

      {open && (
        <div className="border-t border-black/8 px-5 py-2">
          {people.map((person) => (
            <div
              key={`${title}-${person.label}-${person.account}`}
              className="flex items-center justify-between gap-4 border-b border-black/5 py-4 last:border-b-0"
            >
              <div>
                <p className="text-[11px] text-black/45">{person.label}</p>
                <p className="mt-1 text-[14px] font-medium text-black">{person.name}</p>
                <p className="mt-1 text-[11px] text-black/60">{person.account}</p>
              </div>

              <button
                type="button"
                onClick={() => copyText(person.account)}
                className="soft-chip inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-2 text-[11px] text-black transition hover:bg-black hover:text-white"
              >
                {copiedValue === person.account ? <Check size={14} /> : <Copy size={14} />}
                {copiedValue === person.account ? '복사됨' : '복사'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LoveStoryTimeline({ items }) {
  return (
    <section className="section-block gap-8">
      <SectionHeading title="우리의 이야기" subtitle="LOVE STORY" />
      <div className="mx-auto w-full max-w-[360px]">
        <div className="grid grid-cols-2 gap-x-4 gap-y-5">
        {items.map((item, index) => {
          const dateMatch = item.date.match(/(\d{4})년\s*(\d{1,2})월/);
          const formattedDate = dateMatch
            ? `${dateMatch[1]}.${String(dateMatch[2]).padStart(2, '0')}`
            : item.date;
          const isLeftColumn = index % 2 === 0;
          const tiltClass = isLeftColumn ? 'rotate-[2.2deg]' : '-rotate-[2.2deg]';
          const offsetClass =
            index === 0
              ? '-translate-y-1 -translate-x-1'
              : index === 1
                ? 'translate-y-4 translate-x-1'
                : index === 2
                  ? '-translate-y-1 -translate-x-1.5'
                  : index === 3
                    ? 'translate-y-3 translate-x-1.5'
                    : 'translate-y-1 -translate-x-1';

          return (
            <article
              key={`${item.date}-${item.title}`}
              className={`relative border border-black/8 bg-white p-2.5 pb-4 shadow-[0_14px_30px_rgba(35,28,20,0.08)] ${tiltClass} ${offsetClass}`}
            >
              <span className="absolute left-1/2 top-[-11px] h-6 w-16 -translate-x-1/2 rotate-[4deg] bg-[#e8dcc8]/90 shadow-sm" />
              <img
                src={`${import.meta.env.BASE_URL}${item.image}`}
                alt={item.title}
                className="aspect-square w-full object-cover"
                loading="lazy"
              />
              <div className="space-y-2 px-1.5 pt-3 text-center">
                <p className="text-[10px] tracking-[0.16em] text-black/32">{formattedDate}</p>
                <p className="text-[12px] leading-[1.75] tracking-[-0.02em] text-black/68">{item.description}</p>
              </div>
            </article>
          );
        })}
        </div>
      </div>
    </section>
  );
}

function GalleryGrid({ images, onSelect }) {
  return (
    <section className="section-block gap-8">
      <SectionHeading title="갤러리" subtitle="GALLERY" />
      <div className="grid grid-cols-3 gap-2">
        {images.slice(0, 9).map((image) => (
          <button
            key={image.src}
            type="button"
            onClick={() => onSelect(image)}
            className="overflow-hidden bg-[#f3f3f3]"
          >
            <img
              src={`${import.meta.env.BASE_URL}${image.src}`}
              alt={image.caption}
              className="aspect-square h-full w-full object-cover transition duration-300 hover:scale-[1.03]"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </section>
  );
}

function CalendarBlock() {
  const weeks = useMemo(() => {
    const year = 2026;
    const monthIndex = 9;
    const firstDay = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const cells = Array.from({ length: firstDay }, () => null);

    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push(day);
    }

    while (cells.length % 7 !== 0) {
      cells.push(null);
    }

    const weekRows = [];
    for (let i = 0; i < cells.length; i += 7) {
      weekRows.push(cells.slice(i, i + 7));
    }

    return weekRows;
  }, []);

  return (
    <div className="soft-card-strong p-6">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-[16px] font-medium text-black">2026.10</p>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-[11px] text-black/45">
        {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="mt-2 space-y-2">
        {weeks.map((week, rowIndex) => (
          <div key={`week-${rowIndex}`} className="grid grid-cols-7 gap-2">
            {week.map((day, colIndex) => {
              const isHighlight = day === 11;
              return (
                <div
                  key={`day-${rowIndex}-${colIndex}`}
                  className={`flex aspect-square items-center justify-center text-[13px] ${
                    isHighlight ? 'bg-black text-white' : 'text-black'
                  }`}
                >
                  {day ?? ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [introVisible, setIntroVisible] = useState(true);
  const [infoTab, setInfoTab] = useState('bride-room');
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [attendanceSide, setAttendanceSide] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState('');
  const [attendanceName, setAttendanceName] = useState('');
  const [attendanceMeal, setAttendanceMeal] = useState('');
  const [attendanceConsent, setAttendanceConsent] = useState(false);
  const [countdown, setCountdown] = useState({
    days: '000',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });
  const [remainingDaysText, setRemainingDaysText] = useState('000일');
  const [introPrimaryCount, setIntroPrimaryCount] = useState(0);
  const [introSecondaryCount, setIntroSecondaryCount] = useState(0);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);

  const loveStoryItems = weddingInfo.loveStory;
  const galleryImages = weddingInfo.gallery;

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
    const body = document.body;
    const html = document.documentElement;
    let primaryInterval;
    let secondaryTimeout;
    let secondaryInterval;
    let hideTimeout;

    if (introVisible) {
      body.style.overflow = 'hidden';
      html.style.overflow = 'hidden';
      body.style.touchAction = 'none';

      setIntroPrimaryCount(0);
      setIntroSecondaryCount(0);

      primaryInterval = window.setInterval(() => {
        setIntroPrimaryCount((prev) => {
          if (prev >= INTRO_PRIMARY_TEXT.length) {
            window.clearInterval(primaryInterval);
            return prev;
          }
          return prev + 1;
        });
      }, INTRO_TYPE_SPEED_MS);

      const primaryDuration = INTRO_PRIMARY_TEXT.length * INTRO_TYPE_SPEED_MS;
      secondaryTimeout = window.setTimeout(() => {
        secondaryInterval = window.setInterval(() => {
          setIntroSecondaryCount((prev) => {
            if (prev >= INTRO_SECONDARY_TEXT.length) {
              window.clearInterval(secondaryInterval);
              return prev;
            }
            return prev + 1;
          });
        }, INTRO_TYPE_SPEED_MS);
      }, primaryDuration + INTRO_SECONDARY_DELAY_MS);

      const totalDuration =
        primaryDuration +
        INTRO_SECONDARY_DELAY_MS +
        INTRO_SECONDARY_TEXT.length * INTRO_TYPE_SPEED_MS +
        INTRO_HOLD_MS;

      hideTimeout = window.setTimeout(() => {
        setIntroVisible(false);
      }, totalDuration);
    } else {
      body.style.overflow = '';
      html.style.overflow = '';
      body.style.touchAction = '';
    }

    return () => {
      window.clearInterval(primaryInterval);
      window.clearTimeout(secondaryTimeout);
      window.clearInterval(secondaryInterval);
      window.clearTimeout(hideTimeout);
      body.style.overflow = '';
      html.style.overflow = '';
      body.style.touchAction = '';
    };
  }, [introVisible]);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diffMs = Math.max(0, CEREMONY_DATE.getTime() - now.getTime());
      const totalSeconds = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSeconds / (60 * 60 * 24));
      const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
      const seconds = totalSeconds % 60;

      setCountdown({
        days: String(days).padStart(3, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
      });
      setRemainingDaysText(`${String(days).padStart(3, '0')}일`);
    };

    updateCountdown();
    const intervalId = window.setInterval(updateCountdown, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const introPrimaryFirst = INTRO_PRIMARY_TEXT.slice(0, 3);
  const introPrimaryAmp = INTRO_PRIMARY_TEXT.slice(3, 4);
  const introPrimarySecond = INTRO_PRIMARY_TEXT.slice(4);

  const typedPrimaryFirst = introPrimaryFirst.slice(0, Math.min(introPrimaryCount, introPrimaryFirst.length));
  const typedPrimaryAmp =
    introPrimaryCount > introPrimaryFirst.length
      ? introPrimaryAmp.slice(0, Math.min(introPrimaryCount - introPrimaryFirst.length, introPrimaryAmp.length))
      : '';
  const typedPrimarySecond =
    introPrimaryCount > introPrimaryFirst.length + introPrimaryAmp.length
      ? introPrimarySecond.slice(
          0,
          Math.min(
            introPrimaryCount - introPrimaryFirst.length - introPrimaryAmp.length,
            introPrimarySecond.length
          )
        )
      : '';
  const typedSecondary = INTRO_SECONDARY_TEXT.slice(0, introSecondaryCount);
  const canSubmitAttendance =
    attendanceSide &&
    attendanceStatus &&
    attendanceName.trim() &&
    attendanceConsent;
  const infoTabContent =
    infoTab === 'bride-room'
      ? {
          title: '신부대기실',
          image: `${import.meta.env.BASE_URL}images/bride-room.jpg`,
          alt: '신부대기실 안내 이미지',
        }
      : {
          title: '연회장',
          image: `${import.meta.env.BASE_URL}images/banquet-hall.jpg`,
          alt: '연회장 안내 이미지',
        };

  return (
    <>
      {attendanceModalOpen ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/55 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setAttendanceModalOpen(false)}
        >
          <div
            className="soft-card-strong w-full max-w-[min(88vw,448px)] rounded-[24px] px-4 py-5 sm:px-5 sm:py-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-[22px] font-semibold tracking-[-0.05em] text-black sm:text-[24px]">
                참석 의사 전달
              </h3>
              <button
                type="button"
                onClick={() => setAttendanceModalOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center text-black/35 transition hover:text-black"
                aria-label="팝업 닫기"
              >
                <X size={22} />
              </button>
            </div>

            <div className="mt-4 rounded-[18px] bg-[#f4f4f2] px-4 py-4">
              <div className="space-y-7">
                <div>
                  <p className="text-[15px] font-medium tracking-[-0.03em] text-black sm:text-[16px]">
                    어느 측 하객이신가요? <span className="text-[#ff4d4f]">*</span>
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setAttendanceSide('groom')}
                      className={`rounded-[12px] border px-4 py-3.5 text-[15px] font-medium transition ${
                        attendanceSide === 'groom'
                          ? 'border-[#4f91ff] bg-white text-[#4f91ff] shadow-[0_6px_18px_rgba(79,145,255,0.16)]'
                          : 'border-black/10 bg-white text-black'
                      }`}
                    >
                      신랑
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttendanceSide('bride')}
                      className={`rounded-[12px] border px-4 py-3.5 text-[15px] font-medium transition ${
                        attendanceSide === 'bride'
                          ? 'border-[#4f91ff] bg-white text-[#4f91ff] shadow-[0_6px_18px_rgba(79,145,255,0.16)]'
                          : 'border-black/10 bg-white text-black'
                      }`}
                    >
                      신부
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-[15px] font-medium tracking-[-0.03em] text-black sm:text-[16px]">
                    참석 하시나요? <span className="text-[#ff4d4f]">*</span>
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setAttendanceStatus('attending')}
                      className={`rounded-[12px] border px-4 py-3.5 text-[15px] font-medium transition ${
                        attendanceStatus === 'attending'
                          ? 'border-transparent bg-[#cdbdaf] text-white shadow-[0_6px_18px_rgba(161,133,108,0.22)]'
                          : 'border-black/10 bg-white text-black'
                      }`}
                    >
                      참석
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttendanceStatus('absent')}
                      className={`rounded-[12px] border px-4 py-3.5 text-[15px] font-medium transition ${
                        attendanceStatus === 'absent'
                          ? 'border-transparent bg-[#cdbdaf] text-white shadow-[0_6px_18px_rgba(161,133,108,0.22)]'
                          : 'border-black/10 bg-white text-black'
                      }`}
                    >
                      불참석
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-[15px] font-medium tracking-[-0.03em] text-black sm:text-[16px]">
                    성함 <span className="text-[#ff4d4f]">*</span>
                  </p>
                  <input
                    type="text"
                    value={attendanceName}
                    onChange={(event) => setAttendanceName(event.target.value)}
                    className="soft-input mt-3 w-full rounded-[12px] px-4 py-3.5 text-[15px] text-black outline-none transition focus:border-black"
                  />
                </div>

                <div>
                  <p className="text-[15px] font-medium tracking-[-0.03em] text-black sm:text-[16px]">
                    식사 하시나요?
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setAttendanceMeal('yes')}
                      className={`rounded-[12px] border px-4 py-3.5 text-[15px] font-medium transition ${
                        attendanceMeal === 'yes'
                          ? 'border-transparent bg-[#cdbdaf] text-white shadow-[0_6px_18px_rgba(161,133,108,0.22)]'
                          : 'border-black/10 bg-white text-black'
                      }`}
                    >
                      O
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttendanceMeal('no')}
                      className={`rounded-[12px] border px-4 py-3.5 text-[15px] font-medium transition ${
                        attendanceMeal === 'no'
                          ? 'border-transparent bg-[#cdbdaf] text-white shadow-[0_6px_18px_rgba(161,133,108,0.22)]'
                          : 'border-black/10 bg-white text-black'
                      }`}
                    >
                      X
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[13px] text-black/42 sm:text-[14px]">
                  <button
                    type="button"
                    onClick={() => setAttendanceConsent((prev) => !prev)}
                    className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] border transition ${
                      attendanceConsent ? 'border-black bg-black text-white' : 'border-black/14 bg-white text-transparent'
                    }`}
                    aria-label="개인정보 수집 및 활용 동의"
                  >
                    <Check size={16} />
                  </button>
                  <span>개인정보 수집 및 활용 동의</span>
                  <button
                    type="button"
                    onClick={() => window.alert('참석 의사 확인을 위한 최소한의 정보만 수집합니다.')}
                    className="text-black/45 underline underline-offset-4"
                  >
                    [자세히보기]
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={!canSubmitAttendance}
              onClick={() => {
                window.alert('참석 의사가 전달되었습니다.');
                setAttendanceModalOpen(false);
              }}
              className="mt-4 inline-flex w-full items-center justify-center rounded-[14px] bg-[#cfcfcf] px-5 py-3.5 text-[17px] font-semibold text-white transition enabled:bg-[#cdbdaf] enabled:shadow-[0_10px_24px_rgba(161,133,108,0.22)] disabled:cursor-not-allowed"
            >
              전달하기
            </button>
          </div>
        </div>
      ) : null}
      {selectedGalleryImage ? (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/88 p-5"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedGalleryImage(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedGalleryImage(null)}
            className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
            aria-label="닫기"
          >
            <X size={18} />
          </button>
          <figure className="max-w-[420px]" onClick={(event) => event.stopPropagation()}>
            <img
              src={`${import.meta.env.BASE_URL}${selectedGalleryImage.src}`}
              alt={selectedGalleryImage.caption}
              className="max-h-[78vh] w-full object-contain"
            />
            <figcaption className="mt-4 text-center text-[13px] text-white/75">
              {selectedGalleryImage.caption}
            </figcaption>
          </figure>
        </div>
      ) : null}
      {introVisible && (
        <div className="intro-overlay">
          <div className="intro-text">
            <div className="intro-line intro-line-primary" aria-label={INTRO_PRIMARY_TEXT}>
              <span className="intro-name">{typedPrimaryFirst}</span>
              {typedPrimaryAmp ? <span className="intro-amp">{typedPrimaryAmp}</span> : null}
              <span className="intro-name">{typedPrimarySecond}</span>
            </div>
            <div className="intro-line intro-line-secondary">{typedSecondary}</div>
          </div>
        </div>
      )}

      <div className="app-shell">
        <main className="mx-auto flex w-full max-w-[480px] flex-col bg-transparent">
          <ScrollAnimationWrapper amount={0.08} duration={0.9}>
            <section className="flex flex-col gap-5">
              <div className="overflow-hidden bg-black">
                <div className="relative aspect-[4/6]">
                  <img
                    className="h-full w-full object-cover object-top"
                    src={HERO_IMAGE}
                    alt="박수빈 김소희 웨딩 메인 이미지"
                  />
                </div>
              </div>

              <div className="space-y-2 px-6 text-center">
                <div className="space-y-2">
                  <p className="point-text leading-tight">
                    <span className="text-[19px] font-bold">박수빈</span>
                    <span className="mx-2 text-[16px] font-normal">♥</span>
                    <span className="text-[19px] font-bold">김소희</span>
                  </p>
                  <p className="point-text text-[18px] leading-tight tracking-[-0.04em]">
                    10월 11일 저희 결혼합니다.
                  </p>
                  <p className="text-[15px] leading-relaxed text-black/35">
                    2026.10.11 (일) 12:00
                    <br />
                    JK아트컨벤션 아트리움홀
                  </p>
                </div>
              </div>
            </section>
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper amount={0.2}>
            <section className="section-block pt-0 text-center">
              <p className="text-[18px] leading-[1.7] tracking-[-0.03em] text-black">
                서로를 향한 따뜻한 마음으로 만나
                <br />
                <br />
                이제 평생을 함께 걸어가려 합니다.
                <br />
                <br />
                귀한 걸음으로 오셔서
                <br />
                두 사람의 시작을 축복해 주세요.
              </p>
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setAttendanceModalOpen(true)}
                  className="soft-card-strong rounded-full px-7 py-3 text-[15px] font-medium tracking-[-0.03em] text-black transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(35,28,20,0.12)]"
                >
                  참석 의사 전달
                </button>
              </div>
            </section>
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper amount={0.18} delay={0.04}>
            <section className="section-block gap-8">
              <SectionHeading title="우리의 소개" subtitle="OUR INTRODUCTION" />
              <div className="space-y-6">
                <article className="soft-card grid grid-cols-[110px_1fr] gap-4 p-4">
                  <div className="aspect-square">
                    <img
                      src={`${import.meta.env.BASE_URL}${weddingInfo.gallery[0].src}`}
                      alt="신랑 박수빈"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="space-y-2 self-center">
                    <p className="text-[13px] leading-relaxed text-black/55">
                      <span className="font-semibold text-black/72">박경수, 신정미</span>의 장남
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="soft-chip inline-block px-2 py-0.5 text-[11px] font-medium tracking-[0.16em] text-black/55">
                        신랑
                      </span>
                      <p className="point-text text-[24px] font-medium tracking-[-0.04em]">수빈</p>
                    </div>
                    <div className="text-[13px] leading-[1.8] text-black/45">
                      <p>1993년 9월 9일</p>
                      <p>#ESTP #강하늘닮은꼴 #실상은바보 #빙수</p>
                    </div>
                  </div>
                </article>

                <article className="soft-card grid grid-cols-[1fr_110px] gap-4 p-4">
                  <div className="space-y-2 self-center text-right">
                    <p className="text-[13px] leading-relaxed text-black/55">
                      <span className="font-semibold text-black/72">김종범, 송해란</span>의 장녀
                    </p>
                    <div className="flex items-center justify-end gap-2">
                      <span className="soft-chip inline-block px-2 py-0.5 text-[11px] font-medium tracking-[0.16em] text-black/55">
                        신부
                      </span>
                      <p className="point-text text-[24px] font-medium tracking-[-0.04em]">소희</p>
                    </div>
                    <div className="text-[13px] leading-[1.8] text-black/45">
                      <p>1994년 10월 31일</p>
                      <p>#ISTP #얼굴은얄라리 #성격은박명수 #땃지</p>
                    </div>
                  </div>
                  <div className="aspect-square">
                    <img
                      src={`${import.meta.env.BASE_URL}${weddingInfo.gallery[1].src}`}
                      alt="신부 김소희"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </article>
              </div>

            </section>
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper amount={0.18}>
            <section className="section-block gap-8">
              <SectionHeading title="예식 안내" subtitle="CEREMONY INFO" />
              <p className="text-center text-[13px] leading-[1.8] text-black/55">
                <span className="point-text text-[17px] font-semibold tracking-[-0.03em]">
                  JK아트컨벤션 아트리움홀
                </span>
                <br />
                2026년 10월 11일 일요일
                <br />
                오후 12시
              </p>
              <CalendarBlock />
              <div className="text-center">
                <p className="point-text text-[14px]">
                  수빈 ♥ 소희 결혼식까지 <span className="font-semibold">{remainingDaysText}</span> 남았습니다.
                </p>
                <div className="soft-card-strong mt-3 flex items-center justify-center gap-2 px-5 py-4">
                  {[
                    { label: 'Days', value: countdown.days },
                    { label: 'Hour', value: countdown.hours },
                    { label: 'Min', value: countdown.minutes },
                    { label: 'Sec', value: countdown.seconds },
                  ].map((item, index, array) => (
                    <React.Fragment key={item.label}>
                      <div className="min-w-[58px] text-center">
                        <p className="point-text text-[23px] font-semibold tracking-[-0.06em]">{item.value}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-black/45">{item.label}</p>
                      </div>
                      {index < array.length - 1 ? (
                        <span className="point-text -mt-4 text-[20px] font-semibold leading-none">:</span>
                      ) : null}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </section>
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper amount={0.16}>
            <LoveStoryTimeline items={loveStoryItems} />
          </ScrollAnimationWrapper>
          <ScrollAnimationWrapper amount={0.16}>
            <GalleryGrid images={galleryImages} onSelect={setSelectedGalleryImage} />
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper amount={0.18}>
            <section className="section-block gap-8">
              <SectionHeading title="안내사항" subtitle="INFORMATION" />
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setInfoTab('bride-room')}
                  className={`px-4 py-3 text-[13px] font-medium transition ${
                    infoTab === 'bride-room'
                      ? 'soft-card-strong point-text'
                      : 'soft-card text-black/55 hover:text-black'
                  }`}
                >
                  신부대기실
                </button>
                <button
                  type="button"
                  onClick={() => setInfoTab('banquet')}
                  className={`px-4 py-3 text-[13px] font-medium transition ${
                    infoTab === 'banquet'
                      ? 'soft-card-strong point-text'
                      : 'soft-card text-black/55 hover:text-black'
                  }`}
                >
                  연회장
                </button>
              </div>

              <figure className="soft-card overflow-hidden">
                <img
                  src={infoTabContent.image}
                  alt={infoTabContent.alt}
                  className="aspect-auto w-full object-contain"
                />
                <figcaption className="space-y-4 px-5 py-5 text-left text-[13px] leading-[1.8] text-black/68">
                  <div className="text-center">
                    <p className="point-text text-[18px] font-semibold tracking-[-0.04em]">
                      {infoTabContent.title}
                    </p>
                  </div>

                  {infoTab === 'bride-room' ? (
                    <div className="space-y-3">
                      <p>신부대기실은 옆 계단으로 올라오셔야 합니다.</p>
                      <p>
                        계단을 이용하시기 어려우신 분들은
                        <br />
                        직원 안내에 따라 엘리베이터로 올라오실 수 있어요.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p>
                        연회장은 예식장 바로 옆에 위치하고 있습니다.
                        <br />
                        연회장은 예식 30분 전부터 이용 가능합니다.
                      </p>
                      <p>180여 가지의 뷔페식이고, 음주류도 있으니 맘껏 즐겨주세요.</p>
                      <div className="space-y-2">
                        <p className="font-semibold text-black">특히 이 메뉴는 놓치지 마세요!</p>
                        <ul className="space-y-1">
                          <li>- LA 갈비를 포함한 모든 고기 메뉴</li>
                          <li>- 전복갈비탕, 설렁탕, 도가니탕</li>
                          <li>- 육회는 꼭 노른자를 곁들여서</li>
                          <li>- 파스타는 바로 만들어서 신선</li>
                          <li>- 젤라또는 와플이랑 같이</li>
                          <li>- 사케 + 냉면 꿀조합 / 와인은 반반 믹스 추천</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </figcaption>
              </figure>
            </section>
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper amount={0.16}>
            <Map />
          </ScrollAnimationWrapper>
          <ScrollAnimationWrapper amount={0.14}>
            <section className="section-block gap-6">
              <SectionHeading title="마음 전하실 곳" subtitle="SEND YOUR HEART" />
              <p className="text-center text-[13px] leading-[1.8] text-black/55">
                비대면으로 축하를 전하고자
                <br />
                하시는 분들을 위해 기재하였습니다.
                <br />
                너그러운 마음으로 양해부탁드립니다.
              </p>
              <div className="grid gap-4">
                <AccountAccordion
                  title="신랑측"
                  people={[
                    { label: '신랑', name: weddingInfo.groom.name, account: weddingInfo.groom.account },
                    {
                      label: '부',
                      name: weddingInfo.groom.father.name,
                      account: weddingInfo.groom.father.account,
                    },
                    {
                      label: '모',
                      name: weddingInfo.groom.mother.name,
                      account: weddingInfo.groom.mother.account,
                    },
                  ]}
                />
                <AccountAccordion
                  title="신부측"
                  people={[
                    { label: '신부', name: weddingInfo.bride.name, account: weddingInfo.bride.account },
                    {
                      label: '부',
                      name: weddingInfo.bride.father.name,
                      account: weddingInfo.bride.father.account,
                    },
                    {
                      label: '모',
                      name: weddingInfo.bride.mother.name,
                      account: weddingInfo.bride.mother.account,
                    },
                  ]}
                />
              </div>
            </section>
          </ScrollAnimationWrapper>
          <ScrollAnimationWrapper amount={0.12}>
            <Guestbook />
          </ScrollAnimationWrapper>
          <ScrollAnimationWrapper amount={0.12}>
            <section className="section-block gap-6 text-center">
              <SectionHeading title="참석 의사 전달" subtitle="RSVP" />
              <p className="text-[13px] leading-[1.8] text-black/55">
                축하의 마음으로 참석해주시는
                <br />
                모든 분들을 귀하게 모실 수 있도록
                <br />
                참석 의사를 미리 말씀해주세요.
              </p>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setAttendanceModalOpen(true)}
                  className="soft-card-strong rounded-full px-7 py-3 text-[15px] font-medium tracking-[-0.03em] text-black transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(35,28,20,0.12)]"
                >
                  참석 의사 전달
                </button>
              </div>
            </section>
          </ScrollAnimationWrapper>
          <ScrollAnimationWrapper amount={0.12}>
            <section className="section-block text-center">
              <p className="text-[18px] leading-[1.7] tracking-[-0.03em] text-black/68">
                바쁘신 일정에도 귀한 걸음 해주셔서
                <br />
                진심으로 감사드립니다.
                <br />
                <br />
                저희 두사람,
                <br />
                <span className="point-text font-semibold tracking-[0.08em]">잘 먹고</span>
                <br />
                <span className="point-text font-semibold tracking-[0.08em]">잘 자고</span>
                <br />
                <span className="point-text font-semibold tracking-[0.08em]">잘 놀고</span>
                <br />
                <br />
                세월이 흘러도 한결같은 마음으로
                <br />
                서로의 가장 친한 친구가 되어주겠습니다.
                <br />
                <br />
                진심 어린 축복과 응원 부탁드립니다.
              </p>
            </section>
          </ScrollAnimationWrapper>
        </main>
      </div>
    </>
  );
}

export default App;
