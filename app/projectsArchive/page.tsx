import React from 'react';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import { ArrowRight, FolderOpen, Calendar, Menu, X } from 'lucide-react';

export default async function ProjectsArchivePage() {
  // Fetch all projects from Sanity
  const projects = await client.fetch(`
    *[_type == "project"] | order(_createdAt desc) {
      _id,
      title,
      "slug": slug.current,
      overview,
      category,
      _createdAt,
      tags
    }
  `);

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

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        {/* HEADER */}
        <header className="mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-normal text-gray-900 mb-4 md:mb-6">
            Projects Archive
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl leading-relaxed">
            A comprehensive collection of my technical work, from AI/ML research to full-stack development. Each project includes detailed case studies and learnings.
          </p>
        </header>

        {/* PROJECTS GRID */}
        {projects.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2">
            {projects.map((project: any) => (
              <Link 
                key={project._id}
                href={`/projectsArchive/${project.slug}`}
                className="group block bg-white border border-gray-200 hover:border-gray-900 rounded-sm p-6 md:p-8 transition-all"
              >
                {/* Category & Date */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    {project.category || 'Development'}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Calendar size={12} />
                    {new Date(project._createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-xl md:text-2xl font-serif font-normal text-gray-900 mb-3 group-hover:text-gray-600 transition-colors">
                  {project.title}
                </h2>

                {/* Overview */}
                <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                  {project.overview}
                </p>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.slice(0, 4).map((tag: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* CTA */}
                <div className="flex items-center gap-2 text-gray-900 text-sm group-hover:gap-3 transition-all">
                  View case study
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-sm border border-gray-200">
            <FolderOpen size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No projects found.</p>
          </div>
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