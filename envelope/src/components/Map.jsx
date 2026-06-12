import React from 'react';
import { Map as KakaoMap, MapMarker } from 'react-kakao-maps-sdk';
import { weddingInfo } from '@shared/data/info';

const Map = () => {
  const { lat, lng, name, address, naverUrl, kakaoUrl } = weddingInfo.location;
  const tmapUrl = `tmap://?rGoName=${encodeURIComponent(name)}&rGoY=${lat}&rGoX=${lng}`;

  return (
    <section className="px-8 py-10">
      <div className="text-center mb-8">
        <p className="font-garamyeon text-[22px] text-[#2d1f14]">오시는 길</p>
        <p className="text-[9px] tracking-[0.3em] uppercase text-[#8b6b4a] mt-1">LOCATION</p>
      </div>

      <div className="text-center mb-6 space-y-1">
        <p className="text-[15px] font-medium text-[#2d1f14]">{name}</p>
        <p className="text-[12px] leading-relaxed text-[#7d6251]">{address}</p>
      </div>

      <div className="paper-card overflow-hidden mb-4">
        <div className="aspect-[4/3]">
          <KakaoMap center={{ lat, lng }} style={{ width: '100%', height: '100%' }} level={4}>
            <MapMarker position={{ lat, lng }} />
          </KakaoMap>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-8">
        <button
          type="button"
          onClick={() => window.open(tmapUrl, '_blank', 'noopener,noreferrer')}
          className="ink-chip text-[12px]"
        >
          <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#0A43FF] text-[9px] font-bold text-white mr-1.5">T</span>
          티맵
        </button>
        <button
          type="button"
          onClick={() => window.open(naverUrl, '_blank', 'noopener,noreferrer')}
          className="ink-chip text-[12px]"
        >
          <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#03C75A] text-[9px] font-bold text-white mr-1.5">N</span>
          네이버
        </button>
        <button
          type="button"
          onClick={() => window.open(kakaoUrl, '_blank', 'noopener,noreferrer')}
          className="ink-chip text-[12px]"
        >
          <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#FEE500] text-[9px] font-bold text-[#3C1E1E] mr-1.5">K</span>
          카카오
        </button>
      </div>

      <div className="space-y-3">
        {weddingInfo.transit.map((info, i) => (
          <p key={i} className="text-[12px] text-[#7d6251] leading-relaxed pl-3 border-l-2 border-[#b07d64]/30">
            {info}
          </p>
        ))}
      </div>
    </section>
  );
};

export default Map;
