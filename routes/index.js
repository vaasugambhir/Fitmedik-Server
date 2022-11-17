import { Router } from "express";
import { Home} from "../controllers/Home_Controller.js";
import { SignUp,Login,message } from "../controllers/SignUpController.js";


const router = Router();

router.get("/", Home);
router.post("/sign", SignUp);
router.post("/login", Login);
router.get("/mess",message)


export default router;
