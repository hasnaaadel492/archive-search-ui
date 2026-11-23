const DATABASES = [
  { id: 'gov-docs', label: 'وثائق حكومية' },
  { id: 'cultural-agreements', label: 'الاتفاقيات الثقافية' },
  { id: 'gazette-issue', label: 'عدد الجريدة الرسمية' },
  { id: 'special-issue', label: 'عدد ممتاز' },
  { id: 'gazette-supplement', label: 'ملحق جريدة رسمية' },
  { id: 'company-ads', label: 'إعلانات الشركات' },
  { id: 'trademarks', label: 'علامات تجارية' },
  { id: 'parliament-minutes', label: 'مذكرات مجلس الأمة' },
  { id: 'parliament-supplement', label: 'ملحق مذكرات مجلس أمة' },
  { id: 'king-abdullah-ii', label: 'خطابات الملك عبد الله الثاني ابن الحسين' },
  { id: 'king-hussein', label: 'خطابات جلالة الملك الحسين بن طلال' },
  { id: 'prince-hassan', label: 'خطابات سمو الأمير الحسن ابن طلال' },
  { id: 'private-docs', label: 'الوثائق الخاصة' },
  { id: 'photo-archive', label: 'أرشيف الصور' },
];

export default function SearchBar({
  keyword = '',
  onKeywordChange,
  selectedDatabases = [],
  onToggleDatabase,
  onSearch,
  onReset,
  isLoading = false,
}) {
  const safeSelected = Array.isArray(selectedDatabases) ? selectedDatabases : [];
  const safeKeyword = typeof keyword === 'string' ? keyword : '';
  const canSearch = Boolean(safeKeyword.trim()) || safeSelected.length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSearch || isLoading) return;
    onSearch?.();
  };

  return (
    <div className="space-y-5">
      {/* اختيار واحد أو أكثر من قاعدة البيانات */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm sm:text-base font-bold text-slate-800">
            الرجاء اختيار واحد أو اكثر من قاعدة البيانات
          </h2>
          {safeSelected.length > 0 && (
            <span className="text-xs font-medium bg-blue-50 text-[var(--color-primary)] border border-blue-200 px-2.5 py-0.5 rounded-full">
              المحدد: {safeSelected.length}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {DATABASES.map((db) => {
            const isSelected = safeSelected.includes(db.id);
            return (
              <button
                key={db.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onToggleDatabase?.(db.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition cursor-pointer border ${
                  isSelected
                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                {db.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* حقل البحث وأزرار الإجراء */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={safeKeyword}
            onChange={(e) => onKeywordChange?.(e.target.value)}
            maxLength={150}
            placeholder="بحث"
            aria-label="كلمة البحث"
            className="w-full border-b-2 border-slate-300 focus:border-[var(--color-primary)] bg-transparent py-2.5 pr-3 pl-9 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none transition"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"
          >
            🔍
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="submit"
            disabled={!canSearch || isLoading}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition ${
              canSearch && !isLoading
                ? 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-white cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? 'جاري البحث...' : 'بحث'}
          </button>

          <button
            type="button"
            onClick={onReset}
            className="bg-slate-700 hover:bg-slate-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition cursor-pointer"
          >
            تفريغ الحقول
          </button>
        </div>
      </form>
    </div>
  );
}