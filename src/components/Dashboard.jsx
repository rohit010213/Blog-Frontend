import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../css/Dashboard.css';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [editBlog, setEditBlog] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [blogIdToDelete, setBlogIdToDelete] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/v1/users/me', {
                    headers: {
                        'Authorization': `Bearer ${Cookies.get('accessToken')}`
                    }
                });
                setUser(response.data.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchBlogs = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/v1/blogs', {
                    headers: {
                        'Authorization': `Bearer ${Cookies.get('accessToken')}`
                    }
                });
                setBlogs(response.data.blogs);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        };

        fetchUserData();
        fetchBlogs();
    }, []);

    const handleLogout = () => {
        Cookies.remove('accessToken');
        window.location.href = '/login';
    };

    const handleCreateOrUpdateBlog = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (image) {
            formData.append('image', image);
        }

        try {
            if (editBlog) {
                await axios.put(`http://localhost:8000/api/v1/blogs/${editBlog._id}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${Cookies.get('accessToken')}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setMessage('Blog updated successfully!');
            } else {
                await axios.post('http://localhost:8000/api/v1/blogs', formData, {
                    headers: {
                        'Authorization': `Bearer ${Cookies.get('accessToken')}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setMessage('Blog created successfully!');
            }
            setTitle('');
            setDescription('');
            setImage(null);
            setEditBlog(null);
            // Refresh the blog list
            const response = await axios.get('http://localhost:8000/api/v1/blogs', {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('accessToken')}`
                }
            });
            setBlogs(response.data.blogs);
        } catch (error) {
            setMessage('Failed to save blog.');
            console.error('Error saving blog:', error);
        }
    };

    const handleDelete = async () => {
        if (!blogIdToDelete) return;

        console.log('Deleting blog with ID:', blogIdToDelete); 
        try {
            await axios.delete(`http://localhost:8000/api/v1/blogs/${blogIdToDelete}`, {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('accessToken')}`
                }
            });
            setBlogIdToDelete(null);
            setShowConfirm(false);
            // Refresh the blog list
            const response = await axios.get('http://localhost:8000/api/v1/blogs', {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('accessToken')}`
                }
            });
            setBlogs(response.data.blogs);
        } catch (error) {
            console.error('Error deleting blog:', error);
            setMessage('Failed to delete blog.');
        }
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <button onClick={handleLogout} className="logout-button">Logout</button>
                {user && user.avatar && (
                    <img src={user.avatar} alt="User Avatar" className="user-image" />
                )}
            </div>
            <div className="dashboard-content">
                <h1>Welcome to Your Dashboard</h1>
                <form className="blog-form" onSubmit={handleCreateOrUpdateBlog}>
                    <input
                        type="text"
                        placeholder="Blog Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="Blog Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                    <button type="submit">{editBlog ? 'Update Blog' : 'Create Blog'}</button>
                    {message && <p className="message">{message}</p>}
                </form>

                <h2>Blog List</h2>
                <table className="blog-list">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Image</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blogs.map(blog => (
                            <tr key={blog._id}>
                                <td>{blog.title}</td>
                                <td>
                                    <img src={blog.image} alt={blog.title} className="blog-image" />
                                </td>
                                <td>{blog.description}</td>
                                <td>
                                    <button onClick={() => { setEditBlog(blog); setTitle(blog.title); setDescription(blog.description); setImage(null); }}>Edit</button>
                                    <button
                                        onClick={() => {
                                            setBlogIdToDelete(blog._id);
                                            setShowConfirm(true);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {showConfirm && (
                    <div className="delete-confirmation">
                        <p>Are you sure you want to delete this blog?</p>
                        <button onClick={handleDelete}>Yes</button>
                        <button onClick={() => setShowConfirm(false)}>No</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
