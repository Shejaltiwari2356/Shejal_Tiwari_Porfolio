import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({ 
      name: 'title', 
      title: 'Title', 
      type: 'string', 
      validation: (rule) => rule.required() 
    }),
    defineField({ 
      name: 'slug', 
      title: 'Slug', 
      type: 'slug', 
      options: { source: 'title', maxLength: 96 }, 
      validation: (rule) => rule.required() 
    }),
    
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
    defineField({ 
      name: 'tags', 
      title: 'Tech Stack Tags', 
      type: 'array', 
      of: [{ type: 'string' }], 
      options: { layout: 'tags' } 
    }),
    defineField({ 
      name: 'githubLink', 
      title: 'GitHub Link', 
      type: 'url' 
    }),
    defineField({ 
      name: 'demoLink', 
      title: 'Demo Link', 
      type: 'url' 
    }),
    defineField({
      name: 'problem',
      title: 'The Problem',
      type: 'text',
      rows: 4,
      description: 'Describe the problem this project solves.',
    }),
    defineField({
      name: 'solution',
      title: 'The Solution',
      type: 'text',
      rows: 4,
      description: 'Describe how you solved it.',
    }),
    defineField({
      name: 'features',
      title: 'Key Features',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List the key features of your project',
    }),
    defineField({
      name: 'technicalHighlights',
      title: 'Technical Highlights',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List technical achievements or interesting implementation details',
    }),
    defineField({
      name: 'images',
      title: 'Project Gallery',
      type: 'array',
      of: [
        { 
          type: 'image',
          options: {
            hotspot: true
          },
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
    defineField({
      name: 'body',
      title: 'Detailed Description (Rich Text)',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' }
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' }
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL'
                  }
                ]
              }
            ]
          }
        },
        {
          type: 'image',
          options: { hotspot: true }
        }
      ],
      description: 'Optional: Add more detailed content with rich text formatting'
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'images.0'
    }
  }
})