import { useMemo } from 'react';

/**
 * ترتيب أعداد الجريدة الرسمية تصاعدياً من الأقدم إلى الأحدث
 */
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

export default function GazetteList({ issues = [], onSelectIssue }) {
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
          {orderedIssues.length} عدد
        </span>
      </div>

      {!orderedIssues.length ? (
        <div className="p-6 text-center text-xs sm:text-sm text-slate-500">
          ستظهر هنا قائمة أعداد الجريدة الرسمية مرتبة من الأقدم إلى الأحدث فور توفر البيانات من الخادم.
        </div>
      ) : (
        <ul className="divide-y divide-slate-100 max-h-[520px] overflow-y-auto">
          {orderedIssues.map((issue, index) => (
            <li
              key={issue.id ?? issue.issueNumber ?? index}
              className="px-5 py-3.5 hover:bg-slate-50 transition flex items-center justify-between gap-3"
            >
              <div>
                <p className="text-sm font-bold text-slate-800">
                  العدد رقم: {issue.issueNumber ?? issue.number ?? '-'}
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
                  className="text-xs font-semibold text-[var(--color-primary)] hover:underline shrink-0 cursor-pointer"
                >
                  تصفية بالعدد
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}