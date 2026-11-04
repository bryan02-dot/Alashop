import React from 'react';
import { useShop } from '../../context/ShopContext';
import { X, CheckCircle2, Package, Sparkles } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { activePushBanner, dismissPushBanner } = useShop();

  if (!activePushBanner) return null;

  return (
    <div className="fixed top-12 left-4 right-4 z-50 max-w-sm mx-auto animate-in fade-in slide-in-from-top-6 duration-300">
      <div className="bg-slate-900/90 dark:bg-slate-950/90 text-white backdrop-blur-xl rounded-2xl p-3.5 shadow-2xl border border-slate-700/50 flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-sky-500 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
          {activePushBanner.type === 'order' ? (
            <Package className="w-4 h-4 text-white" />
          ) : activePushBanner.type === 'promo' ? (
            <Sparkles className="w-4 h-4 text-white" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-white" />
          )}
        </div>

        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
              {activePushBanner.title}
            </span>
            <span className="text-[10px] text-slate-400">сейчас</span>
          </div>
          <p className="text-xs text-slate-200 mt-0.5 line-clamp-2 leading-relaxed">
            {activePushBanner.message}
          </p>
        </div>

        <button
          onClick={dismissPushBanner}
          className="text-slate-400 hover:text-white p-1 -mr-1 -mt-1 rounded-full transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
