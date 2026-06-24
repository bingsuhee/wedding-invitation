import { toWebpSrc } from '@shared/lib/image';

/**
 * WebP를 우선 제공하고 원본 포맷을 fallback으로 유지하는 이미지 컴포넌트.
 * src에 PNG/JPEG 경로를 넘기면 WebP 경로를 자동으로 파생한다.
 */
export function WebpImage({ src, ...imgProps }) {
  return (
    <picture>
      <source srcSet={toWebpSrc(src)} type="image/webp" />
      <img src={src} {...imgProps} />
    </picture>
  );
}
