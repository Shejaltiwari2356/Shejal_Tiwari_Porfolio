'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ExternalLink, Github, CheckCircle2, Lightbulb, Target, Laptop, X, ChevronLeft, ChevronRight, Menu, ArrowRight } from 'lucide-react';
import { client } from '@/sanity/lib/client';
import { PortableText } from '@portabletext/react';
import { PortableTextBlock } from 'sanity';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Swiper for the "Swapper" functionality
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// --- Sanity Image Builder ---
const builder = imageUrlBuilder(client);
function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// --- Interfaces ---
interface Project {
  title: string;
  overview: string;
  category: string;
  tags: string[];
  body?: PortableTextBlock[];
  githubLink?: string;
  demoLink?: string;
  problem?: string;
  solution?: string;
  features?: string[];
  technicalHighlights?: string[];
  images?: Array<{
    _key: string;
    asset: { _ref: string };
    caption?: string;
  }>;
}

interface RelatedArticle {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  time: string;
}

// --- Data Fetching ---
async function getProjectData(slug: string) {
  if (!slug) return null;

  // Query for the Project
  const projectQuery = `*[_type == "project" && slug.current == $slug][0] {
    title, overview, category, tags, body, githubLink, demoLink, 
    problem, solution, features, technicalHighlights,
    images[] { _key, asset, caption }
  }`;

  // Query for Related Articles (matches homepage style)
  const articlesQuery = `*[_type == "post"] | order(_createdAt desc)[0..1] {
    _id,
    title,
    "slug": slug.current,
    "description": overview, 
    "category": categories[0]->title, 
    "time": "5 min read" 
  }`;

  const [project, relatedArticles] = await Promise.all([
    client.fetch(projectQuery, { slug }),
    client.fetch(articlesQuery)
  ]);

  return { project, relatedArticles };
}

