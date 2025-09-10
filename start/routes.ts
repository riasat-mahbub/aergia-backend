/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const CvsController = () => import('#controllers/cvs_controller')
const UsersController = () => import('#controllers/users_controller')
const AuthController = () => import('#controllers/auth_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.group(() =>{
  router.post('register', [AuthController, 'register'])
  router.post('login', [AuthController, 'login'])
  router.post('logout', [AuthController, 'logout'])
}).prefix('auth')

router.group(() =>{
  router.get('/', [CvsController, 'readAll'])
  router.post('/', [CvsController, 'create'])
  router.delete('/:id', [CvsController, 'delete'])
  router.get('/:id', [CvsController, 'read'])
}).
prefix('cv').
middleware(middleware.auth())



router.group(() =>{
  router.get('getUser', [UsersController, 'getUser'])
}).middleware(middleware.auth())

