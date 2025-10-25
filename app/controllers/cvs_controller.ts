import Cv from "#models/cv";
import { HttpContext } from "@adonisjs/core/http";

export default class CvsController {

    async readAll({auth, response}: HttpContext){
        const user = auth.user
        
        await user?.load('cvs')
        return response.ok({cvs: user?.cvs})
    }

    async create({auth, request, response}:HttpContext){
        const user = auth.user
        const {title, template} = request.only(['title', 'template'])
        if(user){
            const cv = new Cv
            cv.userId = user?.id
            cv.title = title
            cv.template = template || "MIT"
            await cv.save()
            
            const returnData = {
                title: cv.title,
                id: cv.id,
                template: cv.template,
                createdAt: cv.createdAt,
                updatedAt: cv.updatedAt
            }
            return response.created({message: 'CV created successfully', data: returnData})
        }else{
            return response.abort({message: "Invalid User"})
        }

    }

    async read({ auth, params, response }: HttpContext) {
        try{
            const cv = await Cv.query()
            .where('id', params.id)
            .andWhere('user_id', auth.user!.id)
            .firstOrFail()

            const returnData = {
                title: cv.title,
                id: cv.id,
                template: cv.template,
                createdAt: cv.createdAt,
                updatedAt: cv.updatedAt
            }

            return response.ok({message: 'CV found successfully', data: returnData })
        }catch(exception){
            response.abort({message: exception.message})
        }


    }

    async update({ auth, params, request, response }: HttpContext) {
        try{
            const cv = await Cv.query()
            .where('id', params.id)
            .andWhere('user_id', auth.user!.id)
            .firstOrFail()

            const input = request.only(['title', 'template', 'order'])

            cv.merge(input)
            await cv.save()

            return response.ok({ cv })
        }catch(exception){
            response.abort({message: "Cannot update CV"})
        }

    }


    async reorder({auth, request, response}: HttpContext){
        const {activeId, overId} = request.only(['activeId', 'overId'])

        try{

            const activeCV =  await Cv.query()
            .where('id', activeId)
            .andWhere('user_id', auth.user!.id)
            .firstOrFail()

            const overCV = await Cv.query()
            .where('id', overId)
            .andWhere('user_id',  auth.user!.id)
            .firstOrFail()

            const temp = activeCV.order
            activeCV.order = overCV.order
            overCV.order = temp

            activeCV.save()
            overCV.save()

            return response.ok({message: "Reordered Successfully"})
        }catch(exception){
            response.abort({message: "Cannot reorder CVs"})
        }

    }


    async delete({ auth, params, response }: HttpContext) {

        try{
            const cv = await Cv.query()
            .where('id', params.id)
            .andWhere('user_id', auth.user!.id)
            .firstOrFail()

            await cv.delete()
            return response.ok({ message: 'CV deleted successfully'})
        }catch(exception){
            response.abort({message: exception.message})
        }
        
    }
}