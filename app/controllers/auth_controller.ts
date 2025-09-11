import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    const { email, password, fullName } = request.only(['email', 'password', 'fullName'])
    
    const user = await User.create({ email, password, fullName })
    
    return response.created({ user: { id: user.id, email: user.email, fullName: user.fullName } })
  }

  async login({ request, response, auth }: HttpContext) {
    const { email, password, rememberMe } = request.only(['email', 'password', 'rememberMe'])
    
    const user = await User.verifyCredentials(email, password)
    await auth.use('web').login(user, !!rememberMe)
    
    return response.ok({ user: { id: user.id, email: user.email, fullName: user.fullName } })
  }

  async logout({ response, auth }: HttpContext) {
    await auth.use('web').logout()
    return response.ok({ message: 'Logged out successfully' })
  }

  async isLoggedIn({ auth, response }: HttpContext) {
      if (await auth.check()) {
        const user = auth.user!
        return response.ok({
          loggedIn: true,
          user: { id: user.id, email: user.email, fullName: user.fullName },
        })
    }
    return response.unauthorized({ loggedIn: false })
  }
}