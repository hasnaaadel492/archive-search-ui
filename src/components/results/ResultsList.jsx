export default function ResultsList({
  results = [],
  isLoading = false,
  error = '',
  hasSearched = false,
  pagination = { page: 1, totalPages: 1, totalCount: 0 },
  onPageChange,
}) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="animate-pulse space-y-2 border-b border-slate-100 pb-4 last:border-b-0">
            <div className="h-4 bg-slate-200 rounded w-2/3" />
            <div className="h-3 bg-slate-100 rounded w-full" />
            <div className="h-3 bg-slate-100 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-6 text-sm">
        <p className="font-bold mb-1">تعذر إتمام عملية البحث</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
        أدخل كلمات البحث أو حدد الفلاتر المناسبة ثم اضغط على <strong>بحث</strong> لعرض الملفات والوثائق المطابقة.
      </div>
    );
  }

  if (!results.length) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-600 text-sm">
        لم يتم العثور على نتائج مطابقة لمعايير البحث الحالية. جرّب كلمات أخرى أو قم بتفريغ الحقول.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-slate-600">
        <span>
          عدد النتائج: <strong className="text-[var(--color-primary)]">{pagination.totalCount ?? results.length}</strong>
        </span>
        <span>
          صفحة <strong>{pagination.page}</strong> من <strong>{pagination.totalPages || 1}</strong>
        </span>
      </div>

      <ul className="divide-y divide-slate-200">
        {results.map((item, idx) => {
          const safeUrl =
            typeof item.url === 'string' && /^https?:\/\//i.test(item.url)
              ? item.url
              : null;

          return (
            <li key={item.id ?? idx} className="p-5 hover:bg-slate-50/80 transition">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-[var(--color-primary)]">
                    {safeUrl ? (
                      <a
                        href={safeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {item.title || 'وثيقة بدون عنوان'}
                      </a>
                    ) : (
                      <span>{item.title || 'وثيقة بدون عنوان'}</span>
                    )}
                  </h3>

                  {item.summary && (
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {item.summary}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 pt-1 text-xs text-slate-500">
                    {item.category && (
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">
                        {item.category}
                      </span>
                    )}
                    {item.issueNumber && (
                      <span className="bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded-md">
                        العدد: {item.issueNumber}
                      </span>
                    )}
                    {item.date && (
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">
                        التاريخ: {item.date}
                      </span>
                    )}
                  </div>
                </div>

                {safeUrl && (
                  <a
                    href={safeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center justify-center text-xs font-semibold text-[var(--color-primary)] border border-[var(--color-primary)]/30 hover:bg-[var(--color-primary)] hover:text-white px-3.5 py-2 rounded-lg transition"
                  >
                    عرض الملف
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {pagination.totalPages > 1 && (
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            disabled={pagination.page <= 1}
            onClick={() => onPageChange(pagination.page - 1)}
            className="px-4 py-1.5 rounded-lg border border-slate-300 bg-white text-xs sm:text-sm font-medium text-slate-700 disabled:opacity-40 hover:bg-slate-100 transition cursor-pointer"
          >
            السابق
          </button>

          <span className="text-xs sm:text-sm text-slate-600">
            {pagination.page} / {pagination.totalPages}
          </span>

          <button
            type="button"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => onPageChange(pagination.page + 1)}
            className="px-4 py-1.5 rounded-lg border border-slate-300 bg-white text-xs sm:text-sm font-medium text-slate-700 disabled:opacity-40 hover:bg-slate-100 transition cursor-pointer"
          >
            التالي
          </button>
        </div>
      )}
    </div>
  );
}