import React, { useState } from 'react';
import { X, Send, Headphones, Bot, CheckCircle } from 'lucide-react';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'support';
  text: string;
  time: string;
}

export const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'support',
      text: 'Здравствуйте! Вас приветствует служба заботы Alashop. Чем мы можем помочь вам сегодня?',
      time: '09:40',
    },
  ]);
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: Message = {
      id: 'u-' + Date.now(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Automated intelligent replies based on keywords
    setTimeout(() => {
      let reply = 'Спасибо за ваше обращение! Оператор Alashop проверит информацию и свяжется с вами в течение пары минут.';
      const lower = text.toLowerCase();

      if (lower.includes('заказ') || lower.includes('где')) {
        reply = 'Вы можете в реальном времени отслеживать статус вашего заказа во вкладке «Профиль» -> «Мои заказы». Курьеры Alashop доставляют заказы с 09:00 до 21:00 ежедневно.';
      } else if (lower.includes('kaspi') || lower.includes('рассрочк')) {
        reply = 'Да! В Alashop действует рассрочка Kaspi 0-0-24 на все товары без переплат и первоначального взноса. При оформлении заказа выберите способ «Kaspi Pay».';
      } else if (lower.includes('возврат') || lower.includes('гаранти')) {
        reply = 'По закону РК и правилам Alashop вы можете вернуть или обменять неподошедший товар в течение 14 дней при сохранении товарного вида и чека.';
      } else if (lower.includes('доставк') || lower.includes('стоимост')) {
        reply = 'При заказе от 15 000 ₸ доставка по городам Алматы, Астана, Шымкент и всем регионам Казахстана — абсолютно БЕСПЛАТНО!';
      }

      const botMsg: Message = {
        id: 'b-' + Date.now(),
        sender: 'support',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 overflow-hidden">
      <div className="w-full max-w-md h-[85vh] sm:h-[75vh] bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-200">
        {/* Header */}
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-sm">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Поддержка Alashop</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <span className="text-[10px] text-slate-400">Онлайн · Отвечаем за 1 минуту</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl leading-relaxed shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-sky-600 text-white rounded-br-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-xs'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[9px] text-slate-400 mt-1 px-1">{m.time}</span>
            </div>
          ))}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 flex gap-1.5 overflow-x-auto no-scrollbar">
          {[
            'Где мой заказ?',
            'Как работает Kaspi 0-0-24?',
            'Бесплатная доставка',
            'Условия возврата 14 дней',
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-sky-50 hover:text-sky-600 whitespace-nowrap shrink-0 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Напишите сообщение..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-3.5 py-2.5 text-xs rounded-2xl bg-slate-100 dark:bg-slate-800 border-none focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
          <button
            type="submit"
            className="p-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
