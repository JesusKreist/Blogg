import { Box } from '@mui/system'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import Inputed from '../components/Input'
import Navbar from '../components/Navbar'
import ReactQuill from "react-quill";
import QuillToolbar, { modules, formats } from '../Edit/EditorToolbar'
import "react-quill/dist/quill.snow.css";
import "../Edit/styles.css"
import Editor from '../Editor/Editor'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import Spinner from '../components/Spinner'
import CircularColor from '../components/Spinner'
import {useQuery , gql, useMutation} from '@apollo/client'
import { EditorContext } from '../Editor/EditorProvider'

const CreatePost = () => {
    // const [state, setState] = React.useState({ value: null });
    const [image,setImage] = React.useState()
    const [isloading,setLoading] = React.useState(false)
    const [title,setTitle] = React.useState()
    const [url,setUrl] =  React.useState()
    const [body , setBody] = React.useState() 
    const toast = useToast() 
    const {dispatch,state} = useContext(EditorContext)
    
    const {html} = state 

    const [create,{loading,error,data}] = useMutation(CREATEPOST,{
        update(_,{data}){
            console.log(data)
        },
        variables:{body:html,title:title,coverPhoto:url}
    })

    const uploadImage = async(e) =>{
        const file = e.target.files[0]
        const form = new FormData()
        form.append('file',file)
        form.append('upload_preset',"pxfidyxe")
        try {
            setLoading(true)
            const res = await axios.post('https://api.cloudinary.com/v1_1/dgwm7s0yy/image/upload',form)
            await  setLoading(false)
            setUrl(res.data.url)
            console.log(res.data.url)
        } catch (error) {
            setLoading(false)
        }  
    }

    const Submit = async ()=>{
        // const token = JSON.parse(localStorage.getItem('token'))
        // const config = {
        //     headers:{
        //         'Content-Type': 'application/json',
        //         "Authorization":`Bearer ${token}`
        //     }
        // }
        // const data ={
        //     coverPhoto:url,
        //     body:html,
        //     title
        // }
        // console.log(token)
        // const res = await axios.post('http://localhost:4000/createpost',data,config)
        // console.log(res)
        create()
    } 
    return (
        <>
            <div className='bg-[#171d24] min-h-screen'>
                <nav className='bg-[#1F2937] p-3' >
                    <div className='flex w-[90%] mx-auto flex-row justify-between'>
                        <div className='space-x-4 flex items-center'>
                            <Link to='/'><h1 className='text-white font-mono font-bold'>Blogg</h1></Link> 
                        </div>
                        <div className='space-x-6 flex items-center'>
                            <h2 className='text-white font-mono font-bold'>Create Post</h2>
                        </div>
                    </div>
                </nav>
                <div className='w-3/5 mx-auto py-4'>
                    <Box p={4} sx={{ backgroundColor: '#1F2937' }}>
                        <div className='p-3 flex space-x-3'>
                            <label>
                                <p className="text-white font-bold font-mono">Upload a Cover Image</p>
                                <input type='file' accept="image/*"  onChange={uploadImage}  className='text-white rounded-md pt-3 cursor-pointer' placeholder='Add a Cover Image' />
                            </label>
                            {isloading && <CircularColor/>}
                        </div>
                       
                        <input placeholder='New Post title here ...' onChange={(e)=>setTitle(e.target.value)} className='p-5 outline-none text-white bg-transparent text-[45px]' />
                        <Editor />
                        <div className='space-x-4 flex items-center py-2'>
                          <button onClick={Submit} className='text-white font-bold font-mono'>Save Draft</button>
                          <button className='rounded-md bg-[#64e8ad] outline-none py-2 px-4 text-white'>Publish</button>
                        </div>
                        
                        {/* <QuillToolbar />
                        <ReactQuill
                            theme="snow"
                            value={state.value}
                            onChange={handleChange}
                            placeholder={"Write something awesome..."}
                            modules={modules}
                            formats={formats}
                        /> */}
                    </Box>
                </div>
            </div>
        </>
    )
}


const CREATEPOST = gql`
mutation($body: String!, $title: String!, $coverPhoto: String!){
  createPost(body: $body, title: $title, coverPhoto: $coverPhoto) {
    id
    isPublished
    username
    body
  }
}

`
export default CreatePost


