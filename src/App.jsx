import { useEffect, useState } from 'react';
import Header from './components/layout/Header';
import HelpModal from './components/help/HelpModal';
import SearchBar from './components/search/SearchBar';
import SearchFilters from './components/search/SearchFilters';
import ResultsList from './components/results/ResultsList';
import GazetteList from './components/results/GazetteList';
import { archiveService } from './services/archiveService';
import { sanitizeSearchInput } from './utils/sanitize';

const INITIAL_FILTERS = {
  category: 'all',
  issueNumber: '',
  year: '',
  searchScope: 'all',
};

export default function App() {
  const [keyword, setKeyword] = useState('');
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(true);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const [results, setResults] = useState([]);
  const [issues, setIssues] = useState([]);
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

    archiveService
      .getGazetteIssues()
      .then((data) => {
        if (!isMounted) return;
        const list = Array.isArray(data) ? data : data?.items || [];
        setIssues(list);
      })
      .catch(() => {
        // يُترك فارغاً لحين توفر الـ API أو عودة السيرفر
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setKeyword('');
    setFilters(INITIAL_FILTERS);
    setError('');
    setResults([]);
    setHasSearched(false);
    setPagination({ page: 1, totalPages: 1, totalCount: 0 });
  };

  const executeSearch = async (targetPage = 1, overrideFilters = filters) => {
    const cleanKeyword = sanitizeSearchInput(keyword);
    const cleanIssueNumber = sanitizeSearchInput(overrideFilters.issueNumber, 30);
    const cleanYear = sanitizeSearchInput(String(overrideFilters.year || ''), 4);

    setIsLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const data = await archiveService.searchFiles({
        q: cleanKeyword,
        category: overrideFilters.category,
        issueNumber: cleanIssueNumber,
        year: cleanYear,
        scope: overrideFilters.searchScope,
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
    const updatedFilters = { ...filters, issueNumber: issueNum };
    setFilters(updatedFilters);
    setIsAdvancedOpen(true);
    executeSearch(1, updatedFilters);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Header onOpenHelp={() => setIsHelpOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* صندوق البحث والفلترة */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6">
          <SearchBar
            keyword={keyword}
            onKeywordChange={(val) => setKeyword(sanitizeSearchInput(val))}
            onSearch={() => executeSearch(1)}
            isAdvancedOpen={isAdvancedOpen}
            onToggleAdvanced={() => setIsAdvancedOpen((prev) => !prev)}
            isLoading={isLoading}
          />

          {isAdvancedOpen && (
            <SearchFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleReset}
            />
          )}
        </section>

        {/* النتائج وقائمة الجريدة الرسمية */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8">
            <ResultsList
              results={results}
              isLoading={isLoading}
              error={error}
              hasSearched={hasSearched}
              pagination={pagination}
              onPageChange={(nextPage) => executeSearch(nextPage)}
            />
          </div>

          <aside className="lg:col-span-4">
            <GazetteList
              issues={issues}
              onSelectIssue={handleSelectIssueFromGazette}
            />
          </aside>
        </div>
      </main>

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}