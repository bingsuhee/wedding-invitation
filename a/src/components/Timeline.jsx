import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Plane, Gem, Sparkles, Camera, MapPin, Coffee } from 'lucide-react';
import { weddingInfo } from '../data/info';
import ScrollAnimationWrapper from './ScrollAnimationWrapper';

const ICON_MAP = {
  Heart: Heart,
  Plane: Plane,
  Gem: Gem,
  Sparkles: Sparkles,
  Camera: Camera,
  MapPin: MapPin,
  Coffee: Coffee,
};

const TimelineItem = ({ event, index }) => {
  const IconComponent = ICON_MAP[event.icon] || Heart;
  const isEven = index % 2 === 0;

  return (
    <div className="relative mb-12 last:mb-0">
      {/* Icon Node */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 transform -translate-x-1/2 -translate-y-2 bg-white p-2 rounded-full border border-wedding-accent/30 shadow-sm z-10"
      >
        <IconComponent size={18} className="text-wedding-accent" />
      </motion.div>

      {/* Content Container */}
      <div className={`flex items-center justify-between w-full ${isEven ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Empty space for the other side */}
        <div className="w-[45%]" />

        {/* Text and Image Content */}
        <div className={`w-[45%] ${isEven ? 'text-right pr-4' : 'text-left pl-4'}`}>
          <motion.div
            initial={{ opacity: 0, x: isEven ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <span className="text-base text-wedding-accent mb-1 block">
              {event.date}
            </span>
            <h4 className="text-lg font-bold text-gray-800 mb-2">
              {event.title}
            </h4>

            {event.image && (
              <div className="mb-3 inline-block">
                <div className="bg-white p-2 shadow-md rotate-2 hover:rotate-[-2deg] transition-transform duration-300">
                  <img
                    src={`${import.meta.env.BASE_URL}${event.image}`}
                    alt={event.title}
                    className="w-24 h-24 object-cover grayscale-[20%] sepia-[10%]"
                  />
                </div>
              </div>
            )}

            <p className="text-base text-gray-600 leading-relaxed break-keep">
              {event.content}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const Timeline = () => {
  return (
    <ScrollAnimationWrapper>
      <section className="py-20 px-6 bg-white overflow-hidden">
        <div className="text-center mb-16">
          <h2 className="text-2xl text-wedding-accent mb-2">Love Story</h2>
          <div className="w-12 h-px bg-wedding-accent/30 mx-auto" />
        </div>

        <div className="relative max-w-lg mx-auto">
          {/* Continuous Vertical Line */}
          <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-0 border-l border-dashed border-wedding-accent/60 z-0" />

          <div className="relative z-10">
            {weddingInfo.timeline.map((event, index) => (
              <TimelineItem key={index} event={event} index={index} />
            ))}
          </div>
        </div>
      </section>
    </ScrollAnimationWrapper>
  );
};

export default Timeline;
