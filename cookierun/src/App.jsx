import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Copy, Check, X } from 'lucide-react';
import Guestbook from './components/Guestbook';
import Map from './components/Map';
import ScrollAnimationWrapper from './components/ScrollAnimationWrapper';
import { weddingInfo } from '@shared/data/info';

const INTRO_DURATION_MS = 2000;
const INTRO_DOT_INTERVAL_MS = INTRO_DURATION_MS / 9;
const INTRO_IMAGE = `${import.meta.env.BASE_URL}images/illust/intro-party.png`;
const INTRO_DOT_SEQUENCE = [1, 2, 3, 1, 2, 3, 1, 2, 3];
const CEREMONY_DATE = new Date(
  weddingInfo.year,
  weddingInfo.month - 1,
  weddingInfo.day,
  weddingInfo.hour,
  weddingInfo.minute,
  0
);
const HERO_IMAGE = `${import.meta.env.BASE_URL}images/hero-top.jpg`;
const groomGivenName = weddingInfo.groom.name.slice(1);
const brideGivenName = weddingInfo.bride.name.slice(1);
const coupleLabel = `${weddingInfo.groom.name} ${weddingInfo.bride.name}`;

function SectionTitle({ children, bold = false }) {
  return (
    <h2
      className={`point-text paint-title-heading text-[22px] leading-[1.2] tracking-[-0.04em] ${
        bold ? 'font-semibold' : 'font-normal'
      }`}
    >
      <span className="paint-title">{children}</span>
    </h2>
  );
}

function SectionHeading({ title, bold = true }) {
  return (
    <div className="text-center">
      <SectionTitle bold={bold}>{title}</SectionTitle>
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
      <SectionHeading title="우리의 이야기" />
      <div className="story-book-list mx-auto w-full max-w-[390px]">
        {items.slice(0, 3).map((item) => (
            <article
              key={`${item.date}-${item.title}`}
              className="story-book-page"
            >
              <h3 className="story-book-question">Q. {item.question}</h3>
              <img
                src={`${import.meta.env.BASE_URL}${item.image}`}
                alt={item.title}
                className="story-book-image"
                loading="lazy"
              />
              <div className="story-book-answer-group">
                <div className="story-book-answer">
                  <p className="story-book-speaker">{groomGivenName}</p>
                  <p>{item.groomAnswer}</p>
                </div>
                <div className="story-book-answer">
                  <p className="story-book-speaker">{brideGivenName}</p>
                  <p>{item.brideAnswer}</p>
                </div>
              </div>
            </article>
          ))}
      </div>
    </section>
  );
}

