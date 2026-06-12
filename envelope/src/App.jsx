import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { weddingInfo } from '@shared/data/info';
import { supabase } from './lib/supabaseClient';
import EnvelopeScene from './components/EnvelopeScene';
import Map from './components/Map';
import Guestbook from './components/Guestbook';
import ScrollAnimationWrapper from './components/ScrollAnimationWrapper';

const BASE_URL = import.meta.env.BASE_URL;

/* ──────────────── 재사용 소형 컴포넌트 ──────────────── */

const Divider = () => (
  <div className="letter-divider my-1">
    <span className="w-1.5 h-1.5 rotate-45 border border-current shrink-0" />
  </div>
);

const SectionTitle = ({ kr, en }) => (
  <div className="text-center mb-8">
    <p className="font-garamyeon text-[22px] text-[#2d1f14]">{kr}</p>
    <p className="text-[9px] tracking-[0.3em] uppercase text-[#8b6b4a] mt-1">{en}</p>
  </div>
);

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
    <div className="text-[6px] tracking-[0.15em] text-[#8b6b4a] uppercase font-medium">KOREA</div>
    <div className="font-dancing text-[10px] text-[#b07d64] mt-0.5">Wedding</div>
    <div className="text-[8px] text-[#b07d64] font-bold mt-0.5">2026</div>
    {/* Perforation dots */}
    <div className="absolute -left-[5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#fdf9f4]" />
    <div className="absolute -right-[5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#fdf9f4]" />
    <div className="absolute top-[-5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#fdf9f4]" />
    <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#fdf9f4]" />
  </div>
);

/* ──────────────── 메인 앱 ──────────────── */

