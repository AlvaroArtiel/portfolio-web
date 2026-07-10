import {defineField, defineType} from 'sanity'

export const experience = defineType({
  name: 'experience',
  title: 'Experiencia',
  type: 'document',
  fields: [
    defineField({name: 'company', title: 'Empresa', type: 'localeString'}),
    defineField({name: 'role', title: 'Rol', type: 'localeString'}),
    defineField({
      name: 'type',
      title: 'Tipo',
      type: 'string',
      options: {
        list: [
          {title: 'Jornada completa', value: 'fulltime'},
          {title: 'Freelance', value: 'freelance'},
          {title: 'Fundador', value: 'founder'},
        ],
      },
    }),
    defineField({
      name: 'startDate',
      title: 'Fecha inicio (MM/YYYY)',
      type: 'string',
    }),
    defineField({
      name: 'endDate',
      title: 'Fecha fin (MM/YYYY, vacío = Actualidad)',
      type: 'string',
    }),
    defineField({name: 'location', title: 'Ubicación', type: 'localeString'}),
    defineField({name: 'modality', title: 'Modalidad', type: 'localeString'}),
    defineField({name: 'summary', title: 'Resumen', type: 'localeText'}),
    defineField({
      name: 'bullets',
      title: 'Puntos destacados',
      type: 'array',
      of: [{type: 'localeString'}],
    }),
    defineField({name: 'logo', title: 'Logo', type: 'image'}),
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
