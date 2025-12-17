import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'post',
  title: 'Learning Log',
  type: 'document',
  fields: [
    defineField({ 
      name: 'title', 
      title: 'Title', 
      type: 'string', 
      validation: rule => rule.required() 
    }),
    
    defineField({ 
      name: 'slug', 
      title: 'Slug', 
      type: 'slug', 
      options: { source: 'title', maxLength: 96 },
      validation: rule => rule.required() 
    }),

    defineField({ 
      name: 'publishedAt', 
      title: 'Published At', 
      type: 'datetime',
      initialValue: (new Date()).toISOString()
    }),

    // --- 1. The Direct Link (Better than Tags) ---
    defineField({
      name: 'relatedProject',
      title: 'Related Project',
      description: 'Which project is this article about?',
      type: 'reference',
      to: { type: 'project' },
    }),

    // --- 2. Required for Frontend Cards ---
    defineField({
      name: 'overview',
      title: 'Short Overview',
      type: 'text',
      rows: 3,
      description: 'The snippet shown on the homepage cards.',
      validation: rule => rule.max(200)
    }),

    defineField({
      name: 'tags',
      title: 'Tags / Categories',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'e.g. "Reinforcement Learning", "Tutorial"'
    }),

    // --- 3. Rich Text Body ---
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        { type: 'block' }, 
        { type: 'image' },
        { type: 'latex', title: 'Math Block' } // Requires 'sanity-plugin-latex-input'
      ],
    }),
  ],
})