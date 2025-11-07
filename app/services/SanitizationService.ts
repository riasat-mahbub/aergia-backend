import DOMPurify from 'isomorphic-dompurify'

export class SanitizationService {
  static sanitizeHtml(html: string): string {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['b', 'i', 'u', 'strong', 'em', 'p', 'br', 'ul', 'ol', 'li', 'a', 'span'],
      ALLOWED_ATTR: ['href', 'target', 'style'],
      ALLOW_DATA_ATTR: false,
    })
  }

  static sanitizeData(data: any): any {
    if (typeof data === 'string') {
      return this.sanitizeHtml(data)
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item))
    }
    
    if (data && typeof data === 'object') {
      const sanitized: any = {}
      for (const key in data) {
        sanitized[key] = this.sanitizeData(data[key])
      }
      return sanitized
    }
    
    return data
  }
}
