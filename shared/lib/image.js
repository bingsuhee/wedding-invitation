/**
 * PNG/JPEG 경로를 기반으로 WebP 경로를 반환한다.
 * images/ → images/webp/ 로 삽입하고 확장자를 .webp로 교체.
 * 이미 webp/ 경로이거나 images/ 세그먼트가 없으면 원본 그대로 반환.
 */
export function toWebpSrc(src) {
  return src
    .replace(/\/images\/(?!webp\/)/, '/images/webp/')
    .replace(/\.[^./]+$/, '.webp');
}
