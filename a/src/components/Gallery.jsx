import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gallery as PhotoGallery, Item } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css';
import { weddingInfo } from '../data/info';
import ScrollAnimationWrapper from './ScrollAnimationWrapper';

const PolaroidImage = ({ image, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ rotate: index % 2 === 0 ? 2 : -2, scale: 1.02 }}
      transition={{ duration: 0.6, delay: (index % 6) * 0.1 }}
      viewport={{ once: true }}
      className="bg-white p-2 pb-6 shadow-md border border-gray-100 mb-4 transition-transform duration-300"
    >
      <Item
        original={`${import.meta.env.BASE_URL}${image.src}`}
        thumbnail={`${import.meta.env.BASE_URL}${image.src}`}
        width={image.width}
        height={image.height}
      >
        {({ ref, open }) => (
          <div className="overflow-hidden bg-gray-50 aspect-[3/4]">
            <img
              ref={ref}
              onClick={open}
              src={`${import.meta.env.BASE_URL}${image.src}`}
              alt={image.caption}
              className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        )}
      </Item>
      <p className="mt-3 text-sm text-gray-400 text-center">
        {image.caption}
      </p>
    </motion.div>
  );
};

const Gallery = () => {
  const [displayCount, setDisplayCount] = useState(6);
  const totalImages = weddingInfo.gallery.length;

  const handleLoadMore = () => {
    setDisplayCount(prev => Math.min(prev + 6, totalImages));
  };

  return (
    <ScrollAnimationWrapper>
      <section className="py-20 px-6 bg-wedding-bg/30">
        <div className="text-center mb-16">
          <h2 className="text-2xl text-wedding-accent mb-2">Gallery</h2>
          <div className="w-12 h-px bg-wedding-accent/30 mx-auto" />
        </div>

        <PhotoGallery>
          <div className="grid grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {weddingInfo.gallery.slice(0, displayCount).map((image, idx) => (
                <PolaroidImage key={idx} image={image} index={idx} />
              ))}
            </AnimatePresence>
          </div>
        </PhotoGallery>

        {displayCount < totalImages && (
          <div className="mt-12 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLoadMore}
              className="px-8 py-3 rounded-full border border-wedding-accent/30 text-wedding-accent text-sm hover:bg-wedding-accent hover:text-white transition-colors duration-300"
            >
              더보기
            </motion.button>
          </div>
        )}
      </section>
    </ScrollAnimationWrapper>
  );
};

export default Gallery;
