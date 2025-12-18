'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Clock, X, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
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

const builder = imageUrlBuilder(client);
function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

interface Post {
  title: string;
  overview: string;
  publishedAt: string;
  tags: string[];
  body: PortableTextBlock[];
  images?: Array<{
    _key: string;
    asset: { _ref: string };
    caption?: string;
  }>;
  relatedProject?: {
    title: string;
    slug: { current: string };
    category: string;
  };
  readingTime?: string;
}

async function getPost(slug: string) {
  const query = `*[_type == "post" && slug.current == $slug][0] {
    title,
    overview,
    publishedAt,
    tags,
    body,
    images[] { _key, asset, caption },
    relatedProject->{ title, slug, category },
    "readingTime": "5 min read"
  }`;
  return client.fetch(query, { slug });
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Modal for Fullscreen focus
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    getPost(resolvedParams.slug).then((data) => {
      setPost(data);
      setLoading(false);
    });
  }, [resolvedParams.slug]);

  // Open modal with specific image set
  const openModal = (imageUrls: string[], index: number) => {
    setModalImages(imageUrls);
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  // Portable Text Custom Components
  const ptComponents = {
    types: {
      image: ({ value }: any) => {
        const imageUrl = urlFor(value).width(1200).quality(90).url();
        return (
          <figure className="my-8 md:my-12 group cursor-zoom-in" onClick={() => openModal([imageUrl], 0)}>
            <div className="relative w-full bg-gray-50 rounded-sm overflow-hidden" style={{ minHeight: '300px', maxHeight: '600px' }}>
              <Image 
                src={imageUrl} 
                alt={value.alt || "Article Image"} 
                fill 
                className="object-contain" 
              />
            </div>
            {value.caption && (
              <figcaption className="mt-3 text-center text-sm text-gray-500 italic">
                {value.caption}
              </figcaption>
            )}
          </figure>
        );
      },
      latex: ({ value }: any) => (
        <div className="my-6 p-6 bg-gray-50 border border-gray-200 rounded-sm overflow-x-auto">
          <code className="text-sm font-mono text-gray-800">{value.body}</code>
        </div>
      ),
      code: ({ value }: any) => (
        <pre className="bg-gray-900 text-gray-100 p-6 rounded-sm overflow-x-auto my-6">
          <code className="text-sm font-mono">{value.code}</code>
        </pre>
      ),
    },
    block: {
      h2: ({ children }: any) => (
        <h2 className="text-2xl md:text-3xl font-serif font-normal text-gray-900 mt-12 mb-4 leading-tight">
          {children}
        </h2>
      ),
      h3: ({ children }: any) => (
        <h3 className="text-xl md:text-2xl font-serif font-normal text-gray-900 mt-10 mb-3 leading-tight">
          {children}
        </h3>
      ),
      h4: ({ children }: any) => (
        <h4 className="text-lg md:text-xl font-serif font-normal text-gray-900 mt-8 mb-2 leading-tight">
          {children}
        </h4>
      ),
      normal: ({ children }: any) => (
        <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-6 font-serif">
          {children}
        </p>
      ),
      blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 border-gray-900 pl-6 my-8 text-gray-600 font-serif">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }: any) => (
        <ul className="list-disc list-outside ml-6 my-6 space-y-2 text-gray-600 font-serif">
          {children}
        </ul>
      ),
      number: ({ children }: any) => (
        <ol className="list-decimal list-outside ml-6 my-6 space-y-2 text-gray-600 font-serif">
          {children}
        </ol>
      ),
    },
    marks: {
      link: ({ children, value }: any) => {
        const rel = !value?.href?.startsWith('/') ? 'noreferrer noopener' : undefined;
        return (
          <a
            href={value?.href}
            rel={rel}
            target={value?.blank ? '_blank' : undefined}
            className="text-gray-900 underline decoration-gray-300 hover:decoration-gray-900 transition-colors"
          >
            {children}
          </a>
        );
      },
      strong: ({ children }: any) => (
        <strong className="font-semibold text-gray-900">{children}</strong>
      ),
      em: ({ children }: any) => (
        <em className="italic">{children}</em>
      ),
      code: ({ children }: any) => (
        <code className="bg-gray-100 text-gray-900 px-1.5 py-0.5 rounded text-sm font-mono">
          {children}
        </code>
      ),
    },
  };

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center text-gray-500">Loading Article...</div>;
  if (!post) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Article not found</h1>
        <Link href="/writings" className="text-gray-900 hover:text-gray-600 underline">
          Back to Writings
        </Link>
      </div>
    </div>
  );

  const date = new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const galleryUrls = post.images?.map(img => urlFor(img).width(1400).quality(90).url()) || [];

  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link 
              href="/writings" 
              className="group flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Writings
            </Link>
            <Link href="/" className="text-xl font-semibold text-gray-900 hover:text-gray-700 transition-colors">
              Shejal Tiwari
            </Link>
          </div>
        </div>
      </nav>

      {/* ARTICLE HEADER */}
      <header className="max-w-4xl mx-auto px-6 pt-12 md:pt-20 pb-8 md:pb-12">
        <div className="flex flex-wrap gap-3 items-center mb-6 text-sm text-gray-600">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {date}
          </span>
          {post.readingTime && (
            <>
              <span className="text-gray-300">·</span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {post.readingTime}
              </span>
            </>
          )}
          {post.relatedProject && (
            <>
              <span className="text-gray-300">·</span>
              <Link 
                href={`/projectsArchive/${post.relatedProject.slug.current}`}
                className="hover:text-gray-900 transition-colors underline"
              >
                Related to: {post.relatedProject.title}
              </Link>
            </>
          )}
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-normal text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>

        <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8 font-serif">
          {post.overview}
        </p>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag: string) => (
              <span 
                key={tag} 
                className="px-3 py-1.5 bg-gray-100 border border-gray-200 text-gray-700 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* RELATED PROJECT CARD */}
      {post.relatedProject && (
        <div className="max-w-4xl mx-auto px-6 mb-12 md:mb-16">
          <div className="bg-gray-50 border border-gray-200 rounded-sm p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
                  Related Project
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                  {post.relatedProject.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {post.relatedProject.category}
                </p>
                <Link
                  href={`/projectsArchive/${post.relatedProject.slug.current}`}
                  className="inline-flex items-center gap-2 text-sm text-gray-900 hover:text-gray-600 border-b border-gray-900 hover:border-gray-600 transition-colors"
                >
                  View full project
                  <ArrowLeft size={14} className="rotate-180" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOP IMAGE SWAPPER - FIXED DIMENSIONS */}
      {post.images && post.images.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 mb-12 md:mb-16">
          <div className="bg-gray-50 border border-gray-200 rounded-sm p-4 md:p-8">
            <div className="relative pb-12">
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={1}
                navigation={true}
                pagination={{ 
                  clickable: true,
                  el: '.custom-pagination-blog',
                }}
                className="overflow-hidden"
              >
                {post.images.map((img, index) => (
                  <SwiperSlide key={img._key}>
                    <div 
                      className="relative w-full bg-white cursor-zoom-in group" 
                      style={{ minHeight: '400px', maxHeight: '70vh' }}
                      onClick={() => openModal(galleryUrls, index)}
                    >
                      <Image 
                        src={urlFor(img).width(1400).quality(90).url()} 
                        alt={img.caption || "Context Image"} 
                        fill 
                        className="object-contain" 
                      />
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none" />
                    </div>
                    {img.caption && (
                      <p className="text-center text-sm text-gray-600 italic mt-4 font-serif">
                        {img.caption}
                      </p>
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
              
              {/* Custom pagination container */}
              <div className="custom-pagination-blog swiper-pagination mt-6"></div>
              
              <p className="mt-6 text-center text-[10px] text-gray-400 uppercase tracking-widest font-sans font-bold">
                Click to Expand Focus
              </p>
            </div>
          </div>
          
          <style jsx global>{`
            .custom-pagination-blog {
              position: relative !important;
              bottom: auto !important;
              left: 0 !important;
              width: 100% !important;
              display: flex !important;
              justify-content: center !important;
              gap: 8px !important;
            }
            
            .custom-pagination-blog .swiper-pagination-bullet {
              width: 8px !important;
              height: 8px !important;
              background: #d1d5db !important;
              opacity: 1 !important;
              transition: all 0.3s ease !important;
            }
            
            .custom-pagination-blog .swiper-pagination-bullet-active {
              background: #1f2937 !important;
              width: 24px !important;
              border-radius: 4px !important;
            }
          `}</style>
        </section>
      )}

      {/* ARTICLE CONTENT */}
      <main className="max-w-3xl mx-auto px-6 pb-20">
        <article className="prose-custom">
          <PortableText value={post.body} components={ptComponents} />
        </article>

        <div className="mt-16 pt-12 border-t border-gray-200">
          {post.tags && post.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-sans font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <Link
                    key={tag}
                    href={`/writings?tag=${tag}`}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-900 hover:text-white border border-gray-200 hover:border-gray-900 text-gray-700 rounded-full text-sm transition-all"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gray-50 border border-gray-200 rounded-sm p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-serif font-normal text-gray-900 mb-3">
              Thanks for reading!
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed font-serif">
              If you found this article helpful, check out my other writings where I break down complex AI/ML concepts into digestible tutorials.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link 
                href="/writings"
                className="px-6 py-3 bg-gray-900 hover:bg-gray-700 text-white rounded-md text-center transition-all"
              >
                Read More Articles
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 rounded-md text-center transition-all"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left font-sans">
              <p className="text-gray-900 font-semibold mb-2">Shejal Tiwari</p>
              <p className="text-gray-600 text-sm">
                © {new Date().getFullYear()} · Built with Next.js & Sanity
              </p>
            </div>
            <Link 
              href="/writings"
              className="text-sm text-gray-600 hover:text-gray-900 underline font-sans"
            >
              Back to all articles
            </Link>
          </div>
        </div>
      </footer>

      {/* FULLSCREEN FOCUS MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/95 flex flex-col items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
          <button className="absolute top-6 right-6 z-[1010] text-white/70 hover:text-white p-2 transition-colors" onClick={() => setIsModalOpen(false)}>
            <X size={36} />
          </button>
          
          <div className="relative w-full h-full flex items-center justify-center group">
            {modalImages.length > 1 && (
              <>
                <button className="absolute left-0 md:left-4 z-[1010] p-4 text-white/30 hover:text-white transition-all" onClick={(e) => { e.stopPropagation(); setCurrentIndex((currentIndex + modalImages.length - 1) % modalImages.length); }}>
                  <ChevronLeft size={48} />
                </button>
                <button className="absolute right-0 md:right-4 z-[1010] p-4 text-white/30 hover:text-white transition-all" onClick={(e) => { e.stopPropagation(); setCurrentIndex((currentIndex + 1) % modalImages.length); }}>
                  <ChevronRight size={48} />
                </button>
              </>
            )}
            <div className="relative w-full h-full max-w-6xl max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
              <Image 
                src={modalImages[currentIndex]} 
                alt="Fullscreen focus" 
                fill 
                className="object-contain" 
                priority 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}