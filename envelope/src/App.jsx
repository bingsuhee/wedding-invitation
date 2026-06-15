import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { weddingInfo } from '@shared/data/info';
import { supabase } from './lib/supabaseClient';
import EnvelopeScene from './components/EnvelopeScene';
import Map from './components/Map';
import Guestbook from './components/Guestbook';
import ScrollAnimationWrapper from './components/ScrollAnimationWrapper';

const BASE_URL = import.meta.env.BASE_URL;

/* ──────────────── 소형 공통 컴포넌트 ──────────────── */

const Divider = () => (
  <div className="letter-divider my-2">
    <span className="divider-dot">✦</span>
  </div>
);

const SectionLabel = ({ en, ko }) => (
  <div className="s-label">
    <span className="s-en">{en}</span>
    <span className="s-ko">{ko}</span>
  </div>
);

/* ──────────────── Countdown ──────────────── */

const Countdown = () => {
  const target = useMemo(
    () => new Date(weddingInfo.year, weddingInfo.month - 1, weddingInfo.day, weddingInfo.hour, weddingInfo.minute, 0),
    []
  );

  const calc = () => {
    const diff = Math.max(0, target - new Date());
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
      done: diff === 0,
    };
  };

  const [c, setC] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setC(calc()), 1000);
    return () => clearInterval(id);
  }, []);

  const Unit = ({ n, l }) => (
    <div className="cd-unit">
      <div className="cd-num">{String(n).padStart(2, '0')}</div>
      <div className="cd-lbl">{l}</div>
    </div>
  );

  return (
    <ScrollAnimationWrapper>
      <section className="py-10">
        <div className="px-8">
          <SectionLabel en="Countdown" ko="예식까지" />
        </div>
        <div className="countdown-wrap">
          <Unit n={c.d} l="일" />
          <span className="cd-sep">:</span>
          <Unit n={c.h} l="시간" />
          <span className="cd-sep">:</span>
          <Unit n={c.m} l="분" />
          <span className="cd-sep">:</span>
          <Unit n={c.s} l="초" />
        </div>
        <p className="cd-caption px-8">
          {c.done
            ? <>오늘은 {weddingInfo.groom.name} · {weddingInfo.bride.name}의 결혼식입니다</>
            : <>{weddingInfo.groom.name} · {weddingInfo.bride.name}의 결혼식이 <b>{c.d}일</b> 남았어요</>}
        </p>
      </section>
    </ScrollAnimationWrapper>
  );
};

/* ──────────────── Calendar ──────────────── */

const Calendar = () => {
  const { year, month, day } = weddingInfo;
  const first = new Date(year, month - 1, 1);
  const startDow = first.getDay();
  const days = new Date(year, month, 0).getDate();
  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);
  const dow = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <ScrollAnimationWrapper>
      <section className="py-10">
        <div className="px-8">
          <SectionLabel en="Save the Date" ko="예식 일시" />
        </div>
        <div className="cal-wrap">
          <div className="cal-head">{weddingInfo.date.replace(' 낮', '').replace('일요일', '(일)')}</div>
          <div className="cal-sub">{weddingInfo.timeLabel}</div>
          <div className="cal-grid">
            {dow.map((d, i) => (
              <div key={'h' + i} className="cal-dow" style={i === 0 ? { color: 'var(--seal)' } : null}>
                {d}
              </div>
            ))}
            {cells.map((d, i) => (
              <div
                key={i}
                className={[
                  'cal-day',
                  d === null ? 'muted' : '',
                  d === day ? 'mark' : '',
                  d !== null && i % 7 === 0 ? 'sun' : '',
                ].join(' ')}
              >
                {d ?? '·'}
              </div>
            ))}
          </div>
        </div>
      </section>
    </ScrollAnimationWrapper>
  );
};

/* ──────────────── RSVP 모달 ──────────────── */

const choiceBtn = (active) =>
  `flex-1 rounded-sm border py-3 text-[13px] font-medium transition-all ${
    active
      ? 'border-[var(--seal)] bg-[var(--seal)] text-white shadow-sm'
      : 'border-[rgba(74,64,54,0.15)] bg-white text-[var(--ink)]'
  }`;

