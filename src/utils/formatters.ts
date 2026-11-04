export function formatTenge(amount: number): string {
  const rounded = Math.round(amount);
  return `${rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ₸`;
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
  }
  return phone;
}

export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function getOrderStatusLabel(status: string, lang: 'ru' | 'kz' = 'ru'): { text: string; color: string } {
  switch (status) {
    case 'created':
      return {
        text: lang === 'kz' ? 'Қабылданды' : 'Оформлен',
        color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400',
      };
    case 'processing':
      return {
        text: lang === 'kz' ? 'Жинақталуда' : 'В сборке',
        color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400',
      };
    case 'in_transit':
      return {
        text: lang === 'kz' ? 'Жеткізілуде' : 'В пути к вам',
        color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400',
      };
    case 'delivered':
      return {
        text: lang === 'kz' ? 'Жеткізілді' : 'Доставлен',
        color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400',
      };
    case 'cancelled':
      return {
        text: lang === 'kz' ? 'Болдырылмады' : 'Отменен',
        color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400',
      };
    default:
      return { text: status, color: 'text-slate-600 bg-slate-50' };
  }
}
