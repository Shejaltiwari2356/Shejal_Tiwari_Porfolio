'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, Calendar, Menu, X, Hash } from 'lucide-react';
import { client } from '@/sanity/lib/client';

// --- Interfaces ---
interface Article {
  _id: string;
  title: string;
  slug: string;
  overview: string;
  publishedAt: string;
  tags: string[];
}

export default function WritingsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = `*[_type == "post"] | order(publishedAt desc) {
          _id,
          title,
          "slug": slug.current,
          overview,
          publishedAt,
          tags
        }`;
        
        const data = await client.fetch(query);
        setArticles(data);
        setFilteredArticles(data);
      } catch (error) {
        console.error("Error fetching writings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Search Logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredArticles(articles);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = articles.filter(article => 
        article.title.toLowerCase().includes(query) || 
        article.tags?.some(tag => tag.toLowerCase().includes(query))
      );
      setFilteredArticles(filtered);
    }
  }, [searchQuery, articles]);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl font-semibold hover:text-gray-600 transition-colors">
              Shejal Tiwari
            </Link>

            <div className="hidden md:flex gap-8 items-center">
              <Link href="/projectsArchive" className="text-gray-600 hover:text-gray-900 text-sm">Projects</Link>
              <Link href="/writings" className="text-gray-900 font-medium text-sm">Writings</Link>
              <a href="/Shejal_Tiwari_Resume.pdf" target="_blank" className="text-gray-600 hover:text-gray-900 text-sm">Resume</a>
              <Link href="/contact" className="px-5 py-2 bg-gray-900 hover:bg-gray-700 text-white rounded-md text-sm transition-colors">
                Contact
              </Link>
            </div>

            <button className="md:hidden z-50" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-0 left-0 w-full h-screen bg-white flex flex-col justify-center items-center gap-8 md:hidden">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-serif">Home</Link>
            <Link href="/projectsArchive" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-serif">Projects</Link>
            <Link href="/writings" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold font-serif">Writings</Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-serif">Contact</Link>
          </div>
        )}
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        
        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-serif font-normal mb-6">
            The Learning Log.
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl leading-relaxed mb-8">
            Documentation of my journey through AI, Engineering, and Mathematics. I write to clarify my thinking and share what I've built.
          </p>

          {/* SEARCH BAR */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by title or tag..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 transition-colors"
            />
          </div>
        </div>

        {/* ARTICLES LIST */}
        <div className="border-t border-gray-200">
          {loading ? (
            <div className="py-20 text-center text-gray-400">Loading notes...</div>
          ) : filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <Link 
                key={article._id} 
                href={`/writing/${article.slug}`}
                className="group block py-10 border-b border-gray-200 hover:bg-gray-50/50 transition-colors -mx-4 px-4 rounded-lg"
              >
                <article>
                  <div className="flex flex-col md:flex-row gap-4 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500 min-w-[140px]">
                      <Calendar size={14} />
                      {new Date(article.publishedAt).toLocaleDateString('en-US', { 
                        month: 'short', day: 'numeric', year: 'numeric' 
                      })}
                    </div>
                    
                    {/* Tags */}
                    {article.tags && (
                      <div className="flex flex-wrap gap-2">
                        {article.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            <Hash size={10} /> {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <h2 className="text-2xl font-serif font-medium text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h2>
                  
                  <p className="text-gray-600 leading-relaxed mb-4 max-w-2xl">
                    {article.overview}
                  </p>

                  <div className="flex items-center gap-2 text-sm font-medium text-gray-900 group-hover:gap-3 transition-all">
                    Read Article <ArrowRight size={16} />
                  </div>
                </article>
              </Link>
            ))
          ) : (
            <div className="py-20 text-center">
              <p className="text-gray-500">No matching articles found.</p>
            </div>
          )}
        </div>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center md:text-left">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Shejal Tiwari.</p>
        </div>
      </footer>
    </div>
  );
}