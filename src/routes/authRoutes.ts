import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validateUserRegistration, validateUserLogin } from '../middleware/validation';

const router = Router();

router.post('/register', validateUserRegistration, AuthController.register);
router.post('/login', validateUserLogin, AuthController.login);
router.post('/refresh-token', AuthController.refreshToken);

export default router;
