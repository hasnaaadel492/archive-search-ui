import { useMemo } from 'react';

function sortIssuesOldestFirst(issues = []) {
  return [...issues].sort((a, b) => {
    const numA = Number(a.issueNumber ?? a.number);
    const numB = Number(b.issueNumber ?? b.number);

    if (!Number.isNaN(numA) && !Number.isNaN(numB) && numA !== numB) {
      return numA - numB;
    }

    const timeA = a.date ? new Date(a.date).getTime() : 0;
    const timeB = b.date ? new Date(b.date).getTime() : 0;
    return timeA - timeB;
  });
}

export default function GazetteList({
  issues = [],
  isLoading = false,
  selectedIssueNumber = '',
  onSelectIssue,
}) {
  const orderedIssues = useMemo(() => sortIssuesOldestFirst(issues), [issues]);

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="px-5 py-4 bg-[var(--color-primary)] text-white flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold">أعداد الجريدة الرسمية</h2>
          <p className="text-xs text-slate-200">
            قائمة متسلسلة مرتبة من الأقدم إلى الأحدث
          </p>
        </div>
        <span className="text-xs bg-white/15 px-2.5 py-1 rounded-md">
          {isLoading ? '...' : `${orderedIssues.length} عدد`}
        </span>
      </div>

      {isLoading ? (
        <div className="p-5 space-y-3">
          {[1, 2, 3, 4].map((row) => (
            <div key={row} className="animate-pulse flex justify-between items-center py-2 border-b border-slate-100 last:border-b-0">
              <div className="space-y-1.5 w-1/2">
                <div className="h-3.5 bg-slate-200 rounded w-3/4" />
                <div className="h-2.5 bg-slate-100 rounded w-1/2" />
              </div>
              <div className="h-3 bg-slate-200 rounded w-16" />
            </div>
          ))}
        </div>
      ) : !orderedIssues.length ? (
        <div className="p-6 text-center text-xs sm:text-sm text-slate-500">
          ستظهر هنا قائمة أعداد الجريدة الرسمية مرتبة من الأقدم إلى الأحدث فور توفر البيانات من الخادم.
        </div>
      ) : (
        <ul className="divide-y divide-slate-100 max-h-[520px] overflow-y-auto">
          {orderedIssues.map((issue, index) => {
            const currentNum = String(issue.issueNumber ?? issue.number ?? '');
            const isSelected = selectedIssueNumber && selectedIssueNumber === currentNum;

            return (
              <li
                key={issue.id ?? currentNum ?? index}
                className={`px-5 py-3.5 transition flex items-center justify-between gap-3 ${
                  isSelected ? 'bg-blue-50/80' : 'hover:bg-slate-50'
                }`}
              >
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    العدد رقم: {currentNum || '-'}
                  </p>
                  {issue.date && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      تاريخ الصدور: {issue.date}
                    </p>
                  )}
                </div>

                {onSelectIssue && (
                  <button
                    type="button"
                    onClick={() => onSelectIssue(issue)}
                    className={`text-xs font-semibold shrink-0 cursor-pointer ${
                      isSelected
                        ? 'text-blue-700 underline'
                        : 'text-[var(--color-primary)] hover:underline'
                    }`}
                  >
                    {isSelected ? 'محدد حالياً' : 'تصفية بالعدد'}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}