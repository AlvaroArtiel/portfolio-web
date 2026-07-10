import {defineField, defineType} from 'sanity'

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Entrada de blog',
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
    defineField({name: 'date', title: 'Fecha', type: 'date'}),
    defineField({
      name: 'tags',
      title: 'Etiquetas',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({name: 'excerpt', title: 'Extracto', type: 'localeText'}),
    defineField({name: 'body', title: 'Contenido', type: 'localeBlock'}),
    defineField({name: 'cover', title: 'Portada', type: 'image', options: {hotspot: true}}),
    defineField({name: 'published', title: 'Publicado', type: 'boolean', initialValue: false}),
  ],
})
