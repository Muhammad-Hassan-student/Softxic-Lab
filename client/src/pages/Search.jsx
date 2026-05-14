import { Button, Select, TextInput, Spinner, Badge } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { HiSearch, HiFilter, HiX, HiCalendar, HiSortAscending, HiSortDescending } from 'react-icons/hi'
import PostCard from '../components/PostCard';

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'all'
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Categories for filter
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'reactjs', label: 'React.js' },
    { value: 'nextjs', label: 'Next.js' },
    { value: 'webdev', label: 'Web Development' },
    { value: 'saas', label: 'SaaS' },
    { value: 'ai', label: 'Artificial Intelligence' },
    { value: 'enterprise', label: 'Enterprise' }
  ];

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchFromUrl = urlParams.get('searchTerm') || '';
    const sortFromUrl = urlParams.get('sort') || 'desc';
    const categoryFromUrl = urlParams.get('category') || 'all';
    
    setSidebarData({
      searchTerm: searchFromUrl,
      sort: sortFromUrl,
      category: categoryFromUrl,
    });
    
    setFiltersApplied(!!(searchFromUrl || categoryFromUrl !== 'all'));
    
    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/v1/post/getPosts?${searchQuery}`);
      const data = await res.json();
      
      if (!res.ok) {
        setLoading(false);
        return;
      }
      
      if (res.ok) {
        setPosts(data.posts || []);
        setTotalResults(data.totalCount || data.posts?.length || 0);
        setLoading(false);
        setShowMore(data.posts?.length === 9);
      }
    };
    
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSidebarData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const clearFilters = () => {
    setSidebarData({
      searchTerm: '',
      sort: 'desc',
      category: 'all'
    });
    setFiltersApplied(false);
    navigate('/search');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    
    if (sidebarData.searchTerm) {
      urlParams.set('searchTerm', sidebarData.searchTerm);
    }
    urlParams.set('sort', sidebarData.sort);
    if (sidebarData.category !== 'all') {
      urlParams.set('category', sidebarData.category);
    }
    
    const searchQuery = urlParams.toString();
    navigate(`/search${searchQuery ? `?${searchQuery}` : ''}`);
    setMobileFiltersOpen(false);
  };

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/v1/post/getPosts?${searchQuery}`);
    
    if (!res.ok) return;
    
    const data = await res.json();
    setPosts([...posts, ...(data.posts || [])]);
    setShowMore(data.posts?.length === 9);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (sidebarData.searchTerm) count++;
    if (sidebarData.category !== 'all') count++;
    if (sidebarData.sort !== 'desc') count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Search Articles
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover insights, tutorials, and stories from Softxic Agency
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HiFilter className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <h2 className="font-semibold text-gray-900 dark:text-white">Filters</h2>
                  </div>
                  {getActiveFilterCount() > 0 && (
                    <Badge color="indigo" size="sm">
                      {getActiveFilterCount()} active
                    </Badge>
                  )}
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="p-5 space-y-5">
                {/* Search Term */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Search
                  </label>
                  <TextInput
                    type="text"
                    id="searchTerm"
                    placeholder="Enter keywords..."
                    value={sidebarData.searchTerm}
                    onChange={handleChange}
                    rightIcon={HiSearch}
                    className="w-full"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <Select
                    id="category"
                    value={sidebarData.category}
                    onChange={handleChange}
                    className="w-full"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sort By
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSidebarData(prev => ({ ...prev, sort: 'desc' }))}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                        sidebarData.sort === 'desc'
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                          : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-indigo-300'
                      }`}
                    >
                      <HiSortDescending className="w-4 h-4" />
                      <span className="text-sm">Latest</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSidebarData(prev => ({ ...prev, sort: 'asc' }))}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                        sidebarData.sort === 'asc'
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                          : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-indigo-300'
                      }`}
                    >
                      <HiSortAscending className="w-4 h-4" />
                      <span className="text-sm">Oldest</span>
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <Button
                    type="submit"
                    gradientDuoTone="purpleToPink"
                    className="w-full"
                  >
                    <HiSearch className="w-4 h-4 mr-2" />
                    Apply Filters
                  </Button>
                  
                  {getActiveFilterCount() > 0 && (
                    <Button
                      type="button"
                      color="gray"
                      onClick={clearFilters}
                      className="w-full"
                    >
                      <HiX className="w-4 h-4 mr-2" />
                      Clear All
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Mobile Filters Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-2">
                <HiFilter className="w-5 h-5 text-indigo-600" />
                <span className="font-medium text-gray-700 dark:text-gray-300">Filters</span>
                {getActiveFilterCount() > 0 && (
                  <Badge color="indigo" size="sm">
                    {getActiveFilterCount()}
                  </Badge>
                )}
              </div>
              <span className="text-gray-400">{mobileFiltersOpen ? '▲' : '▼'}</span>
            </button>

            {/* Mobile Filters Panel */}
            {mobileFiltersOpen && (
              <div className="mt-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Search
                    </label>
                    <TextInput
                      type="text"
                      id="searchTerm"
                      placeholder="Enter keywords..."
                      value={sidebarData.searchTerm}
                      onChange={handleChange}
                      rightIcon={HiSearch}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <Select
                      id="category"
                      value={sidebarData.category}
                      onChange={handleChange}
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sort By
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSidebarData(prev => ({ ...prev, sort: 'desc' }))}
                        className={`flex-1 py-2 rounded-lg border ${
                          sidebarData.sort === 'desc'
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                            : 'border-gray-300 text-gray-600'
                        }`}
                      >
                        Latest
                      </button>
                      <button
                        type="button"
                        onClick={() => setSidebarData(prev => ({ ...prev, sort: 'asc' }))}
                        className={`flex-1 py-2 rounded-lg border ${
                          sidebarData.sort === 'asc'
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                            : 'border-gray-300 text-gray-600'
                        }`}
                      >
                        Oldest
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button type="submit" gradientDuoTone="purpleToPink" className="flex-1">
                      Apply
                    </Button>
                    {getActiveFilterCount() > 0 && (
                      <Button type="button" color="gray" onClick={clearFilters} className="flex-1">
                        Clear
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {loading ? 'Searching...' : `Results ${totalResults > 0 ? `(${totalResults})` : ''}`}
                  </h2>
                  {filtersApplied && !loading && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Showing posts matching your criteria
                    </p>
                  )}
                </div>
                
                {/* Active Filters Tags */}
                {getActiveFilterCount() > 0 && !loading && (
                  <div className="flex flex-wrap gap-2">
                    {sidebarData.searchTerm && (
                      <Badge color="indigo" size="sm" className="px-2 py-1">
                        Search: {sidebarData.searchTerm}
                      </Badge>
                    )}
                    {sidebarData.category !== 'all' && (
                      <Badge color="purple" size="sm" className="px-2 py-1">
                        Category: {categories.find(c => c.value === sidebarData.category)?.label}
                      </Badge>
                    )}
                    {sidebarData.sort !== 'desc' && (
                      <Badge color="pink" size="sm" className="px-2 py-1">
                        Oldest first
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Results Grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Spinner size="xl" color="purple" />
                <p className="mt-4 text-gray-500 dark:text-gray-400">Loading articles...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <HiSearch className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No posts found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                  Try adjusting your search or filter criteria to find what you're looking for.
                </p>
                {getActiveFilterCount() > 0 && (
                  <Button onClick={clearFilters} color="gray" className="mt-6">
                    Clear all filters
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {posts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))}
                </div>
                
                {/* Show More */}
                {showMore && (
                  <div className="text-center mt-8">
                    <button
                      onClick={handleShowMore}
                      className="inline-flex items-center gap-2 px-6 py-3 text-indigo-600 dark:text-indigo-400 font-medium hover:gap-3 transition-all duration-300"
                    >
                      Load more articles
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}