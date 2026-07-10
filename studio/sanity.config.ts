import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import type {StructureBuilder} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

const orderedList = (S: StructureBuilder, type: string, title: string) =>
  S.listItem()
    .title(title)
    .id(type)
    .child(
      S.documentTypeList(type)
        .title(title)
        .defaultOrdering([{field: 'order', direction: 'asc'}]),
    )

const structure = (S: StructureBuilder) =>
  S.list()
    .title('Contenido')
    .items([
      S.listItem()
        .title('Ajustes del sitio')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      orderedList(S, 'experience', 'Experiencia'),
      orderedList(S, 'education', 'Formación'),
      orderedList(S, 'project', 'Proyectos'),
      orderedList(S, 'personalChapter', 'Personal — capítulos'),
      orderedList(S, 'personalItem', 'Personal — recuerdos'),
      S.divider(),
      S.documentTypeListItem('blogPost').title('Blog'),
    ])

export default defineConfig({
  name: 'default',
  title: 'web-portfolio',

  projectId: '1qxvh1it',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
