import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Github, ExternalLink, Calendar, 
  BookOpen, ArrowRight, Target, Lightbulb, 
  Zap, CheckCircle2, Code2
} from 'lucide-react';
import { client } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';

interface RelatedPost {
  _id: string;
  title: string;
  slug: string;
  overview?: string;
  publishedAt?: string;
}

interface Project {
  _id: string;
  title: string;
  slug: string;
  overview?: string;
  category?: string;
  tags?: string[];
  githubLink?: string;
  demoLink?: string;
  _createdAt: string;
  problem?: string;
  solution?: string;
  features?: string[];
  technicalHighlights?: string[];
  images?: { asset: any; caption?: string }[];
  relatedPosts?: RelatedPost[];
}

export default async function ProjectDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Fetch project with related articles
  const project: Project = await client.fetch(
    `*[_type == "project" && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug.current,
      overview,
      category,
      tags,
      githubLink,
      demoLink,
      _createdAt,
      problem,
      solution,
      features,
      technicalHighlights,
      images[] {
        asset,
        caption
      },
      "relatedPosts": *[_type == "post" && references(^._id)] | order(publishedAt desc) {
        _id,
        title,
        "slug": slug.current,
        overview,
        publishedAt
      }
    }`, 
    { slug }
  );

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-gray-900 mb-4">Project not found</h1>
          <Link href="/projectsArchive" className="text-gray-900 hover:text-gray-600 underline">
            Back to Projects Archive
          </Link>
        </div>
      </div>
    );
  }

  const date = new Date(project._createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl font-semibold text-gray-900 hover:text-gray-700 transition-colors">
              Shejal Tiwari
            </Link>
            <div className="hidden md:flex gap-8 items-center">
              <Link href="/projectsArchive" className="text-gray-900 font-medium text-sm">
                Projects
              </Link>
              <Link href="/writings" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                Writings
              </Link>
              <a href="/Shejal_Tiwari_Resume.pdf" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                Resume
              </a>
              <Link href="/contact" className="px-5 py-2 bg-gray-900 hover:bg-gray-700 text-white rounded-md text-sm transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        {/* BACK BUTTON */}
        <div className="mb-8">
          <Link 
            href="/projectsArchive" 
            className="group inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </Link>
        </div>

        {/* HEADER */}
        <header className="mb-12 md:mb-16">
          <div className="flex flex-wrap gap-3 items-center mb-6 text-sm">
            {project.category && (
              <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs uppercase tracking-wide">
                {project.category}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-gray-500">
              <Calendar size={14} /> {date}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-serif font-normal text-gray-900 mb-6 leading-tight">
            {project.title}
          </h1>

          {project.overview && (
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
              {project.overview}
            </p>
          )}

          {/* Links */}
          <div className="flex flex-wrap gap-4">
            {project.githubLink && (
              <a 
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-700 text-white rounded-md text-sm transition-colors"
              >
                <Github className="w-4 h-4" />
                View Code
              </a>
            )}
            {project.demoLink && (
              <a 
                href={project.demoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 rounded-md text-sm transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </a>
            )}
          </div>
        </header>

        {/* TECH STACK */}
        {project.tags && project.tags.length > 0 && (
          <section className="mb-12 md:mb-16 pb-12 md:pb-16 border-b border-gray-200">
            <h2 className="text-sm uppercase tracking-wide text-gray-500 mb-4">Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag: string, i: number) => (
                <span key={i} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* PROBLEM & SOLUTION */}
        {(project.problem || project.solution) && (
          <section className="mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-serif font-normal text-gray-900 mb-8 flex items-center gap-3">
              <Target className="w-6 h-6 text-gray-900" />
              Project Overview
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {project.problem && (
                <div className="bg-gray-50 border border-gray-200 rounded-sm p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <Lightbulb className="w-5 h-5 text-gray-900 shrink-0 mt-1" />
                    <h3 className="font-semibold text-gray-900">The Problem</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{project.problem}</p>
                </div>
              )}
              {project.solution && (
                <div className="bg-gray-50 border border-gray-200 rounded-sm p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <Zap className="w-5 h-5 text-gray-900 shrink-0 mt-1" />
                    <h3 className="font-semibold text-gray-900">The Solution</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{project.solution}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* KEY FEATURES */}
        {project.features && project.features.length > 0 && (
          <section className="mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-serif font-normal text-gray-900 mb-8 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-gray-900" />
              Key Features
            </h2>
            <div className="space-y-4">
              {project.features.map((feature: string, index: number) => (
                <div key={index} className="flex items-start gap-4 p-5 bg-white border border-gray-200 rounded-sm">
                  <div className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center shrink-0 text-sm font-semibold">
                    {index + 1}
                  </div>
                  <p className="text-gray-600 leading-relaxed pt-0.5">{feature}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TECHNICAL HIGHLIGHTS */}
        {project.technicalHighlights && project.technicalHighlights.length > 0 && (
          <section className="mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-serif font-normal text-gray-900 mb-8 flex items-center gap-3">
              <Code2 className="w-6 h-6 text-gray-900" />
              Technical Implementation
            </h2>
            <div className="bg-gray-900 rounded-sm p-6 md:p-8">
              <ul className="space-y-4">
                {project.technicalHighlights.map((highlight: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 text-gray-100">
                    <span className="text-gray-400 shrink-0 mt-1">›</span>
                    <span className="leading-relaxed">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* PROJECT GALLERY */}
        {project.images && project.images.length > 0 && (
          <section className="mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-serif font-normal text-gray-900 mb-8">
              Project Gallery
            </h2>
            <div className="space-y-8">
              {project.images.map((image: any, index: number) => (
                <figure key={index} className="bg-gray-50 border border-gray-200 rounded-sm overflow-hidden">
                  <img 
                    src={urlForImage(image)} 
                    alt={image.caption || `Project screenshot ${index + 1}`}
                    className="w-full h-auto"
                  />
                  {image.caption && (
                    <figcaption className="px-6 py-4 text-sm text-gray-600 border-t border-gray-200">
                      {image.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* RELATED ARTICLES */}
        {project.relatedPosts && project.relatedPosts.length > 0 && (
          <section className="pt-12 md:pt-16 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-8">
              <BookOpen className="w-6 h-6 text-gray-900" />
              <h2 className="text-2xl md:text-3xl font-serif font-normal text-gray-900">
                Related Articles
              </h2>
            </div>
            <p className="text-gray-600 mb-8 leading-relaxed">
              I documented my learnings and deep technical insights from building this project. Read the full articles below.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {project.relatedPosts.map((post: RelatedPost) => (
                <Link 
                  key={post._id} 
                  href={`/writings/${post.slug}`} 
                  className="group block p-6 bg-white border border-gray-200 hover:border-gray-900 rounded-sm transition-all"
                >
                  <h3 className="text-xl font-serif font-normal text-gray-900 mb-3 group-hover:text-gray-600 transition-colors">
                    {post.title}
                  </h3>
                  {post.overview && (
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-2">
                      {post.overview}
                    </p>
                  )}
                  <div className="flex items-center text-sm text-gray-900 group-hover:gap-3 transition-all">
                    Read article
                    <ArrowRight size={16} className="ml-2" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-900 font-semibold mb-2">Shejal Tiwari</p>
              <p className="text-gray-600 text-sm">
                © {new Date().getFullYear()} · Built with Next.js & Sanity
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}