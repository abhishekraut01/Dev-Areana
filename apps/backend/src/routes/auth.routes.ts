import { Router } from 'express'
import { signinController, signupController, verifyController } from '../controllers/auth.controller'

const router: Router = Router();

router.route('/initiate_signup').post(signupController)
router.route('/initiate_signin').post(signinController)
router.route('/verify').post(verifyController)


export default router