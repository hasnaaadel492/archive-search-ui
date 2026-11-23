export default function Header({ onOpenHelp }) {
  return (
    <header className="bg-[var(--color-primary)] text-white shadow-md border-b-4 border-[var(--color-primary-dark)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center font-bold text-lg">
            أ
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold leading-tight">
              أرشيف الجريدة الرسمية والملفات
            </h1>
            <p className="text-xs text-slate-200 hidden sm:block">
              نظام البحث والاستعلام في الوثائق والأعداد الرسمية
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenHelp}
          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium px-3.5 py-2 rounded-lg border border-white/20 transition cursor-pointer"
        >
          <span aria-hidden="true">؟</span>
          <span>مساعدة الباحث</span>
        </button>
      </div>
    </header>
  );
}