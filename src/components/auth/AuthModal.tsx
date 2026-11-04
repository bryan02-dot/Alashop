import React, { useState } from 'react';
import { X, Smartphone, Mail, Lock, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { updateUserProfile, switchRole } = useShop();

  const [authMode, setAuthMode] = useState<'phone' | 'email' | 'sms_code' | 'forgot'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('+7 (701) 888-24-24');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [userName, setUserName] = useState('Покупатель Alashop');

  if (!isOpen) return null;

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMode('sms_code');
  };

  const handleSmsVerify = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: userName || 'Покупатель Alashop',
      phone: phoneNumber,
    });
    onClose();
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: userName || 'Покупатель Alashop',
      email,
    });
    onClose();
  };

  const handleAppleAuth = () => {
    updateUserProfile({
      name: 'Пользователь Apple ID',
      email: 'apple.user@icloud.com',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/alashop-icon.svg" alt="Alashop" className="w-9 h-9 rounded-xl shadow-sm" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Вход в Alashop
              </h3>
              <p className="text-[10px] text-slate-400">
                Всё необходимое в одном месте!
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher: Phone vs Email */}
        {authMode !== 'sms_code' && authMode !== 'forgot' && (
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setAuthMode('phone')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                authMode === 'phone'
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              По телефону
            </button>
            <button
              onClick={() => setAuthMode('email')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                authMode === 'email'
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              По почте
            </button>
          </div>
        )}

        {/* Phone Form */}
        {authMode === 'phone' && (
          <form onSubmit={handlePhoneSubmit} className="space-y-3 text-xs">
            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Номер мобильного телефона
              </label>
              <div className="relative flex items-center">
                <Smartphone className="w-4 h-4 text-slate-400 absolute left-3" />
                <input
                  type="tel"
                  required
                  placeholder="+7 (___) ___-__-__"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-md shadow-sky-600/20 transition-all"
            >
              Получить код по SMS
            </button>
          </form>
        )}

        {/* SMS Code Verification */}
        {authMode === 'sms_code' && (
          <form onSubmit={handleSmsVerify} className="space-y-3 text-xs">
            <div className="text-center p-2 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300">
              Код подтверждения отправлен на номер <strong>{phoneNumber}</strong>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Введите 4 цифры из SMS (тест: 1234)
              </label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="1234"
                value={smsCode}
                onChange={(e) => setSmsCode(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-center text-lg font-bold tracking-widest focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-md shadow-sky-600/20"
            >
              Войти в профиль
            </button>

            <button
              type="button"
              onClick={() => setAuthMode('phone')}
              className="w-full text-center text-slate-500 text-[11px] hover:underline"
            >
              Изменить номер телефона
            </button>
          </form>
        )}

        {/* Email Form */}
        {authMode === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-3 text-xs">
            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Электронная почта
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3" />
                <input
                  type="email"
                  required
                  placeholder="name@example.kz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Пароль
                </label>
                <button
                  type="button"
                  onClick={() => setAuthMode('forgot')}
                  className="text-[10px] text-sky-600 hover:underline"
                >
                  Забыли пароль?
                </button>
              </div>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-md shadow-sky-600/20"
            >
              Войти по паролю
            </button>
          </form>
        )}

        {/* Forgot Password */}
        {authMode === 'forgot' && (
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-white">Восстановление пароля</h4>
            <p className="text-slate-500 text-[11px]">
              Введите вашу почту или телефон, и мы вышлем ссылку для сброса пароля.
            </p>
            <input
              type="text"
              placeholder="Email или телефон"
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
            />
            <button
              type="button"
              onClick={() => {
                alert('Инструкция по сбросу пароля отправлена!');
                setAuthMode('phone');
              }}
              className="w-full py-2.5 rounded-xl bg-sky-600 text-white font-bold"
            >
              Отправить ссылку
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('phone')}
              className="w-full text-center text-slate-500 text-[11px]"
            >
              Назад ко входу
            </button>
          </div>
        )}

        {/* Apple ID Authorization Button */}
        {authMode !== 'sms_code' && authMode !== 'forgot' && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleAppleAuth}
              className="w-full py-2.5 px-4 rounded-xl bg-black dark:bg-white text-white dark:text-black text-xs font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xs"
            >
              <span className="text-base font-semibold"></span>
              <span>Войти с Apple ID</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
