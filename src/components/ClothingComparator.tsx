import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shirt, Globe, Home, Percent, ArrowRightLeft, ChevronDown, Link2 } from 'lucide-react';

const CURRENCIES = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'RUB', symbol: '₽' },
  { code: 'SAR', symbol: '﷼' },
  { code: 'CNY', symbol: '¥' },
];

const ClothingComparator: React.FC = () => {
  const { t } = useTranslation();
  // Çoklu kategori inputları
  const [brand, setBrand] = useState('');
  const [type, setType] = useState('');
  const [color, setColor] = useState('');
  const [model, setModel] = useState('');
  const [link, setLink] = useState('');
  // Fiyat inputları
  const [domestic, setDomestic] = useState('');
  const [foreign, setForeign] = useState('');
  const [rate, setRate] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [showCurrency, setShowCurrency] = useState(false);

  // Hesaplama
  const domesticPrice = parseFloat(domestic.replace(',', '.'));
  const foreignPrice = parseFloat(foreign.replace(',', '.'));
  const fxRate = parseFloat(rate.replace(',', '.'));
  const foreignTL = !isNaN(foreignPrice) && !isNaN(fxRate) ? foreignPrice * fxRate : undefined;
  const diff = (!isNaN(domesticPrice) && foreignTL !== undefined) ? domesticPrice - foreignTL : undefined;
  const percent = (diff !== undefined && foreignTL !== 0) ? (diff / foreignTL) * 100 : undefined;
  const cheaper = diff === undefined ? null : diff > 0 ? 'foreign' : diff < 0 ? 'domestic' : 'equal';

  // Yatay ve gridli, hesaplama türleriyle aynı genişlikte tasarım
  return (
    <div className="w-full max-w-7xl mx-auto mt-8 animate-fadeInUp">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 border border-violet-100 dark:border-violet-900">
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
          <div className="flex items-center gap-4 min-w-[220px]">
            <div className="bg-violet-100 dark:bg-violet-800 rounded-full p-3">
              <Shirt className="text-violet-600 dark:text-violet-200" size={32} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-violet-700 dark:text-violet-200 tracking-tight mb-1">{t('clothing.title')}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{t('clothing.compareDesc') || 'Yurt içi ve yurt dışı fiyatları hızlıca karşılaştır.'}</p>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
            <input type="text" className="rounded-xl border-2 border-gray-200 dark:border-gray-700 px-4 py-2 text-base bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-violet-400 outline-none" placeholder={t('clothing.brand') || 'Marka'} value={brand} onChange={e => setBrand(e.target.value)} />
            <input type="text" className="rounded-xl border-2 border-gray-200 dark:border-gray-700 px-4 py-2 text-base bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-violet-400 outline-none" placeholder={t('clothing.type') || 'Ürün Tipi'} value={type} onChange={e => setType(e.target.value)} />
            <input type="text" className="rounded-xl border-2 border-gray-200 dark:border-gray-700 px-4 py-2 text-base bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-violet-400 outline-none" placeholder={t('clothing.color') || 'Renk'} value={color} onChange={e => setColor(e.target.value)} />
            <input type="text" className="rounded-xl border-2 border-gray-200 dark:border-gray-700 px-4 py-2 text-base bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-violet-400 outline-none" placeholder={t('clothing.model') || 'Model'} value={model} onChange={e => setModel(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="col-span-2 flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">{t('clothing.domestic')}</label>
              <input type="number" className="w-full rounded-xl border-2 border-violet-200 dark:border-violet-700 px-4 py-3 text-lg focus:ring-2 focus:ring-violet-400 outline-none bg-gray-50 dark:bg-gray-800" placeholder="₺" value={domestic} onChange={e => setDomestic(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">{t('clothing.link')}</label>
              <div className="flex items-center gap-2">
                <input type="url" className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 px-4 py-2 text-base bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-violet-400 outline-none" placeholder="https://..." value={link} onChange={e => setLink(e.target.value)} />
                {link && <a href={link} target="_blank" rel="noopener noreferrer" className="text-violet-600 dark:text-violet-200 hover:underline"><Link2 size={22} /></a>}
              </div>
            </div>
          </div>
          <div className="col-span-2 flex flex-col gap-4">
            <div className="relative">
              <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">{t('clothing.foreign')}</label>
              <div className="flex items-center gap-2">
                <input type="number" className="w-full rounded-xl border-2 border-cyan-200 dark:border-cyan-700 px-4 py-3 text-lg focus:ring-2 focus:ring-cyan-400 outline-none bg-gray-50 dark:bg-gray-800" placeholder={t('clothing.foreign')} value={foreign} onChange={e => setForeign(e.target.value)} />
                <button type="button" className="flex items-center gap-1 px-3 py-2 bg-cyan-100 dark:bg-cyan-800 rounded-lg font-bold text-cyan-700 dark:text-cyan-200 border border-cyan-200 dark:border-cyan-700 hover:bg-cyan-200 dark:hover:bg-cyan-700 transition relative" onClick={() => setShowCurrency(v => !v)}>
                  {CURRENCIES.find(c => c.code === currency)?.symbol || '$'}
                  <ChevronDown size={16} />
                </button>
                {showCurrency && (
                  <div className="absolute z-10 top-14 right-0 bg-white dark:bg-gray-800 border border-cyan-200 dark:border-cyan-700 rounded-xl shadow-lg w-32">
                    {CURRENCIES.map(cur => (
                      <div key={cur.code} className={`px-4 py-2 cursor-pointer hover:bg-cyan-100 dark:hover:bg-cyan-900 ${currency === cur.code ? 'font-bold text-cyan-700 dark:text-cyan-200' : ''}`} onClick={() => { setCurrency(cur.code); setShowCurrency(false); }}>
                        {cur.symbol} {cur.code}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">{t('clothing.rate')}</label>
              <input type="number" className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 px-4 py-3 text-lg focus:ring-2 focus:ring-gray-400 outline-none bg-gray-50 dark:bg-gray-800" placeholder={t('clothing.ratePlaceholder')} value={rate} onChange={e => setRate(e.target.value)} />
            </div>
          </div>
          <div className="col-span-1 flex flex-col justify-center items-center">
            <div className={`rounded-2xl w-full p-4 text-center font-bold text-lg transition-all duration-300 shadow-xl border-2 ${cheaper === null ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-200 border-gray-200 dark:border-gray-700' : cheaper === 'foreign' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 border-green-300 dark:border-green-700 animate-pulse' : cheaper === 'domestic' ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 border-red-300 dark:border-red-700 animate-pulse' : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 border-blue-300 dark:border-blue-700 animate-pulse'}`}>
              {cheaper === null ? t('clothing.enterAll') : cheaper === 'foreign' ? t('clothing.domesticExpensive', { diff: diff.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2}), percent: Math.abs(percent).toLocaleString('tr-TR', {maximumFractionDigits: 2}) }) : cheaper === 'domestic' ? t('clothing.foreignExpensive', { diff: Math.abs(diff).toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2}), percent: Math.abs(percent).toLocaleString('tr-TR', {maximumFractionDigits: 2}) }) : t('clothing.samePrice')}
              {cheaper !== null && link && (
                <div className="mt-2">
                  <a href={link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-bold shadow transition">
                    <Link2 size={18} /> {t('clothing.buy') || 'Satın Al'}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClothingComparator;
