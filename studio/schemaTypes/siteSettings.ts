import {defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Ajustes del sitio',
  type: 'document',
  fields: [
    defineField({name: 'heroTitle', title: 'Título hero', type: 'localeString'}),
    defineField({name: 'heroSubtitle', title: 'Subtítulo hero', type: 'localeString'}),
    defineField({name: 'about', title: 'Sobre mí', type: 'localeText'}),
    defineField({name: 'email', title: 'Email', type: 'string'}),
    defineField({
      name: 'socials',
      title: 'Redes sociales',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'social',
          fields: [
            {name: 'label', title: 'Etiqueta', type: 'string'},
            {name: 'url', title: 'URL', type: 'url'},
            {name: 'visible', title: 'Visible', type: 'boolean', initialValue: true},
          ],
        },
      ],
    }),
    defineField({name: 'cvPdf', title: 'CV (PDF)', type: 'file'}),
    defineField({name: 'seoTitle', title: 'Título SEO', type: 'localeString'}),
    defineField({name: 'seoDescription', title: 'Descripción SEO', type: 'localeString'}),
  ],
})
