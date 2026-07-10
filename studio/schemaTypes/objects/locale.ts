import {defineType} from 'sanity'

const mk = (name: string, type: 'string' | 'text' | 'array') =>
  defineType({
    name,
    type: 'object',
    title: name,
    fields: [
      {
        name: 'es',
        title: 'Español',
        type: type === 'array' ? 'array' : type,
        ...(type === 'array' ? {of: [{type: 'block'}, {type: 'image'}]} : {}),
        validation: (R: any) => R.required(),
      },
      {
        name: 'en',
        title: 'English',
        type: type === 'array' ? 'array' : type,
        ...(type === 'array' ? {of: [{type: 'block'}, {type: 'image'}]} : {}),
      },
    ],
  })

export const localeString = mk('localeString', 'string')
export const localeText = mk('localeText', 'text')
export const localeBlock = mk('localeBlock', 'array')
