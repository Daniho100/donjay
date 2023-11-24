// import React, { useState, useEffect } from "react";
// import Layout from "../../components/Layout/Layout";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import "../../styles/ProductDetailsStyles.css";

// const CarDetails = () => {
//   const params = useParams();
//   const navigate = useNavigate();
//   const [car, setCar] = useState({});
//   const [isOn, setIsOn] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(0); // Added state for selected image index


//   //initalp details
//   useEffect(() => {
//     if (params?._id) getProduct();
//   }, [params?._id]);

//   //getProduct
//   const getProduct = async () => {
//     try {
//       const { data } = await axios.get(
//         `/api/v1/auth/all-carOffers/${params._id}`
//       );
//       console.log(data?.car)
//       setCar(data?.car);
//     } catch (error) {
//       console.log(error);
//     }
//   };
    
//     // Function to handle the toggle action
//     const handleToggle = () => {
//       setIsOn(!isOn);
//     };


//     const handleImageClick = (index) => {
//       setSelectedImage(index);
//     };

//   return (
//     <Layout>
//       <div className="row container product-details">
//         <div className="col-md-9">

//                 {car?.selectedFiles && (
//                   <div class="image-card">
//                   <img
//                     src={car.selectedFiles[selectedImage]}
//                     className="card-img-top"
//                     alt={car.name}
//                     height="430"
//                     width={"400px"}
//                   />
//                   </div>
//                 )}
//                 {/* Slider for other images */}
//                 {Array.isArray(car?.selectedFiles) && car.selectedFiles.length > 1 && (
//                   <div className="image-slider">
//                     {car.selectedFiles.map((image, index) => (
//                       <img
//                         key={index}
//                         src={image}
//                         alt={car.name}
//                         onClick={() => handleImageClick(index)}
//                         className={index === selectedImage ? "selected" : ""}
//                         height="110"
//                         width={"200px"}
//                         cursor="pointer"
//                       />
//                     ))}
//                   </div>
//                 )}
//         </div>
        
//         <div className="col-md-3 product-details-info">
//           <h1 className="text-center">Product Details</h1>
//           <hr />
//           <h6>Name : {car.name}</h6>
//           <h6>Model : {car.model}</h6>
//           <h6>
//             Price : 
//              {car?.price?.toLocaleString("en-US", {
//               style: "currency",
//               currency: "NGN",
//             })}
//           </h6>
//           <h6>Category : {car?.category?.name}</h6>
//           <h6>Gear Type : {car.gearType}</h6>
//           <h6>Year : {car.year}</h6>
//           <h6>Color : {car.color}</h6>
//           <h6>Car Registrated? : {car.registration}</h6>
//           <button class="btn btn-secondary ms-1" onClick={handleToggle}>{isOn ? " Call: +234 9082824893 " : "Show Seller's Contact"}</button>
//         </div>
//       </div>
//       <hr />
//       {/* <div className="row container similar-products">
//         <h4>Similar Products ➡️</h4>
//         {relatedProducts.length < 1 && (
//           <p className="text-center">No Similar Products found</p>
//         )}
//         <div className="d-flex flex-wrap">
//           {relatedProducts?.map((p) => (
//             <div className="card m-2" key={p._id}>
//               <img
//                 src={p.selectedFiles}
//                 className="card-img-top"
//                 alt={p.name}
//               />
//               <div className="card-body">
//                 <div className="card-name-price">
//                   <h5 className="card-title">{p.name}</h5>
//                   <h5 className="card-title card-price">
//                     {p.price.toLocaleString("en-US", {
//                       style: "currency",
//                       currency: "USD",
//                     })}
//                   </h5>
//                 </div>
                
//                 <div className="card-name-price">
//                   <button
//                     className="btn btn-info ms-1"
//                     onClick={() => navigate(`/product/${p._id}`)}
//                   >
//                     More Details
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div> */}
//     </Layout>
//   );
// };

// export default CarDetails;







// ... (previous imports)

import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/ProductDetailsStyles.css";

const CarDetails = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState({});
    const [isOn, setIsOn] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
  
    useEffect(() => {
      if (params?._id) {
        getProduct(); // Fetch car details
      }
    }, [params?._id]);
  
    const getProduct = async () => {
      try {
        const { data } = await axios.get(`/api/v1/auth/all-carOffers/${params._id}`);
        setCar(data?.car);
        console.log(data?.car);
      } catch (error) {
        console.error(error);
      }
    };
  
    const handleToggle = () => {
      setIsOn(!isOn);
    };
  
    const handleImageClick = (index) => {
      setSelectedImage(index);
    };
  
    return (
      <Layout>
        <div className="row container product-details">
          <div className="col-md-9">
            {car?.selectedFiles && (
              <div className="image-card">
                <img
                  src={car.selectedFiles[selectedImage]}
                  className="card-img-top"
                  alt={car.name}
                  height="430"
                  width={"400px"}
                />
              </div>
            )}
            {/* Slider for other images */}
            {Array.isArray(car?.selectedFiles) && car.selectedFiles.length > 1 && (
              <div className="image-slider">
                {car.selectedFiles.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={car.name}
                    onClick={() => handleImageClick(index)}
                    className={index === selectedImage ? "selected" : ""}
                    height="110"
                    width={"200px"}
                    cursor="pointer"
                  />
                ))}
              </div>
            )}
          </div>

            <div className="col-md-3 product-details-info">
                <h1 className="text-center">Product Details</h1>
                    <h6>Name : {car.name}</h6>
                    <h6>Model : {car.model}</h6>
                    <h6>
                        Price : 
                        {car?.price?.toLocaleString("en-US", {
                        style: "currency",
                        currency: "NGN",
                        })}
                    </h6>
                    <h6>Mileage : {car.mileage}</h6>
                    <h6>Year : {car.year}</h6>
                    <h6>Car Registrated? : {car.registration}</h6>
                    <button class="btn btn-secondary ms-1" onClick={handleToggle}>{isOn ? " Call: +234 9082824893 " : "Show Seller's Contact"}</button>
                </div>
            </div>
      </Layout>
    );
  };
  
  export default CarDetails;
  
