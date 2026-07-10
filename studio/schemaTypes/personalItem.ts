import {defineField, defineType} from 'sanity'

export const personalItem = defineType({
  name: 'personalItem',
  title: 'Personal — Recuerdo',
  type: 'document',
  fields: [
    defineField({
      name: 'kind',
      title: 'Tipo',
      type: 'string',
      options: {
        list: [
          {title: 'Foto', value: 'photo'},
          {title: 'Vídeo', value: 'video'},
        ],
      },
    }),
    defineField({
      name: 'chapter',
      title: 'Capítulo',
      type: 'reference',
      to: [{type: 'personalChapter'}],
    }),
    defineField({
      name: 'image',
      title: 'Imagen',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({name: 'youtubeUrl', title: 'URL de YouTube', type: 'url'}),
    defineField({
      name: 'caption',
      title: 'Anotación manuscrita',
      type: 'localeString',
    }),
    defineField({name: 'date', title: 'Fecha aproximada', type: 'string'}),
    defineField({name: 'visible', title: 'Visible', type: 'boolean', initialValue: true}),
  ],
})
