import Cv from "#models/cv"
import FormGroup from "#models/form_group"
import { TemplateService } from "#services/TemplateService"
import { HttpContext } from "@adonisjs/core/http"

export default class FormGroupsController {
        async readAll({params, response}: HttpContext){
            const cv = await Cv.query().where('id', params.cv_id).firstOrFail()
            
            await cv?.load('formGroups')
            return response.ok({formHolders: cv.formGroups})
        }
    
        async create({params, request, response}:HttpContext){
            const cv_id = params.cv_id
            const {title, type, data} = request.only(['title', 'type', 'data'])

            try{
                const CV = await Cv.query().where('id', cv_id).select('template').firstOrFail()
                const template = CV.template

                const formGroup = new FormGroup
                formGroup.cvId = cv_id
                formGroup.title = title
                formGroup.type = type
                formGroup.data = data
                formGroup.style = await TemplateService.getStyle(template, type)
                formGroup.structure = await TemplateService.getStructure(template, type)
                formGroup.visible = true

                await formGroup.save()
                response.ok({formGroup})

            }catch(exception){
                response.abort({message:"Failed to create form group"})
            }
    
        }
    
        async read({ params, response }: HttpContext) {
            try{
                const formGroup = await FormGroup.query()
                .where('id', params.id)
                .andWhere('cv_id', params.cv_id)
                .firstOrFail()
    
                return response.ok({ formGroup })
            }catch(exception){
                response.abort({message: "Cannot find form group"})
            }
    
    
        }

        async update({ params, request, response }: HttpContext) {
            try{
                const formGroup = await FormGroup.query()
                .where('id', params.id)
                .andWhere('cv_id', params.cv_id)
                .firstOrFail()

                const input = request.only(['title', 'type', 'data', 'visible', 'order', 'style'])

                formGroup.merge(input)
                await formGroup.save()

                return response.ok({ formGroup })
            }catch(exception){
                response.abort({message: "Cannot update form group"})
            }

        }

        async reorder({params, request, response}: HttpContext){
            const {activeId, overId} = request.only(['activeId', 'overId'])

            try{

                const activeFormGroup =  await FormGroup.query()
                    .where('id', activeId)
                    .andWhere('cv_id', params.cv_id)
                    .firstOrFail()

                const overFormGroup = await FormGroup.query()
                    .where('id', overId)
                    .andWhere('cv_id', params.cv_id)
                    .firstOrFail()

                const temp = activeFormGroup.order
                activeFormGroup.order = overFormGroup.order
                overFormGroup.order = temp

                activeFormGroup.save()
                overFormGroup.save()

                return response.ok({message: "Reordered Successfully"})
            }catch(exception){
                response.abort({message: "Cannot reorder form group"})
            }

        }
    
    
        async delete({ params, response }: HttpContext) {
    
            try{
                const formGroup = await FormGroup.query()
                .where('id', params.id)
                .andWhere('cv_id', params.cv_id)
                .firstOrFail()
                
                await formGroup.delete()
                return response.ok({ message: "Form Group delete successfully" })
            }catch(exception){
                response.abort({message: "Cannot delete form group"})
            }
            
        }
}