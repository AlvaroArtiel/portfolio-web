import {defineField, defineType} from 'sanity'

const bodyOf = [{type: 'block'}, {type: 'image'}]

export const service = defineType({
  name: 'service',
  title: 'Especialidad',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Título', type: 'localeString'}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title.es'},
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'seoTitle',
      title: 'Título SEO (<title>)',
      type: 'localeString',
      description: 'Orientado a la keyword; se itera desde aquí sin tocar código.',
    }),
    defineField({name: 'seoDescription', title: 'Meta description', type: 'localeText'}),
    defineField({
      name: 'intro',
      title: 'Intro (propuesta de valor)',
      type: 'localeText',
      description: 'Párrafo de apertura bajo el H1.',
    }),
    defineField({
      name: 'body',
      title: 'Contenido',
      type: 'object',
      fields: [
        {name: 'es', title: 'Español', type: 'array', of: bodyOf, validation: (R: any) => R.required()},
        {name: 'en', title: 'English', type: 'array', of: bodyOf},
      ],
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'faq',
          title: 'FAQ',
          fields: [
            {name: 'question', title: 'Pregunta', type: 'localeString'},
            {name: 'answer', title: 'Respuesta', type: 'localeText'},
          ],
        },
      ],
    }),
    defineField({
      name: 'relatedProjects',
      title: 'Proyectos relacionados',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'project'}]}],
    }),
    defineField({name: 'order', title: 'Orden', type: 'number'}),
    defineField({name: 'visible', title: 'Visible', type: 'boolean', initialValue: true}),
  ],
})
