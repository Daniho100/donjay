import {useState, useEffect} from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from 'react-router-dom'

const CarOffer = () => {

  const [car, setCar] = useState([]);

  //get all cars
  const getCars = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/all-carOffers");
      setCar(data.cars);

    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
    
  };

  //lifecycle method
  useEffect(() => {
    getCars();
  }, []);

  return (
    <Layout title={"Dashboard - All Users"}>
      <div className="row dashboard">
        <div className="col-md-3 ">
          <AdminMenu />
        </div>
        <div className="col-md-9 ">
          <h1 className="text-center">All Cars List</h1>
          <div className="d-flex flex-wrap">
            <table className="table table-striped">
              <tr>
                <th>ID</th>
                <th>Brand</th>
                <th>Car Model</th>
                <th>Manufacturing year</th>
                <th>Mileage</th>
                <th>Price Estmation</th>
                <th>Image</th>
                <th>User's Number</th>
              </tr>
              {car?.map((val, index) => (
                <tr key={val._id} className='h-8'>
                  <td>{index + 1}</td>
                  <td>{val.name}</td>
                  <td>{val.model}</td>
                  <td>{val.year}</td>
                  <td>{val.mileage}</td>
                  <td>{val.price}</td>
                  <td>
                  <Link to={`/dashboard/admin/carsale/${val._id}`}>
                      <img src={val.selectedFiles} alt="" style={{height: '100px', width: '150px'}} />
                  </Link>
                  </td>
                  <td>{val.phone}</td>
                </tr>
              ))}
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

 export default CarOffer;
