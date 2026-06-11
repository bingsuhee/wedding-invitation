import React from 'react';
import { weddingInfo } from '../data/info';
import { MapPin, Info, Star } from 'lucide-react';
import ScrollAnimationWrapper from './ScrollAnimationWrapper';

const ICON_MAP = {
  MapPin: MapPin,
  Info: Info,
  Star: Star,
};

const GuestGuide = () => {
  const { guestGuide } = weddingInfo;

  if (!guestGuide || guestGuide.length === 0) return null;

  return (
    <section className="w-full py-16 px-6 bg-wedding-bg relative overflow-hidden">
      <ScrollAnimationWrapper amount={0.2}>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl text-wedding-accent font-bold marker-highlight inline-block">Guest Guide</h3>
          </div>

          <div className="relative bg-[#fffef0] p-8 shadow-sm rotate-[-0.5deg] border-dashed border border-gray-300 grid-pattern">
            {/* Masking Tape Effect */}
            <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-20 h-6 bg-white/40 shadow-sm z-10" />

            <ul className="space-y-6">
              {guestGuide.map((item, index) => {
                const IconComponent = ICON_MAP[item.icon] || Info;
                return (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-1 shrink-0">
                      <IconComponent size={18} className="text-wedding-accent" />
                    </div>
                    <p className="text-base text-gray-700 leading-relaxed break-keep">
                      {item.content}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </ScrollAnimationWrapper>
    </section>
  );
};

export default GuestGuide;
