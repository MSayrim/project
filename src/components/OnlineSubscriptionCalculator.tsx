import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import SubscriptionShareModal from './SubscriptionShareModal';

const POPULAR = [
  {
    name: 'Netflix',
    icon: '🎬',
    types: [
      { label: 'Temel', price: 99.99 },
      { label: 'Standart', price: 149.99 },
      { label: 'Premium', price: 199.99 },
    ],
  },
  {
    name: 'Spotify',
    icon: '🎵',
    types: [
      { label: 'Bireysel', price: 59.99 },
      { label: 'Aile', price: 89.99 },
      { label: 'Duo', price: 79.99 },
      { label: 'Öğrenci', price: 32.99 },
    ],
  },
  {
    name: 'YouTube Premium',
    icon: '▶️',
    types: [
      { label: 'Bireysel', price: 57.99 },
      { label: 'Aile', price: 115.99 },
      { label: 'Öğrenci', price: 37.99 },
    ],
  },
  {
    name: 'Amazon Prime',
    icon: '📦',
    types: [
      { label: 'Prime', price: 39.99 },
    ],
  },
  {
    name: 'Disney+',
    icon: '🦸',
    types: [
      { label: 'Aylık', price: 64.99 },
      { label: 'Yıllık', price: 649.99 },
    ],
  },
];

const periods = [
  { label: 'Aylık', value: 'aylık', factor: 1 },
  { label: 'Yıllık', value: 'yıllık', factor: 1 / 12 },
  { label: '3 Aylık', value: '3aylık', factor: 1 / 3 },
];

