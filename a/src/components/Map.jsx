import React from 'react';
import { weddingInfo } from '../data/info';
import { MapPin, Navigation, Info } from 'lucide-react';
import ScrollAnimationWrapper from './ScrollAnimationWrapper';

const Map = () => {
  const { lat, lng, name, address } = weddingInfo.location;
  const clientId = import.meta.env.VITE_NAVER_CLIENT_ID;

  const staticMapUrl = `https://naveropenapi.apigw.ntruss.com/map-static/v2/raster?w=600&h=400&center=${lng},${lat}&level=15&markers=type:d|size:mid|pos:${lng}%20${lat}&X-NCP-APIGW-API-KEY-ID=${clientId}`;

  const openNaverMap = () => {
    window.open(`https://map.naver.com/v5/search/${encodeURIComponent(name)}`, '_blank');
  };

  const openKakaoMap = () => {
    window.open(`https://map.kakao.com/link/map/${encodeURIComponent(name)},${lat},${lng}`, '_blank');
  };

  return (
    <section className="w-full min-h-dvh flex flex-col items-center justify-center py-20 px-6 overflow-hidden">
      <ScrollAnimationWrapper amount={0.4} className="w-full max-w-sm">
        <div className="text-center">
      <h3 className="text-xl mb-12 text-wedding-accent font-bold italic">오시는 길</h3>
      <div className="mb-8">
        <p className="font-bold text-2xl mb-3">{name}</p>
        <p className="text-gray-400 text-xl leading-relaxed max-w-[240px] mx-auto">{address}</p>
      </div>

      <div className="w-full aspect-[4/3] bg-gray-50 rounded-2xl mb-6 flex items-center justify-center text-gray-300 overflow-hidden shadow-sm border border-gray-100">
        {clientId ? (
          <img
            src={staticMapUrl}
            alt="지도"
            className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentNode.innerHTML = '<p class="text-xs px-10 text-gray-400">지도를 불러올 수 없습니다.<br/>API 키 설정을 확인해주세요.</p>';
            }}
          />
        ) : (
          <div className="flex flex-col items-center gap-3">
            <MapPin size={32} className="text-wedding-accent/30" />
            <p className="text-xs">네이버 지도 API 키가 필요합니다.</p>
          </div>
        )}
      </div>

      <div className="bg-gray-50/30 p-5 rounded-2xl text-left border border-gray-100/50 w-full max-w-[320px] mb-8 mx-auto">
        <ul className="space-y-3">
          <li className="flex items-start gap-2 text-base text-gray-600 leading-relaxed">
            <span className="w-1 h-1 rounded-full bg-wedding-accent mt-1.5 shrink-0" />
            <span>영등포역 타임스퀘어에서 <strong>도보 7분</strong></span>
          </li>
          <li className="flex items-start gap-2 text-base text-gray-600 leading-relaxed">
            <span className="w-1 h-1 rounded-full bg-wedding-accent mt-1.5 shrink-0" />
            <span>문래역에서 <strong>도보 7분</strong></span>
          </li>
          <li className="flex items-start gap-2 text-base text-gray-600 leading-relaxed">
            <span className="w-1 h-1 rounded-full bg-wedding-accent mt-1.5 shrink-0" />
            <span>문래역 4번 출구 뒤쪽에서 <strong>셔틀버스 상시(5분 주기) 운행</strong></span>
          </li>
        </ul>
      </div>

      <div className="grid grid-cols-1 gap-2 w-full max-w-[320px] mx-auto">
        <div className="flex gap-2">
          <button
            onClick={openNaverMap}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-3 bg-white border border-gray-100 rounded-xl text-base font-bold text-gray-600 hover:bg-gray-50 transition shadow-sm"
          >
            <Navigation size={12} className="text-wedding-accent" /> 네이버 지도
          </button>
          <button
            onClick={openKakaoMap}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-3 bg-white border border-gray-100 rounded-xl text-base font-bold text-gray-600 hover:bg-gray-50 transition shadow-sm"
          >
            <Navigation size={12} className="text-wedding-accent" /> 카카오 맵
          </button>
        </div>
        <button
          onClick={() => window.open('http://www.jkart.co.kr/location/#request', '_blank')}
          className="w-full flex items-center justify-center gap-2 px-3 py-3 bg-wedding-accent/5 text-wedding-accent border border-wedding-accent/10 rounded-xl text-base font-bold hover:bg-wedding-accent/10 transition shadow-sm"
        >
          <Info size={12} /> 약도 및 상세 안내
        </button>
      </div>
    </div>
    </ScrollAnimationWrapper>
  </section>
  );
};

export default Map;
