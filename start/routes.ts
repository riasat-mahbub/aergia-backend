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
const FormGroupsController = () => import('#controllers/form_groups_controller')
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
  router.get('isLoggedIn',  [AuthController, 'isLoggedIn'])
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
  router.get('/:cv_id', [FormGroupsController, 'readAll'])
  router.post('/:cv_id', [FormGroupsController, 'create'])
  router.put('/:cv_id/:id', [FormGroupsController, 'update'])
  router.delete('/:cv_id/:id', [FormGroupsController, 'delete'])
  router.get('/:cv_id/:id', [FormGroupsController, 'read'])
  router.post('/:cv_id/reorder', [FormGroupsController, 'reorder'])
}).
prefix('formGroup').
middleware(middleware.auth())



router.group(() =>{
  router.get('getUser', [UsersController, 'getUser'])
}).middleware(middleware.auth())

