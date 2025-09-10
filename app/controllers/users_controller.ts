import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {

    async getUser({auth, response}: HttpContext){
        const user = auth.user;
        return response.ok({name: user?.fullName, email:user?.email})
    }
}