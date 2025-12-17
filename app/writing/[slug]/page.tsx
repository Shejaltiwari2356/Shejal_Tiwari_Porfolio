import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Clock, Bookmark } from 'lucide-react';
import { client } from '@/sanity/lib/client';
import { PortableText } from '@portabletext/react';
import { PortableTextBlock } from 'sanity';
import imageUrlBuilder from '@sanity/image-url';

// --- Image URL Builder ---
const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

// --- Types ---
interface Post {
  title: string;
  overview: string;
  publishedAt: string;
  tags: string[];
  body: PortableTextBlock[];
  relatedProject?: {
    title: string;
    slug: { current: string };
    category: string;
  };
  readingTime?: string;
}

// --- Fetch Data ---
async function getPost(slug: string) {
  const query = `*[_type == "post" && slug.current == $slug][0] {
    title,
    overview,
    publishedAt,
    tags,
    body,
    relatedProject->{
      title,
      slug,
      category
    },
    "readingTime": "5 min read"
  }`;
  return client.fetch(query, { slug });
}

// --- Custom Portable Text Components ---
const portableTextComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) return null;
      return (
        <figure className="my-8 md:my-12">
          <div className="relative w-full aspect-video md:aspect-[16/10] rounded-sm overflow-hidden bg-gray-100">
            <Image
              src={urlFor(value).width(1200).url()}
              alt={value.alt || 'Article image'}
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
    latex: ({ value }: any) => {
      // LaTeX rendering - you'll need to add a library like react-katex or mathjax
      return (
        <div className="my-6 p-6 bg-gray-50 border border-gray-200 rounded-sm overflow-x-auto">
          <code className="text-sm font-mono text-gray-800">{value.body}</code>
        </div>
      );
    },
    code: ({ value }: any) => {
      return (
        <pre className="bg-gray-900 text-gray-100 p-6 rounded-sm overflow-x-auto my-6">
          <code className="text-sm font-mono">{value.code}</code>
        </pre>
      );
    },
  },
  block: {
    h2: ({ children }: any) => (
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mt-12 mb-4 leading-tight">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mt-10 mb-3 leading-tight">
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-lg md:text-xl font-semibold text-gray-900 mt-8 mb-2 leading-tight">
        {children}
      </h4>
    ),
    normal: ({ children }: any) => (
      <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6 font-normal">
        {children}
      </p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-gray-900 pl-6 my-8 text-gray-700 font-normal">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc list-outside ml-6 my-6 space-y-2 text-gray-700">
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal list-outside ml-6 my-6 space-y-2 text-gray-700">
        {children}
      </ol>
    ),
  },
  marks: {
    link: ({ children, value }: any) => {
      const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined;
      return (
        <a
          href={value.href}
          rel={rel}
          target={value.blank ? '_blank' : undefined}
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

// --- Metadata ---
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  return {
    title: `${post?.title || 'Article'} | Shejal Tiwari`,
    description: post?.overview,
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post: Post = await getPost(params.slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-normal mb-4">Article not found</h1>
          <Link href="/writings" className="text-gray-900 hover:text-gray-600 underline">
            Back to Writings
          </Link>
        </div>
      </div>
    );
  }

  const date = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

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
        {/* Meta Info */}
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

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Overview */}
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8 font-normal">
          {post.overview}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <span 
                key={tag} 
                className="px-3 py-1.5 bg-gray-100 border border-gray-200 text-gray-700 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        
      </header>

      {/* HERO IMAGE */}
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

      {/* ARTICLE CONTENT */}
      <main className="max-w-3xl mx-auto px-6 pb-20">
        <article className="prose-custom">
          <PortableText 
            value={post.body} 
            components={portableTextComponents}
          />
        </article>

        {/* ARTICLE FOOTER */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          {/* Tags Repeat */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
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

          {/* CTA */}
          <div className="bg-gray-50 border border-gray-200 rounded-sm p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-serif font-normal text-gray-900 mb-3">
              Thanks for reading!
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
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
            <div className="text-center md:text-left">
              <p className="text-gray-900 font-semibold mb-2">Shejal Tiwari</p>
              <p className="text-gray-600 text-sm">
                © {new Date().getFullYear()} · Built with Next.js & Sanity
              </p>
            </div>
            <Link 
              href="/writings"
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Back to all articles
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}