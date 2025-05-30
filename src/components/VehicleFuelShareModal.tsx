import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { X, Download, Copy } from 'lucide-react';
import { FaWhatsapp, FaXTwitter, FaFacebook } from 'react-icons/fa6';
import { CheckCircle } from 'lucide-react';

interface VehicleFuelShareModalProps {
  open: boolean;
  onClose: () => void;
  result: any;
  slipTitle?: string;
}

const VehicleFuelShareModal: React.FC<VehicleFuelShareModalProps> = ({ open, onClose, result, slipTitle }) => {
  const slipRef = useRef<HTMLDivElement>(null);
  if (!open) return null;

  // En ucuz yakıt tipi bul
  const cheapest = (() => {
    const arr = [
      { key: 'electricity', label: 'Elektrikli', color: 'bg-blue-100 text-blue-800', cost: result.electricity.cost },
      { key: 'gasoline', label: 'Benzinli', color: 'bg-red-100 text-red-700', cost: result.gasoline.cost },
      { key: 'diesel', label: 'Dizel', color: 'bg-gray-200 text-gray-800', cost: result.diesel.cost }
    ];
    return arr.reduce((min, curr) => curr.cost < min.cost ? curr : min, arr[0]);
  })();

  const handleDownload = async () => {
    if (!slipRef.current) return;
    const canvas = await html2canvas(slipRef.current, { backgroundColor: '#f6f8ff', scale: 2 });
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'Arac-Yakit-Karsilastirma.png';
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-xl relative animate-fadeInUp border-2 border-violet-200">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><X size={22} /></button>
        <div className="flex flex-col items-center pt-6">
          <h3 className="text-lg font-extrabold text-violet-700 text-center mb-1">Arkadaşlarınla Paylaş!</h3>
          <p className="text-gray-500 text-sm mb-2">Son hesaplama slipini kolayca paylaşabilirsin 👇</p>
        </div>
        <div ref={slipRef} className="bg-gray-50 rounded-xl p-5 shadow-inner mb-4 mx-4 mt-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center text-white font-bold text-xs">PC</div>
            <h3 className="ml-2 text-violet-800 font-bold">ParamCebimde</h3>
            <div className="ml-auto text-xs text-gray-500">{new Date().toLocaleDateString('tr-TR')}</div>
          </div>
          <h2 className="text-center text-violet-600 font-bold text-xl mb-2 border-b border-gray-200 pb-2 bg-gray-100 -mx-5 px-5 py-2">
            {slipTitle || 'Araç Yakıt Karşılaştırma Sonucu'}
          </h2>
          <div className="text-center text-gray-700 text-sm mb-2">Toplam Mesafe: <b>{result.km} km</b></div>

          {/* En uygun özet başlık */}
          <div className="mb-2 mt-2 text-base font-bold text-center text-green-700 flex items-center justify-center gap-2">
            <CheckCircle size={22} className="text-green-600 -ml-2"/>
            En uygun: <span className="capitalize">{cheapest.label}</span>
          </div>

          <div className="mt-2 mb-1 text-base font-bold text-center text-gray-700">Fiyat Karşılaştırması</div>
          <div className="flex flex-row gap-2 justify-center items-end mb-5">
            {/* Elektrikli */}
            <div className={`relative flex-1 flex flex-col items-center rounded-xl p-4 border ${cheapest.key === 'electricity' ? 'border-green-500 bg-green-50' : 'border-blue-200 bg-blue-50'}`}> 
              <span className="font-bold text-blue-800">Elektrikli</span>
              <span className="text-2xl font-bold mt-1">{result.electricity.cost.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL</span>
              <span className="text-xs mt-1">{result.electricity.total.toFixed(2)} kWh</span>
              {cheapest.key === 'electricity' && (
                <span className="absolute -left-4 -bottom-4 flex items-center gap-1 text-green-600 font-bold z-10"><CheckCircle size={38} className="drop-shadow-lg"/></span>
              )}
            </div>
            {/* Benzinli */}
            <div className={`relative flex-1 flex flex-col items-center rounded-xl p-4 border ${cheapest.key === 'gasoline' ? 'border-green-500 bg-green-50' : 'border-red-200 bg-red-50'}`}> 
              <span className="font-bold text-red-700">Benzinli</span>
              <span className="text-2xl font-bold mt-1">{result.gasoline.cost.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL</span>
              <span className="text-xs mt-1">{result.gasoline.total.toFixed(2)} L</span>
              {cheapest.key === 'gasoline' && (
                <span className="absolute -left-4 -bottom-4 flex items-center gap-1 text-green-600 font-bold z-10"><CheckCircle size={38} className="drop-shadow-lg"/></span>
              )}
            </div>
            {/* Dizel */}
            <div className={`relative flex-1 flex flex-col items-center rounded-xl p-4 border ${cheapest.key === 'diesel' ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-100'}`}> 
              <span className="font-bold text-gray-800">Dizel</span>
              <span className="text-2xl font-bold mt-1">{result.diesel.cost.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL</span>
              <span className="text-xs mt-1">{result.diesel.total.toFixed(2)} L</span>
              {cheapest.key === 'diesel' && (
                <span className="absolute -left-4 -bottom-4 flex items-center gap-1 text-green-600 font-bold z-10"><CheckCircle size={38} className="drop-shadow-lg"/></span>
              )}
            </div>
          </div>
          {/* Fark bilgisi */}
          <div className="mt-2 mb-1 text-center text-xs text-gray-600">
            Fark: <b>{(Math.max(result.electricity.cost, result.gasoline.cost, result.diesel.cost) - Math.min(result.electricity.cost, result.gasoline.cost, result.diesel.cost)).toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL</b> (En pahalı ile en ucuz arasında)
          </div>
          <div className="mt-2 text-xs text-gray-500 text-center">
            Tüketim ve fiyat değerleri değiştirilebilir. Hesaplama yaklaşık sonuç verir.
          </div>
        </div>
        {/* Alt paylaşım butonları bloğu */}
        <div className="flex flex-col items-center gap-2 pb-4">
          <div className="flex justify-center gap-4 w-full">
            <button onClick={handleDownload} className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-semibold w-full max-w-xs justify-center">
              <Download size={18}/> Resim Olarak İndir
            </button>
          </div>
          <div className="flex justify-center gap-3 mt-1">
            <a href={`https://wa.me/?text=${encodeURIComponent('Araç yakıt karşılaştırma sonucum: ' + window.location.href)}`} target="_blank" rel="noopener noreferrer" className="rounded-full bg-green-500 hover:bg-green-600 w-9 h-9 flex items-center justify-center text-white"><FaWhatsapp size={18}/></a>
            <a href={`https://x.com/intent/tweet?text=${encodeURIComponent('Araç yakıt karşılaştırma sonucum: ' + window.location.href)}`} target="_blank" rel="noopener noreferrer" className="rounded-full bg-black hover:bg-gray-800 w-9 h-9 flex items-center justify-center text-white"><FaXTwitter size={18}/></a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="rounded-full bg-blue-600 hover:bg-blue-700 w-9 h-9 flex items-center justify-center text-white"><FaFacebook size={18}/></a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleFuelShareModal;
