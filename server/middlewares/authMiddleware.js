import JWT from "jsonwebtoken";
import User from "../models/userModel.js";

//Protected Routes token base
export const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};


//admin access
export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.role !== 1 || 0) {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in admin middleware",
    });
  }
};


// Regular user access
// export const isRegularUser = async (req, res, next) => {
//   try {
//     const user = await userModel.findById(req.user._id);

//     if (!user || user.role !== 0) {
//       return res.status(403).json({
//         success: false,
//         message: "Unauthorized access for regular users",
//       });
//     } else {
//       next();
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Error in regular user middleware",
//     });
//   }
// };
