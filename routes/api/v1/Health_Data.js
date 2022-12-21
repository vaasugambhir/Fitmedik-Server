import { Router } from 'express';
import {
  getWeekshealthData,
  workLife,
  storeDailyStepCount
} from '../../../controllers/api/v1/Health_Data.js';

const router = Router();

router.get('/get-weeks-health-data', getWeekshealthData);
router.post('/work-life', workLife);
router.post('/daily-steps', storeDailyStepCount);

export default router;
