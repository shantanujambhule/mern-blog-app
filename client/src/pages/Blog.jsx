import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { assets, } from '../assets/assets'
import Navbar from '../components/Navbar'
import Moment from 'moment'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'


const Blog = () => {
  const {id} = useParams()

  const {axios} = useAppContext()

  const [data, setData] = useState(null)
  const [comments, setComments] = useState([])
  const [name, setName] = useState('')
  const [content, setContent] = useState('')


  const fetchBlogData = async () => {
    try {
      const {data} = await axios.get(`/api/blog/${id}`)
      data.success ? setData(data.blog) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
    }
  

  const fetchComments = async () => {
    
    try {
      const {data} = await axios.get(`/api/blog/comments?blogId=${id}`)
      if(data.success){
        setComments(data.comments)}
        else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const addComment = async (e) => {
    e.preventDefault();
    try {
      const {data} = await axios.post('/api/blog/add-comments',{blog: id, name, content});
      if(data.success){
        toast.success(data.message);
        setName('')
        setContent('')
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
   fetchBlogData()
   fetchComments()
  }, [])
  
  return data ? (
    <div className='relative'>
      <img src={assets.gradientBackground} className='absolute -top-50 -z-1 opacity-50' alt="" />
      <Navbar/>
      <div className='text-center mt-20 text-gray-600'>
        <p className='text-primary py-4 font-medium'>Published at {Moment(data.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</p>
        <h1 className='text-2xl font-semibold sm:text-5xl max-w-2xl mx-auto text-gray-800'>{data.title}</h1>
        <h2 className='my-5 max-w-lg truncate mx-auto'>{data.subTitle}</h2>
      </div>
      <div className='mx-5 max-w-5xl md:mx-auto my-10 mt-6'>
        <img src={data.image} alt="" className='rounded-3xl mb-5' />
        <div className='rich-text max-w-3xl mx-auto' dangerouslySetInnerHTML={{__html: data.description}}></div>
     
        <div className='mt-14 mb-10 max-w-3xl mx-auto'>
          <p className='font-semibold mb-4'>Comments({comments.length})</p>
          <div className='flex flex-col gap-4'>
            {comments.map((item, index) => (
              <div key={index} className='relative bg-primary/2 border border-primary/5 max-w-xl p-4 rounded text-gray-600'>
                <div className='flex items-center gap-4 mb-2'>
                  <img src={assets.user_icon} className='w-6' alt="" />
                  <p className='font-medium'>{item.name}</p>
                </div>
                <p className='text-sm max-w-md ml-8'>{item.content}</p>
                <div className='absolute right-4 bottom-3 text-xs flex items-center gap-2'>{Moment(item.createdAt).fromNow()}</div>
              </div>
            ))}
         
        </div>
      </div>
      <div className='max-w-3xl mx-auto'>
        <p className='font-semibold mb-4'>Add Comments</p>
        <form onSubmit={addComment} className='flex flex-col items-start gap-4 max-w-lg'>
            <input onChange={(e) => setName(e.target.value)} value={name} placeholder='Name' required 
            className='w-full p-2 border border-gray-300 rounded outline-none' />
            <textarea onChange={(e) => setContent(e.target.value)} value={content} placeholder='Comment' required 
            className='w-full p-2 border border-gray-300 rounded outline-none' />
            <button className='bg-primary text-white rounded p-2 px-8 hover:scale-102 transition-all cursor-pointer' type='submit'>Submit</button>
        </form>

      </div>
      <div className='my-24 max-w-3xl mx-auto'>
        <p className='font-semibold my-4'>Share this blog at Social Media</p>
            <div className='flex'>
              <img src={assets.facebook_icon} alt="" />
              <img src={assets.twitter_icon} alt="" />
              <img src={assets.googleplus_icon} alt="" />
            </div>
      </div>
    </div>
    <Footer/>
    </div>
  ) : 
    <div><Loader/></div>
  
}

export default Blog
