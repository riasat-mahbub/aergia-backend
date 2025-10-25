import fs from 'fs/promises'
import path from 'path'
import { CssJSON } from './CssJsonService.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export class TemplateService{
    static templatesPath = path.join(__dirname, "..", "templates")

    static async getStructure(templateName:string, componentName:string) {
        const structurePath = path.join(this.templatesPath, templateName, "structure", componentName+".json")
        try{
            const content = await fs.readFile(structurePath, "utf-8")
            return JSON.parse(content);
        }catch(error){
            if (error.code === 'ENOENT') {
                throw new Error(`Component ${componentName} not found in template ${templateName}`)
            }
            throw error
        }

    }

    static async getStyle(templateName:string, componentName:string) {
        const structurePath = path.join(this.templatesPath, templateName, "style", componentName+".css")
        try{
            const content = await fs.readFile(structurePath, "utf-8")
            return CssJSON.cssToJson(content);

        }catch(error){
            if (error.code === 'ENOENT') {
                throw new Error(`Component ${componentName} not found in template ${templateName}`)
            }
            throw error
        }

    }

    
}