import { useEffect } from 'react';

export default function HelpModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-xl w-full overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[var(--color-primary)] text-white px-6 py-4 flex items-center justify-between">
          <h2 id="help-modal-title" className="text-base sm:text-lg font-bold">
            دليل الباحث ومساعدة استخدام النظام
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق نافذة المساعدة"
            className="text-white/80 hover:text-white text-xl leading-none px-2 py-1 cursor-pointer"
          >
            &times;
          </button>
        </div>

        <div className="p-6 space-y-4 text-sm text-slate-700 leading-relaxed max-h-[75vh] overflow-y-auto">
          <div>
            <h3 className="font-bold text-[var(--color-primary)] mb-1">
              1. البحث بالكلمات المفتاحية
            </h3>
            <p>
              اكتب كلمة أو عبارة واضحة (مثل رقم قرار، موضوع، أو عنوان وثيقة) في حقل البحث ثم اضغط على زر البحث للحصول على النتائج المطابقة.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[var(--color-primary)] mb-1">
              2. استخدام البحث المتقدم والفلاتر
            </h3>
            <p>
              يمكنك تضييق نطاق النتائج عبر تحديد التصنيف، السنة، أو رقم العدد، واستخدام زر <strong>تفريغ الحقول</strong> للعودة إلى بحث جديد بسهولة.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[var(--color-primary)] mb-1">
              3. تصفح أعداد الجريدة الرسمية
            </h3>
            <p>
              تُعرض أعداد الجريدة الرسمية في قائمة متسلسلة مرتبة من <strong>الأقدم إلى الأحدث</strong> لتسهيل تتبع التسلسل التاريخي للأعداد.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-white text-sm font-semibold px-5 py-2 rounded-lg transition cursor-pointer"
          >
            فهمت، إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}