import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: (rule) => rule.required() }),
    
    defineField({
      name: 'isFeatured',
      title: 'Feature on Homepage?',
      type: 'boolean',
      initialValue: false,
    }),

    defineField({ 
      name: 'overview', 
      title: 'Short Overview', 
      type: 'text', 
      rows: 3,
      validation: (rule) => rule.max(300) 
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'AI & Machine Learning', value: 'AI/ML' },
          { title: 'Full Stack Web', value: 'Web Dev' },
          { title: 'Data Science', value: 'Data Science' },
          { title: 'Computer Vision', value: 'Computer Vision' },
        ],
      },
    }),
    defineField({ name: 'tags', title: 'Tech Stack Tags', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } }),
    defineField({ name: 'githubLink', title: 'GitHub Link', type: 'url' }),
    defineField({ name: 'demoLink', title: 'Demo Link', type: 'url' }),

    defineField({
      name: 'problem',
      title: 'The Problem',
      type: 'text',
      description: 'Describe the problem this project solves.',
    }),
    defineField({
      name: 'solution',
      title: 'The Solution',
      type: 'text',
      description: 'Describe how you solved it.',
    }),
    defineField({
      name: 'features',
      title: 'Key Features',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'technicalHighlights',
      title: 'Technical Highlights',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'images',
      title: 'Project Gallery',
      type: 'array',
      of: [
        { 
          type: 'image',
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            }
          ]
        }
      ],
    }),
  ],
})