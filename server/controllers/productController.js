import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";

import fs from "fs";
import slugify from "slugify";
import braintree from "braintree";
import dotenv from "dotenv";
import { log } from "console";

dotenv.config();

//payment gateway
// var gateway = new braintree.BraintreeGateway({
//   environment: braintree.Environment.Sandbox,
//   merchantId: process.env.BRAINTREE_MERCHANT_ID,
//   publicKey: process.env.BRAINTREE_PUBLIC_KEY,
//   privateKey: process.env.BRAINTREE_PRIVATE_KEY,
// });



export const createProductController = async (req, res, next) => {
  try {
    const { name, category, model, price, year, mileage, gearType, color, registration } = req.body;
    // Check for required fields in the request body
    const requiredFields = ['name', 'category', 'model', 'price', 'year', 'mileage', 'gearType', 'color', 'registration', 'selectedFiles'];
    
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `${field} is required.` });
      }
    }

    // If all required fields are present, create the product
    const product = await productModel.create({ ...req.body, slug: slugify(name)});
    console.log(req.body);

    // Return a 201 Created response with the created product data
    return res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { name, category, model, price, year, mileage, gearType, color, registration } = req.body;
    // Check for required fields in the request body
    const requiredFields = ['name', 'category', 'model', 'price', 'year', 'mileage', 'gearType', 'color', 'registration', 'selectedFiles'];
    
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `${field} is required.` });
      }
    }

    // If all required fields are present, create the product
    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );

    await products.save();
    // Return a 201 Created response with the created product data
    return res.status(201).json(products);
  } catch (error) {
    next(error);
  }
};


// export const getProductController = async (req, res) => {
//   try {
//     const products = await productModel
//       .find({})
//       .populate("category")
//        .select("-photo")
//       .limit(12)
//       .sort({ createdAt: -1 });
//     res.status(200).send({
//       success: true,
//       counTotal: products.length,
//       message: "All Products ",
//       products,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error in getting products",
//       error: error.message,
//     });
//   }
// };





//Modified getProductController
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .limit(12)
      .sort({ createdAt: -1 });

    // Map through products and replace photo array with the first image
    const modifiedProducts = products.map((product) => {
      const firstImage = product.selectedFiles.length > 0 ? product.selectedFiles[0] : null;
      return {
        ...product.toObject(),
        selectedFiles: firstImage,
      };
    });

    res.status(200).send({
      success: true,
      countTotal: modifiedProducts.length,
      message: "All Products",
      products: modifiedProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting products",
      error: error.message,
    });
  }
};






// get single product
// export const getSingleProductController = async (req, res) => {
//   try {
//     const product = await productModel
//       .findOne({ name: req.params.name })
//       // .select("-photo")
//       .populate("category");
//     res.status(200).send({
//       success: true,
//       message: "Single Product Fetched",
//       product,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Eror while getitng single product",
//       error,
//     });
//   }
// };



//Modified getSingleProductController
// export const getSingleProductController = async (req, res) => {
//   try {
//     const product = await productModel
//       .findOne({ id: req.params._id })
//       .populate("category");

//     // Replace the photo array with the first image
//     const modifiedProduct = {
//       ...product,
//       selectedFiles: product.selectedFiles.length > 0 ? product.selectedFiles[0] : null,
//     };

//     res.status(200).send({
//       success: true,
//       message: "Single Product Fetched",
//       product: modifiedProduct,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error while getting single product",
//       error,
//     });
//   }
// };

export const getSingleProductController = async (req, res) => {
  try {
    const productId = req.params._id;
    const product = await getProductById(productId);

    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    const modifiedProduct = {
      ...product.toObject(),  // Convert Mongoose document to plain JavaScript object
      selectedFiles: product.selectedFiles || [], // Ensure selectedFiles is an array
    };




    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product: modifiedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error while getting single product",
      error: error.message,
    });
  }
};

// Function to get a product by its unique id
const getProductById = async (productId) => {
  try {
    const product = await productModel
      .findOne({ _id: productId })
      .populate("category");
    return product;
  } catch (error) {
    throw error;
  }
};




// get photo
// export const productPhotoController = async (req, res) => {
//   try {
//     const product = await productModel.findById(req.params.pid).select("photo");
//     if (product.photo) {
//       res.set("Content-type", product.photo.contentType);
//       return res.status(200).send(product.photo.data);
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error while getting photo",
//       error,
//     });
//   }
// };



//Modified productPhotoController
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("selectedFiles");

    if (product.selectedFiles && product.selectedFiles.length > 0) {
      // Send the first image in the array
      const firstImage = product.selectedFiles[0];
      res.set("Content-type", firstImage.contentType);
      return res.status(200).send(firstImage.data);
    } else {
      // Handle the case where no photo is found
      res.status(404).send({
        success: false,
        message: "No photo found for the product",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting photo",
      error,
    });
  }
};





//delete controller
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("selectedFiles");
    res.status(200).send({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

//upate producta
// export const updateProductController = async (req, res) => {
//   try {
//     const { name, description, price, category, quantity, shipping } =
//       req.fields;
//     const { photo } = req.files;
//     //validation
//     switch (true) {
//       case !name:
//         return res.status(500).send({ error: "Name is Required" });
//       case !description:
//         return res.status(500).send({ error: "Description is Required" });
//       case !price:
//         return res.status(500).send({ error: "Price is Required" });
//       case !category:
//         return res.status(500).send({ error: "Category is Required" });
//       case !quantity:
//         return res.status(500).send({ error: "Quantity is Required" });
//       case photo && photo.size > 1000000:
//         return res
//           .status(500)
//           .send({ error: "photo is Required and should be less then 1mb" });
//     }

//     const products = await productModel.findByIdAndUpdate(
//       req.params.pid,
//       { ...req.fields, slug: slugify(name) },
//       { new: true }
//     );
//     if (photo) {
//       products.photo.data = fs.readFileSync(photo.path);
//       products.photo.contentType = photo.type;
//     }
//     await products.save();
//     res.status(201).send({
//       success: true,
//       message: "Product Updated Successfully",
//       products,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       error,
//       message: "Error in Update product",
//     });
//   }
// };

// filters
export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Filtering Products",
      error,
    });
  }
};

// product count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

// product list base on page
export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

// search product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { model: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};

// similar products
export const realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
};

// get prdocyst by catgory
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};

//payment gateway api
//token
// export const braintreeTokenController = async (req, res) => {
//   try {
//     gateway.clientToken.generate({}, function (err, response) {
//       if (err) {
//         res.status(500).send(err);
//       } else {
//         res.send(response);
//       }
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// //payment
// export const brainTreePaymentController = async (req, res) => {
//   try {
//     const { nonce, cart } = req.body;
//     let total = 0;
//     cart.map((i) => {
//       total += i.price;
//     });
//     let newTransaction = gateway.transaction.sale(
//       {
//         amount: total,
//         paymentMethodNonce: nonce,
//         options: {
//           submitForSettlement: true,
//         },
//       },
//       function (error, result) {
//         if (result) {
//           const order = new orderModel({
//             products: cart,
//             payment: result,
//             buyer: req.user._id,
//           }).save();
//           res.json({ ok: true });
//         } else {
//           res.status(500).send(error);
//         }
//       }
//     );
//   } catch (error) {
//     console.log(error);
//   }
// };
