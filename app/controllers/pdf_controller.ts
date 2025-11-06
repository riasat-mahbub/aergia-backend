import type { HttpContext } from '@adonisjs/core/http'
import { PdfService } from '#services/PdfService'
import Cv from '#models/cv'

export default class PdfController {
  private pdfService = new PdfService()

  async generate({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const cvId = params.id

    // Verify CV belongs to user
    const cv = await Cv.query().where('id', cvId).where('user_id', user.id).first()
    
    if (!cv) {
      return response.notFound({ message: 'CV not found' })
    }

    try {
      const pdfBuffer = await this.pdfService.generatePdf(cvId, cv.template)
      
      response.header('Content-Type', 'application/pdf')
      response.header('Content-Disposition', `attachment; filename="${cv.title}.pdf"`)
      
      return response.send(pdfBuffer)
    } catch (error) {
      console.log(error)
      return response.internalServerError({ message: JSON.stringify(error.message) })
    }
  }
}