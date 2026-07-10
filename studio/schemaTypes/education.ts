import {defineField, defineType} from 'sanity'

export const education = defineType({
  name: 'education',
  title: 'Formación',
  type: 'document',
  fields: [
    defineField({name: 'school', title: 'Centro', type: 'localeString'}),
    defineField({name: 'degree', title: 'Título', type: 'localeString'}),
    defineField({
      name: 'startDate',
      title: 'Fecha inicio (MM/YYYY)',
      type: 'string',
    }),
    defineField({
      name: 'endDate',
      title: 'Fecha fin (MM/YYYY)',
      type: 'string',
    }),
    defineField({name: 'award', title: 'Mención / premio', type: 'localeString'}),
    defineField({name: 'description', title: 'Descripción', type: 'localeText'}),
    defineField({name: 'order', title: 'Orden', type: 'number'}),
    defineField({name: 'visible', title: 'Visible', type: 'boolean', initialValue: true}),
  ],
})
