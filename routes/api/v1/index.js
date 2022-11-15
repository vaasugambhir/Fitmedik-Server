import { Router } from 'express';
import { apiHome } from '../../../controllers/api/v1/Api_Home.js';
import Organization from './Organization.js';
import Department from './Department.js';
import HealthData from './Health_Data.js';
import User from '../../../models/User.js';
import OrganizationSchema from '../../../models/Organization.js';
import DepartmentSchema from '../../../models/Department.js';
const router = Router();

router.get('/', apiHome);

router.post('/user', async (req, res) => {
  try {
    const user = await User.create(req.body);

    const organization = await OrganizationSchema.findById(
      req.body.parentOrganization
    );

    const dept = await DepartmentSchema.findById(req.body.department);

    organization.users.push(user);
    dept.users.push(user);

    await organization.save();
    await dept.save();

    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: 'Fuck off' });
  }
});

router.use('/organization', Organization);
router.use('/department', Department);
router.use('/health-data', HealthData);

export default router;
