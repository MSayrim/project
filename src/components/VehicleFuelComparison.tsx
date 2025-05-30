import React, { useState } from 'react';
import VehicleFuelShareModal from './VehicleFuelShareModal';

const DEFAULTS = {
  km: 100,
  electricityConsumption: 17, // kWh/100km
  gasolineConsumption: 6.5,   // L/100km
  dieselConsumption: 5,       // L/100km
  electricityPrice: 2.2,      // TL/kWh
  gasolinePrice: 44,          // TL/L
  dieselPrice: 42             // TL/L
};

const VehicleFuelComparison: React.FC = () => {
  const [km, setKm] = useState(DEFAULTS.km);
  const [electricityConsumption, setElectricityConsumption] = useState(DEFAULTS.electricityConsumption);
  const [gasolineConsumption, setGasolineConsumption] = useState(DEFAULTS.gasolineConsumption);
  const [dieselConsumption, setDieselConsumption] = useState(DEFAULTS.dieselConsumption);
  const [electricityPrice, setElectricityPrice] = useState(DEFAULTS.electricityPrice);
  const [gasolinePrice, setGasolinePrice] = useState(DEFAULTS.gasolinePrice);
  const [dieselPrice, setDieselPrice] = useState(DEFAULTS.dieselPrice);
  const [showShareModal, setShowShareModal] = useState(false);

  // Hesaplamalar
  const electricTotalKwh = (electricityConsumption / 100) * km;
  const gasolineTotalLt = (gasolineConsumption / 100) * km;
  const dieselTotalLt = (dieselConsumption / 100) * km;

  const electricTotalCost = electricTotalKwh * electricityPrice;
  const gasolineTotalCost = gasolineTotalLt * gasolinePrice;
  const dieselTotalCost = dieselTotalLt * dieselPrice;

  const shareResult = {
    km,
    electricity: { consumption: electricityConsumption, total: electricTotalKwh, cost: electricTotalCost, price: electricityPrice },
    gasoline: { consumption: gasolineConsumption, total: gasolineTotalLt, cost: gasolineTotalCost, price: gasolinePrice },
    diesel: { consumption: dieselConsumption, total: dieselTotalLt, cost: dieselTotalCost, price: dieselPrice }
  };

  return (
      <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl mt-6 border-2 border-violet-200 dark:border-violet-900/30">
        <h2 className="text-2xl font-extrabold mb-4 text-center text-violet-700 dark:text-violet-300 tracking-tight drop-shadow">Araç Yakıt Karşılaştırma</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">Toplam Mesafe (km)</label>
            <input type="number" min={1} className="w-full p-2 rounded-lg border-2 border-violet-200 dark:border-violet-900/40 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-violet-400 transition" value={km} onChange={e => setKm(Number(e.target.value))} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Elektrik */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-xl shadow flex flex-col gap-1 border-2 border-blue-200 dark:border-blue-900/40">
            <div className="font-bold text-blue-800 dark:text-blue-200 mb-2 text-lg flex items-center gap-2"><span>🔌</span>Elektrikli Araç</div>
            <label className="block text-xs font-semibold mb-1">Tüketim (kWh/100km)</label>
            <input type="number" min={1} step={0.1} className="w-full p-1 rounded-lg border-2 border-blue-200 dark:border-blue-900/40 bg-white dark:bg-blue-950 focus:ring-2 focus:ring-blue-400 transition mb-2" value={electricityConsumption} onChange={e => setElectricityConsumption(Number(e.target.value))} />
            <label className="block text-xs font-semibold mb-1">Elektrik Fiyatı (TL/kWh)</label>
            <input type="number" min={0.01} step={0.01} className="w-full p-1 rounded-lg border-2 border-blue-200 dark:border-blue-900/40 bg-white dark:bg-blue-950 focus:ring-2 focus:ring-blue-400 transition" value={electricityPrice} onChange={e => setElectricityPrice(Number(e.target.value))} />
          </div>
          {/* Benzin */}
          <div className="p-4 bg-red-50 dark:bg-red-900 rounded-xl shadow flex flex-col gap-1 border-2 border-red-200 dark:border-red-900/40">
            <div className="font-bold text-red-800 dark:text-red-200 mb-2 text-lg flex items-center gap-2"><span>⛽</span>Benzinli Araç</div>
            <label className="block text-xs font-semibold mb-1">Tüketim (L/100km)</label>
            <input type="number" min={1} step={0.1} className="w-full p-1 rounded-lg border-2 border-red-200 dark:border-red-900/40 bg-white dark:bg-red-950 focus:ring-2 focus:ring-red-400 transition mb-2" value={gasolineConsumption} onChange={e => setGasolineConsumption(Number(e.target.value))} />
            <label className="block text-xs font-semibold mb-1">Benzin Fiyatı (TL/L)</label>
            <input type="number" min={0.01} step={0.01} className="w-full p-1 rounded-lg border-2 border-red-200 dark:border-red-900/40 bg-white dark:bg-red-950 focus:ring-2 focus:ring-red-400 transition" value={gasolinePrice} onChange={e => setGasolinePrice(Number(e.target.value))} />
          </div>
          {/* Dizel */}
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl shadow flex flex-col gap-1 border-2 border-gray-300 dark:border-gray-800/40">
            <div className="font-bold text-gray-800 dark:text-gray-200 mb-2 text-lg flex items-center gap-2"><span>🚗</span>Dizel Araç</div>
            <label className="block text-xs font-semibold mb-1">Tüketim (L/100km)</label>
            <input type="number" min={1} step={0.1} className="w-full p-1 rounded-lg border-2 border-gray-300 dark:border-gray-800/40 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-gray-400 transition mb-2" value={dieselConsumption} onChange={e => setDieselConsumption(Number(e.target.value))} />
            <label className="block text-xs font-semibold mb-1">Dizel Fiyatı (TL/L)</label>
            <input type="number" min={0.01} step={0.01} className="w-full p-1 rounded-lg border-2 border-gray-300 dark:border-gray-800/40 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-gray-400 transition" value={dieselPrice} onChange={e => setDieselPrice(Number(e.target.value))} />
          </div>
        </div>
        <hr className="my-4 border-violet-200 dark:border-violet-900/30" />
        <h3 className="text-lg font-extrabold mb-2 text-center text-violet-700 dark:text-violet-300 tracking-tight">Toplam Tüketim ve Maliyet</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-800 shadow border-2 border-blue-200 dark:border-blue-900/40">
            <div className="font-bold text-blue-700 dark:text-blue-200 text-base flex items-center justify-center gap-1">🔌 Elektrikli</div>
            <div className="text-sm mt-1">{electricTotalKwh.toFixed(2)} kWh</div>
            <div className="text-xl font-bold mt-1">{electricTotalCost.toLocaleString('tr-TR', {maximumFractionDigits: 2})} TL</div>
          </div>
          <div className="p-3 rounded-xl bg-red-100 dark:bg-red-800 shadow border-2 border-red-200 dark:border-red-900/40">
            <div className="font-bold text-red-700 dark:text-red-200 text-base flex items-center justify-center gap-1">⛽ Benzinli</div>
            <div className="text-sm mt-1">{gasolineTotalLt.toFixed(2)} L</div>
            <div className="text-xl font-bold mt-1">{gasolineTotalCost.toLocaleString('tr-TR', {maximumFractionDigits: 2})} TL</div>
          </div>
          <div className="p-3 rounded-xl bg-gray-200 dark:bg-gray-700 shadow border-2 border-gray-300 dark:border-gray-800/40">
            <div className="font-bold text-gray-700 dark:text-gray-200 text-base flex items-center justify-center gap-1">🚗 Dizel</div>
            <div className="text-sm mt-1">{dieselTotalLt.toFixed(2)} L</div>
            <div className="text-xl font-bold mt-1">{dieselTotalCost.toLocaleString('tr-TR', {maximumFractionDigits: 2})} TL</div>
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <button
              className="bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 px-6 rounded-lg shadow-lg border-2 border-violet-200 dark:border-violet-900/40 transition"
              onClick={() => setShowShareModal(true)}
          >
            Sonucumu Paylaş
          </button>
        </div>
        <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-center">
          <p>Varsayılan tüketim değerleri ortalama fabrika verileridir. Kendi aracınıza göre değiştirebilirsiniz.</p>
        </div>
        {/* Paylaşım Modalı */}
        {showShareModal && (
            <VehicleFuelShareModal
                open={showShareModal}
                onClose={() => setShowShareModal(false)}
                result={shareResult}
                slipTitle="Araç Yakıt Karşılaştırma Sonucu"
            />
        )}
      </div>
  );
};

export default VehicleFuelComparison;
