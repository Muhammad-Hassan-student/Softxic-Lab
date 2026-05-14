import React from "react";
import { Link } from "react-router-dom";
import { HiCalendar, HiClock, HiEye, HiArrowNarrowRight, HiBookOpen } from "react-icons/hi";

export default function PostCard({ post, featured = false }) {
  // Calculate reading time
  const readingTime = (content) => {
    const wordsPerMinute = 200;
    const text = content?.replace(/<[^>]*>/g, '') || '';
    const words = text.split(/\s/g).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
      featured ? 'md:col-span-2 lg:col-span-2' : ''
    }`}>
      {/* Image Container with Overlay */}
      <div className="relative overflow-hidden">
        <Link to={`/post/${post.slug}`}>
          <img
            src={post.image || '/default-blog-image.jpg'}
            alt={post.title}
            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        </Link>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Category Badge */}
        {post.category && (
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-full shadow-lg">
              <HiBookOpen className="w-3 h-3" />
              {post.category}
            </span>
          </div>
        )}
        
        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-white text-xs font-semibold rounded-full shadow-lg">
              ⭐ Featured
            </span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-5 flex flex-col gap-3">
        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <HiCalendar className="w-3.5 h-3.5" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <HiClock className="w-3.5 h-3.5" />
            <span>{readingTime(post.content)} min read</span>
          </div>
          {post.views !== undefined && (
            <div className="flex items-center gap-1.5">
              <HiEye className="w-3.5 h-3.5" />
              <span>{post.views.toLocaleString()} views</span>
            </div>
          )}
        </div>
        
        {/* Title */}
        <Link to={`/post/${post.slug}`}>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300">
            {post.title}
          </h3>
        </Link>
        
        {/* Description / Excerpt */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
          {post.description || post.content?.replace(/<[^>]*>/g, '').substring(0, 120) + '...' || 'Click to read this insightful article from Softxic Agency.'}
        </p>
        
        {/* Author & Read More */}
        <div className="flex items-center justify-between pt-3 mt-1 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
              H
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                Hassan
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Softxic Agency
              </span>
            </div>
          </div>
          
          <Link
            to={`/post/${post.slug}`}
            className="inline-flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-semibold text-sm group-hover:gap-2.5 transition-all duration-300"
          >
            Read More
            <HiArrowNarrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </div>
  );
}