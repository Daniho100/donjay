import { useState } from 'react';
import axios from 'axios';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../../firebase';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';

const Sell = () => {
  // const { currentUser } = useSelector((state) => state.user);
  // const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    selectedFiles: [],
    name: '',
    year: '',
    model: '',
    price: '',
    mileage: '',
    phone: '',
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(formData);


  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.selectedFiles.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            selectedFiles: formData.selectedFiles.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      selectedFiles: formData.selectedFiles.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.selectedFiles.length < 1)
        return setError('You must upload at least one image');
      
      setLoading(true);
      setError(false);
      const res = await axios.post('/api/v1/auth/create-car', {
        headers: {
          'Content-Type': 'application/json',
        },
          ...formData,
      });
      const data = await res.json(formData);
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      // navigate(`/car/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Brand Name'
            className='border p-3 rounded-lg'
            id='name'
            maxLength='62'
            
            onChange={handleChange}
            value={formData.name}
          />
          <input
            type='number'
            placeholder='Year'
            className='border p-3 rounded-lg'
            id='year'
          
            onChange={handleChange}
            value={formData.year}
          />
          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input
              type='text'
              placeholder='model'
              className='border p-3 rounded-lg'
              id='model'
              
              onChange={handleChange}
              value={formData.model}
              />

              <input
              type='number'
              placeholder='price'
              className='border p-3 rounded-lg'
              id='price'
            
              onChange={handleChange}
              value={formData.price}
              />
            </div>
            <div className='flex gap-2'>
              <input
              type='number'
              placeholder='mileage'
              className='border p-3 rounded-lg'
              id='mileage'
            
              onChange={handleChange}
              value={formData.mileage}
              />
            </div>
            <div className='flex gap-2'>
            <input
              type='number'
              placeholder='phone'
              className='border p-3 rounded-lg'
              id='phone'
              onChange={handleChange}
              value={formData.phone}
              />
            </div>
           
          </div>
        </div>
        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>
            Images:
            <span className='font-normal text-gray-600 ml-2'>
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className='flex gap-4'>
            <input
              onChange={(e) => setFiles(e.target.files)}
              className='p-3 border border-gray-300 rounded w-full'
              type='file'
              id='images'
              accept='image/*'
              multiple
            />
            <button
              type='button'
              disabled={uploading}
              onClick={handleImageSubmit}
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className='text-red-700 text-sm'>
            {imageUploadError && imageUploadError}
          </p>
          {formData.selectedFiles.length > 0 &&
            formData.selectedFiles.map((url, index) => (
              <div
                key={url}
                className='flex justify-between p-3 border items-center'
              >
                <img
                  src={url}
                  alt='listing'
                  className='w-20 h-20 object-contain rounded-lg'
                  style={{width: '15rem', height: '120px'}}
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? 'Creating...' : 'Create listing'}
          </button>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  );
}


export default Sell;

