import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Alert, Button, Modal, TextInput, Spinner, Badge } from 'flowbite-react';
import { useDispatch } from 'react-redux';
import { 
  deleteUserFailure, 
  deleteUserStart, 
  deleteUserSuccess, 
  signOutSuccess, 
  updateInFailure, 
  updateInStart, 
  updateInSuccess 
} from '../redux/user/userSlice';
import { 
  HiOutlineExclamationCircle, 
  HiCamera, 
  HiCheckCircle, 
  HiExclamationCircle,
  HiPencil,
  HiLogout,
  HiTrash,
  HiUser,
  HiMail,
  HiLockClosed
} from 'react-icons/hi';
import { Link } from 'react-router-dom';

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const refFilePicker = useRef();
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setImageFileUploadError('File size must be less than 2MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setImageFileUploadError('Please upload a valid image file');
        return;
      }
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
      setImageFileUploadError(null);
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImageToCloudinary();
    }
    return () => {
      if (imageFileUrl) {
        URL.revokeObjectURL(imageFileUrl);
      }
    };
  }, [imageFile]);

  const uploadImageToCloudinary = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    setImageFileUploadProgress(0);

    const formDataImg = new FormData();
    formDataImg.append('image', imageFile);

    try {
      const res = await fetch('/api/v1/upload/upload', {
        method: 'POST',
        credentials: 'include',
        body: formDataImg,
      });

      const data = await res.json();

      if (!res.ok) {
        setImageFileUploadError(data.message || 'Upload failed');
        setImageFileUploadProgress(null);
        setImageFileUploading(false);
        return;
      }

      setImageFileUploadProgress(100);
      setImageFileUrl(data.url);
      setFormData({ ...formData, profilePicture: data.url });
      setTimeout(() => setImageFileUploadProgress(null), 1000);
      setImageFileUploading(false);
      
    } catch (error) {
      setImageFileUploadError('Image upload failed. Please try again.');
      setImageFileUploadProgress(null);
      setImageFileUploading(false);
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    
    if (Object.keys(formData).length === 0) {
      setUpdateUserError('No changes made to update');
      return;
    }
    
    try {
      dispatch(updateInStart());
      const res = await fetch(`/api/v1/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
                credentials: "include",

        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        dispatch(updateInFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateInSuccess(data));
        setUpdateUserSuccess("Profile updated successfully");
        setFormData({});
      }
    } catch (error) {
      dispatch(updateInFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  const handleDelete = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/v1/user/delete/${currentUser._id}`, {
        method: "DELETE",
        credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      }
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/v1/user/signOut', {
        method: 'POST',
        credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      }
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const getUserRoleColor = () => {
    if (currentUser?.role === 'admin') return 'purple';
    if (currentUser?.role === 'author') return 'green';
    return 'gray';
  };

  const getUserRoleLabel = () => {
    if (currentUser?.role === 'admin') return 'Administrator';
    if (currentUser?.role === 'author') return 'Content Author';
    return 'Member';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg mb-4">
            <HiUser className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
            My Profile
          </h1>
          <div className="mt-2">
            <Badge color={getUserRoleColor()} size="sm" className="inline-flex">
              {getUserRoleLabel()}
            </Badge>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <form className="p-6 space-y-6" onSubmit={handleSubmit}>
            {/* Profile Picture Section */}
            <div className="text-center">
              <input 
                type='file' 
                accept='image/*' 
                onChange={handleImageChange} 
                ref={refFilePicker} 
                hidden 
              />
              
              <div 
                className="relative w-32 h-32 mx-auto cursor-pointer group"
                onClick={() => refFilePicker.current.click()}
              >
                {/* Upload Progress Overlay */}
                {imageFileUploadProgress && imageFileUploadProgress < 100 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-full z-10">
                    <div className="text-center">
                      <Spinner size="lg" color="white" />
                      <span className="text-white text-xs block mt-1">{imageFileUploadProgress}%</span>
                    </div>
                  </div>
                )}
                
                {/* Profile Image */}
                <img 
                  src={imageFileUrl || currentUser.profilePicture} 
                  alt="Profile" 
                  className='rounded-full w-full h-full object-cover ring-4 ring-indigo-500/30 group-hover:ring-indigo-500/50 transition-all'
                />
                
                {/* Camera Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <HiCamera className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Click to change profile picture
              </p>
              
              {imageFileUploadError && (
                <Alert color="failure" className="mt-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <HiExclamationCircle className="w-5 h-5" />
                    <span>{imageFileUploadError}</span>
                  </div>
                </Alert>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Username */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <HiUser className="w-5 h-5 text-gray-400" />
                  </div>
                  <TextInput
                    type='text'
                    id='username'
                    placeholder='Username'
                    defaultValue={currentUser.username}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <HiMail className="w-5 h-5 text-gray-400" />
                  </div>
                  <TextInput
                    type='email'
                    id='email'
                    placeholder='Email'
                    defaultValue={currentUser.email}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <HiLockClosed className="w-5 h-5 text-gray-400" />
                  </div>
                  <TextInput
                    type='password'
                    id='password'
                    placeholder='Leave blank to keep current'
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter a new password only if you want to change it
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Button
                type='submit'
                gradientDuoTone="purpleToPink"
                disabled={loading || imageFileUploading}
                className="w-full rounded-xl py-2.5"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <HiPencil className="w-4 h-4 mr-2" />
                    Update Profile
                  </>
                )}
              </Button>

              {/* Create Post Button - Author or Admin */}
              {(currentUser?.role === "author" || currentUser?.role === "admin") && (
                <Link to='/create-post'>
                  <Button type='button' gradientDuoTone="tealToLime" className='w-full rounded-xl py-2.5'>
                    <HiPencil className="w-4 h-4 mr-2" />
                    Create New Post
                  </Button>
                </Link>
              )}
            </div>
          </form>

          {/* Danger Zone */}
          <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
              Danger Zone
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                color="failure"
                onClick={() => setShowModal(true)}
                className="flex-1 rounded-xl"
              >
                <HiTrash className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
              <Button
                color="gray"
                onClick={handleSignOut}
                className="flex-1 rounded-xl"
              >
                <HiLogout className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Success/Error Messages */}
          {updateUserSuccess && (
            <div className="px-6 pb-6">
              <Alert color="success" className="rounded-lg">
                <div className="flex items-center gap-2">
                  <HiCheckCircle className="w-5 h-5" />
                  <span>{updateUserSuccess}</span>
                </div>
              </Alert>
            </div>
          )}
          
          {updateUserError && (
            <div className="px-6 pb-6">
              <Alert color="failure" className="rounded-lg">
                <div className="flex items-center gap-2">
                  <HiExclamationCircle className="w-5 h-5" />
                  <span>{updateUserError}</span>
                </div>
              </Alert>
            </div>
          )}
        </div>
      </div>

      {/* Delete Account Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md" className="rounded-2xl">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <HiOutlineExclamationCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
              Delete Account
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <Button color="failure" onClick={handleDelete}>
                Yes, Delete
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}