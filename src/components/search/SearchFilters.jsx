const DEFAULT_CATEGORIES = [
  { id: 'all', label: 'جميع التصنيفات' },
  { id: 'official-gazette', label: 'الجريدة الرسمية' },
  { id: 'gov-docs', label: 'وثائق حكومية' },
  { id: 'agreements', label: 'اتفاقيات' },
  { id: 'royal-decrees', label: 'إرادات وخطابات ملكية' },
];

export default function SearchFilters({
  filters,
  categories = DEFAULT_CATEGORIES,
  onFilterChange,
  onReset,
}) {
  const currentYear = new Date().getFullYear();

  const activeFiltersCount = [
    filters.category !== 'all',
    Boolean(filters.issueNumber?.trim()),
    Boolean(String(filters.year || '').trim()),
    filters.searchScope !== 'all',
  ].filter(Boolean).length;

  return (
    <div className="mt-4 pt-4 border-t border-slate-200 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold text-slate-600">
          تصنيف الوثائق:
        </span>

        {activeFiltersCount > 0 && (
          <span className="text-xs font-medium bg-blue-50 text-[var(--color-primary)] border border-blue-200 px-2.5 py-0.5 rounded-full">
            فلاتر مفعّلة: {activeFiltersCount}
          </span>
        )}
      </div>

      {/* أزرار اختيار التصنيف السريع */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const isSelected = filters.category === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onFilterChange('category', cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer border ${
                isSelected
                  ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* حقول التصفية التفصيلية */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            رقم العدد
          </label>
          <input
            type="text"
            dir="ltr"
            value={filters.issueNumber}
            onChange={(e) => onFilterChange('issueNumber', e.target.value)}
            maxLength={30}
            placeholder="5420"
            className="w-full text-right rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-[var(--color-primary)] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            السنة
          </label>
          <input
            type="number"
            dir="ltr"
            min="1900"
            max={currentYear}
            value={filters.year}
            onChange={(e) => onFilterChange('year', e.target.value)}
            placeholder={String(currentYear)}
            className="w-full text-right rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-[var(--color-primary)] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            مجال البحث
          </label>
          <select
            value={filters.searchScope}
            onChange={(e) => onFilterChange('searchScope', e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-[var(--color-primary)] focus:outline-none"
          >
            <option value="all">العنوان والمحتوى</option>
            <option value="title">العنوان فقط</option>
            <option value="content">محتوى الملف</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={onReset}
            disabled={activeFiltersCount === 0}
            className="w-full rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 disabled:opacity-45 disabled:hover:bg-rose-50 text-rose-700 font-semibold text-xs sm:text-sm py-2.5 px-4 transition cursor-pointer"
          >
            تفريغ الحقول
          </button>
        </div>
      </div>
    </div>
  );
}