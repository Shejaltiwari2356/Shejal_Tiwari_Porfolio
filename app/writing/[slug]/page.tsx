import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Hash } from 'lucide-react';
import { client } from '@/sanity/lib/client';
import { PortableText } from '@portabletext/react';
import { PortableTextBlock } from 'sanity';

// --- Types ---
interface Post {
  title: string;
  overview: string;
  publishedAt: string;
  tags: string[];
  body: PortableTextBlock[];
}

// --- Fetch Data ---
async function getPost(slug: string) {
  const query = `*[_type == "post" && slug.current == $slug][0] {
    title,
    overview,
    publishedAt,
    tags,
    body
  }`;
  return client.fetch(query, { slug });
}

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Article not found</h1>
          <Link href="/writings" className="text-blue-600 hover:underline">Back to Writings</Link>
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
    <div className="min-h-screen bg-white text-gray-900">
      
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/writings" className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Writings
          </Link>
          <Link href="/" className="text-sm font-semibold">Shejal Tiwari</Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        
        {/* ARTICLE HEADER */}
        <header className="mb-12">
          <div className="flex flex-wrap gap-4 items-center mb-6 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar size={14} /> {date}
            </span>
            {post.tags && (
              <div className="flex gap-2">
                <span className="text-gray-300">•</span>
                {post.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 text-gray-700">
                    <Hash size={12} /> {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-serif font-medium text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          <p className="text-xl text-gray-500 leading-relaxed font-light">
            {post.overview}
          </p>
        </header>

        <hr className="border-gray-100 mb-12" />

        {/* ARTICLE CONTENT */}
        <article className="prose prose-lg prose-slate max-w-none prose-headings:font-serif prose-headings:font-medium prose-a:text-blue-600 prose-img:rounded-xl">
          <PortableText value={post.body} />
        </article>

      </main>
    </div>
  );
}