const App = () => {
  const [phase, setPhase] = useState('envelope');

  // 갤러리 라이트박스
  const [galleryIndex, setGalleryIndex] = useState(null);

  // 계좌 복사
  const [copied, setCopied] = useState({});
  const [openAccount, setOpenAccount] = useState(null); // 'groom' | 'bride'

  // 안내사항 탭
  const [infoTab, setInfoTab] = useState('bride-room');

  // RSVP 모달
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [rsvpSide, setRsvpSide] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState('');
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpMeal, setRsvpMeal] = useState('');
  const [rsvpConsent, setRsvpConsent] = useState(false);
  const [rsvpLoading, setRsvpLoading] = useState(false);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied({ [key]: true });
    setTimeout(() => setCopied({}), 2000);
  };

  const canSubmitRsvp = rsvpSide && rsvpStatus && rsvpName.trim() && rsvpConsent;

  const handleRsvpSubmit = async () => {
    if (!canSubmitRsvp || rsvpLoading) return;
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
      setRsvpOpen(false);
      setRsvpSide(''); setRsvpStatus(''); setRsvpName(''); setRsvpMeal(''); setRsvpConsent(false);
    } catch {
      alert('전달에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setRsvpLoading(false);
    }
  };

  const closeRsvp = () => {
    if (rsvpLoading) return;
    setRsvpOpen(false);
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

  const selectorStyle = (active) =>
    `flex-1 rounded-none py-2 text-[12px] border-b-2 transition-colors ${
      active ? 'border-[#b07d64] text-[#b07d64] font-medium' : 'border-[rgba(45,31,20,0.1)] text-[#8b6b4a]'
    }`;

  const choiceBtn = (active) =>
    `flex-1 rounded-sm border py-3 text-[13px] font-medium transition-all ${
      active
        ? 'border-[#b07d64] bg-[#b07d64] text-white shadow-sm'
        : 'border-[rgba(45,31,20,0.15)] bg-white text-[#2d1f14]'
    }`;

  return (
    <>
      {/* ── RSVP 모달 ── */}
      <AnimatePresence>
        {rsvpOpen && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center"
            style={{ background: 'rgba(45,31,20,0.55)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeRsvp}
          >
            <motion.div
              className="w-full max-w-[480px] rounded-t-[20px] sm:rounded-[16px] p-6"
              style={{ background: '#fdf9f4', maxHeight: '92svh', overflowY: 'auto' }}
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <p className="font-garamyeon text-[22px] text-[#2d1f14]">참석 의사 전달</p>
                <button onClick={closeRsvp} className="text-[#8b6b4a] hover:text-[#2d1f14] transition-colors mt-1">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-[13px] text-[#5a3e2b] mb-3">어느 측 하객이신가요? <span className="text-[#b07d64]">*</span></p>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setRsvpSide('groom')} className={choiceBtn(rsvpSide === 'groom')}>신랑</button>
                    <button onClick={() => setRsvpSide('bride')} className={choiceBtn(rsvpSide === 'bride')}>신부</button>
                  </div>
                </div>

                <div>
                  <p className="text-[13px] text-[#5a3e2b] mb-3">참석 하시나요? <span className="text-[#b07d64]">*</span></p>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setRsvpStatus('attending')} className={choiceBtn(rsvpStatus === 'attending')}>참석</button>
                    <button onClick={() => setRsvpStatus('absent')} className={choiceBtn(rsvpStatus === 'absent')}>불참석</button>
                  </div>
                </div>

                <div>
                  <p className="text-[13px] text-[#5a3e2b] mb-1">성함 <span className="text-[#b07d64]">*</span></p>
                  <input
                    type="text"
                    className="ink-input"
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    placeholder="이름을 입력해 주세요"
                  />
                </div>

                <div>
                  <p className="text-[13px] text-[#5a3e2b] mb-3">식사 하시나요?</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setRsvpMeal('yes')} className={choiceBtn(rsvpMeal === 'yes')}>O</button>
                    <button onClick={() => setRsvpMeal('no')} className={choiceBtn(rsvpMeal === 'no')}>X</button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setRsvpConsent(v => !v)}
                    className={`w-8 h-8 shrink-0 rounded-sm border flex items-center justify-center transition-all ${
                      rsvpConsent ? 'bg-[#2d1f14] border-[#2d1f14]' : 'bg-white border-[rgba(45,31,20,0.2)]'
                    }`}
                  >
                    {rsvpConsent && <Check size={14} className="text-white" />}
                  </button>
                  <span className="text-[11px] text-[#8b6b4a]">개인정보 수집 및 활용 동의</span>
                  <button
                    className="text-[11px] text-[#8b6b4a] underline underline-offset-4 ml-auto shrink-0"
                    onClick={() => alert('참석 의사 확인을 위한 최소한의 정보만 수집합니다.')}
                  >
                    자세히
                  </button>
                </div>
              </div>

              <button
                disabled={!canSubmitRsvp || rsvpLoading}
                onClick={handleRsvpSubmit}
                className="mt-6 w-full py-3.5 text-[14px] font-medium tracking-wide text-white rounded-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: canSubmitRsvp ? '#b07d64' : '#c8b097' }}
              >
                {rsvpLoading ? '전달 중...' : '전달하기'}
              </button>
            </motion.div>
          </motion.div>
        )}
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
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
              onClick={() => setGalleryIndex(null)}
            >
              <X size={22} />
            </button>
            <button
              className="absolute left-3 text-white/70 hover:text-white transition-colors p-2"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
            >
              ‹
            </button>
            <img
              src={`${BASE_URL}${selectedImage.src}`}
              alt={selectedImage.caption}
              className="max-h-[85svh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute right-3 text-white/70 hover:text-white transition-colors p-2 text-[28px] leading-none"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
            >
              ›
            </button>
            {selectedImage.caption && (
              <p className="absolute bottom-5 inset-x-0 text-center text-[12px] text-white/60">
                {selectedImage.caption}
              </p>
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

          {/* ═══ 1. 히어로 ═══ */}
          <section className="relative overflow-hidden">
            <div className="relative h-[68svh]">
              <img
                src={`${BASE_URL}images/hero-top.jpg`}
                alt="웨딩 사진"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(253,249,244,0.95) 85%, #fdf9f4 100%)' }}
              />
              <div className="absolute inset-x-0 bottom-0 text-center pb-10 px-8">
                <p className="text-[8px] tracking-[0.45em] uppercase mb-3" style={{ color: '#8b6b4a' }}>청첩장</p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="font-dancing text-[46px] leading-none" style={{ color: '#2d1f14' }}>
                    {weddingInfo.groom.name}
                  </span>
                  <span className="font-dancing text-[28px]" style={{ color: '#b07d64' }}>&</span>
                  <span className="font-dancing text-[46px] leading-none" style={{ color: '#2d1f14' }}>
                    {weddingInfo.bride.name}
                  </span>
                </div>
                <p className="text-[12px] mt-2 tracking-wide" style={{ color: '#7d6251' }}>{weddingInfo.dateLabel}</p>
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
              <SectionTitle kr="인사말" en="GREETING" />
              <p
                className="font-garamyeon text-[17px] leading-[2.2] whitespace-pre-wrap"
                style={{ color: '#3d2b1f' }}
              >
                {weddingInfo.message}
              </p>
              <button
                onClick={() => setRsvpOpen(true)}
                className="mt-10 inline-flex items-center gap-2 text-white text-[11px] tracking-[0.18em] uppercase px-8 py-3 rounded-sm transition-colors hover:opacity-85"
                style={{ background: '#2d1f14' }}
              >
                참석 의사 전달
              </button>
            </section>
          </ScrollAnimationWrapper>

          <Divider />

          {/* ═══ 3. 예식 안내 ═══ */}
          <ScrollAnimationWrapper>
            <section className="px-8 py-10">
              <SectionTitle kr="예식 안내" en="CEREMONY" />
              <div className="paper-card p-7 text-center space-y-5">
                <div>
                  <p className="text-[10px] tracking-[0.25em] uppercase mb-1" style={{ color: '#8b6b4a' }}>DATE & TIME</p>
                  <p className="font-garamyeon text-[20px]" style={{ color: '#2d1f14' }}>{weddingInfo.date}</p>
                </div>
                <div className="h-px" style={{ background: 'rgba(45,31,20,0.1)' }} />
                <div>
                  <p className="text-[10px] tracking-[0.25em] uppercase mb-1" style={{ color: '#8b6b4a' }}>VENUE</p>
                  <p className="text-[15px] font-medium" style={{ color: '#2d1f14' }}>{weddingInfo.location.name}</p>
                  <p className="text-[12px] mt-1" style={{ color: '#7d6251' }}>{weddingInfo.location.address}</p>
                </div>
              </div>
            </section>
          </ScrollAnimationWrapper>

          <Divider />

          {/* ═══ 4. 우리의 이야기 ═══ */}
          <ScrollAnimationWrapper>
            <section className="py-10">
              <div className="px-8">
                <SectionTitle kr="우리의 이야기" en="OUR STORY" />
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
                    <img
                      src={`${BASE_URL}${item.image}`}
                      alt={item.title}
                      className="w-full aspect-[4/5] object-cover"
                    />
                    <div className="pt-2 px-1">
                      <p className="font-garamyeon text-[13px] leading-snug" style={{ color: '#2d1f14' }}>{item.title}</p>
                      <p className="text-[9px] mt-0.5" style={{ color: '#8b6b4a' }}>{item.date}</p>
                      <p className="text-[10px] mt-1 leading-relaxed" style={{ color: '#7d6251' }}>{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </ScrollAnimationWrapper>

          <Divider />

          {/* ═══ 5. 갤러리 ═══ */}
          <section className="py-10">
            <div className="px-8">
              <SectionTitle kr="갤러리" en="GALLERY" />
            </div>
            <div className="grid grid-cols-3 gap-0.5">
              {weddingInfo.gallery.map((image, i) => (
                <button
                  key={i}
                  className="aspect-square overflow-hidden block"
                  onClick={() => setGalleryIndex(i)}
                >
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

          {/* ═══ 6. 안내사항 ═══ */}
          <ScrollAnimationWrapper>
            <section className="py-10">
              <div className="px-8">
                <SectionTitle kr="안내사항" en="INFORMATION" />
              </div>
              <div className="flex px-8 mb-4 gap-0 border-b" style={{ borderColor: 'rgba(45,31,20,0.1)' }}>
                <button className={selectorStyle(infoTab === 'bride-room')} onClick={() => setInfoTab('bride-room')}>
                  신부대기실
                </button>
                <button className={selectorStyle(infoTab === 'banquet-hall')} onClick={() => setInfoTab('banquet-hall')}>
                  연회장
                </button>
              </div>
              <div className="overflow-hidden">
                <img
                  src={`${BASE_URL}images/${infoTab === 'bride-room' ? 'bride-room.jpg' : 'banquet-hall.jpg'}`}
                  alt={infoTab === 'bride-room' ? '신부대기실' : '연회장'}
                  className="w-full object-cover"
                />
              </div>
            </section>
          </ScrollAnimationWrapper>

          <Divider />

          {/* ═══ 7. 오시는 길 ═══ */}
          <Map />

          <Divider />

          {/* ═══ 8. 마음 전하실 곳 ═══ */}
          <ScrollAnimationWrapper>
            <section className="px-8 py-10">
              <SectionTitle kr="마음 전하실 곳" en="ACCOUNT" />
              <div className="space-y-3">
                {/* 신랑측 */}
                <div className="paper-card overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                    onClick={() => setOpenAccount(openAccount === 'groom' ? null : 'groom')}
                  >
                    <span className="text-[14px] font-medium" style={{ color: '#2d1f14' }}>신랑측</span>
                    {openAccount === 'groom' ? <ChevronUp size={16} className="text-[#8b6b4a]" /> : <ChevronDown size={16} className="text-[#8b6b4a]" />}
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
                        <div className="border-t px-5 py-4 space-y-4" style={{ borderColor: 'rgba(45,31,20,0.08)' }}>
                          {groomAccounts.map(({ label, name, account, key }) => (
                            <div key={key} className="flex items-center justify-between">
                              <div>
                                <p className="text-[10px] mb-0.5" style={{ color: '#8b6b4a' }}>{label} · {name}</p>
                                <p className="text-[13px] font-medium" style={{ color: '#2d1f14' }}>{account}</p>
                              </div>
                              <button
                                onClick={() => handleCopy(account, key)}
                                className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-sm border transition-all"
                                style={{
                                  color: copied[key] ? '#b07d64' : '#8b6b4a',
                                  borderColor: copied[key] ? '#b07d64' : 'rgba(45,31,20,0.15)',
                                  background: copied[key] ? 'rgba(176,125,100,0.06)' : 'white',
                                }}
                              >
                                {copied[key] ? <Check size={12} /> : <Copy size={12} />}
                                복사
                              </button>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 신부측 */}
                <div className="paper-card overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                    onClick={() => setOpenAccount(openAccount === 'bride' ? null : 'bride')}
                  >
                    <span className="text-[14px] font-medium" style={{ color: '#2d1f14' }}>신부측</span>
                    {openAccount === 'bride' ? <ChevronUp size={16} className="text-[#8b6b4a]" /> : <ChevronDown size={16} className="text-[#8b6b4a]" />}
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
                        <div className="border-t px-5 py-4 space-y-4" style={{ borderColor: 'rgba(45,31,20,0.08)' }}>
                          {brideAccounts.map(({ label, name, account, key }) => (
                            <div key={key} className="flex items-center justify-between">
                              <div>
                                <p className="text-[10px] mb-0.5" style={{ color: '#8b6b4a' }}>{label} · {name}</p>
                                <p className="text-[13px] font-medium" style={{ color: '#2d1f14' }}>{account}</p>
                              </div>
                              <button
                                onClick={() => handleCopy(account, key)}
                                className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-sm border transition-all"
                                style={{
                                  color: copied[key] ? '#b07d64' : '#8b6b4a',
                                  borderColor: copied[key] ? '#b07d64' : 'rgba(45,31,20,0.15)',
                                  background: copied[key] ? 'rgba(176,125,100,0.06)' : 'white',
                                }}
                              >
                                {copied[key] ? <Check size={12} /> : <Copy size={12} />}
                                복사
                              </button>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </section>
          </ScrollAnimationWrapper>

          <Divider />

          {/* ═══ 9. 방명록 ═══ */}
          <Guestbook />

          <Divider />

          {/* ═══ 10. 답장 카드 (RSVP) ═══ */}
          <ScrollAnimationWrapper>
            <section className="px-8 py-12 text-center">
              <div
                className="paper-card px-8 py-10 relative overflow-hidden"
                style={{
                  background: '#f9f3ec',
                  border: '1px dashed rgba(176,125,100,0.4)',
                  boxShadow: 'none',
                }}
              >
                {/* 상단 장식선 */}
                <div className="flex items-center gap-3 mb-6 text-[#b07d64]/40">
                  <div className="flex-1 h-px bg-current" />
                  <span className="text-[10px] tracking-[0.3em] uppercase font-medium text-[#b07d64]/60">Reply Card</span>
                  <div className="flex-1 h-px bg-current" />
                </div>
                <p className="font-garamyeon text-[20px] mb-2" style={{ color: '#2d1f14' }}>참석 여부를 알려주세요</p>
                <p className="text-[12px] leading-relaxed mb-8" style={{ color: '#7d6251' }}>
                  원활한 준비를 위해<br />참석 의사를 전달해 주시면 감사하겠습니다.
                </p>
                <button
                  onClick={() => setRsvpOpen(true)}
                  className="inline-flex items-center gap-2 text-white text-[12px] tracking-[0.15em] uppercase px-10 py-3.5 rounded-sm transition-opacity hover:opacity-85"
                  style={{ background: '#b07d64' }}
                >
                  참석 의사 전달
                </button>
              </div>
            </section>
          </ScrollAnimationWrapper>

          {/* ═══ 푸터 ═══ */}
          <footer className="py-10 text-center border-t" style={{ borderColor: 'rgba(45,31,20,0.07)' }}>
            <p className="font-dancing text-[24px]" style={{ color: '#b07d64' }}>
              {weddingInfo.groom.name} & {weddingInfo.bride.name}
            </p>
            <p className="text-[10px] tracking-[0.2em] mt-1.5" style={{ color: '#8b6b4a' }}>{weddingInfo.dateLabel}</p>
          </footer>

        </motion.main>
      )}
    </>
  );
};

export default App;
