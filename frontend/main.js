import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import * as  css from './style.css'
import axios from 'axios'

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new jsonWorker()
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker()
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker()
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker()
    }
    return new editorWorker()
  }
}

const exampleCode = `
export interface User {
    name: string;
    age: number;
    email?: string;
}
`.trim()

const typescriptEditor = monaco.editor.create(document.getElementById('typescript'), {
  value: exampleCode,
  language: 'typescript',
})

const jsonSchemaEditor = monaco.editor.create(document.getElementById('json'), {
	value: "",
	language: 'json',
	readOnly: true,
})

const convertButton = document.getElementById('convert')

convertButton.addEventListener('click', () => {
	convertButton.disabled = true
	
	axios.post('http://localhost:3000/', { code: typescriptEditor.getValue()}).then(({data}) => {
		console.log('received json schema: %o', data)
		jsonSchemaEditor.setValue(JSON.stringify(data, null, 2))
	})
	.catch(err => {
		console.error('received error', err)
		alert(`JSON Schema generation error: ${err?.response?.data}`)
	})
	.finally(() => {
		convertButton.disabled = false
	})
})

