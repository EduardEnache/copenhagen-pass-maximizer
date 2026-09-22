/// <reference types="vite-plugin-pwa/react" />
import { useRegisterSW } from 'virtual:pwa-register/react';
import { XIcon } from './icons';

/** Registers the PWA service worker and shows a small toast when a new
 * version is ready, letting the visitor reload on their own terms. */
export function UpdateToast() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError(error) {
      console.error('Service worker registration failed', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) return null;

  return (
    <div className="update-toast" role="status">
      <span>
        {needRefresh
          ? 'An update is ready.'
          : 'Copenhagen Pass Maximizer is ready to work offline.'}
      </span>
      {needRefresh && (
        <button type="button" onClick={() => updateServiceWorker(true)}>
          Reload
        </button>
      )}
      <button type="button" className="icon-button" onClick={close} aria-label="Dismiss">
        <XIcon size={16} />
      </button>
    </div>
  );
}
