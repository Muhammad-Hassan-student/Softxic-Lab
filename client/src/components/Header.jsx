import React, { useEffect, useState } from 'react'
import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import { FaMoon, FaSun } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme } from '../redux/theme/themeSlice'
import { signOutSuccess } from '../redux/user/userSlice'

export default function Header() {
    const path = useLocation().pathname;
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const { theme } = useSelector(state => state.theme)
    const [searchTerm, setSearchTerm] = useState('');
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchFromUrl = urlParams.get('searchTerm');
        if (searchFromUrl) {
            setSearchTerm(searchFromUrl);
        }
    }, [location.search])

    const handleSignOut = async () => {
        try {
            const res = await fetch('/api/v1/user/signOut', {
                method: 'POST',
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
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

    return (
        <Navbar 
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled 
                    ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-700' 
                    : 'bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800'
            }`}
        >
            <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link to={'/'} className='flex items-center gap-2 group'>
                    <div className='w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105'>
                        <span className='text-white font-bold text-lg'>S</span>
                    </div>
                    <div className='flex flex-col'>
                        <span className='text-xl font-bold tracking-tight text-gray-900 dark:text-white'>
                            Softxic
                        </span>
                        <span className='text-[10px] font-medium text-gray-500 dark:text-gray-400 -mt-1'>
                            Agency's Blog
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation - Minimal Links */}
                <div className='hidden md:flex items-center gap-8'>
                    <Link 
                        to={'/'} 
                        className={`text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
                            path === '/' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300'
                        }`}
                    >
                        Home
                    </Link>
                    <Link 
                        to={'/about'} 
                        className={`text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
                            path === '/about' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300'
                        }`}
                    >
                        About
                    </Link>
                    <Link 
                        to={'/blog'} 
                        className={`text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
                            path === '/blog' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300'
                        }`}
                    >
                        Blog
                    </Link>
                </div>

                {/* Search and Actions */}
                <div className='flex items-center gap-3'>
                    {/* Search Form - Desktop */}
                    <form onSubmit={handleSubmit} className='hidden lg:block'>
                        <TextInput
                            type='text'
                            placeholder='Search'
                            rightIcon={AiOutlineSearch}
                            className='w-64'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>

                    {/* Theme Toggle */}
                    <Button 
                        className='w-9 h-9' 
                        color='gray' 
                        pill
                        onClick={() => dispatch(toggleTheme())}
                    >
                        {theme === 'light' ? <FaMoon className='w-4 h-4' /> : <FaSun className='w-4 h-4 text-yellow-400' />}
                    </Button>

                    {/* Search Button - Mobile */}
                    <Button 
                        className='w-9 h-9 lg:hidden' 
                        color='gray' 
                        pill
                        onClick={() => document.querySelector('input')?.focus()}
                    >
                        <AiOutlineSearch className='w-4 h-4' />
                    </Button>

                    {/* User Menu */}
                    {currentUser ? (
                        <Dropdown
                            arrowIcon={false}
                            inline
                            label={
                                <Avatar
                                    alt='User'
                                    img={currentUser.profilePicture}
                                    rounded
                                    className='ring-2 ring-indigo-500 cursor-pointer'
                                    size='sm'
                                />
                            }
                        >
                            <Dropdown.Header>
                                <span className='block text-sm font-semibold'>{currentUser.username}</span>
                                <span className='block text-xs text-gray-500 truncate'>{currentUser.email}</span>
                            </Dropdown.Header>
                            <Link to={'/dashboard?tab=profile'}>
                                <Dropdown.Item>Profile</Dropdown.Item>
                            </Link>
                            <Link to={'/dashboard?tab=posts'}>
                                <Dropdown.Item>My Posts</Dropdown.Item>
                            </Link>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={handleSignOut} className="text-red-600">
                                Sign Out
                            </Dropdown.Item>
                        </Dropdown>
                    ) : (
                        <Link to={'/sign-in'}>
                            <Button gradientDuoTone="purpleToBlue" size="sm" className="rounded-lg">
                                Sign In
                            </Button>
                        </Link>
                    )}
                    
                    <Navbar.Toggle className="md:hidden" />
                </div>
            </div>

            {/* Mobile Menu */}
            <Navbar.Collapse className="md:hidden">
                <div className="flex flex-col gap-2 py-4">
                    <Link 
                        to={'/'} 
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            path === '/' 
                                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                    >
                        Home
                    </Link>
                    <Link 
                        to={'/about'} 
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            path === '/about' 
                                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                    >
                        About
                    </Link>
                    <Link 
                        to={'/blog'} 
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            path === '/blog' 
                                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                    >
                        Blog
                    </Link>
                    
                    {/* Mobile Theme Toggle */}
                    <button
                        onClick={() => dispatch(toggleTheme())}
                        className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
                    >
                        {theme === 'light' ? <FaMoon className='w-4 h-4' /> : <FaSun className='w-4 h-4' />}
                        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                    </button>
                </div>
            </Navbar.Collapse>
        </Navbar>
    )
}