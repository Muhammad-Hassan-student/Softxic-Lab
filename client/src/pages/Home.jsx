import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CallToAction from './CallToAction';
import PostCard from '../components/PostCard';
import { HiArrowNarrowRight, HiSparkles, HiUserGroup, HiChip, HiTrendingUp, HiCalendar, HiClock } from 'react-icons/hi';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalAuthors: 0
  });

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/post/getPosts?limit=9`);
        const data = await res.json();
        console.log(res)
        if (res.ok) {
          const allPosts = data.posts || [];
          setPosts(allPosts);
          
          // Get featured posts (first 3 or posts with featured flag)
          const featured = allPosts.filter(p => p.isFeatured || p.status === 'published').slice(0, 3);
          setFeaturedPosts(featured);
          
          // Get recent posts (next 6)
          const recent = allPosts.slice(3, 9);
          setRecentPosts(recent);
          
          // Set stats
          setStats({
            totalPosts: allPosts.length,
            totalViews: allPosts.reduce((sum, post) => sum + (post.views || 0), 0),
            totalAuthors: new Set(allPosts.map(p => p.authorId)).size
          });
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  // SEO Structured Data
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Softxic Agency Blog",
      "description": "Expert insights on web development, technology, and digital innovation from Softxic Agency founder Hassan and team.",
      "url": window.location.origin,
      "publisher": {
        "@type": "Organization",
        "name": "Softxic Agency",
        "founder": {
          "@type": "Person",
          "name": "Hassan"
        }
      }
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <>
      {/* Hero Section - Luxury Modern Design */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <HiSparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-white/90">Softxic Agency • Since 2024</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Where Ideas Become{' '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Digital Reality
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Welcome to the official blog of <span className="font-semibold text-white">Hassan</span>, founder of Softxic Agency. 
              Explore expert insights on web development, cutting-edge technology, and digital innovation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/search"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Explore Articles
                <HiArrowNarrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 border border-white/20"
              >
                Meet Hassan
              </Link>
            </div>
            
            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 pt-8 border-t border-white/10">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">{stats.totalPosts}+</div>
                <div className="text-sm text-gray-400 mt-1">Articles Published</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">{stats.totalViews.toLocaleString()}+</div>
                <div className="text-sm text-gray-400 mt-1">Total Views</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">{stats.totalAuthors}+</div>
                <div className="text-sm text-gray-400 mt-1">Expert Contributors</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Curved Bottom Edge */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-12 md:h-20">
            <path d="M0,0 C300,100 900,100 1200,0 L1200,120 L0,120 Z" fill="#ffffff" className="dark:fill-gray-900 fill-white"></path>
          </svg>
        </div>
      </section>

      {/* Featured Posts Section */}
      {featuredPosts.length > 0 && (
        <section className="bg-white dark:bg-gray-900 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 rounded-full px-4 py-1.5 mb-4">
                <HiTrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Featured Stories</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Editor's Picks
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Handpicked articles from Hassan and the Softxic team
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <div key={post._id} className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
                  <PostCard post={post} featured={index === 0} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action - Softxic Agency */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Digital Presence?
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
              Let Softxic Agency help you build cutting-edge web solutions that drive results
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Start Your Project
              <HiArrowNarrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      {recentPosts.length > 0 && (
        <section className="bg-gray-50 dark:bg-gray-900/50 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
              <div>
                <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 rounded-full px-4 py-1.5 mb-4">
                  <HiCalendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Latest Updates</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  Recent Articles
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Stay updated with the latest in technology and development
                </p>
              </div>
              <Link
                to="/search"
                className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold hover:gap-3 transition-all mt-4 sm:mt-0"
              >
                View All Posts
                <HiArrowNarrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentPosts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Topics Section - Technology Categories */}
      <section className="bg-white dark:bg-gray-900 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Explore by Topic
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Dive deep into your areas of interest
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Web Development", icon: HiChip, color: "from-blue-500 to-cyan-500", count: 24 },
              { name: "UI/UX Design", icon: HiSparkles, color: "from-purple-500 to-pink-500", count: 18 },
              { name: "Technology", icon: HiChip, color: "from-green-500 to-emerald-500", count: 32 },
              { name: "Digital Agency", icon: HiUserGroup, color: "from-orange-500 to-red-500", count: 15 }
            ].map((topic) => (
              <Link
                key={topic.name}
                to={`/search?category=${topic.name.toLowerCase()}`}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 text-center transition-all duration-300 hover:scale-105"
                style={{ backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))`, backgroundColor: '#1a1a1a' }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${topic.color} opacity-90`}></div>
                <div className="relative z-10">
                  <topic.icon className="w-8 h-8 text-white mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-1">{topic.name}</h3>
                  <p className="text-sm text-white/80">{topic.count} Articles</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Never Miss an Update
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Join 5,000+ subscribers receiving weekly insights from Hassan and Softxic Agency
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Subscribe Now
            </button>
          </form>
          
          <p className="text-sm text-gray-400 mt-4">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </>
  );
}