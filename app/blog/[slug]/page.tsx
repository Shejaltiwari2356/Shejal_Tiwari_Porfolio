import { client } from "@/sanity/lib/client";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

async function getBlogPost(slug: string) {
  const query = `*[_type == "post" && slug.current == "${slug}"][0]`;
  const data = await client.fetch(query);
  return data;
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    return notFound();
  }

  const PortableTextComponents = {
    types: {
      latex: ({ value }: any) => <Latex>{`$${value.body}$`}</Latex>,
    },
  };

  return (
    <main className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <Link href="/" className="text-sm text-gray-500 hover:text-black mb-8 block transition-colors">
          ← Back to Home
        </Link>

        {/* Removed 'prose-invert' so it uses standard dark text on white background */}
        <article className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-black prose-p:text-gray-700 prose-li:text-gray-700 prose-a:text-blue-600">
          <h1 className="text-4xl font-extrabold mb-4 text-black">{post.title}</h1>
          <p className="text-gray-500 mb-8 text-sm">
            {new Date(post.publishedAt).toLocaleDateString()}
          </p>

          <div className="leading-relaxed">
            <PortableText value={post.body} components={PortableTextComponents} />
          </div>
        </article>
      </div>
    </main>
  );
}