import {defineField, defineType} from 'sanity'

export const personalChapter = defineType({
  name: 'personalChapter',
  title: 'Personal — Capítulo',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Título', type: 'localeString'}),
    defineField({name: 'emoji', title: 'Emoji', type: 'string'}),
    defineField({name: 'description', title: 'Descripción', type: 'localeText'}),
    defineField({name: 'order', title: 'Orden', type: 'number'}),
  ],
})
