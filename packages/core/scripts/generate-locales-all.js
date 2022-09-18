import { join as joinPaths, dirname } from 'path'
import { fileURLToPath } from 'url'
import { readFile, readdir } from 'fs/promises'
import handlebars from 'handlebars'

const thisDir = dirname(fileURLToPath(import.meta.url))
const templatePath = joinPaths(thisDir, '../src/locales-all.ts.tpl')
const localesDir = joinPaths(thisDir, '../src/locales')

export default async function() {
  let templateText = await readFile(templatePath, 'utf8')
  let template = handlebars.compile(templateText)
  let localeCodes = (await readdir(localesDir))
    .filter((filename) => !isFilenameHidden(filename))
    .map((filename) => removeExtension(filename))

  return template({
    localeCodes,
  })
}

/*
TODO: more DRY
*/

function isFilenameHidden(filename) {
  return Boolean(filename.match(/^\./))
}

function removeExtension(path) {
  const match = path.match(/^(.*)\.([^\/]*)$/)
  return match ? match[1] : path
}