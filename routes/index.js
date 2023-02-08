import { Router } from 'express';
import { Home } from '../controllers/Home_Controller.js';
import { SignUp, Login, message,otpTest,CheckToken,allAppUsers,allEventsUser,uploadjournal,allDetails,updateUser } from '../controllers/UserController.js';
import apiRoutes from './api/index.js';
import { Admin, AdminOTP} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import {protect as managerProtect} from '../middleware/authMiddlewareManager.js'
import { addOrganization,getOrganization,updateOrganization,setupPassword,addPassword,allHospitalManagers,managerLogin,forgetPassword,addManager,verifyOtp,singleHospitalManagers,addDept,allDept,addUser,allUsers,addPartner,updatePartner,allPartners,singlePartner,getOrganizationDetails,addEvent,updateEvent,allEvents,userCount,allQuestionare,getDetailsOrganization,allUsersDept,getAllevents,allPartnersOrg,allTreatmentPartners,alldeptusers} from '../controllers/organizationController.js';
import { storeDailyStepCount,storeDailySleepHours, workLife } from '../controllers/Health_DataController.js';
import { userProtect } from '../middleware/authMiddlewareUser.js';
import multer from 'multer'
const router = Router();

const upload = multer({
    storage:multer.diskStorage({
        destination:function(req,file,cb){
            cb(null,"../files")
        },
        filename:function(req,file,cb){
            cb(null,file.fieldname + "_" + Date.now())
        }
    })
})


//admin routes
router.post('/admin', Admin);
router.post('/admin/verifyotp', AdminOTP);

//organization apis
router.post('/organization',protect,addOrganization)
router.get('/organization',protect,getOrganization)
router.put('/organization',protect,updateOrganization)
router.get('/getDetailsOrganization/:organizationId',protect,getDetailsOrganization)
router.post('/addManager',protect,addManager)
router.get('/getAllevents/:partnerId',protect,getAllevents)
router.post('/addEvent',protect,addEvent)
router.post('/updateEvent',protect,updateEvent)
router.get('/allEvents/:id',protect,allEvents)
router.get('/allTreatmentPartners',protect,allTreatmentPartners)

//hospital managers
router.get('/allHospitalManagers',allHospitalManagers)
router.get('/allHospitalManagers/:organizationId',singleHospitalManagers)
router.get('/setupPassword/:token',setupPassword)
router.post('/setupPassword/:token',addPassword)
router.post('/manager/login',managerLogin)
router.post('/forgetPassword',forgetPassword)
router.post('/verifyOtp',verifyOtp)
router.get('/organizationDetails',managerProtect,getOrganizationDetails)
router.get('/allPartnersOrg',managerProtect,allPartnersOrg)

router.use('/api', apiRoutes);
router.get('/', Home);
router.get('/mess', message);

//user login
router.get('/allAppUsers',allAppUsers);
router.post('/signup', SignUp);
router.post('/login', Login);
router.post('/storeDailyStepCount',userProtect,storeDailyStepCount)
router.post('/storeDailySleepHours',userProtect,storeDailySleepHours)
router.post('/workLife',userProtect,workLife)
router.get('/allEventsUser',userProtect,allEventsUser)
router.get('/allDetails',userProtect,allDetails)
router.post('/updateUser',userProtect,updateUser)
// router.post("/uploadjournal",[userProtect,upload],uploadjournal)
router.post("/otp",otpTest);
router.post("/checkOtp",CheckToken)



//hospital admin
router.post('/addDept',managerProtect,addDept)
router.get('/allDept',managerProtect,allDept)
router.post('/addUser',managerProtect,addUser)
router.get('/allUsers',managerProtect,allUsers)
router.get('/allUsers/:departmentId',managerProtect,allUsersDept)
router.get('/userCount',managerProtect,userCount)
router.get('/allQuestionare',managerProtect,allQuestionare)
router.get('/alldeptusers',alldeptusers)

//treatment partners
router.post('/addPartner',protect,addPartner)
router.put('/updatePartner',protect,updatePartner)
router.get('/allPartners',protect,allPartners)
router.get('/singlePartner/:id',protect,singlePartner)
export default router;