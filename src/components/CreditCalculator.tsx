import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Share2, ExternalLink } from 'lucide-react';
import CreditResultModal from './CreditResultModal.tsx';

interface CreditCalculatorProps {
  // Gerekirse prop'lar eklenebilir
}

interface PaymentScheduleItem {
  no: number;
  date: string;
  payment: number;
  principal: number;
  interest: number;
  kkdf: number;
  bsmv: number;
  remainingPrincipal: number;
}

enum CalculationType {
  LOAN_AMOUNT = "LOAN_AMOUNT",
  MONTHLY_PAYMENT = "MONTHLY_PAYMENT",
  TERM = "TERM"
}

const CreditCalculator: React.FC<CreditCalculatorProps> = () => {
  const { t } = useTranslation();
  
  // Kredi hesaplama için state'ler
  const [loanType, setLoanType] = useState<string>("Hızlı Kredi");
  const [loanAmount, setLoanAmount] = useState<number>(200000);
  const [loanTerm, setLoanTerm] = useState<number>(24);
  const [interestRate, setInterestRate] = useState<number>(5.25);
  const [installment, setInstallment] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [annualEffectiveRate, setAnnualEffectiveRate] = useState<number>(0);
  const [calculationDate, setCalculationDate] = useState<string>("");
  const [showResults, setShowResults] = useState<boolean>(false);
  const [paymentSchedule, setPaymentSchedule] = useState<PaymentScheduleItem[]>([]);
  const [calculationType, setCalculationType] = useState<CalculationType>(CalculationType.LOAN_AMOUNT);
  const [targetMonthlyPayment, setTargetMonthlyPayment] = useState<number>(17170.80);
  const [targetLoanAmount, setTargetLoanAmount] = useState<number>(200000);
  const [targetLoanTerm, setTargetLoanTerm] = useState<number>(24);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const resultRef = React.useRef<HTMLDivElement>(null);

  // Kredi hesaplama fonksiyonu
  const calculateLoan = () => {
    // KKDF ve BSMV oranları (Türkiye'deki standart oranlar)
    const kkdfRate = 0.15; // %15
    const bsmvRate = 0.15; // %15 (Bankadaki örneğe göre %15 kullanıyoruz)
    
    // Aylık faiz oranı (yıllık faiz / 100 / 12)
    const monthlyInterestRateDecimal = interestRate / 100;
    
    // Brüt faiz oranı hesaplama (KKDF ve BSMV dahil)
    const brutFaizOrani = monthlyInterestRateDecimal * (1 + kkdfRate + bsmvRate);
    
    // Banka hesaplama yöntemine göre aylık taksit hesaplama
    // Taksit = P * r * (1 + r)^n / ((1 + r)^n - 1)
    // P: kredi tutarı, r: brüt aylık faiz oranı, n: toplam taksit sayısı
    
    // Sabit taksit tutarı hesaplama
    const carpan = (brutFaizOrani * Math.pow(1 + brutFaizOrani, loanTerm)) / 
                  (Math.pow(1 + brutFaizOrani, loanTerm) - 1);
    const monthlyPaymentAmount = loanAmount * carpan;
    
    // Toplam geri ödeme
    const totalAmount = monthlyPaymentAmount * loanTerm;
    
    // Efektif faiz oranları hesaplama
    const annualEffectiveRateValue = (Math.pow(1 + brutFaizOrani, 12) - 1) * 100;
    
    setInstallment(parseFloat(monthlyPaymentAmount.toFixed(2)));
    setTotalPayment(parseFloat(totalAmount.toFixed(2)));
    setAnnualEffectiveRate(parseFloat(annualEffectiveRateValue.toFixed(4)));
    
    // Ödeme planı oluşturma
    createPaymentSchedule(monthlyPaymentAmount);
    
    // Hesaplama tarihi
    const now = new Date();
    setCalculationDate(`${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
    
    setShowResults(true);
  };

  // Ödeme planı oluşturma - Java örneğine göre
  const createPaymentSchedule = (monthlyPayment: number) => {
    let remainingPrincipal = loanAmount;
    const schedule: PaymentScheduleItem[] = [];
    
    // KKDF ve BSMV oranları
    const kkdfRate = 0.15;
    const bsmvRate = 0.15; // Bankadaki örneğe göre %15 kullanıyoruz
    
    for (let i = 0; i < loanTerm; i++) {
      // Faiz hesaplama - kalan anapara üzerinden
      const interestAmount = remainingPrincipal * (interestRate / 100);
      
      // KKDF ve BSMV hesaplama
      const kkdfAmount = interestAmount * kkdfRate;
      const bsmvAmount = interestAmount * bsmvRate;
      
      // Anapara hesaplama (taksit - faiz - kkdf - bsmv)
      const principalAmount = monthlyPayment - interestAmount - kkdfAmount - bsmvAmount;
      
      // Kalan anapara güncelleme
      remainingPrincipal -= principalAmount;
      
      // Son taksitte kalan tutarı sıfırlama (yuvarlama hatalarını önlemek için)
      if (i === loanTerm - 1) {
        remainingPrincipal = 0;
      }
      
      // Ödeme planına ekleme
      schedule.push({
        no: i + 1,
        date: "", // Tarih bilgisi eklenmeyecek
        payment: parseFloat(monthlyPayment.toFixed(2)),
        principal: parseFloat(principalAmount.toFixed(2)),
        interest: parseFloat(interestAmount.toFixed(2)),
        kkdf: parseFloat(kkdfAmount.toFixed(2)),
        bsmv: parseFloat(bsmvAmount.toFixed(2)),
        remainingPrincipal: parseFloat(remainingPrincipal.toFixed(2))
      });
    }
    
    setPaymentSchedule(schedule);
  };

  // Aylık taksit tutarına göre kredi tutarı hesaplama
  const calculateLoanAmountFromMonthlyPayment = () => {
    // KKDF ve BSMV oranları
    const kkdfRate = 0.15; // %15
    const bsmvRate = 0.15; // %15 (Bankadaki örneğe göre %15 kullanıyoruz)
    
    // Aylık faiz oranı
    const monthlyInterestRateDecimal = interestRate / 100;
    
    // Brüt faiz oranı hesaplama (KKDF ve BSMV dahil)
    const brutFaizOrani = monthlyInterestRateDecimal * (1 + kkdfRate + bsmvRate);
    
    // Taksit formülünden kredi tutarını çözme
    // Taksit = P * r * (1 + r)^n / ((1 + r)^n - 1)
    // P = Taksit / [r * (1 + r)^n / ((1 + r)^n - 1)]
    
    const carpan = (brutFaizOrani * Math.pow(1 + brutFaizOrani, targetLoanTerm)) / 
                  (Math.pow(1 + brutFaizOrani, targetLoanTerm) - 1);
    
    const calculatedLoanAmount = targetMonthlyPayment / carpan;
    
    // State güncelleme
    setLoanAmount(parseFloat(calculatedLoanAmount.toFixed(2)));
    setLoanTerm(targetLoanTerm);
    
    // Normal hesaplama fonksiyonunu çağır
    setTimeout(() => calculateLoan(), 100);
  };

  // Aylık taksit tutarına göre vade hesaplama
  const calculateTermFromMonthlyPayment = () => {
    // KKDF ve BSMV oranları
    const kkdfRate = 0.15; // %15
    const bsmvRate = 0.15; // %15 (Bankadaki örneğe göre %15 kullanıyoruz)
    
    // Aylık faiz oranı
    const monthlyInterestRateDecimal = interestRate / 100;
    
    // Brüt faiz oranı hesaplama (KKDF ve BSMV dahil)
    const brutFaizOrani = monthlyInterestRateDecimal * (1 + kkdfRate + bsmvRate);
    
    // Taksit formülünden vadeyi çözme
    // Bu karmaşık bir denklem, iteratif yaklaşım kullanacağız
    
    let calculatedTerm = 1;
    let calculatedPayment = 0;
    
    // Maksimum 180 ay (15 yıl) için kontrol et
    for (let i = 1; i <= 180; i++) {
      const carpan = (brutFaizOrani * Math.pow(1 + brutFaizOrani, i)) / 
                    (Math.pow(1 + brutFaizOrani, i) - 1);
      
      calculatedPayment = targetLoanAmount * carpan;
      
      // Hedef taksit tutarına eşit veya daha düşük ise bu vadeyi kullan
      if (calculatedPayment <= targetMonthlyPayment || i === 180) {
        calculatedTerm = i;
        break;
      }
    }
    
    // State güncelleme
    setLoanTerm(calculatedTerm);
    setLoanAmount(targetLoanAmount);
    
    // Normal hesaplama fonksiyonunu çağır
    setTimeout(() => calculateLoan(), 100);
  };

  // Hesaplama türüne göre doğru fonksiyonu çağır
  const handleCalculate = () => {
    switch (calculationType) {
      case CalculationType.LOAN_AMOUNT:
        calculateLoan();
        break;
      case CalculationType.MONTHLY_PAYMENT:
        calculateLoanAmountFromMonthlyPayment();
        break;
      case CalculationType.TERM:
        calculateTermFromMonthlyPayment();
        break;
      default:
        calculateLoan();
    }
  };

  // Formu sıfırla
  const resetForm = () => {
    setLoanAmount(200000);
    setLoanTerm(24);
    setInterestRate(5.25);
    setShowResults(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">Kredi Hesaplama Aracı</h2>
      
      <div className="mb-6">
        <p className="text-red-500 text-sm mb-4">* Doldurulması zorunlu alanlar.</p>
        
        {/* Hesaplama Formu */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <div className="mb-4">
            <label className="block mb-2">
              Hesaplama Şekli:
              <select
                value={calculationType}
                onChange={(e) => setCalculationType(e.target.value as CalculationType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white mt-1"
              >
                <option value={CalculationType.LOAN_AMOUNT}>Kredi Tutarına Göre</option>
                <option value={CalculationType.MONTHLY_PAYMENT}>Aylık Taksite Göre</option>
                <option value={CalculationType.TERM}>Vadeye Göre</option>
              </select>
            </label>
          </div>
          
          {calculationType === CalculationType.LOAN_AMOUNT && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2">
                  <span className="text-red-500">*</span> Kredi Tutarı:
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white mt-1"
                    />
                    <span className="ml-2">TL</span>
                  </div>
                </label>
              </div>
              <div>
                <label className="block mb-2">
                  <span className="text-red-500">*</span> Vade (Ay):
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white mt-1"
                    />
                  </div>
                </label>
              </div>
            </div>
          )}
          
          {calculationType === CalculationType.MONTHLY_PAYMENT && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2">
                  <span className="text-red-500">*</span> Aylık Taksit Tutarı:
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={targetMonthlyPayment}
                      onChange={(e) => setTargetMonthlyPayment(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white mt-1"
                    />
                    <span className="ml-2">TL</span>
                  </div>
                </label>
              </div>
              <div>
                <label className="block mb-2">
                  <span className="text-red-500">*</span> Vade (Ay):
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={targetLoanTerm}
                      onChange={(e) => setTargetLoanTerm(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white mt-1"
                    />
                  </div>
                </label>
              </div>
            </div>
          )}
          
          {calculationType === CalculationType.TERM && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2">
                  <span className="text-red-500">*</span> Kredi Tutarı:
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={targetLoanAmount}
                      onChange={(e) => setTargetLoanAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white mt-1"
                    />
                    <span className="ml-2">TL</span>
                  </div>
                </label>
              </div>
              <div>
                <label className="block mb-2">
                  <span className="text-red-500">*</span> Aylık Taksit Tutarı:
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={targetMonthlyPayment}
                      onChange={(e) => setTargetMonthlyPayment(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white mt-1"
                    />
                    <span className="ml-2">TL</span>
                  </div>
                </label>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2">
                <span className="text-red-500">*</span> Faiz Oranı (%):
                <div className="flex items-center">
                  <input
                    type="number"
                    step="0.01"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white mt-1"
                  />
                </div>
              </label>
            </div>
            <div>
              <label className="block mb-2">
                <span className="text-red-500">*</span> Kredi Türü:
                <select
                  value={loanType}
                  onChange={(e) => setLoanType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white mt-1"
                >
                  <option value="Hızlı Kredi">Hızlı Kredi</option>
                  <option value="İhtiyaç Kredisi">İhtiyaç Kredisi</option>
                  <option value="Konut Kredisi">Konut Kredisi</option>
                  <option value="Taşıt Kredisi">Taşıt Kredisi</option>
                </select>
              </label>
            </div>
          </div>
          
          <div className="mt-6 flex space-x-4">
            <button
              onClick={handleCalculate}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Hesapla
            </button>
            <button
              onClick={resetForm}
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Sıfırla
            </button>
            <button
              type="button"
              onClick={() => setShareModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
            >
              <Share2 size={18} />
              Paylaş
            </button>
          </div>
        </div>
      </div>
      
      {/* Sonuçlar */}
      {showResults && (
        <div className="mt-8">
          <div ref={resultRef} id="credit-share-result">
            <h3 className="text-xl font-bold mb-4 dark:text-white border-b pb-2">{loanType}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="flex justify-between py-2 border-b">
                  <span className="font-medium">Faiz Oranı:</span>
                  <span>% {interestRate}</span>
                </p>
                <p className="flex justify-between py-2 border-b">
                  <span className="font-medium">Yıllık Maliyet Oranı:</span>
                  <span>% {annualEffectiveRate.toLocaleString('tr-TR')}</span>
                </p>
                <p className="flex justify-between py-2 border-b">
                  <span className="font-medium">Kredi Tutarı:</span>
                  <span>{loanAmount.toLocaleString('tr-TR')} TL</span>
                </p>
                <p className="flex justify-between py-2 border-b">
                  <span className="font-medium">Taksit Sayısı:</span>
                  <span>{loanTerm} Ay</span>
                </p>
              </div>
              <div>
                <p className="flex justify-between py-2 border-b">
                  <span className="font-medium">Vade Sayısı:</span>
                  <span>{loanTerm} Ay</span>
                </p>
                <p className="flex justify-between py-2 border-b">
                  <span className="font-medium">Aylık Ödeme:</span>
                  <span>{installment.toLocaleString('tr-TR')} TL</span>
                </p>
                <p className="flex justify-between py-2 border-b">
                  <span className="font-medium">Geri Ödeme:</span>
                  <span>{totalPayment.toLocaleString('tr-TR')} TL</span>
                </p>
              </div>
            </div>
            {/* Ödeme Planı Tablosu */}
            <div className="mt-6 overflow-x-auto">
              <h4 className="text-lg font-semibold mb-3 dark:text-white">Ödeme Planı Tablosu</h4>
              <table className="min-w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="py-2 px-3 border text-left">Taksit Sayısı</th>
                    <th className="py-2 px-3 border text-right">Taksit Tutarı</th>
                    <th className="py-2 px-3 border text-right">Faiz</th>
                    <th className="py-2 px-3 border text-right">KKDF</th>
                    <th className="py-2 px-3 border text-right">BSMV</th>
                    <th className="py-2 px-3 border text-right">Taksit Anapara</th>
                    <th className="py-2 px-3 border text-right">Kalan Anapara</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentSchedule.map((item) => (
                    <tr key={item.no} className={item.no % 2 === 0 ? 'bg-gray-50 dark:bg-gray-600' : ''}>
                      <td className="py-2 px-3 border">{item.no}</td>
                      <td className="py-2 px-3 border text-right">{item.payment.toLocaleString('tr-TR')}</td>
                      <td className="py-2 px-3 border text-right">{item.interest.toLocaleString('tr-TR')}</td>
                      <td className="py-2 px-3 border text-right">{item.kkdf.toLocaleString('tr-TR')}</td>
                      <td className="py-2 px-3 border text-right">{item.bsmv.toLocaleString('tr-TR')}</td>
                      <td className="py-2 px-3 border text-right">{item.principal.toLocaleString('tr-TR')}</td>
                      <td className="py-2 px-3 border text-right">{item.remainingPrincipal.toLocaleString('tr-TR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-sm text-gray-600 mt-2">Ödeme Planınıza tahsis ücreti ve sigorta prim bedeli dahil değildir.</p>
              <p className="text-sm text-gray-600">Örnek Ödeme Planınız; {calculationDate} tarihinde oluşturulmuştur.</p>
            </div>
          </div>
          {/* Paylaşım Modalı */}
          <CreditResultModal
            open={shareModalOpen}
            onClose={() => setShareModalOpen(false)}
            result={{
              type: 'credit',
              interestRate,
              annualEffectiveRate,
              loanAmount,
              loanTerm,
              installment,
              totalPayment,
              paymentSchedule,
              calculationDate,
              loanType
            }}
            slipTitle={loanType}
          />
        </div>
      )}
    </div>
  );
};

export default CreditCalculator;
