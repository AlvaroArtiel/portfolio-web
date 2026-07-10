import {defineField, defineType} from 'sanity'

const bodyOf = [
  {type: 'block'},
  {
    type: 'image',
    fields: [
      {
        name: 'layout',
        title: 'Diseño',
        type: 'string',
        options: {
          list: [
            {title: 'Completo', value: 'full'},
            {title: 'Doble', value: 'double'},
            {title: 'Cuadrícula', value: 'grid'},
          ],
        },
      },
    ],
  },
  {
    type: 'object',
    name: 'youtube',
    title: 'YouTube',
    fields: [{name: 'url', title: 'URL', type: 'url'}],
  },
]

export const project = defineType({
  name: 'project',
  title: 'Proyecto',
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
      name: 'category',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          {title: 'Propio', value: 'propio'},
          {title: 'Cliente', value: 'cliente'},
          {title: 'Formación', value: 'formacion'},
          {title: 'Personal', value: 'personal'},
        ],
      },
    }),
    defineField({name: 'featured', title: 'Destacado', type: 'boolean'}),
    defineField({name: 'year', title: 'Año', type: 'string'}),
    defineField({name: 'role', title: 'Rol', type: 'localeString'}),
    defineField({
      name: 'stack',
      title: 'Stack',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({name: 'summary', title: 'Resumen', type: 'localeText'}),
    defineField({
      name: 'heroMedia',
      title: 'Media principal',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
      validation: (R) => R.required().min(2).max(3),
    }),
    defineField({
      name: 'cover',
      title: 'Portada (para el deck)',
      type: 'image',
      options: {hotspot: true},
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
    defineField({name: 'externalUrl', title: 'URL externa', type: 'url'}),
    defineField({
      name: 'nextProject',
      title: 'Siguiente proyecto',
      type: 'reference',
      to: [{type: 'project'}],
    }),
    defineField({name: 'visible', title: 'Visible', type: 'boolean', initialValue: true}),
    defineField({name: 'order', title: 'Orden', type: 'number'}),
  ],
})
