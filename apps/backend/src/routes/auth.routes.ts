import { Router } from 'express'
import { handleInitSignin, handleInitSignup, handleSignin, handleSignup } from '../controllers/auth.controller'

const router: Router = Router();

router.route('/initiate_signup').post(handleInitSignup)
router.route('/initiate_signin').post(handleInitSignin)
router.route('/signin').post(handleSignin)
router.route('/signup').post(handleSignup)


export default router