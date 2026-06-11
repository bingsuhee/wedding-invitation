import React, { useEffect, useState, useCallback } from 'react';
import Main from './components/Main';
import Invitation from './components/Invitation';
import Timeline from './components/Timeline';
import Gallery from './components/Gallery';
import Map from './components/Map';
import Guestbook from './components/Guestbook';
import ProgressBar from './components/ProgressBar';
import Petals from './components/Petals';
import NotificationToast from './components/NotificationToast';
import { Heart } from 'lucide-react';
import { weddingInfo } from './data/info';
import { supabase } from './lib/supabaseClient';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [notificationQueue, setNotificationQueue] = useState([]);
  const [currentNotification, setCurrentNotification] = useState(null);

  useEffect(() => {
    // Dynamic Title
    document.title = `${weddingInfo.groom.name} ♥ ${weddingInfo.bride.name} 저희 결혼합니다`;

    const updateMeta = (name, content, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        if (property) el.setAttribute('property', name);
        else el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const desc = `${weddingInfo.date}, ${weddingInfo.location.name}`;
    updateMeta('description', desc);
    updateMeta('og:title', document.title, true);
    updateMeta('og:description', desc, true);
    updateMeta('twitter:title', document.title);
    updateMeta('twitter:description', desc);
  }, []);

  // Supabase Realtime Subscription
  useEffect(() => {
    console.log('Initializing global Supabase subscription...');
    const channel = supabase
      .channel('global_guestbook_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'guestbook' },
        (payload) => {
          console.log('New message received globally:', payload.new);
          // 1. Add to notification queue
          setNotificationQueue((prev) => [...prev, payload.new]);

          // 2. Dispatch custom event for Guestbook component
          window.dispatchEvent(new CustomEvent('new-guestbook-message', { detail: payload.new }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Notification Queue Handler
  useEffect(() => {
    if (!currentNotification && notificationQueue.length > 0) {
      const next = notificationQueue[0];
      setCurrentNotification(next);
      setNotificationQueue((prev) => prev.slice(1));
    }
  }, [notificationQueue, currentNotification]);

  const handleNotificationDone = useCallback(() => {
    setCurrentNotification(null);
  }, []);

  return (
    <div className="bg-wedding-bg min-h-screen text-base">
      <AnimatePresence>
        {currentNotification && (
          <NotificationToast
            key={currentNotification.id}
            message={currentNotification}
            onDone={handleNotificationDone}
          />
        )}
      </AnimatePresence>
      <Petals count={20} />
      <ProgressBar />

      <main className="flex flex-col">
        <Main />
        <Invitation />
        <Timeline />
        <Gallery />
        <Map />
        <Guestbook />
      </main>

      <footer className="py-20 flex flex-col items-center justify-center bg-white border-t border-gray-50">
        <Heart size={24} className="mx-auto text-wedding-accent mb-4 opacity-30" />
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;
