/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { weddingInfo } from '../data/info';
import { Phone, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollAnimationWrapper from './ScrollAnimationWrapper';

const AccountItem = ({ name, account, relation }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
      <div className="text-left">
        <p className="text-sm text-gray-400 mb-0.5">{relation}</p>
        <p className="text-base font-bold text-gray-700">{name}</p>
        <p className="text-base text-gray-500 mt-1">{account}</p>
      </div>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-50 text-sm font-bold text-gray-500 hover:bg-gray-100 transition"
      >
        {copied ? (
          <>
            <Check size={12} className="text-green-500" />
            <span className="text-green-600">복사됨</span>
          </>
        ) : (
          <>
            <Copy size={12} />
            <span>복사</span>
          </>
        )}
      </button>
    </div>
  );
};

const AccountSection = ({ title, person, father, mother }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition"
      >
        <span className="text-base font-bold text-gray-700">{title} 계좌번호</span>
        {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 pt-2 pb-4">
              <AccountItem name={person.name} account={person.account} relation={title} />
              <AccountItem name={father.name} account={father.account} relation="부" />
              <AccountItem name={mother.name} account={mother.account} relation="모" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Invitation = () => {
  return (
    <section className="w-full min-h-dvh flex items-center justify-center py-20 overflow-hidden">
      <ScrollAnimationWrapper amount={0.4} className="w-full max-w-sm">
        <div className="mx-auto bg-white pt-10 px-10 pb-10 rounded-2xl shadow-sm border border-gray-100 text-center">
          <h3 className="text-xl mb-12 text-wedding-accent font-bold">소중한 분들을 초대합니다</h3>
          <p className="text-gray-600 leading-[2.2] mb-16 whitespace-pre-line text-lg px-2">
            {weddingInfo.message}
          </p>

          <div className="space-y-8 text-gray-700 mb-16">
            <div className="flex flex-col gap-2">
              <span className="text-base text-wedding-accent/70 uppercase tracking-widest">Groom</span>
              <div className="flex items-center justify-center gap-3">
                <span className="text-base text-gray-500">{weddingInfo.groom.father.name} · {weddingInfo.groom.mother.name}</span>
                <span className="text-sm text-gray-300">의 장남</span>
                <span className="text-lg font-bold">{weddingInfo.groom.name}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-base text-wedding-accent/70 uppercase tracking-widest">Bride</span>
              <div className="flex items-center justify-center gap-3">
                <span className="text-base text-gray-500">{weddingInfo.bride.father.name} · {weddingInfo.bride.mother.name}</span>
                <span className="text-sm text-gray-300">의 장녀</span>
                <span className="text-lg font-bold">{weddingInfo.bride.name}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <AccountSection
              title="신랑측"
              person={weddingInfo.groom}
              father={weddingInfo.groom.father}
              mother={weddingInfo.groom.mother}
            />
            <AccountSection
              title="신부측"
              person={weddingInfo.bride}
              father={weddingInfo.bride.father}
              mother={weddingInfo.bride.mother}
            />
          </div>

          <div className="mt-16 flex justify-center gap-3">
            <a
              href={`tel:${weddingInfo.groom.contact}`}
              className="flex flex-1 items-center justify-center gap-2 px-4 py-3 rounded-full border border-wedding-accent/30 text-wedding-accent text-sm font-bold transition hover:bg-wedding-accent hover:text-white uppercase tracking-tighter"
            >
              <Phone size={12} /> 신랑 연락하기
            </a>
            <a
              href={`tel:${weddingInfo.bride.contact}`}
              className="flex flex-1 items-center justify-center gap-2 px-4 py-3 rounded-full border border-wedding-accent/30 text-wedding-accent text-sm font-bold transition hover:bg-wedding-accent hover:text-white uppercase tracking-tighter"
            >
              <Phone size={12} /> 신부 연락하기
            </a>
          </div>
        </div>
      </ScrollAnimationWrapper>
    </section>
  );
};

export default Invitation;
