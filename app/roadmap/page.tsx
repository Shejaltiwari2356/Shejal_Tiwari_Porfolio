'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, CheckCircle2, Circle, Clock, 
  BookOpen, Code2, Brain, Target, TrendingUp,
  Github, Linkedin, ChevronDown, ChevronUp
} from 'lucide-react';

interface Phase {
  id: string;
  number: number;
  title: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  duration: string;
  focusArea: string;
  description: string;
  skills: string[];
  project: string;
  category: 'internship' | 'advanced';
}

const roadmapPhases: Phase[] = [
  {
    id: 'phase-1',
    number: 1,
    title: 'Foundation & PyTorch Intro',
    status: 'completed',
    duration: 'Month 1 (4 weeks)',
    focusArea: 'Python, Math, PyTorch Basics',
    description: 'Building strong foundations in Python programming, essential mathematics for ML, and introduction to PyTorch.',
    category: 'internship',
    skills: [
      'Python: Pandas, NumPy, OOP, Clean Code',
      'Math for ML: Linear Algebra (Vectors, Matrices), Statistics (Probability, Hypothesis Testing)',
      'Tools: Git/GitHub, Jupyter/Colab',
      'PyTorch: Tensors, AutoGrad, Basic NN concepts'
    ],
    project: 'Linear Regression or simple classification from scratch in Python/NumPy, then re-implement in basic PyTorch.'
  },
  {
    id: 'phase-2',
    number: 2,
    title: 'Machine Learning Core',
    status: 'completed',
    duration: 'Months 2-3 (8 weeks)',
    focusArea: 'Supervised & Unsupervised Learning',
    description: 'Mastering core machine learning algorithms and building end-to-end ML workflows.',
    category: 'internship',
    skills: [
      'Supervised Learning: Linear/Logistic Regression, Decision Trees, Random Forests, SVM',
      'Unsupervised Learning: K-Means, PCA',
      'ML Workflow: Feature Engineering, Model Evaluation (Metrics, Cross-Validation, Hyperparameter Tuning)',
      'Tools: Scikit-learn, MLflow basics'
    ],
    project: 'End-to-end ML model (e.g., housing price prediction or classification), including data cleanup and evaluation, hosted on GitHub.'
  },
  {
    id: 'phase-3',
    number: 3,
    title: 'Deep Learning & PyTorch Mastery',
    status: 'completed',
    duration: 'Months 4-5 (8 weeks)',
    focusArea: 'CNNs, RNNs, Transfer Learning',
    description: 'Deep dive into neural networks, computer vision, and sequential models using PyTorch.',
    category: 'internship',
    skills: [
      'DL Core: CNNs (for Computer Vision), RNNs/LSTMs (for sequences)',
      'PyTorch: Custom Datasets, DataLoaders, Training Loops, Transfer Learning (using pre-trained models like ResNet)',
      'Model Building/Training: Loss Functions, Optimizers, Backpropagation intuition'
    ],
    project: 'Image Classification using a CNN and PyTorch, demonstrating the use of a custom dataset and training loop.'
  },
  {
    id: 'phase-4',
    number: 4,
    title: 'Gen AI/LLM & Deployment Readiness',
    status: 'in-progress',
    duration: 'Month 6 (4 weeks)',
    focusArea: 'Transformers, LLMs, Docker',
    description: 'Learning generative AI, working with large language models, and deploying ML applications.',
    category: 'internship',
    skills: [
      'Gen AI/LLM: Transformers (Architecture intuition), Attention Mechanism, Prompt Engineering',
      'Tools: Hugging Face ecosystem (pre-trained models), Intro to LangChain or LangGraph (simple chain/agent)',
      'Deployment: Docker basics, FastAPI/Flask for model serving'
    ],
    project: 'A basic RAG (Retrieval-Augmented Generation) Chatbot using a pre-trained LLM and LangChain, packaged in a Docker container. [Internship Ready Capstone]'
  },
  {
    id: 'phase-5',
    number: 5,
    title: 'Specialization: NLP & OpenCV Depth',
    status: 'upcoming',
    duration: 'Months 7-8',
    focusArea: 'Advanced NLP & Computer Vision',
    description: 'Advanced specialization in natural language processing and computer vision techniques.',
    category: 'advanced',
    skills: [
      'NLP: Deeper dive into Transformers (BERT, GPT), Sequence-to-Sequence models, Advanced fine-tuning',
      'OpenCV/CV: Image manipulation, Object Detection (YOLO), Segmentation (U-Net)'
    ],
    project: 'Advanced Object Detection or a full-fledged Question Answering LLM system with fine-tuning.'
  },
  {
    id: 'phase-6',
    number: 6,
    title: 'MLOps & CI/CD',
    status: 'upcoming',
    duration: 'Months 9-10',
    focusArea: 'Cloud Deployment & Automation',
    description: 'Production-grade ML systems with automated deployment pipelines and monitoring.',
    category: 'advanced',
    skills: [
      'Model Deployment: Cloud (AWS SageMaker/GCP Vertex AI) - focus on one',
      'CI/CD: Jenkins/GitHub Actions basics for automated testing, packaging, and deployment of ML models',
      'Model Management: MLflow/DVC for experiment and version tracking',
      'Monitoring: Basic model/data drift concepts'
    ],
    project: 'Implement a full MLOps pipeline for your ML model (Phase 2 or 3 project), including CI/CD and deployment to a cloud-based service.'
  },
  {
    id: 'phase-7',
    number: 7,
    title: 'Agentic AI & Advanced LLM Systems',
    status: 'upcoming',
    duration: 'Months 11-12',
    focusArea: 'Autonomous Agents & RAG',
    description: 'Building autonomous AI agents with advanced reasoning and decision-making capabilities.',
    category: 'advanced',
    skills: [
      'Agentic AI: In-depth LangGraph (state management, memory, tool use), Autonomous Agents (ReAct framework)',
      'LLM Deep Dive: Advanced RAG with Vector Databases (Pinecone/Faiss), Model Optimization (Quantization, PEFT/LoRA)'
    ],
    project: 'Build an autonomous, multi-step AI agent (e.g., a simple web-scraping research agent) using LangGraph and a vector database.'
  }
];

