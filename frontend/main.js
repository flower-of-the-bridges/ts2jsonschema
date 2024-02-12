import { getEditor } from './monaco'
import * as  css from './style.css'
import axios from 'axios'

const exampleCode = `
export interface User {
    name: string;
    age: number;
    email?: string;
}
`.trim()

const { VITE_BACKEND_URL = 'http://localhost:3000/' } = import.meta.env

const typescriptEditor = getEditor(document.getElementById('typescript'), {
  value: exampleCode,
  language: 'typescript',
})

const jsonSchemaEditor = getEditor(document.getElementById('json'), {
	value: "",
	language: 'json',
	readOnly: true,
})

const convertButton = document.getElementById('convert')

convertButton.addEventListener('click', () => {
	convertButton.disabled = true
	
	axios.post(VITE_BACKEND_URL, { code: typescriptEditor.getValue()}).then(({data}) => {
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