const RsvpModal = ({ onClose }) => {
  const [rsvpSide, setRsvpSide] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState('');
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpMeal, setRsvpMeal] = useState('');
  const [rsvpConsent, setRsvpConsent] = useState(false);
  const [rsvpLoading, setRsvpLoading] = useState(false);

  const canSubmit = rsvpSide && rsvpStatus && rsvpName.trim() && rsvpConsent;

  const handleSubmit = async () => {
    if (!canSubmit || rsvpLoading) return;
    setRsvpLoading(true);
    try {
      const { error } = await supabase.from('rsvp').insert([{
        name: rsvpName.trim(),
        side: rsvpSide,
        status: rsvpStatus,
        meal: rsvpMeal || null,
      }]);
      if (error) throw error;
      alert('참석 의사가 전달되었습니다.');
      onClose();
    } catch {
      alert('전달에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setRsvpLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(45,31,20,0.55)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-[480px] rounded-t-[20px] sm:rounded-[16px] p-6"
        style={{ background: 'var(--paper)', maxHeight: '92svh', overflowY: 'auto' }}
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <p className="font-garamyeon text-[22px]" style={{ color: 'var(--ink)' }}>참석 의사 전달</p>
          <button onClick={onClose} style={{ color: 'var(--ink-soft)' }} className="hover:opacity-70 transition-opacity mt-1">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-[13px] mb-3" style={{ color: 'var(--ink)' }}>어느 측 하객이신가요? <span style={{ color: 'var(--accent)' }}>*</span></p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setRsvpSide('groom')} className={choiceBtn(rsvpSide === 'groom')}>신랑</button>
              <button onClick={() => setRsvpSide('bride')} className={choiceBtn(rsvpSide === 'bride')}>신부</button>
            </div>
          </div>
          <div>
            <p className="text-[13px] mb-3" style={{ color: 'var(--ink)' }}>참석 하시나요? <span style={{ color: 'var(--accent)' }}>*</span></p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setRsvpStatus('attending')} className={choiceBtn(rsvpStatus === 'attending')}>참석</button>
              <button onClick={() => setRsvpStatus('absent')} className={choiceBtn(rsvpStatus === 'absent')}>불참석</button>
            </div>
          </div>
          <div>
            <p className="text-[13px] mb-1" style={{ color: 'var(--ink)' }}>성함 <span style={{ color: 'var(--accent)' }}>*</span></p>
            <input type="text" className="ink-input" value={rsvpName} onChange={(e) => setRsvpName(e.target.value)} placeholder="이름을 입력해 주세요" />
          </div>
          <div>
            <p className="text-[13px] mb-3" style={{ color: 'var(--ink)' }}>식사 하시나요?</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setRsvpMeal('yes')} className={choiceBtn(rsvpMeal === 'yes')}>O</button>
              <button onClick={() => setRsvpMeal('no')} className={choiceBtn(rsvpMeal === 'no')}>X</button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setRsvpConsent(v => !v)}
              className={`w-8 h-8 shrink-0 rounded-sm border flex items-center justify-center transition-all ${
                rsvpConsent ? 'text-white' : 'bg-white'
              }`}
              style={{
                background: rsvpConsent ? 'var(--ink)' : 'white',
                borderColor: rsvpConsent ? 'var(--ink)' : 'rgba(74,64,54,0.2)',
              }}
            >
              {rsvpConsent && <Check size={14} className="text-white" />}
            </button>
            <span className="text-[11px]" style={{ color: 'var(--ink-soft)' }}>개인정보 수집 및 활용 동의</span>
            <button
              className="text-[11px] underline underline-offset-4 ml-auto shrink-0"
              style={{ color: 'var(--ink-soft)' }}
              onClick={() => alert('참석 의사 확인을 위한 최소한의 정보만 수집합니다.')}
            >
              자세히
            </button>
          </div>
        </div>

        <button
          disabled={!canSubmit || rsvpLoading}
          onClick={handleSubmit}
          className="mt-6 w-full py-3.5 text-[14px] font-medium tracking-wide text-white rounded-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: canSubmit ? 'var(--seal)' : 'var(--line)' }}
        >
          {rsvpLoading ? '전달 중...' : '전달하기'}
        </button>
      </motion.div>
    </motion.div>
  );
};

/* ──────────────── PostageStamp ──────────────── */

const PostageStamp = () => (
  <div
    className="w-14 h-[72px] flex flex-col items-center justify-center relative"
    style={{
      background: 'white',
      border: '1.5px solid rgba(176,125,100,0.5)',
      outline: '2px dashed rgba(176,125,100,0.22)',
      outlineOffset: '-4px',
      boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
    }}
  >
    <div className="text-[6px] tracking-[0.15em] uppercase font-medium" style={{ color: 'var(--ink-soft)' }}>KOREA</div>
    <div className="font-dancing text-[10px] mt-0.5" style={{ color: 'var(--accent)' }}>Wedding</div>
    <div className="text-[8px] font-bold mt-0.5" style={{ color: 'var(--accent)' }}>2026</div>
    <div className="absolute -left-[5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full" style={{ background: 'var(--paper-edge)' }} />
    <div className="absolute -right-[5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full" style={{ background: 'var(--paper-edge)' }} />
    <div className="absolute top-[-5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full" style={{ background: 'var(--paper-edge)' }} />
    <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full" style={{ background: 'var(--paper-edge)' }} />
  </div>
);

