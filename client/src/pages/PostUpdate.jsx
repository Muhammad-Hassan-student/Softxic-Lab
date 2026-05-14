import React, { useEffect, useState } from 'react';
import { Alert, Button, FileInput, Select, TextInput, Label } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function PostUpdate() {
  const [file, setFile] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'uncategorized',
    status: 'draft',
    image: ''
  });
  const [publishError, setPublishError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();
  const { postId } = useParams();

  // Fetch existing post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/v1/post/getPosts?postId=${postId}`);
        const data = await res.json();
        
        if (!res.ok) {
          setPublishError(data.message);
          return;
        }
        
        if (res.ok && data.posts && data.posts[0]) {
          setFormData(data.posts[0]);
          setPublishError(null);
        }
      } catch (error) {
        console.log(error.message);
        setPublishError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  // 🔥 Upload to Cloudinary
  const handleUploadImage = async () => {
    if (!file) {
      return setImageUploadError('Please select an image');
    }
    
    if (file.size > 5 * 1024 * 1024) {
      return setImageUploadError('Image must be less than 5MB');
    }
    
    const formDataImg = new FormData();
    formDataImg.append('image', file);
    
    setImageUploadProgress(0);
    setImageUploadError(null);
    
    try {
      const res = await fetch('/api/v1/upload/upload', {
        method: 'POST',
        credentials: 'include',
        body: formDataImg,
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setImageUploadError(data.message || 'Upload failed');
        setImageUploadProgress(null);
        return;
      }
      
      setImageUploadProgress(100);
      setFormData({ ...formData, image: data.url });
      setTimeout(() => setImageUploadProgress(null), 1000);
      
    } catch (error) {
      setImageUploadError('Image upload failed');
      setImageUploadProgress(null);
      console.error(error);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  setUpdating(true);
  
  try {
    const res = await fetch(`/api/v1/post/updatePost/${postId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      setPublishError(data.message);
      setUpdating(false);
      return;
    }
    
    setPublishError(null);
    
    // 🔥 FIX: Conditional navigation
    if (formData.status === 'published') {
      navigate(`/post/${data.slug}`);
    } else {
      navigate('/dashboard?tab=posts');
    }
    
  } catch (error) {
    setPublishError(error.message);
    setUpdating(false);
  }
};

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
        <p className="mt-4 text-gray-500">Loading post...</p>
      </div>
    );
  }

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-3xl text-center my-7 font-semibold'>Update Post</h1>
      
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput 
            type='text' 
            placeholder='Title' 
            className='flex-1' 
            onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
            value={formData.title || ''}
            required
          />
          <Select 
            onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
            value={formData.category || 'uncategorized'}
          >
            <option value={'uncategorized'}>Select a category</option>
            <option value={'javascript'}>JavaScript</option>
            <option value={'reactjs'}>React Js</option>
            <option value={'nextjs'}>Next Js</option>
            <option value={'nodejs'}>Node Js</option>
            <option value={'mongodb'}>MongoDB</option>
          </Select>
        </div>

        <div>
          <Label value="Post Status" className="mb-2 block" />
          <Select 
            onChange={(e) => setFormData({ ...formData, status: e.target.value })} 
            value={formData.status || 'draft'}
            className="w-full md:w-64"
          >
            <option value="draft">📝 Draft</option>
            <option value="published">🚀 Published</option>
          </Select>
        </div>

        <div className='flex gap-5 items-center justify-between border-4 border-teal-500 border-dotted p-3 rounded-lg'>
          <FileInput 
            type="file" 
            accept={'image/*'} 
            onChange={(e) => setFile(e.target.files[0])} 
          />
          <Button 
            type='button' 
            gradientDuoTone={'tealToLime'} 
            size={'sm'} 
            outline 
            onClick={handleUploadImage} 
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? `${imageUploadProgress}%` : "Upload New Image"}
          </Button>
        </div>
        
        {imageUploadError && <Alert color={'failure'}>{imageUploadError}</Alert>}
        
        {formData?.image && (
          <div className="relative">
            <img 
              className="h-auto max-w-full rounded-lg object-cover max-h-96 mx-auto" 
              src={formData.image} 
              alt="Post preview"
            />
            <button
              type="button"
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 text-xs"
              onClick={() => setFormData({ ...formData, image: '' })}
            >
              ✕ Remove
            </button>
          </div>
        )}
        
        <ReactQuill 
          theme="snow" 
          placeholder='Write something...' 
          className='h-72 mb-12' 
          required 
          onChange={(value) => setFormData({ ...formData, content: value })} 
          value={formData.content || ''}
        />
        
        <Button 
          type='submit' 
          gradientDuoTone={'tealToLime'} 
          disabled={imageUploadProgress || updating}
        >
          {imageUploadProgress ? "Uploading..." : updating ? "Updating..." : "Update Post"}
        </Button>
        
        {publishError && <Alert className='mt-5' color='failure'>{publishError}</Alert>}
      </form>
    </div>
  );
}