function GalleryGrid({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [pendingDirection, setPendingDirection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const thumbRowRef = useRef(null);
  const stageRef = useRef(null);
  const dragStateRef = useRef({
    active: false,
    pointerId: null,
    startX: 0,
    deltaX: 0,
    width: 0,
    dragging: false,
  });
  const galleryItems = images.slice(0, 9);
  const currentImage = galleryItems[currentIndex] ?? galleryItems[0];
  const getWrappedIndex = (index) => {
    if (galleryItems.length === 0) {
      return 0;
    }

    return (index + galleryItems.length) % galleryItems.length;
  };
  const stageImages = [-1, 0, 1].map((offset) => galleryItems[getWrappedIndex(currentIndex + offset)]);

  useEffect(() => {
    const row = thumbRowRef.current;
    const activeThumb = row?.children[currentIndex];

    if (!row || !activeThumb) {
      return;
    }

    const rowRect = row.getBoundingClientRect();
    const thumbRect = activeThumb.getBoundingClientRect();

    if (thumbRect.right > rowRect.right) {
      row.scrollTo({
        left: row.scrollLeft + thumbRect.right - rowRect.right,
        behavior: 'smooth',
      });
      return;
    }

    if (thumbRect.left < rowRect.left) {
      row.scrollTo({
        left: row.scrollLeft - (rowRect.left - thumbRect.left),
        behavior: 'smooth',
      });
    }
  }, [currentIndex]);

  const goToPrevious = () => {
    if (galleryItems.length <= 1 || isAnimating) {
      return;
    }

    const width = stageRef.current?.offsetWidth ?? 0;
    if (!width) {
      setCurrentIndex((index) => getWrappedIndex(index - 1));
      return;
    }

    setIsAnimating(true);
    setPendingDirection(-1);
    setTransitionEnabled(true);
    setSwipeOffset(width);
  };

  const goToNext = () => {
    if (galleryItems.length <= 1 || isAnimating) {
      return;
    }

    const width = stageRef.current?.offsetWidth ?? 0;
    if (!width) {
      setCurrentIndex((index) => getWrappedIndex(index + 1));
      return;
    }

    setIsAnimating(true);
    setPendingDirection(1);
    setTransitionEnabled(true);
    setSwipeOffset(-width);
  };

  const resetDragState = () => {
    dragStateRef.current = {
      active: false,
      pointerId: null,
      startX: 0,
      deltaX: 0,
      width: 0,
      dragging: false,
    };
    setIsDragging(false);
  };

  const handlePointerDown = (event) => {
    if (galleryItems.length <= 1 || isAnimating || event.target.closest('button')) {
      return;
    }

    setTransitionEnabled(false);
    setSwipeOffset(0);
    dragStateRef.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      deltaX: 0,
      width: stageRef.current?.offsetWidth ?? 0,
      dragging: false,
    };

    if (stageRef.current) {
      stageRef.current.setPointerCapture?.(event.pointerId);
    }
  };

  const handlePointerMove = (event) => {
    const dragState = dragStateRef.current;

    if (!dragState.active || dragState.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - dragState.startX;

    if (!dragState.dragging && Math.abs(deltaX) > 10) {
      dragState.dragging = true;
      setIsDragging(true);
    }

    if (!dragState.dragging) {
      return;
    }

    dragState.deltaX = deltaX;
    setSwipeOffset(deltaX);
  };

  const completeSwipe = (pointerId) => {
    const dragState = dragStateRef.current;

    if (!dragState.active || dragState.pointerId !== pointerId) {
      return;
    }

    const width = dragState.width || stageRef.current?.offsetWidth || 1;
    const swipeThreshold = Math.min(90, width * 0.18);

    if (Math.abs(dragState.deltaX) >= swipeThreshold) {
      if (dragState.deltaX < 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    } else {
      setTransitionEnabled(true);
      setSwipeOffset(0);
    }

    resetDragState();
  };

  const handlePointerUp = (event) => {
    completeSwipe(event.pointerId);
  };

  const handlePointerCancel = (event) => {
    completeSwipe(event.pointerId);
  };

  const handleStageKeyDown = (event) => {
    if (isAnimating) {
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goToPrevious();
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goToNext();
    }
  };

  const handleTrackTransitionEnd = () => {
    if (pendingDirection === 0) {
      setTransitionEnabled(false);
      return;
    }

    setTransitionEnabled(false);
    setCurrentIndex((index) => getWrappedIndex(index + pendingDirection));
    setSwipeOffset(0);
    setPendingDirection(0);
    setIsAnimating(false);
  };

  if (!currentImage) {
    return null;
  }

  return (
    <section className="section-block gap-8">
      <SectionHeading title="갤러리" />
      <div className="gallery-viewer mx-auto w-full max-w-[390px]">
        <figure
          ref={stageRef}
          className={`gallery-stage ${isDragging ? 'is-dragging' : ''}`}
          tabIndex={0}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onPointerLeave={handlePointerUp}
          onKeyDown={handleStageKeyDown}
        >
          <div
            className={`gallery-stage-track ${transitionEnabled ? 'is-animated' : ''}`}
            style={{ transform: `translateX(calc(-100% + ${swipeOffset}px))` }}
            onTransitionEnd={handleTrackTransitionEnd}
          >
            {stageImages.map((image, index) => (
              <div
                key={`${image.src}-${index}`}
                className="gallery-stage-slide"
                aria-hidden={index !== 1}
              >
                <img
                  src={`${import.meta.env.BASE_URL}${image.src}`}
                  alt={index === 1 ? currentImage.caption : ''}
                  className="gallery-stage-image"
                  loading="lazy"
                  draggable="false"
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={goToPrevious}
            className="gallery-nav-button left-3"
            aria-label="이전 사진"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={goToNext}
            className="gallery-nav-button right-3"
            aria-label="다음 사진"
          >
            <ChevronRight size={20} />
          </button>
        </figure>
        <div ref={thumbRowRef} className="gallery-thumb-row" aria-label="갤러리 썸네일">
          {galleryItems.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`gallery-thumb ${index === currentIndex ? 'is-active' : ''}`}
              aria-label={`${index + 1}번째 사진 보기`}
              aria-current={index === currentIndex ? 'true' : undefined}
            >
              <img
                src={`${import.meta.env.BASE_URL}${image.src}`}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
        <p className="gallery-counter">{String(currentIndex + 1).padStart(2, '0')} / {String(galleryItems.length).padStart(2, '0')}</p>
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
        {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
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
  const [attendanceCompanionCount, setAttendanceCompanionCount] = useState('');
  const [attendanceNote, setAttendanceNote] = useState('');
  const [attendanceConsent, setAttendanceConsent] = useState(false);
  const [countdown, setCountdown] = useState({
    days: '000',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });
  const [remainingDaysText, setRemainingDaysText] = useState('000일');
  const [introDotFrame, setIntroDotFrame] = useState(0);

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
    let dotInterval;
    let hideTimeout;

    if (introVisible) {
      body.style.overflow = 'hidden';
      html.style.overflow = 'hidden';
      body.style.touchAction = 'none';

      setIntroDotFrame(0);

      const introStartTime = Date.now();
      dotInterval = window.setInterval(() => {
        const elapsedMs = Date.now() - introStartTime;
        const nextFrame = Math.min(
          INTRO_DOT_SEQUENCE.length - 1,
          Math.floor(elapsedMs / INTRO_DOT_INTERVAL_MS)
        );

        setIntroDotFrame(nextFrame);

        if (nextFrame >= INTRO_DOT_SEQUENCE.length - 1) {
          window.clearInterval(dotInterval);
        }
      }, 50);

      hideTimeout = window.setTimeout(() => {
        setIntroVisible(false);
      }, INTRO_DURATION_MS);
    } else {
      body.style.overflow = '';
      html.style.overflow = '';
      body.style.touchAction = '';
    }

    return () => {
      window.clearInterval(dotInterval);
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

  useEffect(() => {
    if (!attendanceModalOpen) {
      return undefined;
    }

    const body = document.body;
    const html = document.documentElement;
    const previousBodyOverflow = body.style.overflow;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyTouchAction = body.style.touchAction;

    body.style.overflow = 'hidden';
    html.style.overflow = 'hidden';
    body.style.touchAction = 'none';

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setAttendanceModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      body.style.overflow = previousBodyOverflow;
      html.style.overflow = previousHtmlOverflow;
      body.style.touchAction = previousBodyTouchAction;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [attendanceModalOpen]);

  const introDots = '.'.repeat(INTRO_DOT_SEQUENCE[introDotFrame]);
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

  const closeAttendanceSheet = () => {
    setAttendanceModalOpen(false);
  };

  const handleAttendanceSubmit = () => {
    window.alert('참석 의사가 전달되었습니다.');
    resetAttendanceForm();
    closeAttendanceSheet();
  };

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
          className="attendance-sheet-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="attendance-sheet-title"
          onClick={closeAttendanceSheet}
        >
          <div
            className="attendance-sheet-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="attendance-sheet-handle" aria-hidden="true" />
            <div className="attendance-sheet-header">
              <div className="w-10" aria-hidden="true" />
              <h3
                id="attendance-sheet-title"
                className="text-[18px] font-medium tracking-[-0.04em] text-[#4b3424] sm:text-[19px]"
              >
                참석 여부 전달
              </h3>
              <button
                type="button"
                onClick={closeAttendanceSheet}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#8d7a69] transition hover:bg-[#f7efe3] hover:text-[#4b3424]"
                aria-label="참석 여부 전달 시트 닫기"
              >
                <X size={22} />
              </button>
            </div>

            <div className="attendance-sheet-body">
              <div className="space-y-6">
                <div>
                  <p className="text-[14px] font-medium tracking-[-0.03em] text-[#5d4837] sm:text-[15px]">
                    어느 측 하객이신가요? <span className="text-[#e06f6f]">*</span>
                  </p>
                  <div className="attendance-segment-grid mt-3 grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setAttendanceSide('groom')}
                      className={`attendance-segment-button ${attendanceSide === 'groom' ? 'is-active' : ''}`}
                    >
                      신랑
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttendanceSide('bride')}
                      className={`attendance-segment-button ${attendanceSide === 'bride' ? 'is-active' : ''}`}
                    >
                      신부
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-[14px] font-medium tracking-[-0.03em] text-[#5d4837] sm:text-[15px]">
                    참석여부 <span className="text-[#e06f6f]">*</span>
                  </p>
                  <div className="attendance-segment-grid mt-3 grid-cols-2">
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
                      불참석
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-[14px] font-medium tracking-[-0.03em] text-[#5d4837] sm:text-[15px]">
                    식사여부 <span className="text-[#e06f6f]">*</span>
                  </p>
                  <div className="attendance-segment-grid mt-3 grid-cols-3">
                    <button
                      type="button"
                      onClick={() => setAttendanceMeal('yes')}
                      className={`attendance-segment-button ${attendanceMeal === 'yes' ? 'is-active' : ''}`}
                    >
                      O
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttendanceMeal('no')}
                      className={`attendance-segment-button ${attendanceMeal === 'no' ? 'is-active' : ''}`}
                    >
                      X
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

                <div>
                  <p className="text-[14px] font-medium tracking-[-0.03em] text-[#5d4837] sm:text-[15px]">
                    성함 <span className="text-[#e06f6f]">*</span>
                  </p>
                  <input
                    type="text"
                    value={attendanceName}
                    onChange={(event) => setAttendanceName(event.target.value)}
                    placeholder="성함을 입력해주세요"
                    className="attendance-text-input mt-3"
                  />
                </div>

                <div>
                  <p className="text-[14px] font-medium tracking-[-0.03em] text-[#5d4837] sm:text-[15px]">
                    동행인 수(본인 제외)
                  </p>
                  <input
                    type="number"
                    min="0"
                    inputMode="numeric"
                    value={attendanceCompanionCount}
                    onChange={(event) => setAttendanceCompanionCount(event.target.value)}
                    placeholder="예: 1"
                    className="attendance-text-input mt-3"
                  />
                </div>

                <div>
                  <p className="text-[14px] font-medium tracking-[-0.03em] text-[#5d4837] sm:text-[15px]">
                    전달사항
                  </p>
                  <textarea
                    value={attendanceNote}
                    onChange={(event) => setAttendanceNote(event.target.value)}
                    placeholder="남기실 말씀을 적어주세요"
                    className="attendance-textarea mt-3"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] text-[#7b6b5f] sm:text-[14px]">
                  <button
                    type="button"
                    onClick={() => setAttendanceConsent((prev) => !prev)}
                    className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-[3px] border transition ${attendanceConsent ? 'border-[#d6b7b6] bg-[#d6b7b6] text-white' : 'border-[#dfd5ca] bg-white text-transparent'}`}
                    aria-label="개인정보 수집 및 활용 동의"
                  >
                    <Check size={12} />
                  </button>
                  <span>개인정보 수집 및 활용 동의</span>
                  <button
                    type="button"
                    onClick={() => window.alert('참석 의사 확인을 위한 최소한의 정보만 수집합니다.')}
                    className="text-[#8a7c71] underline underline-offset-4"
                  >
                    [자세히보기]
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={!canSubmitAttendance}
              onClick={handleAttendanceSubmit}
              className="attendance-submit-button mt-5"
            >
              전달
            </button>
          </div>
        </div>
      ) : null}

      {introVisible && (
        <div className="intro-overlay">
          <div className="intro-content">
            <img
              className="intro-image"
              src={INTRO_IMAGE}
              alt={`${coupleLabel} 파티 일러스트`}
            />
            <div className="intro-text" aria-live="polite">
              {weddingInfo.groom.name} <span className="intro-heart" role="img" aria-label="하트">♥</span> {weddingInfo.bride.name} 파티 맺는 중<span className="intro-dots">{introDots}</span>
            </div>
            <div className="intro-progress" aria-hidden="true">
              <span className="intro-progress-fill" />
            </div>
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
                    alt={`${coupleLabel} 웨딩 메인 이미지`}
                  />
                </div>
              </div>

              <div className="space-y-2 px-6 text-center">
                <p className="party-complete-label">파티 모집 완료! 이제부터 같은 팀입니다.</p>
                <div className="space-y-2">
                  <p className="point-text text-[18px] leading-tight tracking-[-0.04em]">
                    <span className="font-bold">{groomGivenName}</span>이와 <span className="font-bold">{brideGivenName}</span>의
                  </p>
                  <p className="point-text text-[18px] leading-tight tracking-[-0.04em]">
                    결혼식에 초대드립니다.
                  </p>
                  <p className="text-[15px] leading-relaxed text-black/35">
                    {weddingInfo.dateLabel} {weddingInfo.timeLabel}
                    <br />
                    {weddingInfo.location.name}
                  </p>
                </div>
              </div>
            </section>
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper amount={0.2}>
            <section className="section-block pt-0 text-center">
              <div className="text-[16px] leading-[1.75] tracking-[-0.03em] text-black">
                <p>긴 여정 끝에 최고의 파티원을 만났습니다.</p>
                <p>인생의 솔로 플레이를 마치고,</p>
                <p>이제는 둘이 함께 새로운 퀘스트에 도전합니다.</p>
                <p>*퀘스트: 행복하고 예쁘게 살기 (진행 중)</p>
                <p>저희의 새로운 모험이 시작되는 날을 함께 응원해 주세요.</p>
              </div>
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
              <SectionHeading title="우리의 소개" />
              <div className="couple-intro-columns">
                <div className="intro-person-column">
                  <div className="intro-portrait-frame">
                    <img
                      src={`${import.meta.env.BASE_URL}${weddingInfo.gallery[1].src}`}
                      alt={`신부 ${weddingInfo.bride.name}`}
                      className="intro-portrait-image"
                    />
                  </div>
                  <article className="intro-profile-card">
                    <div className="flex items-center gap-2">
                      <span className="soft-chip inline-block px-2 py-0.5 text-[11px] font-medium tracking-[0.16em] text-black/55">
                        신부
                      </span>
                      <p className="point-text text-[24px] font-medium tracking-[-0.04em]">{brideGivenName}</p>
                    </div>
                    <span className="intro-profile-divider" aria-hidden="true" />
                    <p className="text-[13px] leading-relaxed text-black/55">
                      <span className="font-semibold text-black/72">
                        {weddingInfo.bride.father.name}, {weddingInfo.bride.mother.name}
                      </span>의 장녀
                    </p>
                    <div className="text-[13px] leading-[1.8] text-black/45">
                      <p>{weddingInfo.bride.profile.birthDate}</p>
                      <p>{weddingInfo.bride.profile.tags.join(' ')}</p>
                    </div>
                  </article>
                </div>

                <div className="intro-person-column intro-person-column-offset">
                  <article className="intro-profile-card intro-profile-card-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="soft-chip inline-block px-2 py-0.5 text-[11px] font-medium tracking-[0.16em] text-black/55">
                        신랑
                      </span>
                      <p className="point-text text-[24px] font-medium tracking-[-0.04em]">{groomGivenName}</p>
                    </div>
                    <span className="intro-profile-divider intro-profile-divider-right" aria-hidden="true" />
                    <p className="text-[13px] leading-relaxed text-black/55">
                      <span className="font-semibold text-black/72">
                        {weddingInfo.groom.father.name}, {weddingInfo.groom.mother.name}
                      </span>의 장남
                    </p>
                    <div className="text-[13px] leading-[1.8] text-black/45">
                      <p>{weddingInfo.groom.profile.birthDate}</p>
                      <p>{weddingInfo.groom.profile.tags.join(' ')}</p>
                    </div>
                  </article>
                  <div className="intro-portrait-frame">
                    <img
                      src={`${import.meta.env.BASE_URL}${weddingInfo.gallery[0].src}`}
                      alt={`신랑 ${weddingInfo.groom.name}`}
                      className="intro-portrait-image"
                    />
                  </div>
                </div>
              </div>
              {/*
                  <div className="aspect-square">
                    <img
                      src={`${import.meta.env.BASE_URL}${weddingInfo.gallery[0].src}`}
                      alt={`신랑 ${weddingInfo.groom.name}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="space-y-2 self-center">
                    <p className="text-[13px] leading-relaxed text-black/55">
                      <span className="font-semibold text-black/72">
                        {weddingInfo.groom.father.name}, {weddingInfo.groom.mother.name}
                      </span>의 장남
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="soft-chip inline-block px-2 py-0.5 text-[11px] font-medium tracking-[0.16em] text-black/55">
                        신랑
                      </span>
                      <p className="point-text text-[24px] font-medium tracking-[-0.04em]">{groomGivenName}</p>
                    </div>
                    <div className="text-[13px] leading-[1.8] text-black/45">
                      <p>{weddingInfo.groom.profile.birthDate}</p>
                      <p>{weddingInfo.groom.profile.tags.join(' ')}</p>
                    </div>
                  </div>
                </article> : null}

                <article className="soft-card grid grid-cols-[1fr_110px] gap-4 p-4">
                  <div className="space-y-2 self-center text-right">
                    <p className="text-[13px] leading-relaxed text-black/55">
                      <span className="font-semibold text-black/72">
                        {weddingInfo.bride.father.name}, {weddingInfo.bride.mother.name}
                      </span>의 장녀
                    </p>
                    <div className="flex items-center justify-end gap-2">
                      <span className="soft-chip inline-block px-2 py-0.5 text-[11px] font-medium tracking-[0.16em] text-black/55">
                        신부
                      </span>
                      <p className="point-text text-[24px] font-medium tracking-[-0.04em]">{brideGivenName}</p>
                    </div>
                    <div className="text-[13px] leading-[1.8] text-black/45">
                      <p>{weddingInfo.bride.profile.birthDate}</p>
                      <p>{weddingInfo.bride.profile.tags.join(' ')}</p>
                    </div>
                  </div>
                  <div className="aspect-square">
                    <img
                      src={`${import.meta.env.BASE_URL}${weddingInfo.gallery[1].src}`}
                      alt={`신부 ${weddingInfo.bride.name}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </article>
              */}
            </section>
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper amount={0.18} delay={0.02}>
            <LoveStoryTimeline items={loveStoryItems} />
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper amount={0.18}>
            <GalleryGrid images={galleryImages} />
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper amount={0.16}>
            <Map />
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper amount={0.18}>
            <section className="section-block gap-8">
              <SectionHeading title="안내사항" />
              <div className="soft-card overflow-hidden">
                <div
                  className="grid grid-cols-2 gap-0 border-b border-black/8 bg-[#f8f6ef]"
                  role="tablist"
                  aria-label="안내사항 탭"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={infoTab === 'bride-room'}
                    aria-controls="info-tab-panel"
                    onClick={() => setInfoTab('bride-room')}
                    className={`info-tab-button ${infoTab === 'bride-room' ? 'is-active' : ''}`}
                  >
                    신부대기실
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={infoTab === 'banquet'}
                    aria-controls="info-tab-panel"
                    onClick={() => setInfoTab('banquet')}
                    className={`info-tab-button ${infoTab === 'banquet' ? 'is-active' : ''}`}
                  >
                    연회장
                  </button>
                </div>

                <figure id="info-tab-panel" role="tabpanel">
                  <img
                    src={infoTabContent.image}
                    alt={infoTabContent.alt}
                    className="aspect-auto w-full object-contain"
                  />
                  <figcaption className="space-y-4 px-5 py-5 text-left text-[13px] leading-[1.8] text-black/68">
                    {infoTab === 'bride-room' ? (
                      <div className="space-y-3">
                        <p>신부대기실은 4층 계단으로 올라오시면 됩니다.</p>
                        <p>
                          계단 이용이 어려우신 분들은
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
                        <p>180여 가지의 뷔페식과 음주류가 준비되어 있으니 맛있게 즐겨주세요.</p>
                        <div className="space-y-2">
                          <p className="font-semibold text-black">특히 이 메뉴는 꼭 챙겨보세요!</p>
                          <ul className="space-y-1">
                            <li>- LA 갈비를 포함한 모든 고기 메뉴</li>
                            <li>- 육회갈비와 즉석 스테이크</li>
                            <li>- 연회장 전용 코너의 초밥 섹션</li>
                            <li>- 파스타는 바로 만들어줘서 특히 추천</li>
                            <li>- 와플과 함께 즐기는 디저트 코너</li>
                            <li>- 식사 후에는 커피와 과일, 아이스크림 추천</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </figcaption>
                </figure>
              </div>
            </section>
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper amount={0.12}>
            <Guestbook />
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper amount={0.14}>
            <section className="section-block gap-6">
              <SectionHeading title="마음 전하실 곳" />
              <p className="text-center text-[13px] leading-[1.8] text-black/55">
                비대면으로 축하를 전하고자
                <br />
                하시는 분들을 위해 기재하였습니다.
                <br />
                너그러운 마음으로 양해 부탁드립니다.
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
            <section className="section-block gap-6 text-center">
              <SectionHeading title="참석 의사 전달" />
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
                저희 두 사람,
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
