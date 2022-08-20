const { appendFile } = require('node:fs/promises')
const { join } = require('path')

module.exports = async file => {
  if (!file.startsWith('/')) {
    file = join(process.cwd(), file)
  }
  const exports = await import(file)
  const keys = Object.keys(exports)
  const keysDefault = Object.keys(exports.default || {})
  const keysAll = [...new Set([...keys, ...keysDefault])].filter(key => key !== 'default')
  const content = `;0 && (module.exports = {${keysAll.map(key => `${key}`).join(', ')}});
// magic annotation
`
  await appendFile(file, content)
}
