import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { filterOptions, sortOptions } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import {
  ArrowUpDownIcon,
  StarIcon,
  PlayCircleIcon,
  ClockIcon,
  FilterIcon,
  XIcon,
  SearchIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  UsersIcon,
  TrophyIcon,
  BookOpenIcon,
  CheckCircleIcon,
  ZapIcon
} from "lucide-react";
import { useContext, useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// Debounce hook for search optimization
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timerRef = useRef();

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [value, delay]);

  return debouncedValue;
}

function createSearchParamsHelper(filterParams, searchQuery = "") {
  const queryParams = [];

  // Add search query if it exists
  if (searchQuery.trim()) {
    queryParams.push(`search=${encodeURIComponent(searchQuery.trim())}`);
  }

  // Add filter parameters
  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  return queryParams.join("&");
}

// Search utility function
function searchCourses(courses, query) {
  if (!query.trim()) return courses;

  const searchTerm = query.toLowerCase().trim();

  return courses.filter(course => {
    // Search in title
    if (course.title?.toLowerCase().includes(searchTerm)) return true;

    // Search in category
    if (course.category?.toLowerCase().includes(searchTerm)) return true;

    // Search in instructor name
    if (course.instructorName?.toLowerCase().includes(searchTerm)) return true;

    // Search in level
    if (course.level?.toLowerCase().includes(searchTerm)) return true;

    // Search in description
    if (course.description?.toLowerCase().includes(searchTerm)) return true;

    return false;
  });
}

