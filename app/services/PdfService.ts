import puppeteer from 'puppeteer'
import { TemplateService } from './TemplateService.js'
import FormGroup from '#models/form_group'
import { CssJSON } from './CssJsonService.js'

export class PdfService {

  async generatePdf(cvId: string, template: string): Promise<Buffer> {
    const formGroups = await FormGroup.query().where('cv_id', cvId).orderBy('order', 'asc')
    
    const html = await this.generateHtml(formGroups, template)
    
    const browser = await puppeteer.launch({ 
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    })
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
      let styles = `
        /* Tailwind Preflight Reset */
        *, ::before, ::after {
          box-sizing: border-box;
          border-width: 0;
          border-style: solid;
          border-color: currentColor;
        }
        
        html {
          line-height: 1.5;
          -webkit-text-size-adjust: 100%;
          -moz-tab-size: 4;
          tab-size: 4;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
          font-feature-settings: normal;
          font-variation-settings: normal;
        }
        
        body {
          margin: 0;
          line-height: inherit;
          font-family: Arial, Helvetica, sans-serif;
        }
        
        hr {
          height: 0;
          color: inherit;
          border-top-width: 1px;
        }
        
        abbr:where([title]) {
          text-decoration: underline dotted;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-size: inherit;
          font-weight: inherit;
        }
        
        a {
          color: inherit;
          text-decoration: inherit;
        }
        
        b, strong {
          font-weight: bolder;
        }
        
        code, kbd, samp, pre {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 1em;
        }
        
        small {
          font-size: 80%;
        }
        
        sub, sup {
          font-size: 75%;
          line-height: 0;
          position: relative;
          vertical-align: baseline;
        }
        
        sub {
          bottom: -0.25em;
        }
        
        sup {
          top: -0.5em;
        }
        
        table {
          text-indent: 0;
          border-color: inherit;
          border-collapse: collapse;
        }
        
        button, input, optgroup, select, textarea {
          font-family: inherit;
          font-feature-settings: inherit;
          font-variation-settings: inherit;
          font-size: 100%;
          font-weight: inherit;
          line-height: inherit;
          color: inherit;
          margin: 0;
          padding: 0;
        }
        
        button, select {
          text-transform: none;
        }
        
        button, [type='button'], [type='reset'], [type='submit'] {
          -webkit-appearance: button;
          background-color: transparent;
          background-image: none;
        }
        
        :-moz-focusring {
          outline: auto;
        }
        
        :-moz-ui-invalid {
          box-shadow: none;
        }
        
        progress {
          vertical-align: baseline;
        }
        
        ::-webkit-inner-spin-button, ::-webkit-outer-spin-button {
          height: auto;
        }
        
        [type='search'] {
          -webkit-appearance: textfield;
          outline-offset: -2px;
        }
        
        ::-webkit-search-decoration {
          -webkit-appearance: none;
        }
        
        ::-webkit-file-upload-button {
          -webkit-appearance: button;
          font: inherit;
        }
        
        summary {
          display: list-item;
        }
        
        blockquote, dl, dd, h1, h2, h3, h4, h5, h6, hr, figure, p, pre {
          margin: 0;
        }
        
        fieldset {
          margin: 0;
          padding: 0;
        }
        
        legend {
          padding: 0;
        }
        
        ol, ul, menu {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        
        dialog {
          padding: 0;
        }
        
        textarea {
          resize: vertical;
        }
        
        input::placeholder, textarea::placeholder {
          opacity: 1;
          color: #9ca3af;
        }
        
        button, [role="button"] {
          cursor: pointer;
        }
        
        :disabled {
          cursor: default;
        }
        
        img, svg, video, canvas, audio, iframe, embed, object {
          display: block;
          vertical-align: middle;
        }
        
        img, video {
          max-width: 100%;
          height: auto;
        }
        
        [hidden] {
          display: none;
        }
    `
      
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
        content += `<p class="sectionTitle">${formGroup.title}</p>`
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
    if (node.visible === false) return ''
    if (node.if && !this.evaluateCondition(node.if, data, locals)) return ''
    
    const className = node.style ? (node.style.startsWith('.') ? node.style.slice(1) : node.style) : ''
    
    switch (node.type) {
      case 'Div':
        let content = ''
        if (node.children) {
          for (const child of node.children) {
            content += this.renderNode(child, data, locals)
          }
        }
        if (!content.trim()) return '' // Skip empty divs
        return `<div class="${className}">${content}</div>`
        
      case 'Text':
        const value = this.getValue(node.bind, data, locals) || ''
        if (!value) return ''
        return `<p class="${className}">${this.escapeHtml(String(value))}</p>`
        
      case 'Html':
        const htmlValue = this.getValue(node.bind, data, locals) || ''
        if (!htmlValue.trim()) return '' // Skip empty
        return `<div class="${className}">${htmlValue}</div>`
      
      case "Raw":
        if (!node.bind) return ''
        return `<span class="${className}">${this.escapeHtml(node.bind)}</span>`
      
      case 'Icon':
        const iconValue = this.getValue(node.bind, data, locals) || ''
        if (!iconValue) return ''
        return `<span class="${className}">${this.escapeHtml(String(iconValue))}</span>`
        
      case 'Link':
        const href = this.getValue(node.bind, data, locals) || '#'
        if (!href || href === '#') return ''
        const text = node.textbind ? this.getValue(node.textbind, data, locals) : href
        return `<a class="${className}" href="${this.escapeHtml(String(href))}">${this.escapeHtml(String(text))}</a>`
        
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
  
  private evaluateCondition(condition: string, data: any, locals: Record<string, any> = {}): boolean {
    if (!condition) return true
    
    const tokens = condition.split(/\s+/)
    const evaluated = tokens.map(token => {
      if (token === '&&' || token === '||' || token === '!') return token
      const value = this.getValue(token, data, locals)
      return value ? 'true' : 'false'
    }).join(' ')
    
    try {
      return eval(evaluated) as boolean
    } catch {
      return false
    }
  }
  
  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }
    return text.replace(/[&<>"']/g, m => map[m])
  }
}