import { Router } from 'express';
import { getWeekshealthData } from '../../../controllers/api/v1/Health_Data.js';

const router = Router();

router.get('/get-weeks-health-data', getWeekshealthData);

export default router;