function StudentViewCoursesPage() {
  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFilters, setExpandedFilters] = useState({});
  const [isSearching, setIsSearching] = useState(false);
  const {
    studentViewCoursesList,
    setStudentViewCoursesList,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  // Enrollment status state
  const [enrollmentStatus, setEnrollmentStatus] = useState({});
  const [loadingEnrollment, setLoadingEnrollment] = useState({});

  // Use debounced search query to reduce API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // State for filtered courses based on search
  const [filteredCourses, setFilteredCourses] = useState([]);

  // Ref to track if it's the initial load
  const initialLoadRef = useRef(true);

  // Initialize all filters as expanded and read URL parameters
  useEffect(() => {
    const initialExpandedState = {};
    Object.keys(filterOptions).forEach(key => {
      initialExpandedState[key] = true;
    });
    setExpandedFilters(initialExpandedState);

    // Read initial state from URL parameters
    const urlSearchQuery = searchParams.get('search') || '';
    const urlFilters = {};

    // Parse filter parameters from URL
    Object.keys(filterOptions).forEach(key => {
      const paramValue = searchParams.get(key);
      if (paramValue) {
        urlFilters[key] = paramValue.split(',');
      }
    });

    setSearchQuery(urlSearchQuery);
    setFilters(urlFilters);

    // Store initial filters in session storage
    sessionStorage.setItem("filters", JSON.stringify(urlFilters));
  }, []);

  // Update filtered courses when search query or course list changes (client-side filtering)
  useEffect(() => {
    if (studentViewCoursesList) {
      const searchedCourses = searchCourses(studentViewCoursesList, searchQuery);
      setFilteredCourses(searchedCourses);
    }
  }, [searchQuery, studentViewCoursesList]);

  // Check enrollment status for a specific course
  async function checkEnrollmentStatus(courseId) {
    if (!auth?.user?._id) return false;

    setLoadingEnrollment(prev => ({ ...prev, [courseId]: true }));

    try {
      const response = await checkCoursePurchaseInfoService(courseId, auth.user._id);
      setEnrollmentStatus(prev => ({
        ...prev,
        [courseId]: response.success && response.data
      }));
      return response.success && response.data;
    } catch (error) {
      console.error('Error checking enrollment:', error);
      setEnrollmentStatus(prev => ({ ...prev, [courseId]: false }));
      return false;
    } finally {
      setLoadingEnrollment(prev => ({ ...prev, [courseId]: false }));
    }
  }

  // Check enrollment status for all courses when component loads or auth changes
  useEffect(() => {
    if (studentViewCoursesList && auth?.user?._id) {
      studentViewCoursesList.forEach(course => {
        checkEnrollmentStatus(course._id);
      });
    }
  }, [studentViewCoursesList, auth]);

  // Fixed filter handler with proper state updates
  const handleFilterOnChange = useCallback((getSectionId, getCurrentOption) => {
    setFilters(prevFilters => {
      const cpyFilters = { ...prevFilters };
      const currentSectionFilters = cpyFilters[getSectionId] || [];

      const indexOfCurrentOption = currentSectionFilters.indexOf(getCurrentOption.id);

      let newSectionFilters;
      if (indexOfCurrentOption === -1) {
        // Add filter
        newSectionFilters = [...currentSectionFilters, getCurrentOption.id];
      } else {
        // Remove filter
        newSectionFilters = currentSectionFilters.filter(id => id !== getCurrentOption.id);
      }

      // Only include section in filters if it has active filters
      const newFilters = {
        ...cpyFilters,
        [getSectionId]: newSectionFilters.length > 0 ? newSectionFilters : undefined
      };

      // Clean up empty sections
      Object.keys(newFilters).forEach(key => {
        if (!newFilters[key] || newFilters[key].length === 0) {
          delete newFilters[key];
        }
      });

      // Store in session storage
      sessionStorage.setItem("filters", JSON.stringify(newFilters));

      return newFilters;
    });
  }, []);

  // Optimized API call function with error handling
  const fetchAllStudentViewCourses = useCallback(async (filters, sort, searchQuery = "") => {
    try {
      setLoadingState(true);
      setIsSearching(true);

      const queryParams = new URLSearchParams({
        sortBy: sort,
      });

      // Add filter parameters
      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          queryParams.append(key, value.join(','));
        }
      });

      // Add search query to API call if it exists
      if (searchQuery.trim()) {
        queryParams.append('search', searchQuery.trim());
      }

      const response = await fetchStudentViewCourseListService(queryParams);

      if (response?.success) {
        setStudentViewCoursesList(response?.data || []);
      } else {
        console.error('Failed to fetch courses:', response?.message);
        setStudentViewCoursesList([]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setStudentViewCoursesList([]);
    } finally {
      setLoadingState(false);
      setIsSearching(false);
      initialLoadRef.current = false;
    }
  }, [setLoadingState, setStudentViewCoursesList]);

  async function handleCourseNavigate(getCurrentCourseId) {
    const response = await checkCoursePurchaseInfoService(
      getCurrentCourseId,
      auth?.user?._id
    );

    if (response?.success) {
      if (response?.data) {
        navigate(`/course-progress/${getCurrentCourseId}`);
      } else {
        navigate(`/course/details/${getCurrentCourseId}`);
      }
    }
  }

  const clearAllFilters = useCallback(() => {
    setFilters({});
    setSearchQuery("");
    sessionStorage.removeItem("filters");

    // Update URL to remove all parameters
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    // Update URL to remove search parameter
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('search');
    setSearchParams(newSearchParams);
  }, [searchParams, setSearchParams]);

  const handleSearch = useCallback(() => {
    // Update URL with current search and filters
    const queryString = createSearchParamsHelper(filters, searchQuery);
    setSearchParams(new URLSearchParams(queryString));
  }, [filters, searchQuery, setSearchParams]);

  const getActiveFiltersCount = useCallback(() => {
    return Object.values(filters).reduce((count, arr) => count + arr.length, 0);
  }, [filters]);

  const toggleFilterSection = useCallback((sectionId) => {
    setExpandedFilters(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  }, []);

  // Handle search input key press (Enter key)
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Enhanced attractive course card with enrollment status
  const CourseCard = ({ course }) => {
    const isEnrolled = enrollmentStatus[course._id];
    const isLoading = loadingEnrollment[course._id];

    const gradientColors = [
      "from-blue-500 to-purple-600",
      "from-green-500 to-teal-600",
      "from-orange-500 to-red-600",
      "from-purple-500 to-pink-600",
      "from-teal-500 to-blue-600",
      "from-red-500 to-orange-600"
    ];

    const randomGradient = gradientColors[Math.floor(Math.random() * gradientColors.length)];

    return (
      <Card
        onClick={() => handleCourseNavigate(course?._id)}
        className="cursor-pointer group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white rounded-2xl overflow-hidden"
      >
        <CardContent className="p-0 h-full flex flex-col">
          {/* Course Image with Gradient Overlay */}
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 h-48">
            <img
              src={course?.image}
              alt={course?.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x200/3B82F6/FFFFFF?text=Course+Image';
              }}
            />
            <div className={`absolute inset-0 bg-gradient-to-br ${randomGradient} opacity-80 mix-blend-multiply`} />

            {/* Course badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {course?.bestseller && (
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <TrophyIcon className="w-3 h-3" />
                  Bestseller
                </span>
              )}
              {isEnrolled && (
                <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <CheckCircleIcon className="w-3 h-3" />
                  Enrolled
                </span>
              )}
            </div>

            {/* Quick Action Button */}
            <div className="absolute bottom-3 right-3">
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCourseNavigate(course._id);
                }}
                disabled={isLoading}
                className={`px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 ${
                  isEnrolled
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                }`}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : isEnrolled ? (
                  "Continue Learning"
                ) : (
                  "Enroll Now"
                )}
              </Button>
            </div>
          </div>

          {/* Course Content */}
          <div className="p-6 flex-1 flex flex-col">
            <CardTitle className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
              {course?.title}
            </CardTitle>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex items-start gap-2">
              <BookOpenIcon className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              {course?.description || "Learn essential skills with expert guidance"}
            </p>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {course?.instructorName?.charAt(0) || "I"}
                </div>
                <span className="text-sm font-medium text-gray-700">{course?.instructorName}</span>
              </div>

              <div className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 px-2 py-1 rounded-full">
                <StarIcon className="w-3 h-3 text-white fill-current" />
                <span className="text-white text-xs font-bold">{course?.rating || 4.8}</span>
              </div>
            </div>

            {/* Course Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center p-2 bg-blue-50 rounded-lg">
                <PlayCircleIcon className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <span className="text-xs font-semibold text-gray-700">{course?.curriculum?.length || 12}</span>
                <p className="text-[10px] text-gray-500">Lessons</p>
              </div>
              <div className="text-center p-2 bg-green-50 rounded-lg">
                <ClockIcon className="w-4 h-4 text-green-600 mx-auto mb-1" />
                <span className="text-xs font-semibold text-gray-700">{course?.duration || '12h'}</span>
                <p className="text-[10px] text-gray-500">Duration</p>
              </div>
              <div className="text-center p-2 bg-purple-50 rounded-lg">
                <UsersIcon className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                <span className="text-xs font-semibold text-gray-700">{course?.studentsCount || '2.1k'}</span>
                <p className="text-[10px] text-gray-500">Students</p>
              </div>
            </div>

            {/* Price Section - Only show if not enrolled */}
            <div className="mt-auto pt-4 border-t border-gray-100">
              {!isEnrolled ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        ${course?.pricing || 49.99}
                      </span>
                      {course?.originalPrice && course.originalPrice > course.pricing && (
                        <span className="text-sm text-gray-500 line-through">
                          ${course.originalPrice}
                        </span>
                      )}
                    </div>

                    {course?.discount && (
                      <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {Math.round(((course.originalPrice - course.pricing) / course.originalPrice) * 100)}% OFF
                      </span>
                    )}
                  </div>

                  {/* Progress Bar for Popularity */}
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Popularity</span>
                      <span>{course?.popularity || 85}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-green-400 to-blue-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${course?.popularity || 85}%` }}
                      ></div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                  <span className="text-green-700 font-semibold text-sm">You're enrolled in this course</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Update URL when filters or search change
  useEffect(() => {
    const queryString = createSearchParamsHelper(filters, searchQuery);
    setSearchParams(new URLSearchParams(queryString));
  }, [filters, searchQuery, setSearchParams]);

  // Main effect for API calls with debouncing and optimization
  useEffect(() => {
    if (initialLoadRef.current) {
      // Initial load - fetch with URL parameters
      fetchAllStudentViewCourses(filters, sort, searchQuery);
    } else {
      // Subsequent changes - use debounced search
      const timer = setTimeout(() => {
        fetchAllStudentViewCourses(filters, sort, debouncedSearchQuery);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [filters, sort, debouncedSearchQuery, fetchAllStudentViewCourses]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      sessionStorage.removeItem("filters");
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 bg-gradient-to-r from-blue-50 to-indigo-50">
      {/* Enhanced Header Section */}
      <div className="relative bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 border-b border-blue-200/50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl text-center mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">
              Unlock Your Potential
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Discover courses that transform your career. Learn from industry experts and join thousands of successful students.
            </p>

            {/* Enhanced Search Bar with loading indicator */}
            <div className="relative max-w-2xl mx-auto">
              <SearchIcon className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Search by title, category, instructor, or level..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="w-full pl-16 pr-24 py-5 border-0 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 shadow-lg text-lg bg-white/80 backdrop-blur-sm"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-20 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              )}
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className="absolute right-2 top-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg disabled:opacity-50"
              >
                {isSearching ? '...' : 'Search'}
              </Button>
            </div>
            {searchQuery && (
              <div className="mt-4 text-sm text-gray-600">
                Searching in: Title, Category, Instructor, Level, Description
                {debouncedSearchQuery !== searchQuery && (
                  <span className="ml-2 text-blue-500">(Typing...)</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container ml-8 px-4 py-8 ">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <div className={`lg:w-80 transition-all duration-300 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl border-0 shadow-lg sticky top-6 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-gray-900 text-lg">Filters</h2>
                  {(getActiveFiltersCount() > 0 || searchQuery) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-blue-600 hover:text-blue-700 text-sm h-8 font-medium"
                    >
                      Clear all
                    </Button>
                  )}
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  {getActiveFiltersCount() > 0 ? `${getActiveFiltersCount()} active filters` : 'No filters applied'}
                  {searchQuery && ` • Searching: "${searchQuery}"`}
                </div>
              </div>

              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                {Object.keys(filterOptions).map((sectionKey) => (
                  <div key={sectionKey} className="border-b bg-gradient-to-r from-blue-50 to-indigo-50 border-gray-100 last:border-b-0">
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleFilterSection(sectionKey)}
                    >
                      <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                        {sectionKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </h3>
                      {expandedFilters[sectionKey] ? (
                        <ChevronUpIcon className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                      )}
                    </div>

                    {expandedFilters[sectionKey] && (
                      <div className="px-4 pb-4 space-y-2">
                        {filterOptions[sectionKey].map((option) => (
                          <Label
                            key={option.id}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer group"
                          >
                            <Checkbox
                              checked={!!filters[sectionKey]?.includes(option.id)}
                              onCheckedChange={() =>
                                handleFilterOnChange(sectionKey, option)
                              }
                              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 border-gray-300"
                            />
                            <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                              {option.label}
                            </span>
                          </Label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            {/* Controls Bar */}
            <div className="bg-white rounded-2xl border-0 shadow-lg p-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="lg:hidden flex items-center gap-2 border-gray-300 hover:border-gray-400 px-4 py-2 rounded-lg"
                  >
                    <FilterIcon className="w-4 h-4" />
                    Filters
                    {(getActiveFiltersCount() > 0 || searchQuery) && (
                      <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                        {getActiveFiltersCount() + (searchQuery ? 1 : 0)}
                      </span>
                    )}
                  </Button>

                  <div className="text-gray-700">
                    <span className="font-bold text-gray-900 text-lg">
                      {filteredCourses.length}
                    </span>
                    {searchQuery ? ' matching' : ' amazing'} courses found
                    {searchQuery && (
                      <span className="ml-2 text-blue-600 font-medium">
                        for "{searchQuery}"
                      </span>
                    )}
                    {isSearching && (
                      <span className="ml-2 text-gray-500 text-sm">(updating...)</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 font-medium">Sort by:</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 border-gray-300 hover:border-gray-400 px-4 py-2 rounded-lg font-medium"
                      >
                        <ArrowUpDownIcon className="w-4 h-4" />
                        {sortOptions.find(opt => opt.id === sort)?.label || "Sort by"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg border border-gray-200">
                      <DropdownMenuRadioGroup
                        value={sort}
                        onValueChange={(value) => setSort(value)}
                      >
                        {sortOptions.map((sortItem) => (
                          <DropdownMenuRadioItem
                            value={sortItem.id}
                            key={sortItem.id}
                            className="cursor-pointer py-3 px-4 text-sm font-medium hover:bg-blue-50 focus:bg-blue-50"
                          >
                            {sortItem.label}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Enhanced Courses Grid */}
            {loadingState ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
                {[...Array(6)].map((_, index) => (
                  <Card key={index} className="border-0 shadow-lg rounded-2xl overflow-hidden">
                    <CardContent className="p-0">
                      <Skeleton className="w-full h-48 rounded-none" />
                      <div className="p-6 space-y-4">
                        <Skeleton className="h-6 w-full rounded" />
                        <Skeleton className="h-4 w-3/4 rounded" />
                        <Skeleton className="h-4 w-1/2 rounded" />
                        <div className="flex justify-between items-center pt-4">
                          <Skeleton className="h-8 w-24 rounded-full" />
                          <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredCourses && filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
                {filteredCourses.map((courseItem) => (
                  <CourseCard key={courseItem?._id} course={courseItem} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border-0 shadow-lg">
                <div className="max-w-md mx-auto">
                  <SearchIcon className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                  <h2 className="text-2xl font-bold text-gray-600 mb-3">
                    {searchQuery ? 'No courses found' : 'No courses available'}
                  </h2>
                  <p className="text-gray-500 mb-6 text-lg">
                    {searchQuery
                      ? `No courses found for "${searchQuery}". Try adjusting your search terms or filters.`
                      : 'Try adjusting your filters to find more courses'
                    }
                  </p>
                  <div className="flex gap-4 justify-center flex-wrap">
                    {searchQuery && (
                      <Button
                        onClick={clearSearch}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
                      >
                        Clear search
                      </Button>
                    )}
                    <Button
                      onClick={clearAllFilters}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
                    >
                      Clear all filters
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default StudentViewCoursesPage;