const tools = [
  { category: 'Programming', items: 'Python (Pandas, NumPy, Scikit-learn, Matplotlib)' },
  { category: 'Deep Learning', items: 'PyTorch (Primary Focus)' },
  { category: 'Gen AI/LLMs', items: 'Hugging Face, LangChain, LangGraph, Vector Databases' },
  { category: 'Deployment/MLOps', items: 'Docker, FastAPI/Flask, Git, MLflow, CI/CD (GitHub Actions), Cloud (AWS/GCP/Azure)' },
  { category: 'Specialization', items: 'OpenCV, NLTK/SpaCy/Transformers' }
];

export default function RoadmapPage() {
  const [expandedPhase, setExpandedPhase] = useState<string>('phase-4');

  const getStatusIcon = (status: Phase['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-gray-900" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-gray-900" />;
      case 'upcoming':
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const internshipPhases = roadmapPhases.filter(p => p.category === 'internship');
  const advancedPhases = roadmapPhases.filter(p => p.category === 'advanced');

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
              <Link href="/contact" className="px-5 py-2 bg-gray-900 hover:bg-gray-700 text-white rounded-md text-sm transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12 md:py-20">
        {/* BACK BUTTON */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="group inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>

        {/* HEADER */}
        <header className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full mb-6">
            <TrendingUp className="w-4 h-4 text-gray-900" />
            <span className="text-sm text-gray-900">12-Month Learning Journey</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif font-normal text-gray-900 mb-6 leading-tight">
            From Web Dev to AI Engineer: My Complete Roadmap
          </h1>

          <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
            A comprehensive 12-month guide documenting my transition from full-stack development to artificial intelligence. 
            Follow along as I break down complex ML concepts, share learning resources, and build real-world projects.
          </p>

          <div className="p-6 bg-gray-900 rounded-sm text-white mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5" />
              <span className="font-semibold">Primary Goal</span>
            </div>
            <p className="text-lg">Internship Ready by July (End of Month 6)</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-semibold text-gray-900 mb-1">7</div>
              <div className="text-sm text-gray-600">Phases</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-semibold text-gray-900 mb-1">12</div>
              <div className="text-sm text-gray-600">Months</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-semibold text-gray-900 mb-1">15+</div>
              <div className="text-sm text-gray-600">Projects</div>
            </div>
          </div>
        </header>

        {/* INTERNSHIP READY PHASES */}
        <section className="mb-16">
          <h2 className="text-3xl font-serif font-normal text-gray-900 mb-4">
            Internship Ready Track
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Months 1-6 · Foundation to deployment readiness
          </p>

          <div className="space-y-6">
            {internshipPhases.map((phase) => (
              <div 
                key={phase.id}
                className="border border-gray-200 rounded-sm overflow-hidden"
              >
                <button
                  onClick={() => setExpandedPhase(expandedPhase === phase.id ? '' : phase.id)}
                  className="w-full p-6 flex items-start gap-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="shrink-0 mt-1">
                    {getStatusIcon(phase.status)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="text-xs uppercase tracking-wide text-gray-500">
                        Phase {phase.number}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-900 rounded-full text-xs font-medium">
                        {phase.duration}
                      </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-serif font-normal text-gray-900 mb-2">
                      {phase.title}
                    </h3>

                    <p className="text-sm text-gray-500 mb-3">
                      Focus: {phase.focusArea}
                    </p>

                    <p className="text-gray-600 leading-relaxed">
                      {phase.description}
                    </p>
                  </div>

                  <div className="shrink-0 text-gray-400">
                    {expandedPhase === phase.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>

                {expandedPhase === phase.id && (
                  <div className="px-6 pb-6 space-y-6 border-t border-gray-200 bg-gray-50">
                    {/* Skills */}
                    <div className="pt-6">
                      <h4 className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-4">
                        <Brain className="w-5 h-5" />
                        Key Concepts & Skills
                      </h4>
                      <div className="space-y-3">
                        {phase.skills.map((skill, i) => (
                          <div key={i} className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-sm">
                            <CheckCircle2 className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                            <span className="text-gray-700 text-sm leading-relaxed">{skill}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Project */}
                    <div>
                      <h4 className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-4">
                        <Code2 className="w-5 h-5" />
                        Portfolio Project
                      </h4>
                      <div className="p-4 bg-white border-2 border-gray-900 rounded-sm">
                        <p className="text-gray-700 leading-relaxed">{phase.project}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ADVANCED MASTERY PHASES */}
        <section className="mb-16">
          <h2 className="text-3xl font-serif font-normal text-gray-900 mb-4">
            Advanced Mastery Track
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Months 7-12 · Post-internship specialization
          </p>

          <div className="space-y-6">
            {advancedPhases.map((phase) => (
              <div 
                key={phase.id}
                className="border border-gray-200 rounded-sm overflow-hidden"
              >
                <button
                  onClick={() => setExpandedPhase(expandedPhase === phase.id ? '' : phase.id)}
                  className="w-full p-6 flex items-start gap-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="shrink-0 mt-1">
                    {getStatusIcon(phase.status)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="text-xs uppercase tracking-wide text-gray-500">
                        Phase {phase.number}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-900 rounded-full text-xs font-medium">
                        {phase.duration}
                      </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-serif font-normal text-gray-900 mb-2">
                      {phase.title}
                    </h3>

                    <p className="text-sm text-gray-500 mb-3">
                      Focus: {phase.focusArea}
                    </p>

                    <p className="text-gray-600 leading-relaxed">
                      {phase.description}
                    </p>
                  </div>

                  <div className="shrink-0 text-gray-400">
                    {expandedPhase === phase.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>

                {expandedPhase === phase.id && (
                  <div className="px-6 pb-6 space-y-6 border-t border-gray-200 bg-gray-50">
                    {/* Skills */}
                    <div className="pt-6">
                      <h4 className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-4">
                        <Brain className="w-5 h-5" />
                        Key Concepts & Skills
                      </h4>
                      <div className="space-y-3">
                        {phase.skills.map((skill, i) => (
                          <div key={i} className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-sm">
                            <CheckCircle2 className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                            <span className="text-gray-700 text-sm leading-relaxed">{skill}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Project */}
                    <div>
                      <h4 className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-4">
                        <Code2 className="w-5 h-5" />
                        Portfolio Project
                      </h4>
                      <div className="p-4 bg-white border-2 border-gray-900 rounded-sm">
                        <p className="text-gray-700 leading-relaxed">{phase.project}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* TOOLS & TECHNOLOGIES */}
        <section className="mb-16 p-8 bg-gray-900 rounded-sm text-white">
          <h2 className="text-2xl font-serif font-normal mb-6 flex items-center gap-3">
            <BookOpen className="w-6 h-6" />
            Key Tools & Technologies
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {tools.map((tool, i) => (
              <div key={i} className="p-4 bg-white/10 rounded-sm">
                <h3 className="font-semibold mb-2">{tool.category}</h3>
                <p className="text-sm text-gray-300">{tool.items}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="p-8 border border-gray-200 rounded-sm">
          <h3 className="text-2xl font-serif font-normal text-gray-900 mb-4">
            Following a similar path?
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            I document every concept I learn in detailed articles. Check out my writings to learn alongside me and see how I'm implementing these concepts in real projects.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/writings"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white hover:bg-gray-700 rounded-md transition-all"
            >
              Read My Articles
              <BookOpen className="w-4 h-4" />
            </Link>
            <Link 
              href="/projectsArchive"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 border border-gray-300 hover:border-gray-900 rounded-md transition-all"
            >
              View My Projects
              <Code2 className="w-4 h-4" />
            </Link>
          </div>
        </section>
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