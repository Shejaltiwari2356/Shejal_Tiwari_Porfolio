'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // <--- key import for multi-page routing
import { ArrowRight, Github, Linkedin, BookOpen, TrendingUp, Mail, Menu, X } from 'lucide-react';
import { client } from '@/sanity/lib/client';

// --- Interfaces ---
interface Project {
  _id: string;
  title: string;
  slug: string;
  overview: string;
  tags: string[];
  category: string;
}

interface Article {
  _id: string;
  title: string;
  description: string;
  category: string;
  time: string;
  slug: string;
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State for Sanity Data
  const [projects, setProjects] = useState<Project[]>([]);
  const [writings, setWritings] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    // --- FETCH DATA ---
    const fetchData = async () => {
      try {
        // Only fetch FEATURED projects for the homepage showcase
        const projectsQuery = `*[_type == "project" && isFeatured == true] | order(_createdAt desc)[0..2] {
          _id,
          title,
          "slug": slug.current,
          overview,
          tags,
          category
        }`;
        
        // Only fetch RECENT writings
        const writingsQuery = `*[_type == "post"] | order(_createdAt desc)[0..1] {
          _id,
          title,
          "slug": slug.current,
          "description": overview, 
          "category": categories[0]->title, 
          "time": "5 min read" 
        }`;

        const [pData, wData] = await Promise.all([
          client.fetch(projectsQuery),
          client.fetch(writingsQuery)
        ]);

        if (pData) setProjects(pData);
        if (wData) setWritings(wData);
      } catch (error) {
        console.error("Sanity fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-sm' : 'bg-white'
      } border-b border-gray-200`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="cursor-pointer z-50">
              <Link href="/" className="text-xl font-semibold text-gray-900 hover:text-gray-700 transition-colors">
                Shejal Tiwari
              </Link>
            </div>

            {/* Desktop Navigation - LINKING TO SEPARATE PAGES */}
            <div className="hidden md:flex gap-8 items-center">
              <Link href="/projectsArchive" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                Projects
              </Link>
              <Link href="/writings" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                Writings
              </Link>
              {/* External File Link */}
              <a href="/Shejal_Tiwari_Resume.pdf" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                Resume
              </a>
              <Link href="/contact" className="px-5 py-2 bg-gray-900 hover:bg-gray-700 text-white rounded-md text-sm transition-colors">
                Contact
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden z-50 text-gray-900"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-0 left-0 w-full h-screen bg-white flex flex-col justify-center items-center gap-8 md:hidden">
            <Link href="/projectsArchive" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl text-gray-900 font-serif">
              Projects
            </Link>
            <Link href="/writings" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl text-gray-900 font-serif">
              Writings
            </Link>
            <a href="/Shejal_Tiwari_Resume.pdf" target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl text-gray-900 font-serif">
              Resume
            </a>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl text-gray-900 font-serif">
              Contact
            </Link>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-12 md:pb-20">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full mb-6 md:mb-8">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-xs md:text-sm text-green-700">Open to opportunities</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-serif font-normal text-gray-900 mb-6 leading-tight">
            Building intelligent systems, documenting the journey.
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8 md:mb-10 leading-relaxed font-serif">
            Final-year IT Engineering student at VESIT, specializing in AI/ML. I believe the best way to learn is to teach—so I document everything from data structures to neural networks, creating resources that make complex concepts accessible.
          </p>

          <div className="flex flex-col md:flex-row gap-4 mb-12 md:mb-16">
            <Link href="/writings" className="group px-6 py-3 bg-gray-900 hover:bg-gray-700 text-white rounded-md transition-all flex items-center justify-center gap-2">
              Read My Articles
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="https://www.linkedin.com/in/shejal-tiwari-a0736a256/" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 rounded-md transition-all flex items-center justify-center gap-2">
              <Linkedin className="w-5 h-5" />
              LinkedIn
            </a>
            <a href="https://github.com/Shejaltiwari2356" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 rounded-md transition-all flex items-center justify-center gap-2">
              <Github className="w-5 h-5" />
              GitHub
            </a>
          </div>

          {/* Featured Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 pt-8 border-t border-gray-200">
            <div>
              <div className="text-3xl md:text-4xl font-semibold text-gray-900 mb-1">11</div>
              <div className="text-sm text-gray-600">Technical Articles</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-semibold text-gray-900 mb-1">2</div>
              <div className="text-sm text-gray-600">Projects Documented</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-semibold text-gray-900 mb-1">100%</div>
              <div className="text-sm text-gray-600">Open Source</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CONTENT BANNER */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-gray-900 rounded-sm p-8 md:p-12 text-white">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full mb-6">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">Featured Series</span>
            </div>
            <h3 className="text-2xl md:text-4xl font-serif font-normal mb-4">
              From Web Dev to AI Engineer: My Complete Roadmap
            </h3>
            <p className="text-gray-300 mb-8 text-base md:text-lg leading-relaxed">
              A comprehensive guide documenting my transition from full-stack development to artificial intelligence. Follow along as I break down complex ML concepts, share learning resources, and build real-world projects.
            </p>
            <Link href="/roadmap" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 hover:bg-gray-100 rounded-md transition-all">
              Start Reading
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* WRITINGS PREVIEW */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
          <div>
            <h3 className="text-3xl md:text-4xl font-serif font-normal text-gray-900 mb-2">
              Latest Writings
            </h3>
            <p className="text-base md:text-lg text-gray-600">Insights, tutorials, and deep dives into AI/ML concepts</p>
          </div>
          <Link href="/writings" className="text-gray-900 hover:text-gray-600 flex items-center gap-2 group border-b border-gray-900 w-fit">
            View all
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {loading ? (
             <div className="text-gray-400">Loading articles...</div>
          ) : writings.length > 0 ? (
            writings.map((article: Article) => (
              <Link key={article._id} href={`/writing/${article.slug}`} className="group block">
                <div className="border-b border-gray-200 pb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <span>{article.time || '5 min read'}</span>
                    <span>·</span>
                    <span>{article.category || 'Tech'}</span>
                  </div>
                  <h4 className="text-xl md:text-2xl font-serif font-normal text-gray-900 mb-3 group-hover:text-gray-600 transition-colors">
                    {article.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed mb-4 line-clamp-2">
                    {article.description}
                  </p>
                  <div className="flex items-center gap-2 text-gray-900 text-sm group-hover:gap-3 transition-all">
                    Read more
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-gray-500">No articles found in Sanity.</div>
          )}
        </div>

        {/* Learning Path CTA */}
        <div className="bg-gray-50 border border-gray-200 rounded-sm p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex-shrink-0 w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl md:text-2xl font-serif font-normal text-gray-900 mb-3">
                Follow My Learning Path
              </h4>
              <p className="text-gray-600 mb-6 leading-relaxed">
                I document every concept I learn—from basic algorithms to advanced deep learning architectures. My articles include code examples, visualizations, and real-world applications to help you understand and implement these concepts yourself.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Python', 'Data Structures', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision'].map((tag: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:border-gray-900 transition-colors cursor-pointer">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SELECTED PROJECTS (Homepage Showcase) */}
      <section className="bg-gray-50 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h3 className="text-3xl md:text-4xl font-serif font-normal text-gray-900 mb-2">
              Selected Projects
            </h3>
            <p className="text-base md:text-lg text-gray-600">Real-world applications with detailed case studies</p>
          </div>

          <div className="space-y-8">
            {loading ? (
              <div className="text-gray-400">Loading projects...</div>
            ) : projects.length > 0 ? (
              projects.map((project: Project, index: number) => (
                <Link
                  key={project._id}
                  href={`/projectsArchive/${project.slug}`}
                  className="group block bg-white border border-gray-200 hover:border-gray-900 rounded-sm p-6 md:p-8 transition-all"
                >
                  <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                    <div className="flex-shrink-0">
                      <div className="text-2xl font-serif text-gray-400 group-hover:text-gray-900 transition-colors">
                        {(index + 1).toString().padStart(2, '0')}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
                        {project.category || 'Development'}
                      </div>

                      <h4 className="text-xl md:text-2xl font-serif font-normal text-gray-900 mb-3 group-hover:text-gray-600 transition-colors">
                        {project.title}
                      </h4>

                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {project.overview}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags && project.tags.map((tag: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 text-gray-900 group-hover:gap-3 transition-all">
                        View case study
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
               <div className="text-gray-500">No projects found in Sanity.</div>
            )}
          </div>
        </div>
      </section>

      {/* QUICK CONTACT (Footer CTA) */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="bg-gray-900 rounded-sm p-8 md:p-12 text-center">
          <h3 className="text-3xl md:text-4xl font-serif font-normal text-white mb-4">
            Get in Touch
          </h3>
          <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            I am always open to discussing new opportunities. Feel free to reach out via email.
          </p>
          <div className="flex justify-center">
            <a 
              href="mailto:shejaltiwari95@gmail.com"
              className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white hover:bg-gray-100 text-gray-900 rounded-sm font-medium transition-colors text-base md:text-lg break-all md:break-normal"
            >
              <Mail className="w-5 h-5 shrink-0" />
              shejaltiwari95@gmail.com
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-900 font-semibold mb-2">Shejal Tiwari</p>
              <p className="text-gray-600 text-sm">
                © {new Date().getFullYear()} · Built with Next.js & Sanity
              </p>
            </div>
            <div className="flex gap-4">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center border border-gray-300 hover:border-gray-900 text-gray-600 hover:text-gray-900 rounded-full transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center border border-gray-300 hover:border-gray-900 text-gray-600 hover:text-gray-900 rounded-full transition-all">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}