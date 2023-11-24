import express from "express";
import {
  registerController,
  saleController,
  loginController,
  getCarsController,
  getSingleCarController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getUserController,
  getAllOrdersController,
  orderStatusController,
} from "../controllers/authController.js";
 import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

//router object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/register", registerController);

//REGISTER || METHOD POST
// router.post("/create-car", requireSignIn, saleController);


router.post('/create-car', requireSignIn, saleController )



//LOGIN || POST
router.post("/login", loginController);

//Forgot Password || POST
router.post("/forgot-password", forgotPasswordController);

//protected User route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

router.post("/user-auth", requireSignIn,  (req, res) => {
  res.status(200).send({ ok: true });
});
//protected Admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//update profile
router.put("/profile", requireSignIn, updateProfileController);

//orders
router.get("/orders", requireSignIn, getOrdersController);

//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

//all Users
router.get("/all-users", requireSignIn, isAdmin, getUserController);

//all cars
router.get("/all-carOffers", requireSignIn, isAdmin, getCarsController);

// get a single car
router.get("/all-carOffers/:_id", requireSignIn, isAdmin, getSingleCarController);

// order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

export default router;
