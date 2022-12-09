import { Router } from 'express';
import { Home } from '../controllers/Home_Controller.js';
import { SignUp, Login, message } from '../controllers/SignUpController.js';
import apiRoutes from './api/index.js';

const router = Router();

router.use('/api', apiRoutes);
router.post('/sign', SignUp);
router.post('/login', Login);
router.get('/mess', message);
router.get('/', Home);

export default router;