/* ──────────────── 메인 앱 ──────────────── */

const App = () => {
  const [phase, setPhase] = useState('envelope');
  const [galleryIndex, setGalleryIndex] = useState(null);
  const [copied, setCopied] = useState({});
  const [openAccount, setOpenAccount] = useState(null);
  const [infoTab, setInfoTab] = useState('bride-room');
  const [rsvpOpen, setRsvpOpen] = useState(false);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied({ [key]: true });
    setTimeout(() => setCopied({}), 2000);
  };

  const selectedImage = galleryIndex !== null ? weddingInfo.gallery[galleryIndex] : null;
  const prevImage = () => setGalleryIndex(i => (i - 1 + weddingInfo.gallery.length) % weddingInfo.gallery.length);
  const nextImage = () => setGalleryIndex(i => (i + 1) % weddingInfo.gallery.length);

  const groomAccounts = [
    { label: '신랑', name: weddingInfo.groom.name, account: weddingInfo.groom.account, key: 'groom' },
    { label: '아버지', name: weddingInfo.groom.father.name, account: weddingInfo.groom.father.account, key: 'groom-father' },
    { label: '어머니', name: weddingInfo.groom.mother.name, account: weddingInfo.groom.mother.account, key: 'groom-mother' },
  ];
  const brideAccounts = [
    { label: '신부', name: weddingInfo.bride.name, account: weddingInfo.bride.account, key: 'bride' },
    { label: '아버지', name: weddingInfo.bride.father.name, account: weddingInfo.bride.father.account, key: 'bride-father' },
    { label: '어머니', name: weddingInfo.bride.mother.name, account: weddingInfo.bride.mother.account, key: 'bride-mother' },
  ];

  return (
    <>
      {/* ── RSVP 모달 ── */}
      <AnimatePresence>
        {rsvpOpen && <RsvpModal onClose={() => setRsvpOpen(false)} />}
      </AnimatePresence>

      {/* ── 갤러리 라이트박스 ── */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-[110] flex items-center justify-center"
            style={{ background: 'rgba(20,10,5,0.92)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setGalleryIndex(null)}
          >
            <button className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors" onClick={() => setGalleryIndex(null)}>
              <X size={22} />
            </button>
            <button
              className="absolute left-3 text-white/70 hover:text-white transition-colors p-2 text-[28px] leading-none"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
            >‹</button>
            <img
              src={`${BASE_URL}${selectedImage.src}`}
              alt={selectedImage.caption}
              className="max-h-[85svh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute right-3 text-white/70 hover:text-white transition-colors p-2 text-[28px] leading-none"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
            >›</button>
            {selectedImage.caption && (
              <p className="absolute bottom-5 inset-x-0 text-center text-[12px] text-white/60">{selectedImage.caption}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 봉투 씬 ── */}
      <AnimatePresence>
        {phase === 'envelope' && (
          <EnvelopeScene key="envelope-scene" onOpen={() => setPhase('letter')} />
        )}
      </AnimatePresence>

      {/* ── 편지 내용 ── */}
      {phase === 'letter' && (
        <motion.main
          className="letter-paper"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
        >

          {/* ═══ 1. 커버 ═══ */}
          <section className="relative overflow-hidden">
            <div className="relative h-[68svh]">
              <img
                src={`${BASE_URL}images/hero-top.jpg`}
                alt="웨딩 사진"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to bottom, transparent 35%, color-mix(in oklab, var(--paper) 90%, transparent) 80%, var(--paper) 100%)' }}
              />
              <div className="absolute inset-x-0 bottom-0 text-center pb-10 px-8">
                <div className="cover-kicker">Wedding Invitation</div>
                <div className="cover-names">
                  {weddingInfo.groom.name}
                  <span className="cover-amp">and</span>
                  {weddingInfo.bride.name}
                </div>
                <div className="cover-date">{weddingInfo.dateLabel}</div>
              </div>
            </div>
            {/* 우표 장식 */}
            <div className="absolute top-6 right-5">
              <PostageStamp />
            </div>
          </section>

          <Divider />

          {/* ═══ 2. 인사말 ═══ */}
          <ScrollAnimationWrapper>
            <section className="px-8 py-10 text-center">
              <SectionLabel en="Invitation" ko="모시는 글" />
              <p className="greeting-text whitespace-pre-wrap">
                {weddingInfo.message}
              </p>
              <button
                onClick={() => setRsvpOpen(true)}
                className="mt-10 inline-flex items-center gap-2 text-white text-[11px] tracking-[0.18em] uppercase px-8 py-3 rounded-sm transition-opacity hover:opacity-85"
                style={{ background: 'var(--ink)' }}
              >
                참석 의사 전달
              </button>
            </section>
          </ScrollAnimationWrapper>

          <Divider />

          {/* ═══ 3. 예식까지 (Countdown) ═══ */}
          <Countdown />

          <Divider />

          {/* ═══ 4. 예식 일시 (Calendar) ═══ */}
          <Calendar />

          <Divider />

          {/* ═══ 5. 우리의 이야기 ═══ */}
          <ScrollAnimationWrapper>
            <section className="py-10">
              <div className="px-8">
                <SectionLabel en="Our Story" ko="우리의 이야기" />
              </div>
              <div className="grid grid-cols-2 gap-4 px-6">
                {weddingInfo.loveStory.map((item, i) => (
                  <motion.div
                    key={i}
                    className={`polaroid ${i === weddingInfo.loveStory.length - 1 && weddingInfo.loveStory.length % 2 === 1 ? 'col-span-2 w-[48%] mx-auto' : ''}`}
                    style={{ rotate: `${i % 2 === 0 ? -1.8 : 1.8}deg`, marginTop: i % 2 === 1 ? '20px' : '0' }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                  >
                    <img src={`${BASE_URL}${item.image}`} alt={item.title} className="w-full aspect-[4/5] object-cover" />
                    <div className="pt-2 px-1">
                      <p className="font-garamyeon text-[13px] leading-snug" style={{ color: 'var(--ink)' }}>{item.title}</p>
                      <p className="text-[9px] mt-0.5" style={{ color: 'var(--ink-soft)' }}>{item.date}</p>
                      <p className="text-[10px] mt-1 leading-relaxed" style={{ color: 'var(--ink-soft)' }}>{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </ScrollAnimationWrapper>

          <Divider />

          {/* ═══ 6. 갤러리 ═══ */}
          <section className="py-10">
            <div className="px-8">
              <SectionLabel en="Our Moments" ko="갤러리" />
            </div>
            <div className="grid grid-cols-3 gap-0.5">
              {weddingInfo.gallery.map((image, i) => (
                <button key={i} className="aspect-square overflow-hidden block" onClick={() => setGalleryIndex(i)}>
                  <img
                    src={`${BASE_URL}${image.src}`}
                    alt={image.caption}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </section>

          <Divider />

          {/* ═══ 7. 안내사항 ═══ */}
          <ScrollAnimationWrapper>
            <section className="py-10">
              <div className="px-8">
                <SectionLabel en="Information" ko="안내사항" />
              </div>
              <div className="notice-tabs-wrap">
                <div className="notice-tabs" role="tablist">
                  <button
                    role="tab"
                    aria-selected={infoTab === 'bride-room'}
                    className={`ntab ${infoTab === 'bride-room' ? 'active' : ''}`}
                    onClick={() => setInfoTab('bride-room')}
                  >
                    신부대기실
                  </button>
                  <button
                    role="tab"
                    aria-selected={infoTab === 'banquet-hall'}
                    className={`ntab ${infoTab === 'banquet-hall' ? 'active' : ''}`}
                    onClick={() => setInfoTab('banquet-hall')}
                  >
                    연회장
                  </button>
                </div>
                <div className="notice-panel" role="tabpanel">
                  <img
                    src={`${BASE_URL}images/${infoTab === 'bride-room' ? 'bride-room.jpg' : 'banquet-hall.jpg'}`}
                    alt={infoTab === 'bride-room' ? '신부대기실' : '연회장'}
                    className="w-full object-cover rounded-md"
                  />
                </div>
              </div>
            </section>
          </ScrollAnimationWrapper>

          <Divider />

          {/* ═══ 8. 오시는 길 ═══ */}
          <div className="py-4">
            <div className="px-8 mb-2">
              <SectionLabel en="Location" ko="오시는 길" />
            </div>
            <Map />
          </div>

          <Divider />

          {/* ═══ 9. 마음 전하실 곳 ═══ */}
          <ScrollAnimationWrapper>
            <section className="px-8 py-10">
              <SectionLabel en="With Heart" ko="마음 전하실 곳" />
              <div className="space-y-3">
                {/* 신랑측 */}
                <div className="acct-wrap">
                  <button
                    className="acct-head-row w-full text-left"
                    onClick={() => setOpenAccount(openAccount === 'groom' ? null : 'groom')}
                  >
                    <span className="acct-who">신랑측</span>
                    {openAccount === 'groom'
                      ? <ChevronUp size={16} style={{ color: 'var(--ink-soft)' }} />
                      : <ChevronDown size={16} style={{ color: 'var(--ink-soft)' }} />}
                  </button>
                  <AnimatePresence>
                    {openAccount === 'groom' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        {groomAccounts.map(({ label, name, account, key }) => (
                          <div key={key} className="acct-row">
                            <div>
                              <div className="acct-bank">{label} · {name}</div>
                              <div className="acct-no">{account}</div>
                            </div>
                            <button
                              onClick={() => handleCopy(account, key)}
                              className="copy-btn flex items-center gap-1.5"
                            >
                              {copied[key] ? <Check size={12} /> : <Copy size={12} />}
                              {copied[key] ? '복사됨' : '복사'}
                            </button>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 신부측 */}
                <div className="acct-wrap">
                  <button
                    className="acct-head-row w-full text-left"
                    onClick={() => setOpenAccount(openAccount === 'bride' ? null : 'bride')}
                  >
                    <span className="acct-who">신부측</span>
                    {openAccount === 'bride'
                      ? <ChevronUp size={16} style={{ color: 'var(--ink-soft)' }} />
                      : <ChevronDown size={16} style={{ color: 'var(--ink-soft)' }} />}
                  </button>
                  <AnimatePresence>
                    {openAccount === 'bride' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        {brideAccounts.map(({ label, name, account, key }) => (
                          <div key={key} className="acct-row">
                            <div>
                              <div className="acct-bank">{label} · {name}</div>
                              <div className="acct-no">{account}</div>
                            </div>
                            <button
                              onClick={() => handleCopy(account, key)}
                              className="copy-btn flex items-center gap-1.5"
                            >
                              {copied[key] ? <Check size={12} /> : <Copy size={12} />}
                              {copied[key] ? '복사됨' : '복사'}
                            </button>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </section>
          </ScrollAnimationWrapper>

          <Divider />

          {/* ═══ 10. 방명록 ═══ */}
          <Guestbook />

          <Divider />

          {/* ═══ 11. 답장 카드 (RSVP) ═══ */}
          <ScrollAnimationWrapper>
            <section className="px-8 py-12 text-center">
              <div
                className="px-8 py-10 relative overflow-hidden rounded-sm"
                style={{
                  background: 'color-mix(in oklab, var(--paper) 60%, #fff)',
                  border: '1px dashed color-mix(in oklab, var(--line) 80%, transparent)',
                }}
              >
                <div className="flex items-center gap-3 mb-6" style={{ color: 'var(--line)' }}>
                  <div className="flex-1 h-px bg-current" />
                  <span className="text-[10px] tracking-[0.3em] uppercase font-medium" style={{ color: 'var(--accent)', opacity: 0.7 }}>Reply Card</span>
                  <div className="flex-1 h-px bg-current" />
                </div>
                <p className="font-garamyeon text-[20px] mb-2" style={{ color: 'var(--ink)' }}>참석 여부를 알려주세요</p>
                <p className="text-[12px] leading-relaxed mb-8" style={{ color: 'var(--ink-soft)' }}>
                  원활한 준비를 위해<br />참석 의사를 전달해 주시면 감사하겠습니다.
                </p>
                <button
                  onClick={() => setRsvpOpen(true)}
                  className="inline-flex items-center gap-2 text-white text-[12px] tracking-[0.15em] uppercase px-10 py-3.5 rounded-sm transition-opacity hover:opacity-85"
                  style={{ background: 'var(--seal)' }}
                >
                  참석 의사 전달
                </button>
              </div>
            </section>
          </ScrollAnimationWrapper>

          {/* ═══ 12. 클로징 ═══ */}
          <div className="closing-wrap border-t" style={{ borderColor: 'color-mix(in oklab, var(--line) 40%, transparent)' }}>
            <div className="closing-thanks">와주셔서<br />감사합니다</div>
            <div className="closing-sign">{weddingInfo.groom.name} &amp; {weddingInfo.bride.name}</div>
            <p className="text-[11px] mt-3 tracking-[0.2em]" style={{ color: 'var(--ink-soft)' }}>{weddingInfo.dateLabel}</p>
          </div>

        </motion.main>
      )}
    </>
  );
};

export default App;
