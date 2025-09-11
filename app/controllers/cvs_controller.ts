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
        const {title} = request.only(['title'])
        if(user){
            const cv = new Cv
            cv.userId = user?.id
            cv.title = title
            await cv.save()
            
            const {userId, ...data} = cv
            return response.created({message: 'CV created successfully', data: data})
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

            return response.ok({ cv })
        }catch(exception){
            response.abort({message: exception.message})
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