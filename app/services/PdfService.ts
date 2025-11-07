import puppeteer from 'puppeteer'
import { TemplateService } from './TemplateService.js'
import FormGroup from '#models/form_group'
import { CssJSON } from './CssJsonService.js'

export class PdfService {

  async generatePdf(cvId: string, template: string): Promise<Buffer> {
    const formGroups = await FormGroup.query().where('cv_id', cvId).orderBy('order', 'asc')
    
    const html = await this.generateHtml(formGroups, template)
    
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    
    await page.setContent(html, { waitUntil: 'networkidle0' })
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
    })
    
    await browser.close()
    return Buffer.from(pdf)
  }

  private async generateHtml(formGroups: any[], template: string): Promise<string> {
    const styles = await this.generateStyles(formGroups, template)
    const content = await this.generateContent(formGroups, template)
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <link href="https://fonts.googleapis.com/css2?family=Arimo:wght@400;600;700&family=Roboto:wght@400;500;700&family=Open+Sans:wght@400;600;700&family=Lato:wght@400;700&family=Montserrat:wght@400;600;700&family=Source+Sans+Pro:wght@400;600;700&family=Raleway:wght@400;600;700&family=Poppins:wght@400;600;700&family=Nunito:wght@400;600;700&family=PT+Sans:wght@400;700&family=Inter:wght@400;600;700&family=Playfair+Display:wght@400;700&family=Merriweather:wght@400;700&family=Ubuntu:wght@400;700&family=Crimson+Text:wght@400;700&family=Libre+Baskerville:wght@400;700&family=Oswald:wght@400;700&family=Fira+Sans:wght@400;600;700&family=Work+Sans:wght@400;600;700&family=Noto+Sans:wght@400;700&family=Roboto+Slab:wght@400;700&family=Quicksand:wght@400;600;700&family=Karla:wght@400;700&family=Rubik:wght@400;600;700&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
          <style>${styles}</style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `
  }

  private async generateStyles(formGroups: any[], template: string): Promise<string> {
    let styles = ''
    
    for (const formGroup of formGroups) {
      if (formGroup.style) {
        const cssContent = CssJSON.jsonToCss(formGroup.style)
        console.log(formGroup.id, formGroup.type, cssContent)
        styles += cssContent + '\n'
      } else {
        try {
          const styleJson = await TemplateService.getStyle(template, formGroup.type)
          const cssContent = CssJSON.jsonToCss(styleJson)
          styles += cssContent + '\n'
        } catch (error) {
          // Skip if template style not found
        }
      }
    }
    
    return styles
  }

  private async generateContent(formGroups: any[], template: string): Promise<string> {
    let content = ''
    
    for (const formGroup of formGroups.filter(fg => fg.visible !== false)) {
      const structure = await TemplateService.getStructure(template, formGroup.type)
      const formData = typeof formGroup.data === 'string' ? JSON.parse(formGroup.data) : formGroup.data
      
      content += `<div class="th-${formGroup.id}">`
      if (formGroup.type !== 'profile') {
        content += `<div class="sectionTitle">${formGroup.title}</div>`
      }
      content += this.renderStructure(structure, formData)
      content += '</div>'
    }
    
    return content
  }

  private renderStructure(structure: any, formData: any[]): string {
    if (!structure || !formData) return ''
    
    let html = ''
    
    for (const form of formData.filter(f => f.visible !== false)) {
      html += this.renderNode(structure, form, {})
    }
    
    return html
  }

  private renderNode(node: any, data: any, locals: Record<string, any> = {}): string {
    if (!node) return ''
    
    const className = node.style ? (node.style.startsWith('.') ? node.style.slice(1) : node.style) : ''
    
    switch (node.type) {
      case 'Div':
        let content = ''
        if (node.children) {
          for (const child of node.children) {
            content += this.renderNode(child, data, locals)
          }
        }
        return `<div class="${className}">${content}</div>`
        
      case 'Text':
        const value = this.getValue(node.bind, data, locals) || ''
        return `<span class="${className}">${value}</span>`
        
      case 'Html':
        const htmlValue = this.getValue(node.bind, data, locals) || ''
        return `<div class="${className}">${htmlValue}</div>`
      
      case "Raw":
        return `<span class="${className}">${node.bind}</span>`
      
      case 'Icon':
        const iconValue = this.getValue(node.bind, data, locals) || ''
        return `<span class="${className}">${iconValue}</span>`
        
      case 'Link':
        const href = this.getValue(node.bind, data, locals) || '#'
        const text = node.textbind ? this.getValue(node.textbind, data, locals) : href
        return `<a class="${className}" href="${href}">${text}</a>`
        
      case 'map':
        const arrayData = this.getValue(node.source, data, locals) || []
        if (!Array.isArray(arrayData)) return ''
        
        let mapContent = ''
        const itemName = node.bind || 'item'
        for (const item of arrayData) {
          const newLocals = { ...locals, [itemName]: item }
          mapContent += this.renderNode(node.template, data, newLocals)
        }
        return mapContent
        
      default:
        return ''
    }
  }

  private getValue(path: string, data: any, locals: Record<string, any> = {}): any {
    if (!path) return undefined
    
    const trimmed = path.trim()
    
    // Handle data.* paths
    if (trimmed.startsWith('data.')) {
      return this.getPath(data, trimmed.slice(5))
    }
    
    // Handle local variables (e.g., info.icon, url.title)
    const firstDot = trimmed.indexOf('.')
    if (firstDot !== -1) {
      const first = trimmed.slice(0, firstDot)
      const rest = trimmed.slice(firstDot + 1)
      if (locals.hasOwnProperty(first)) {
        return this.getPath(locals[first], rest)
      }
    } else {
      if (locals.hasOwnProperty(trimmed)) {
        return locals[trimmed]
      }
    }
    
    // Fallback to data
    return this.getPath(data, trimmed)
  }
  
  private getPath(obj: any, path: string): any {
    if (!obj || !path) return undefined
    
    const parts = path.split('.')
    let current = obj
    
    for (const part of parts) {
      if (current == null) return undefined
      current = current[part]
    }
    
    return current
  }
}