export default function OnlineSubscriptionCalculator() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newPeriod, setNewPeriod] = useState('aylık');
  const [newPeople, setNewPeople] = useState(1);
  const [newNote, setNewNote] = useState('');
  const [showShare, setShowShare] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const shareRef = useRef(null);

  // Seçili marka ve tipi bul
  const brandObj = POPULAR.find(b => b.name === selectedBrand);
  const typeObj = brandObj?.types.find(t => t.label === selectedType);
  const icon = brandObj?.icon || '➕';

  // Marka veya tip seçilince fiyatı otomatik doldur
  useEffect(() => {
    if (typeObj) setNewPrice(typeObj.price.toString());
  }, [selectedType]);

  const addSubscription = () => {
    if (!selectedBrand || !selectedType || !newPrice) return;
    setSubscriptions([
      ...subscriptions,
      {
        name: selectedBrand,
        type: selectedType,
        price: parseFloat(newPrice),
        period: newPeriod,
        icon,
        people: newPeople,
        note: newNote,
      },
    ]);
    setSelectedBrand('');
    setSelectedType('');
    setNewPrice('');
    setNewPeriod('aylık');
    setNewPeople(1);
    setNewNote('');
    inputRef.current?.focus();
  };

  const removeSubscription = (idx: number) => {
    setSubscriptions(subscriptions.filter((_, i) => i !== idx));
  };

  const getMonthly = (sub: any) => {
    const p = periods.find(p => p.value === sub.period);
    return p ? sub.price * p.factor : sub.price;
  };

  const totalMonthly = subscriptions.reduce((sum, sub) => sum + getMonthly(sub), 0);
  const totalYearly = totalMonthly * 12;
  const totalMonthlyPerPerson = subscriptions.reduce((sum, sub) => sum + getMonthly(sub) / (sub.people || 1), 0);
  const totalYearlyPerPerson = totalMonthlyPerPerson * 12;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') addSubscription();
  };

  const handleShareImage = async () => {
    if (shareRef.current) {
      const canvas = await html2canvas(shareRef.current, {backgroundColor: null});
      const link = document.createElement('a');
      link.download = 'abonelik-ozeti.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-gray-900 rounded-xl p-6 shadow">
      <h2 className="text-2xl font-bold mb-2 text-center text-indigo-600">Online Abonelik Hesaplama</h2>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-4 text-sm">
        Sahip olduğun tüm online abonelikleri ekle, toplam aylık ve yıllık maliyetini anında gör!
      </p>
      <div className="flex gap-2 mb-2 flex-wrap items-end">
        <select
          className="flex-1 border rounded px-3 py-2"
          value={selectedBrand}
          onChange={e => {
            setSelectedBrand(e.target.value);
            setSelectedType('');
          }}
        >
          <option value="">Abonelik seçin</option>
          {POPULAR.map(b => (
            <option key={b.name} value={b.name}>{b.icon} {b.name}</option>
          ))}
        </select>
        <select
          className="flex-1 border rounded px-3 py-2"
          value={selectedType}
          onChange={e => setSelectedType(e.target.value)}
          disabled={!selectedBrand}
        >
          <option value="">Üyelik tipi</option>
          {brandObj?.types.map(t => (
            <option key={t.label} value={t.label}>{t.label}</option>
          ))}
        </select>
        <input
          ref={inputRef}
          className="w-24 border rounded px-3 py-2"
          placeholder="Tutar"
          type="number"
          value={newPrice}
          onChange={e => setNewPrice(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <select
          className="border rounded px-2 py-2"
          value={newPeriod}
          onChange={e => setNewPeriod(e.target.value)}
        >
          {periods.map(p => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
        <input
          className="w-16 border rounded px-2 py-2"
          type="number"
          min={1}
          max={10}
          value={newPeople}
          onChange={e => setNewPeople(Number(e.target.value))}
          title="Kaç kişiyle paylaşıyorsun?"
          placeholder="Kişi"
        />
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-bold"
          onClick={addSubscription}
          type="button"
        >Ekle</button>
      </div>
      <input
        className="w-full border rounded px-3 py-2 mb-4"
        placeholder="Açıklama (isteğe bağlı)"
        value={newNote}
        onChange={e => setNewNote(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="divide-y divide-gray-200 dark:divide-gray-700 mb-6">
        {subscriptions.length === 0 && (
          <div className="py-8 text-gray-400 text-center text-sm">Henüz abonelik eklemediniz.</div>
        )}
        {subscriptions.map((sub, idx) => (
          <div key={idx} className="flex items-center justify-between py-3 group">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{sub.icon}</span>
              <span className="font-semibold text-gray-800 dark:text-gray-100">{sub.name}</span>
              <span className="text-xs text-gray-500">{sub.type && <>({sub.type})</>}</span>
              {sub.people > 1 && <span className="ml-2 text-xs bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-100 px-2 rounded">{sub.people} kişiyle</span>}
              {sub.note && <span className="ml-2 text-xs text-gray-400 italic">({sub.note})</span>}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-indigo-600">{getMonthly(sub).toLocaleString('tr-TR', {minimumFractionDigits:2})}₺/ay</span>
              <button className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeSubscription(idx)} title="Sil">Sil</button>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 text-center">
        <div className="text-lg font-bold text-gray-800 dark:text-gray-100">Toplam Aylık:</div>
        <div className="text-2xl font-extrabold text-indigo-700 dark:text-indigo-300 mb-1">{totalMonthly.toLocaleString('tr-TR', {minimumFractionDigits:2})}₺</div>
        <div className="text-sm text-gray-500 mb-2">Yıllık karşılığı: <span className="font-bold text-indigo-600">{totalYearly.toLocaleString('tr-TR', {minimumFractionDigits:2})}₺</span></div>
        <div className="text-base font-semibold text-indigo-700 dark:text-indigo-300">Kişi başı aylık: {totalMonthlyPerPerson.toLocaleString('tr-TR', {minimumFractionDigits:2})}₺</div>
        <div className="text-xs text-gray-400">(Paylaşımlı aboneliklerde kişi sayısına göre otomatik hesaplanır)</div>
        <div className="text-sm text-gray-500 mt-2 italic">Aboneliklerinizi gözden geçirin, gerekirse iptal edin ve bütçenizi koruyun!</div>
      </div>
      <div className="flex justify-end mt-4">
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-bold"
          onClick={() => setShowShare(true)}
        >
          Paylaş
        </button>
      </div>
      {showShare && (
        <SubscriptionShareModal
          ref={shareRef}
          subscriptions={subscriptions}
          totalMonthly={totalMonthly}
          totalYearly={totalYearly}
          totalMonthlyPerPerson={totalMonthlyPerPerson}
          totalYearlyPerPerson={totalYearlyPerPerson}
          onClose={() => setShowShare(false)}
          onDownloadImage={handleShareImage}
        />
      )}
    </div>
  );
}
