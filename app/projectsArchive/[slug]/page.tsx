// app/projectsArchive/[slug]/page.tsx

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, ExternalLink, Github } from 'lucide-react';
import { client } from '@/sanity/lib/client';
import { PortableText } from '@portabletext/react';
import { PortableTextBlock } from 'sanity';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Image URL Builder
const builder = imageUrlBuilder(client);
function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Types
interface Project {
  title: string;
  overview: string;
  category: string;
  tags: string[];
  body: PortableTextBlock[];
  projectUrl?: string;
  githubUrl?: string;
  completedAt?: string;
  image?: {
    asset: { _ref: string };
    alt?: string;
  };
}

interface PortableTextImage {
  asset?: { _ref?: string };
  alt?: string;
  caption?: string;
}

interface PortableTextValue {
  body?: string;
  code?: string;
  href?: string;
  blank?: boolean;
}

// Fetch Data
async function getProject(slug: string) {
  const query = `*[_type == "project" && slug.current == $slug][0] {
    title,
    overview,
    category,
    tags,
    body,
    projectUrl,
    githubUrl,
    completedAt,
    image
  }`;
  return client.fetch(query, { slug });
}

// Custom Portable Text Components
const portableTextComponents = {
  types: {
    image: ({ value }: { value: PortableTextImage }) => {
      if (!value?.asset?._ref) return null;
      return (
        <figure className="my-8 md:my-12">
          <div className="relative w-full aspect-video rounded-sm overflow-hidden bg-gray-100">
            <Image
              src={urlFor(value).width(1200).url()}
              alt={value.alt || 'Project image'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
          {value.caption && (
            <figcaption className="text-sm text-gray-500 text-center mt-3 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    code: ({ value }: { value: PortableTextValue }) => {
      return (
        <pre className="bg-gray-900 text-gray-100 p-6 rounded-sm overflow-x-auto my-6">
          <code className="text-sm font-mono">{value.code}</code>
        </pre>
      );
    },
  },
  block: {
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mt-12 mb-4 leading-tight">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mt-10 mb-3 leading-tight">
        {children}
      </h3>
    ),
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4 className="text-lg md:text-xl font-semibold text-gray-900 mt-8 mb-2 leading-tight">
        {children}
      </h4>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6 font-normal">
        {children}
      </p>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-4 border-gray-900 pl-6 my-8 text-gray-700 font-normal">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="list-disc list-outside ml-6 my-6 space-y-2 text-gray-700">
        {children}
      </ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="list-decimal list-outside ml-6 my-6 space-y-2 text-gray-700">
        {children}
      </ol>
    ),
  },
  marks: {
    link: ({ children, value }: { children?: React.ReactNode; value?: PortableTextValue }) => {
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
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold text-gray-900">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic">{children}</em>
    ),
    code: ({ children }: { children?: React.ReactNode }) => (
      <code className="bg-gray-100 text-gray-900 px-1.5 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ),
  },
};

// Metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  return {
    title: `${project?.title || 'Project'} | Shejal Tiwari`,
    description: project?.overview,
  };
}

// Main Component
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project: Project = await getProject(slug);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-normal mb-4">Project not found</h1>
          <Link href="/projectsArchive" className="text-gray-900 hover:text-gray-600 underline">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link 
              href="/projectsArchive" 
              className="group flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Projects
            </Link>
            <Link href="/" className="text-xl font-semibold text-gray-900 hover:text-gray-700 transition-colors">
              Shejal Tiwari
            </Link>
          </div>
        </div>
      </nav>

      {/* PROJECT HEADER */}
      <header className="max-w-4xl mx-auto px-6 pt-12 md:pt-20 pb-8 md:pb-12">
        <div className="mb-6">
          <span className="inline-block px-3 py-1 bg-gray-900 text-white text-xs uppercase tracking-wide rounded-full">
            {project.category}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 mb-6 leading-tight">
          {project.title}
        </h1>

        <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8 font-normal">
          {project.overview}
        </p>

        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {/* Added type definition for tag string */}
            {project.tags.map((tag: string) => (
              <span 
                key={tag} 
                className="px-3 py-1.5 bg-gray-100 border border-gray-200 text-gray-700 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          {project.projectUrl && (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-700 text-white rounded-md text-sm transition-all"
            >
              <ExternalLink size={16} />
              View Project
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:border-gray-900 text-gray-700 hover:text-gray-900 rounded-md text-sm transition-all"
            >
              <Github size={16} />
              View Code
            </a>
          )}
        </div>
      </header>

      {/* HERO IMAGE */}
      {project.image && (
        <div className="max-w-5xl mx-auto px-6 mb-12 md:mb-16">
          {/* Changed aspect-video to aspect-16/10 for Tailwind best practices */}
          <div className="relative w-full aspect-16/10 rounded-sm overflow-hidden bg-gray-100">
            <Image
              src={urlFor(project.image).width(1200).url()}
              alt={project.image.alt || project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
              priority
            />
          </div>
        </div>
      )}

      {/* PROJECT CONTENT */}
      <main className="max-w-3xl mx-auto px-6 pb-20">
        <article className="prose-custom">
          <PortableText 
            value={project.body} 
            components={portableTextComponents}
          />
        </article>

        <div className="mt-16 pt-12 border-t border-gray-200">
          {project.tags && project.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {/* Added type definition for tag string */}
                {project.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-gray-100 border border-gray-200 text-gray-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gray-50 border border-gray-200 rounded-sm p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-serif font-normal text-gray-900 mb-3">
              Interested in this project?
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Check out more of my work or get in touch to discuss potential collaborations.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link 
                href="/projectsArchive"
                className="px-6 py-3 bg-gray-900 hover:bg-gray-700 text-white rounded-md text-center transition-all"
              >
                View More Projects
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

      <footer className="border-t border-gray-200 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-900 font-semibold mb-2">Shejal Tiwari</p>
              <p className="text-gray-600 text-sm">
                © {new Date().getFullYear()} · Built with Next.js & Sanity
              </p>
            </div>
            <Link 
              href="/projectsArchive"
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Back to all projects
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}