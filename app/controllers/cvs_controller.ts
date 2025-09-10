import { HttpContext } from "@adonisjs/core/http";

export default class CvsController {

    async getCvs({auth, response}: HttpContext){
        const user = auth.user
        
        await user?.load('cvs')
        return response.ok({cvs: user?.cvs})
    }
}