export default function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [data, setData] = useState<{ project: Project | null; relatedArticles: RelatedArticle[] }>({
    project: null,
    relatedArticles: [],
  });
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    getProjectData(resolvedParams.slug).then((res) => {
      if (res) setData(res);
      setLoading(false);
    });
  }, [resolvedParams.slug]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center font-serif text-gray-500">Loading case study...</div>;

  const { project, relatedArticles } = data;

  if (!project) return (
    <div className="min-h-screen flex items-center justify-center bg-white font-serif text-gray-900">
      <div className="text-center">
        <h1 className="text-2xl mb-4">Project not found</h1>
        <Link href="/projectsArchive" className="text-gray-900 border-b border-gray-900">Back to Projects</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 font-sans">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl font-semibold text-gray-900 hover:text-gray-700 transition-colors">
              Shejal Tiwari
            </Link>
            <div className="hidden md:flex gap-8 items-center">
              <Link href="/projectsArchive" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Projects</Link>
              <Link href="/writings" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Writings</Link>
              <a href="/Shejal_Tiwari_Resume.pdf" target="_blank" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Resume</a>
              <Link href="/contact" className="px-5 py-2 bg-gray-900 hover:bg-gray-700 text-white rounded-md text-sm transition-colors">Contact</Link>
            </div>
            <button className="md:hidden text-gray-900" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <Link href="/projectsArchive" className="group inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-12 font-sans transition-colors">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Projects
        </Link>

        {/* HERO SECTION */}
        <header className="max-w-4xl mb-16">
          <div className="inline-block px-3 py-1 bg-gray-900 rounded-full mb-6 font-sans">
            <span className="text-[10px] text-white uppercase tracking-widest font-bold px-1">{project.category}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-normal text-gray-900 mb-8 leading-tight">{project.title}</h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-serif mb-10 max-w-3xl">{project.overview}</p>
          <div className="flex flex-wrap gap-4 font-sans">
            {project.githubLink && (
              <a href={project.githubLink} target="_blank" className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-sm transition-all flex items-center gap-2 text-sm font-medium">
                <Github size={18} /> View Source
              </a>
            )}
            {project.demoLink && (
              <a href={project.demoLink} target="_blank" className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 rounded-sm transition-all flex items-center gap-2 text-sm font-medium shadow-sm">
                <ExternalLink size={18} /> Live Demo
              </a>
            )}
          </div>
        </header>

        {/* IMAGE SWAPPER */}
        {project.images && project.images.length > 0 && (
          <section className="mb-20">
            <Swiper modules={[Navigation, Pagination]} spaceBetween={20} slidesPerView={1} navigation={true} pagination={{ clickable: true }} className="rounded-sm border border-gray-200 overflow-hidden">
              {project.images.map((img, index) => (
                <SwiperSlide key={img._key}>
                  <div className="relative aspect-[16/9] cursor-zoom-in group" onClick={() => { setCurrentIndex(index); setIsModalOpen(true); }}>
                    <Image src={urlFor(img).width(1200).url()} alt={project.title} fill className="object-cover" priority={index === 0} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <p className="mt-4 text-center text-[10px] text-gray-400 uppercase tracking-widest font-sans font-bold">Click to Expand Focus</p>
          </section>
        )}

        {/* PROBLEM & SOLUTION */}
        {(project.problem || project.solution) && (
          <section className="grid md:grid-cols-2 gap-12 mb-20 py-12 border-y border-gray-200 font-serif">
            {project.problem && (
              <div>
                <div className="flex items-center gap-2 text-gray-400 mb-6 font-sans">
                  <Target size={18} />
                  <span className="text-[10px] uppercase tracking-widest font-bold">The Problem</span>
                </div>
                <p className="text-gray-900 text-lg leading-relaxed italic font-serif">&ldquo;{project.problem}&rdquo;</p>
              </div>
            )}
            {project.solution && (
              <div>
                <div className="flex items-center gap-2 text-gray-400 mb-6 font-sans">
                  <Lightbulb size={18} />
                  <span className="text-[10px] uppercase tracking-widest font-bold">The Solution</span>
                </div>
                <p className="text-gray-900 text-lg leading-relaxed font-serif">{project.solution}</p>
              </div>
            )}
          </section>
        )}

        {/* FEATURES & HIGHLIGHTS */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          {project.features && (
            <div>
              <h3 className="text-xl font-serif font-normal text-gray-900 mb-6 flex items-center gap-3"><CheckCircle2 size={20} /> Key Features</h3>
              <ul className="space-y-4 font-sans text-sm">
                {project.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-4 text-gray-600 leading-relaxed"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-gray-900 shrink-0" /> {feat}</li>
                ))}
              </ul>
            </div>
          )}
          {project.technicalHighlights && (
            <div>
              <h3 className="text-xl font-serif font-normal text-gray-900 mb-6 flex items-center gap-3"><Laptop size={20} /> Tech Highlights</h3>
              <ul className="space-y-4 font-sans text-sm">
                {project.technicalHighlights.map((high, i) => (
                  <li key={i} className="flex items-start gap-4 text-gray-600 leading-relaxed"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-gray-300 shrink-0" /> {high}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* BODY CONTENT */}
        {project.body && (
          <article className="prose prose-lg max-w-none mb-24 prose-headings:font-serif prose-headings:font-normal prose-p:text-gray-600 prose-p:font-serif">
            <PortableText value={project.body} />
          </article>
        )}

        {/* RELATED WRITINGS (Homepage style implementation) */}
        {relatedArticles.length > 0 && (
          <section className="mt-20 pt-20 border-t border-gray-200">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
              <div>
                <h3 className="text-3xl md:text-4xl font-serif font-normal text-gray-900 mb-2">Related Writings</h3>
                <p className="text-base text-gray-600 font-serif">Explore more insights and deep dives into AI/ML concepts</p>
              </div>
              <Link href="/writings" className="text-gray-900 hover:text-gray-600 flex items-center gap-2 group border-b border-gray-900 w-fit font-sans text-sm">
                View all articles
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
              {relatedArticles.map((article) => (
                <Link key={article._id} href={`/writing/${article.slug}`} className="group block">
                  <div className="border-b border-gray-200 pb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3 font-sans">
                      <span>{article.time}</span>
                      <span>·</span>
                      <span>{article.category}</span>
                    </div>
                    <h4 className="text-xl md:text-2xl font-serif font-normal text-gray-900 mb-3 group-hover:text-gray-600 transition-colors">
                      {article.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed mb-4 line-clamp-2 font-serif text-sm">
                      {article.description}
                    </p>
                    <div className="flex items-center gap-2 text-gray-900 text-sm group-hover:gap-3 transition-all font-sans font-medium">
                      Read more
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="bg-gray-900 rounded-sm p-8 md:p-12 text-center text-white font-serif">
          <h3 className="text-3xl md:text-4xl font-serif font-normal mb-6">Interested in this project?</h3>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-serif">Check out more of my work or get in touch to discuss potential collaborations.</p>
          <div className="flex flex-col md:flex-row justify-center gap-4 font-sans">
            <Link href="/projectsArchive" className="px-8 py-3 bg-white text-gray-900 hover:bg-gray-100 rounded-sm font-medium transition-all text-sm">View More Projects</Link>
            <Link href="/contact" className="px-8 py-3 bg-transparent border border-white/30 hover:border-white text-white rounded-sm font-medium transition-all text-sm">Get in Touch</Link>
          </div>
        </section>
      </main>

      {/* MODAL */}
      {isModalOpen && project.images && (
        <div className="fixed inset-0 z-[1000] bg-black/95 flex flex-col items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
          <button onClick={(e) => { e.stopPropagation(); setIsModalOpen(false); }} className="absolute top-6 right-6 z-[1010] text-white/70 hover:text-white transition-colors"><X size={36} /></button>
          <div className="relative w-full h-full flex items-center justify-center group">
            <button className="absolute left-0 md:left-4 z-[1010] p-4 text-white/30 hover:text-white transition-all" onClick={(e) => { e.stopPropagation(); setCurrentIndex((currentIndex + project.images!.length - 1) % project.images!.length); }}><ChevronLeft size={48} /></button>
            <div className="relative w-full h-full max-w-6xl max-h-[85vh]" onClick={(e) => e.stopPropagation()}><Image src={urlFor(project.images[currentIndex]).width(1800).url()} alt="Fullscreen view" fill className="object-contain" /></div>
            <button className="absolute right-0 md:right-4 z-[1010] p-4 text-white/30 hover:text-white transition-all" onClick={(e) => { e.stopPropagation(); setCurrentIndex((currentIndex + 1) % project.images!.length); }}><ChevronRight size={48} /></button>
          </div>
          {project.images[currentIndex].caption && <p className="mt-4 text-white/80 font-serif italic text-lg z-[1010]" onClick={(e) => e.stopPropagation()}>{project.images[currentIndex].caption}</p>}
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-600 text-sm font-sans">
            <div className="text-center md:text-left">
              <p className="text-gray-900 font-semibold mb-2">Shejal Tiwari</p>
              <p>© {new Date().getFullYear()} · Built with Next.js & Sanity</p>
            </div>
            <Link href="/projectsArchive" className="hover:text-gray-900 underline underline-offset-4">Back to all projects</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}