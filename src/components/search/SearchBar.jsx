export default function SearchBar({
  keyword,
  onKeywordChange,
  onSearch,
  isAdvancedOpen,
  onToggleAdvanced,
  isLoading,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            maxLength={150}
            placeholder="ابحث بالكلمات المفتاحية في الوثائق والملفات..."
            aria-label="كلمات البحث المفتاحية"
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 sm:flex-none bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] disabled:opacity-60 text-white font-semibold text-sm px-6 py-3 rounded-lg transition cursor-pointer"
          >
            {isLoading ? 'جاري البحث...' : 'بحث'}
          </button>

          <button
            type="button"
            onClick={onToggleAdvanced}
            aria-expanded={isAdvancedOpen}
            className="flex-1 sm:flex-none bg-slate-100 hover:bg-slate-200 text-[var(--color-primary)] font-semibold text-sm px-4 py-3 rounded-lg border border-slate-300 transition cursor-pointer"
          >
            {isAdvancedOpen ? 'إخفاء البحث المتقدم' : 'بحث متقدم'}
          </button>
        </div>
      </div>
    </form>
  );
}