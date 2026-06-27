import React from 'react';
import { Bus, CarFront, TrainFront } from 'lucide-react';
import { Map as KakaoMap, MapMarker } from 'react-kakao-maps-sdk';
import { weddingInfo } from '@shared/data/info';

const Map = () => {
  const { lat, lng, name, address, tmapUrl, naverUrl, kakaoAppUrl, kakaoUrl } = weddingInfo.location;
  const mapButtonClassName =
    'soft-chip map-link-button inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 py-3 text-[13px] text-black';
  const openMapUrl = (url) => {
    window.location.href = url;
  };
  const openAppUrlWithFallback = (appUrl, fallbackUrl) => {
    let didLeavePage = false;

    const markAsLeftPage = () => {
      didLeavePage = true;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        markAsLeftPage();
      }
    };

    window.addEventListener('pagehide', markAsLeftPage, { once: true });
    window.addEventListener('blur', markAsLeftPage, { once: true });
    document.addEventListener('visibilitychange', handleVisibilityChange, { once: true });

    window.location.href = appUrl;

    window.setTimeout(() => {
      window.removeEventListener('pagehide', markAsLeftPage);
      window.removeEventListener('blur', markAsLeftPage);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (!didLeavePage) {
        window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
      }
    }, 900);
  };

  return (
    <section className="section-block section-with-lead gap-8">
      <div className="text-center">
        <h2 className="point-text paint-title-heading text-[22px] font-semibold leading-[1.2] tracking-[-0.04em]">
          <span className="paint-title">오시는 길</span>
        </h2>
      </div>

      <div className="section-lead">
        <p className="section-lead-title">{name}</p>
        <p>
          {address}
        </p>
      </div>

      <div className="soft-card-strong overflow-hidden">
        <div className="aspect-[4/3]">
          <KakaoMap center={{ lat, lng }} style={{ width: '100%', height: '100%' }} level={4}>
            <MapMarker position={{ lat, lng }} />
          </KakaoMap>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => openMapUrl(tmapUrl)}
          className={mapButtonClassName}
        >
          <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0A43FF] text-[10px] font-bold text-white">T</span>
          티맵
        </button>
        <button
          type="button"
          onClick={() => openMapUrl(naverUrl)}
          className={mapButtonClassName}
        >
          <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#03C75A] text-[10px] font-bold text-white">N</span>
          네이버지도
        </button>
        <button
          type="button"
          onClick={() => openAppUrlWithFallback(kakaoAppUrl, kakaoUrl)}
          className={mapButtonClassName}
        >
          <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FEE500] text-[10px] font-bold text-[#3C1E1E]">K</span>
          카카오맵
        </button>
      </div>

      <div className="grid gap-3 text-[13px] text-black/65">
        <div className="flex items-start gap-3">
          <TrainFront size={16} className="mt-0.5 shrink-0 text-black/75" />
          <div>
            <p className="font-medium text-black">지하철</p>
            <p className="leading-[1.8]">
              2호선 문래역 하차
              <br />
              - 셔틀버스 : 4번출구(뒷쪽) 셔틀버스 운행
              <br />
              - 도보이용 : 5번출구에서 전방 직진 300M
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Bus size={16} className="mt-0.5 shrink-0 text-black/75" />
          <div>
            <p className="font-medium text-black">버스</p>
            <p className="leading-[1.8]">
              문래역 정류장 하차
              <br />
              - 지선버스 6211, 6625 간선버스 641 마을버스 영등포12
              <br />
              문래주민센터 / 영일시장.록스 정류장 하차
              <br />
              - 마을버스 영등포05
              <br />
              벽산메가트리움APT 정류장 하차
              <br />
              - 지선버스 6516
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <CarFront size={16} className="mt-0.5 shrink-0 text-black/75" />
          <div>
            <p className="font-medium text-black">자가용</p>
            <p className="leading-[1.8]">티맵, 네이버지도, 카카오맵에서 예식장 검색 후 방문</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Map;
