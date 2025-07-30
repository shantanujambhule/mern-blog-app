import React, { useEffect, useRef, useState } from 'react';
import { assets, blogCategories } from '../../assets/assets';
import Quill from 'quill';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import {parse} from 'marked'

const AddBlog = () => {
  const { axios } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [image, setImage] = useState(false);
  const [title, setTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [category, setCategory] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setIsAdding(true);

      const description = quillRef.current?.root?.innerHTML;

      const blog = {
        title,
        subTitle,
        description,
        category,
        isPublished,
      };

      const formData = new FormData();
      formData.append('blog', JSON.stringify(blog));
      formData.append('image', image);

      const { data } = await axios.post('/api/blog/add', formData);

      if (data.success) {
        toast.success(data.message);
        // Reset form
        setImage(false);
        setTitle('');
        setSubTitle('');
        setCategory('');
        setIsPublished(false);
        quillRef.current.root.innerHTML = '';
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsAdding(false);
    }
  };

  const genrateContent = async () => {
  if (!title) return toast.error('Please enter title');

  try {
    setLoading(true);
    const { data } = await axios.post('/api/blog/generate', { prompt: title });

    console.log('API response:', data); // <--- ADD THIS

    if (data.success && data.contents) {
      quillRef.current.root.innerHTML = parse(data.contents); // ✅ Only parse if content exists
    } else {
      toast.error(data.message || "No content returned.");
    }
  } catch (error) {
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: 'snow' });
    }
  }, []);

  return (
    <form onSubmit={onSubmitHandler} className="flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll">
      <div className="bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded">
        <p>Upload Thumbnail</p>
        <label htmlFor="image">
          <img
            src={!image ? assets.upload_area : URL.createObjectURL(image)}
            alt=""
            className="mt-2 h-16 rounded cursor-pointer"
          />
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden required />
        </label>

        <p className="mt-4">Blog Title</p>
        <input
          type="text"
          placeholder="Type here"
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          required
        />

        <p className="mt-4">Sub Title</p>
        <input
          type="text"
          placeholder="Type here"
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
          onChange={(e) => setSubTitle(e.target.value)}
          value={subTitle}
          required
        />

        <p className="mt-4">Description</p>
        <div className="max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative">
          <div ref={editorRef}></div>
          <button disabled={loading}
            className="absolute bottom-1 right-2 ml-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:underline cursor-pointer"
            type="button"
            onClick={genrateContent}
          >
            Generate with AI
          </button>
        </div>

        <p className="mt-4">Blog Category</p>
        <select
          onChange={(e) => setCategory(e.target.value)}
          value={category}
          required
          className="mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded"
        >
          <option value="">Select Category</option>
          {blogCategories.map((item, index) => {
            return (
              <option key={index} value={item}>
                {item}
              </option>
            );
          })}
        </select>

        <div className="flex items-center gap-2 mt-4">
          <p>Publish Now</p>
          <input
            type="checkbox"
            className="scale-125 cursor-pointer"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
        </div>

        <button
          disabled={isAdding}
          className="bg-primary text-white mt-8 w-40 h-10 rounded cursor-pointer text-sm"
          type="submit"
        >
          {isAdding ? 'Adding...' : 'Add Blog'}
        </button>
      </div>
    </form>
  );
};

export default AddBlog;
