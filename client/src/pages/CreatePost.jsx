import React, { useState } from 'react';
import { Alert, Button, FileInput, Select, TextInput, Label, Spinner } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  HiDocumentText, 
  HiPhotograph, 
  HiTrash, 
  HiCheckCircle, 
  HiExclamationCircle,
  HiEye,
  HiEyeOff,
  HiCloudUpload,
  HiX
} from 'react-icons/hi';

// 🔥 Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || '';

export default function CreatePost() {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  // Quill modules configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'check',
    'align', 'blockquote', 'code-block', 'link', 'image', 'video'
  ];

  // Handle file selection with preview
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreviewImage(previewUrl);
      setImageUploadError(null);
    }
  };

  // 🔥 FIXED: Upload to Cloudinary via Backend with absolute URL
  const handleUploadImage = async () => {
    if (!file) {
      setImageUploadError('Please select an image first');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setImageUploadError('Image must be less than 5MB');
      return;
    }
    
    const formDataImg = new FormData();
    formDataImg.append('image', file);
    
    setImageUploadProgress(0);
    setImageUploadError(null);
    
    try {
      // 🔥 FIX: Use absolute URL with API_URL
      const res = await fetch(`${API_URL}/api/v1/upload/upload`, {
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
      setTimeout(() => {
        setImageUploadProgress(null);
        setPreviewImage(null);
      }, 1000);
      
    } catch (error) {
      setImageUploadError('Image upload failed');
      setImageUploadProgress(null);
      console.error(error);
    }
  };

  // 🔥 FIXED: Submit post with absolute URL
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setPublishError('Please add a title for your post');
      return;
    }
    if (!formData.content.trim()) {
      setPublishError('Please add content to your post');
      return;
    }
    
    setIsSubmitting(true);
    setPublishError(null);
    
    try {
      // 🔥 FIX: Use absolute URL with API_URL
      const res = await fetch(`${API_URL}/api/v1/post/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setPublishError(data.message || 'Failed to create post');
        setIsSubmitting(false);
        return;
      }
      
      if (formData.status === 'published') {
        navigate(`/post/${data.slug}`);
      } else {
        navigate('/dashboard?tab=posts');
      }
      
    } catch (error) {
      setPublishError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  const categories = [
    { value: 'uncategorized', label: 'Select a category' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'reactjs', label: 'React.js' },
    { value: 'nextjs', label: 'Next.js' },
    { value: 'nodejs', label: 'Node.js' },
    { value: 'mongodb', label: 'MongoDB' },
    { value: 'saas', label: 'SaaS' },
    { value: 'enterprise', label: 'Enterprise' },
    { value: 'ai', label: 'Artificial Intelligence' },
  ];

  return (
    <div className="min-h-screen mt-10 bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg mb-4">
            <HiDocumentText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
            Create New Post
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Share your knowledge with the Softxic community
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Title */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <Label htmlFor="title" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
              Post Title
            </Label>
            <TextInput 
              id="title"
              type='text' 
              placeholder="Enter an engaging title..." 
              className="w-full"
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              A compelling title attracts more readers
            </p>
          </div>

          {/* Category and Status Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <Label htmlFor="category" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                Category
              </Label>
              <Select 
                id="category"
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                value={formData.category}
                className="w-full"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </Select>
            </div>

            {/* Status */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <Label className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                Post Status
              </Label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'draft' })}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${
                    formData.status === 'draft'
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                      : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-amber-300'
                  }`}
                >
                  <HiEyeOff className="w-4 h-4" />
                  <span className="font-medium">Draft</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'published' })}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${
                    formData.status === 'published'
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                      : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-green-300'
                  }`}
                >
                  <HiEye className="w-4 h-4" />
                  <span className="font-medium">Publish</span>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                {formData.status === "draft" 
                  ? "Draft posts are only visible to you. Publish when ready to share with the world." 
                  : "Published posts will be visible to everyone immediately."}
              </p>
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <Label className="text-gray-700 dark:text-gray-300 font-semibold mb-3 block">
              Featured Image
            </Label>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 border-2 border-dashed border-indigo-300 dark:border-indigo-700 rounded-xl bg-indigo-50/30 dark:bg-indigo-900/10">
              <div className="flex-1 w-full">
                <FileInput 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileSelect}
                  className="w-full"
                />
                {file && (
                  <p className="text-xs text-gray-500 mt-2">
                    Selected: {file.name}
                  </p>
                )}
              </div>
              <Button 
                type='button' 
                gradientDuoTone="purpleToPink" 
                size="md"
                onClick={handleUploadImage} 
                disabled={!!imageUploadProgress}
                className="whitespace-nowrap"
              >
                {imageUploadProgress ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    {imageUploadProgress}%
                  </>
                ) : (
                  <>
                    <HiCloudUpload className="w-4 h-4 mr-2" />
                    Upload
                  </>
                )}
              </Button>
            </div>
            
            {imageUploadError && (
              <Alert color="failure" className="mt-4 rounded-xl">
                <div className="flex items-center gap-2">
                  <HiExclamationCircle className="w-5 h-5" />
                  <span>{imageUploadError}</span>
                </div>
              </Alert>
            )}
            
            {/* Image Preview */}
            {(formData.image || previewImage) && (
              <div className="relative mt-4 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 p-2">
                <img 
                  className="w-full h-auto max-h-64 object-contain rounded-lg" 
                  src={previewImage || formData.image} 
                  alt="Post preview"
                />
                <button
                  type="button"
                  className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                  onClick={() => {
                    setFormData({ ...formData, image: '' });
                    setFile(null);
                    setPreviewImage(null);
                  }}
                >
                  <HiTrash className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Content Editor */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <Label className="text-gray-700 dark:text-gray-300 font-semibold mb-3 block">
              Post Content
            </Label>
            <ReactQuill 
              theme="snow" 
              placeholder="Write your amazing content here..." 
              className="h-80 mb-12" 
              required 
              modules={modules}
              formats={formats}
              onChange={(value) => setFormData({ ...formData, content: value })} 
            />
          </div>

          {/* Submit Button */}
          <div className="sticky bottom-4 z-10">
            <Button 
              type='submit' 
              gradientDuoTone="purpleToPink" 
              disabled={!!imageUploadProgress || isSubmitting}
              className="w-full rounded-xl py-3 text-lg font-semibold shadow-lg"
              size="lg"
            >
              {imageUploadProgress ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Uploading...
                </>
              ) : isSubmitting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Creating...
                </>
              ) : formData.status === "published" ? (
                <>
                  <HiCheckCircle className="w-5 h-5 mr-2" />
                  Publish Post
                </>
              ) : (
                <>
                  <HiDocumentText className="w-5 h-5 mr-2" />
                  Save Draft
                </>
              )}
            </Button>
          </div>

          {/* Error Message */}
          {publishError && (
            <Alert color="failure" className="rounded-xl">
              <div className="flex items-center gap-2">
                <HiExclamationCircle className="w-5 h-5" />
                <span>{publishError}</span>
              </div>
            </Alert>
          )}
        </form>
      </div>
    </div>
  );
}