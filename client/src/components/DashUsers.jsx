import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Modal, Table,Button } from "flowbite-react";
import {HiOutlineExclamationCircle} from 'react-icons/hi'
import {FaCheck,FaTimes} from 'react-icons/fa'
import { Link } from "react-router-dom";

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore,setShowMore] =useState(true);
  const [showModal,setShowModal]=useState(false);
  const [userIdToDelete,setUserIdToDelete]=useState('')

  console.log(userIdToDelete);
  //get post
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/user/getUsers`, {credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      }});
        const data = await res.json();
        if (res.ok) {
            setUsers(data.users);
          if(data.users.length < 3){
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);
  const handleShowMore= async () => {
    const startIndex= users.length;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/user/getUsers?&startIndex=${startIndex}`, 
        {credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      }}
       );
      const data= await res.json();
      if(res.ok){
        setUsers((prev) => [...prev, ...data.users]);
        if(data.users.length < 3) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  //Post delete
  const handleDeleteUser=async () => {
    setShowModal(false);
    try {
      const res=await fetch(`${import.meta.env.VITE_API_URL}/api/v1/user/delete/${userIdToDelete}`,{
        method: 'DELETE',
        credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      }
      });
      const data =await res.json();
      if(!res.ok){
        console.log(data.message)
      }else{
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
      }
    } catch (error) {
      console.log(error.message);
    }
  }

   if (currentUser?.role !== "admin") {
    return (
      <div className="flex-1 p-4 text-center text-red-500">
        Access Denied. Only admins can view this page.
      </div>
    );
  }
  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
             
            </Table.Head>
            {users.map((user) => (
              <Table.Body className="divide-y" key={user._id}> 
                <Table.Row className="bg-white dark:border-gray-500 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="w-10 h-10 object-cover bg-gray-500 rounded-full"
                      />
                   
                  </Table.Cell>
                  <Table.Cell>
                   {user.username}
                  </Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.isAdmin ? <FaCheck className="text-green-700 text-lg"/> : <FaTimes className="text-red-600"/>}</Table.Cell>
                  <Table.Cell>
                    <span className='font-medium text-red-500 hover:underline cursor-pointer' onClick={() => {setShowModal(true); setUserIdToDelete(user._id)}}>Delete</span>
                  </Table.Cell>
                 
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">Show More</button>
          )}
        </>
      ) : (
        <h1>You have no posts yet</h1>
      )}

      
        <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
            <Modal.Header/>
            <Modal.Body>
              <div className="text-center">
                <HiOutlineExclamationCircle className='h-12 w-12 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
                <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-200'>Are you sure you want to delete your account?</h3>
              </div>
              <div className='flex justify-center gap-4'>
                <Button color={'failure'} onClick={handleDeleteUser}>Yes, I'm sure</Button>
                <Button color={'gray'} onClick={() => setShowModal(false)}>No, cancel</Button>
              </div>
            </Modal.Body>
        </Modal>
    </div>
  );
}
