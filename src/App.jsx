import { useEffect, useState } from 'react';
import Header from './components/layout/Header';
import HelpModal from './components/help/HelpModal';
import SearchBar from './components/search/SearchBar';
import SearchFilters from './components/search/SearchFilters';
import ResultsList from './components/results/ResultsList';
import GazetteList from './components/results/GazetteList';
import { archiveService } from './services/archiveService';
import { sanitizeSearchInput } from './utils/sanitize';

export default function App() {
  const [mode, setMode] = useState('simple'); // 'simple' | 'advanced'
  const [keyword, setKeyword] = useState('');
  const [selectedDatabases, setSelectedDatabases] = useState([]);
  const [advancedRules, setAdvancedRules] = useState([]);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const [results, setResults] = useState([]);
  const [issues, setIssues] = useState([]);
  const [isIssuesLoading, setIsIssuesLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalCount: 0,
  });

  useEffect(() => {
    let isMounted = true;
    setIsIssuesLoading(true);

    archiveService
      .getGazetteIssues()
      .then((data) => {
        if (!isMounted) return;
        const list = Array.isArray(data) ? data : data?.items || [];
        setIssues(list);
      })
      .catch(() => {
        // يُترك فارغاً لحين توفر الـ API أو عودة السيرفر
      })
      .finally(() => {
        if (isMounted) setIsIssuesLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleDatabase = (dbId) => {
    setSelectedDatabases((prev) =>
      prev.includes(dbId) ? prev.filter((item) => item !== dbId) : [...prev, dbId]
    );
  };

  const handleResetSimple = () => {
    setKeyword('');
    setSelectedDatabases([]);
    setError('');
    setResults([]);
    setHasSearched(false);
    setPagination({ page: 1, totalPages: 1, totalCount: 0 });
  };

  const handleAddRule = (newRule) => {
    setAdvancedRules((prev) => [...prev, newRule]);
  };

  const handleRemoveRule = (ruleId) => {
    setAdvancedRules((prev) => prev.filter((rule) => rule.id !== ruleId));
  };

  const handleClearRules = () => {
    setAdvancedRules([]);
    setError('');
    setResults([]);
    setHasSearched(false);
    setPagination({ page: 1, totalPages: 1, totalCount: 0 });
  };

  const executeSimpleSearch = async (targetPage = 1, overrideDbs = selectedDatabases) => {
    const cleanKeyword = sanitizeSearchInput(keyword);

    setIsLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const data = await archiveService.searchFiles({
        q: cleanKeyword,
        databases: overrideDbs.join(','),
        page: targetPage,
      });

      const items = Array.isArray(data) ? data : data?.items || data?.results || [];
      setResults(items);
      setPagination({
        page: data?.page || targetPage,
        totalPages: data?.totalPages || 1,
        totalCount: data?.totalCount ?? items.length,
      });
    } catch (err) {
      setResults([]);
      setError(
        err?.name === 'AbortError'
          ? 'انتهت مهلة الاتصال بالخادم، يرجى المحاولة مرة أخرى.'
          : err?.message || 'حدث خطأ أثناء الاتصال بالخادم.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const executeAdvancedSearch = async (targetPage = 1) => {
    setIsLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const data = await archiveService.searchFiles({
        mode: 'advanced',
        rules: JSON.stringify(advancedRules),
        page: targetPage,
      });

      const items = Array.isArray(data) ? data : data?.items || data?.results || [];
      setResults(items);
      setPagination({
        page: data?.page || targetPage,
        totalPages: data?.totalPages || 1,
        totalCount: data?.totalCount ?? items.length,
      });
    } catch (err) {
      setResults([]);
      setError(
        err?.name === 'AbortError'
          ? 'انتهت مهلة الاتصال بالخادم، يرجى المحاولة مرة أخرى.'
          : err?.message || 'حدث خطأ أثناء الاتصال بالخادم.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectIssueFromGazette = (issue) => {
    const issueNum = String(issue.issueNumber ?? issue.number ?? '');
    if (!issueNum) return;

    setMode('advanced');
    setAdvancedRules([
      {
        id: `${Date.now()}`,
        database: 'عدد الجريدة الرسمية',
        fieldName: 'رقم العدد',
        criterion: 'مطابق تماماً',
        searchWord: sanitizeSearchInput(issueNum, 30),
        toValue: '',
        fromYear: '',
        toYear: '',
        operator: 'و',
        sorted: true,
      },
    ]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Header onOpenHelp={() => setIsHelpOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
    <section className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3.5 mb-5">
            <label
              htmlFor="search-mode-select"
              className="text-xs sm:text-sm font-bold text-slate-700"
            >
              نمط البحث:
            </label>

        <select
  id="search-mode-select"
  value={mode}
  onChange={(e) => setMode(e.target.value)}
  className="rounded-lg border border-slate-300 bg-slate-50 hover:bg-white px-4 py-2 text-xs sm:text-sm font-bold text-[var(--color-primary)] shadow-2xs outline-none focus:border-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/25 focus-visible:border-[var(--color-primary)] transition cursor-pointer"
>
  <option value="simple">بحث بسيط</option>
  <option value="advanced">بحث متقدم</option>
</select>
          </div>

          {mode === 'simple' ? (
            <SearchBar
              keyword={keyword}
              onKeywordChange={(val) => setKeyword(sanitizeSearchInput(val))}
              selectedDatabases={selectedDatabases}
              onToggleDatabase={handleToggleDatabase}
              onSearch={() => executeSimpleSearch(1)}
              onReset={handleResetSimple}
              isLoading={isLoading}
            />
          ) : (
            <SearchFilters
              rules={advancedRules}
              onAddRule={handleAddRule}
              onRemoveRule={handleRemoveRule}
              onClearRules={handleClearRules}
              onExecuteAdvancedSearch={() => executeAdvancedSearch(1)}
              isLoading={isLoading}
            />
          )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8">
            <ResultsList
              results={results}
              isLoading={isLoading}
              error={error}
              hasSearched={hasSearched}
              pagination={pagination}
              onPageChange={(nextPage) =>
                mode === 'simple'
                  ? executeSimpleSearch(nextPage)
                  : executeAdvancedSearch(nextPage)
              }
            />
          </div>

          <aside className="lg:col-span-4">
            <GazetteList
              issues={issues}
              isLoading={isIssuesLoading}
              onSelectIssue={handleSelectIssueFromGazette}
            />
          </aside>
        </div>
      </main>

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}