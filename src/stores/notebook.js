/* ~~/src/stores/notebook.js */

// imports
import { parse } from 'marked'

export const useNotebook = defineStore('notebook', () => {
  let openNotebook = async url =>
    await fetch(url)
      .then(response => response.json())
      .then(json => toPyScript(json))

  let toPyScript = notebook => {
    let scripts = notebook['cells'].map(cell => {
      if (cell.cell_type == 'code') {
        return `\n${cell.source.join('')}\n`
      } else if (cell.cell_type == 'markdown') {
        return parse(cell.source.join(''))
      } else {
        return parse('```\n' + cell.source.join('') + '\n```')
      }
    })
    return scripts.join('\n')
  }

  return { openNotebook, toPyScript }
})
