import { useState } from 'react';
import { sanitizeSearchInput } from '../../utils/sanitize';

const DB_OPTIONS = [
  'وثائق حكومية',
  'الاتفاقيات الثقافية',
  'عدد الجريدة الرسمية',
  'عدد ممتاز',
  'ملحق جريدة رسمية',
  'إعلانات الشركات',
  'علامات تجارية',
  'مذكرات مجلس الأمة',
  'ملحق مذكرات مجلس أمة',
  'خطابات الملك عبد الله الثاني ابن الحسين',
  'خطابات جلالة الملك الحسين بن طلال',
  'خطابات سمو الأمير الحسن ابن طلال',
  'الوثائق الخاصة',
  'أرشيف الصور',
];

const FIELD_OPTIONS = [
  'العنوان',
  'المحتوى',
  'رقم العدد',
  'السنة',
  'الجهة المصدرة',
];

const CRITERION_OPTIONS = [
  'يحتوي على',
  'مطابق تماماً',
  'يبدأ بـ',
  'ينتهي بـ',
];

const INPUT_STYLE =
  'w-full rounded-lg border border-slate-300 bg-slate-50/70 hover:bg-white focus:bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/15 transition';

export default function SearchFilters({
  rules = [],
  onAddRule,
  onRemoveRule,
  onClearRules,
  onExecuteAdvancedSearch,
  isLoading,
}) {
  const [database, setDatabase] = useState('');
  const [fieldName, setFieldName] = useState('');
  const [criterion, setCriterion] = useState('');
  const [searchWord, setSearchWord] = useState('');
  const [operator, setOperator] = useState('و');
  const [isSorted, setIsSorted] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    const cleanWord = sanitizeSearchInput(searchWord);
    if (!cleanWord && !database && !fieldName) return;

    onAddRule({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      database: database || 'الكل',
      fieldName: fieldName || 'العنوان والمحتوى',
      criterion: criterion || 'يحتوي على',
      searchWord: cleanWord,
      fromValue: '',
      toValue: '',
      fromYear: '',
      toYear: '',
      operator,
      sorted: isSorted,
    });

    setSearchWord('');
  };

  return (
    <div className="space-y-5">
      {/* حقول إنشاء الشرط */}
      <form onSubmit={handleAdd} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <select
            value={database}
            onChange={(e) => setDatabase(e.target.value)}
            aria-label="قاعدة البيانات"
           className={`${INPUT_STYLE} cursor-pointer focus:border-none`}
          >
            <option value="">قاعدة البيانات</option>
            {DB_OPTIONS.map((db) => (
              <option key={db} value={db}>
                {db}
              </option>
            ))}
          </select>

          <select
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            aria-label="إسم الحقل"
            className={`${INPUT_STYLE} cursor-pointer focus:border-none`}
          >
            <option value="">إسم الحقل</option>
            {FIELD_OPTIONS.map((field) => (
              <option key={field} value={field}>
                {field}
              </option>
            ))}
          </select>

          <select
            value={criterion}
            onChange={(e) => setCriterion(e.target.value)}
            aria-label="معيار البحث"
            className={`${INPUT_STYLE} cursor-pointer focus:border-none`}
          >
            <option value="">معيار البحث</option>
            {CRITERION_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={searchWord}
            onChange={(e) => setSearchWord(sanitizeSearchInput(e.target.value))}
            maxLength={150}
            placeholder="كلمة البحث"
            aria-label="كلمة البحث"
            className={INPUT_STYLE + ' focus:border-none'}
          />
        </div>

        {/* معاملات الربط ومفتاح ترتيب */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-slate-50 border border-slate-200/80 px-4 py-2.5 text-sm text-slate-700">
          <span className="text-xs font-semibold text-slate-500">
            ربط الشروط والترتيب:
          </span>

          <div className="flex flex-wrap items-center gap-6">
            <label className="inline-flex items-center gap-2 cursor-pointer select-none font-medium text-slate-700">
              <input
                type="checkbox"
                checked={isSorted}
                onChange={(e) => setIsSorted(e.target.checked)}
                className="w-4 h-4 rounded accent-[var(--color-primary)] cursor-pointer"
              />
              <span>ترتيب</span>
            </label>

            <div className="flex items-center gap-4 border-r border-slate-300 pr-5">
              {['و', 'أو', 'ليس'].map((op) => {
                const active = operator === op;
                return (
                  <label
                    key={op}
                    className={`inline-flex items-center gap-1.5 cursor-pointer select-none px-2.5 py-1 rounded-md text-xs sm:text-sm transition ${
                      active
                        ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold'
                        : 'text-slate-700 hover:bg-slate-200/60'
                    }`}
                  >
                    <input
                      type="radio"
                      name="searchOperator"
                      value={op}
                      checked={active}
                      onChange={() => setOperator(op)}
                      className="w-3.5 h-3.5 accent-[var(--color-primary)] cursor-pointer"
                    />
                    <span>{op}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* زر إضافة الشرط */}
        <button
          type="submit"
          className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-white text-sm font-semibold py-2.5 rounded-lg shadow-2xs transition cursor-pointer"
        >
          إضافة
        </button>
      </form>

      {/* جدول الشروط المضافة */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-2xs">
        <table className="w-full text-center text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="bg-[var(--color-primary)] text-white">
              <th className="py-2.5 px-2 font-semibold border-l border-white/15">إسم الحقل</th>
              <th className="py-2.5 px-2 font-semibold border-l border-white/15">معيار البحث</th>
              <th className="py-2.5 px-2 font-semibold border-l border-white/15">كلمة البحث</th>
              <th className="py-2.5 px-2 font-semibold border-l border-white/15">إلى قيمة</th>
              <th className="py-2.5 px-2 font-semibold border-l border-white/15">من سنة</th>
              <th className="py-2.5 px-2 font-semibold border-l border-white/15">إلى سنة</th>
              <th className="py-2.5 px-2 font-semibold border-l border-white/15">شرط</th>
              <th className="py-2.5 px-2 font-semibold">حذف</th>
            </tr>
          </thead>
          <tbody>
            {!rules.length ? (
              <tr>
                <td colSpan={8} className="py-5 px-3 text-slate-500 bg-white">
                  لايوجد بيانات
                </td>
              </tr>
            ) : (
              rules.map((rule) => (
                <tr key={rule.id} className="border-t border-slate-200 bg-white hover:bg-slate-50 transition">
                  <td className="py-2.5 px-2 border-l border-slate-100">{rule.fieldName}</td>
                  <td className="py-2.5 px-2 border-l border-slate-100">{rule.criterion}</td>
                  <td className="py-2.5 px-2 border-l border-slate-100 font-semibold text-slate-800">
                    {rule.searchWord || '-'}
                  </td>
                  <td className="py-2.5 px-2 border-l border-slate-100">{rule.toValue || '-'}</td>
                  <td className="py-2.5 px-2 border-l border-slate-100">{rule.fromYear || '-'}</td>
                  <td className="py-2.5 px-2 border-l border-slate-100">{rule.toYear || '-'}</td>
                  <td className="py-2.5 px-2 border-l border-slate-100">
                    <span className="inline-block bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-semibold">
                      {rule.operator}
                    </span>
                  </td>
                  <td className="py-2.5 px-2">
                    <button
                      type="button"
                      onClick={() => onRemoveRule(rule.id)}
                      className="text-rose-600 hover:text-rose-800 hover:underline font-semibold text-xs cursor-pointer"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* أزرار تنفيذ البحث المتقدم وتفريغ الشروط */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          disabled={rules.length === 0 || isLoading}
          onClick={onExecuteAdvancedSearch}
          className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition ${
            rules.length > 0 && !isLoading
              ? 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-white cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? 'جاري البحث...' : 'بحث'}
        </button>

        <button
          type="button"
          onClick={onClearRules}
          className="bg-slate-700 hover:bg-slate-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition cursor-pointer"
        >
          تفريغ الحقول
        </button>
      </div>
    </div>
  );
}