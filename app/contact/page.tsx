'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Mail, Linkedin, Github, ArrowRight, Send, 
  CheckCircle2, MapPin, Calendar 
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset status after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
      
      // Reset error after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setErrorMessage('');
      }, 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

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
              <Link href="/projectsArchive" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                Projects
              </Link>
              <Link href="/writings" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                Writings
              </Link>
              <a href="/Shejal_Tiwari_Resume.pdf" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                Resume
              </a>
              <Link href="/contact" className="px-5 py-2 bg-gray-900 text-white rounded-md text-sm">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20">
        {/* HEADER */}
        <header className="max-w-3xl mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-normal text-gray-900 mb-6 leading-tight">
            Let's work together
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            I'm always open to discussing new projects, opportunities, or partnerships. 
            Whether you have a question or just want to say hi, feel free to reach out.
          </p>
        </header>

        <div className="grid md:grid-cols-5 gap-12 md:gap-16">
          {/* CONTACT FORM */}
          <div className="md:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900"
                  placeholder="john@example.com"
                />
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-900 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900"
                  placeholder="Project Inquiry"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-900 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none text-gray-900"
                  placeholder="Tell me about your project..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full md:w-auto px-8 py-3 bg-gray-900 hover:bg-gray-700 text-white rounded-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : status === 'success' ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Message Sent!
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Success Message */}
              {status === 'success' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-800">
                    Thank you for reaching out! I'll get back to you as soon as possible.
                  </p>
                </div>
              )}

              {/* Error Message */}
              {status === 'error' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800">
                    {errorMessage || 'Failed to send message. Please try again or email me directly.'}
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* CONTACT INFO SIDEBAR */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl font-serif font-normal text-gray-900 mb-4">
                Direct Contact
              </h2>
              <div className="space-y-4">
                <a 
                  href="mailto:shejaltiwari95@gmail.com"
                  className="flex items-start gap-3 p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md transition-all group"
                >
                  <Mail className="w-5 h-5 text-gray-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email</div>
                    <div className="text-gray-900 group-hover:text-gray-600 break-all">
                      shejaltiwari95@gmail.com
                    </div>
                  </div>
                </a>

                <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-md">
                  <MapPin className="w-5 h-5 text-gray-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Location</div>
                    <div className="text-gray-900">Panvel, Maharashtra, IN</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-md">
                  <Calendar className="w-5 h-5 text-gray-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Availability</div>
                    <div className="text-gray-900">Open to opportunities</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-serif font-normal text-gray-900 mb-4">
                Connect Online
              </h2>
              <div className="space-y-3">
                <a 
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-900 rounded-md transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Linkedin className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">LinkedIn</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
                </a>

                <a 
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-900 rounded-md transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Github className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">GitHub</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
                </a>
              </div>
            </div>

            <div className="p-6 bg-gray-900 rounded-sm text-white">
              <h3 className="font-semibold mb-2">Response Time</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                I typically respond within 24-48 hours. For urgent matters, please mention it in your subject line.
              </p>
            </div>
          </div>
        </div>

        {/* CTA SECTION */}
        <section className="mt-20 pt-12 border-t border-gray-200">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-gray-50 border border-gray-200 rounded-sm">
              <h3 className="text-2xl font-serif font-normal text-gray-900 mb-3">
                Looking for my work?
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Check out my projects and case studies to see what I've been building.
              </p>
              <Link 
                href="/projectsArchive"
                className="inline-flex items-center gap-2 text-gray-900 hover:gap-3 transition-all group"
              >
                View Projects
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="p-8 bg-gray-50 border border-gray-200 rounded-sm">
              <h3 className="text-2xl font-serif font-normal text-gray-900 mb-3">
                Want to learn with me?
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Read my technical articles where I document everything I learn.
              </p>
              <Link 
                href="/writings"
                className="inline-flex items-center gap-2 text-gray-900 hover:gap-3 transition-all group"
              >
                Read Articles
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 py-12 mt-20">
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