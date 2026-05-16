import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Modal, Table, Button, Badge } from "flowbite-react";
import { 
  HiOutlineExclamationCircle, 
  HiMail, 
  HiEye, 
  HiTrash, 
  HiCheckCircle, 
  HiXCircle,
  HiSearch,
  HiFilter,
  HiRefresh,
  HiDownload,
  HiMailOpen,
  HiReply,
  HiUser,
  HiCalendar,
  HiTag
} from "react-icons/hi";
import { Link } from "react-router-dom";

export default function AdminContactMessages() {
  const { currentUser } = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({ totalMessages: 0, unreadCount: 0, readCount: 0, repliedCount: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const API_URL = import.meta.env.VITE_API_URL || "";

  // Fetch messages
  const fetchMessages = async () => {
    if (currentUser?.role !== "admin") return;

    setIsRefreshing(true);
    try {
      let url = `${API_URL}/api/v1/contact/admin/messages?limit=100`;
      if (filterStatus !== "all") url += `&status=${filterStatus}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;

      const res = await fetch(url, {
        credentials: "include",
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(data.messages);
        setStats({
          totalMessages: data.totalMessages,
          unreadCount: data.unreadCount,
          readCount: data.readCount,
          repliedCount: data.repliedCount,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [currentUser, filterStatus, searchTerm]);

  const handleDelete = async () => {
    if (!messageToDelete) return;
    try {
      const res = await fetch(`${API_URL}/api/v1/contact/admin/messages/${messageToDelete}`, {
        method: "DELETE",
        credentials: "include",
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((msg) => msg._id !== messageToDelete));
        setShowModal(false);
        fetchMessages();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAsReplied = async (messageId) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/contact/admin/messages/${messageId}/reply`, {
        method: "PUT",
        credentials: "include",
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === messageId ? { ...msg, status: "replied" } : msg
          )
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewMessage = async (message) => {
    setSelectedMessage(message);
    setShowViewModal(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "unread":
        return <Badge color="failure" className="flex items-center gap-1 px-2 py-1"><HiXCircle className="w-3 h-3" /> Unread</Badge>;
      case "read":
        return <Badge color="warning" className="flex items-center gap-1 px-2 py-1"><HiEye className="w-3 h-3" /> Read</Badge>;
      case "replied":
        return <Badge color="success" className="flex items-center gap-1 px-2 py-1"><HiCheckCircle className="w-3 h-3" /> Replied</Badge>;
      default:
        return <Badge color="gray" className="px-2 py-1">{status}</Badge>;
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMessages = messages.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(messages.length / itemsPerPage);

  if (currentUser?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-red-100 to-red-200 flex items-center justify-center">
            <HiOutlineExclamationCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-700">Access Denied</h2>
          <p className="text-gray-500 mt-2">Admin privileges required to view contact messages.</p>
          <Button gradientDuoTone="purpleToPink" className="mt-4" onClick={() => window.location.href = '/'}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
              Contact Messages
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage and respond to all contact form submissions
            </p>
          </div>
          <Button
            size="sm"
            color="gray"
            onClick={fetchMessages}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <HiRefresh className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Messages</p>
                <p className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.totalMessages}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <HiMail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Unread</p>
                <p className="text-2xl md:text-3xl font-bold text-red-600 dark:text-red-400">{stats.unreadCount}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <HiMailOpen className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Read</p>
                <p className="text-2xl md:text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.readCount}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <HiEye className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Replied</p>
                <p className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">{stats.repliedCount}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <HiReply className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
              <HiFilter className="w-4 h-4" /> Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2.5 focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">📋 All Messages</option>
              <option value="unread">📩 Unread</option>
              <option value="read">👁️ Read</option>
              <option value="replied">✅ Replied</option>
            </select>
          </div>
          <div className="flex-[2]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
              <HiSearch className="w-4 h-4" /> Search Messages
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, email, subject, or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2.5 pl-10 focus:ring-2 focus:ring-purple-500"
              />
              <HiSearch className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl border">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-500">Loading messages...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl border">
          <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
            <HiMail className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-lg font-medium text-gray-600">No messages found</p>
          <p className="text-sm text-gray-500 mt-1">Try changing your filters or search term</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <Table hoverable className="shadow-md rounded-xl">
              <Table.Head className="bg-gray-50 dark:bg-gray-800">
                <Table.HeadCell className="px-4 py-3">Date</Table.HeadCell>
                <Table.HeadCell className="px-4 py-3">Name</Table.HeadCell>
                <Table.HeadCell className="px-4 py-3">Email</Table.HeadCell>
                <Table.HeadCell className="px-4 py-3">Subject</Table.HeadCell>
                <Table.HeadCell className="px-4 py-3">Status</Table.HeadCell>
                <Table.HeadCell className="px-4 py-3">Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {currentMessages.map((msg) => (
                  <Table.Row key={msg._id} className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${msg.status === "unread" ? "bg-blue-50 dark:bg-blue-900/20 font-semibold" : ""}`}>
                    <Table.Cell className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-1">
                        <HiCalendar className="w-3 h-3 text-gray-400" />
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </div>
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <HiUser className="w-4 h-4 text-gray-400" />
                        <span>{msg.name}</span>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3">
                      <a href={`mailto:${msg.email}`} className="text-blue-600 hover:underline">
                        {msg.email}
                      </a>
                    </Table.Cell>
                    <Table.Cell className="max-w-xs truncate px-4 py-3">
                      <div className="flex items-center gap-1">
                        <HiTag className="w-3 h-3 text-gray-400" />
                        {msg.subject}
                      </div>
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3">{getStatusBadge(msg.status)}</Table.Cell>
                    <Table.Cell className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Button size="xs" gradientDuoTone="purpleToPink" onClick={() => handleViewMessage(msg)} className="whitespace-nowrap">
                          <HiEye className="w-3 h-3 mr-1" /> View
                        </Button>
                        {msg.status !== "replied" && (
                          <Button size="xs" gradientDuoTone="greenToBlue" onClick={() => handleMarkAsReplied(msg._id)} className="whitespace-nowrap">
                            <HiCheckCircle className="w-3 h-3 mr-1" /> Reply
                          </Button>
                        )}
                        <Button size="xs" color="failure" onClick={() => { setMessageToDelete(msg._id); setShowModal(true); }} className="whitespace-nowrap">
                          <HiTrash className="w-3 h-3" />
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3">
            {currentMessages.map((msg) => (
              <div
                key={msg._id}
                className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border ${msg.status === "unread" ? "border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700"}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{msg.name}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <HiCalendar className="w-3 h-3" />
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {getStatusBadge(msg.status)}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span className="font-medium">Subject:</span> {msg.subject}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {msg.message}
                </p>
                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <Button size="xs" gradientDuoTone="purpleToPink" onClick={() => handleViewMessage(msg)}>
                    <HiEye className="w-3 h-3 mr-1" /> View
                  </Button>
                  {msg.status !== "replied" && (
                    <Button size="xs" gradientDuoTone="greenToBlue" onClick={() => handleMarkAsReplied(msg._id)}>
                      <HiCheckCircle className="w-3 h-3 mr-1" /> Mark Replied
                    </Button>
                  )}
                  <Button size="xs" color="failure" onClick={() => { setMessageToDelete(msg._id); setShowModal(true); }}>
                    <HiTrash className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center items-center gap-2 mt-6">
              <Button
                size="xs"
                color="gray"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-8 h-8 rounded-lg transition-all ${
                      currentPage === idx + 1
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              <Button
                size="xs"
                color="gray"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* View Message Modal */}
      <Modal show={showViewModal} onClose={() => setShowViewModal(false)} size="2xl" className="z-50">
        <Modal.Header className="!p-4 border-b bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <div className="flex items-center gap-2">
            <HiMail className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-gray-800 dark:text-white">Message from {selectedMessage?.name}</span>
          </div>
        </Modal.Header>
        <Modal.Body className="!p-6">
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Name</p>
                  <p className="font-medium">{selectedMessage.name}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <a href={`mailto:${selectedMessage.email}`} className="font-medium text-blue-600 hover:underline">
                    {selectedMessage.email}
                  </a>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Date Received</p>
                  <p className="font-medium">{new Date(selectedMessage.createdAt).toLocaleString()}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  {getStatusBadge(selectedMessage.status)}
                </div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Subject</p>
                <p className="font-medium">{selectedMessage.subject}</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Message</p>
                <p className="whitespace-pre-wrap leading-relaxed">{selectedMessage.message}</p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="!p-4 border-t flex flex-wrap justify-end gap-2">
          <a
            href={`mailto:${selectedMessage?.email}?subject=Re: ${selectedMessage?.subject}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            <HiMail className="w-4 h-4" /> Reply via Email
          </a>
          <Button color="gray" onClick={() => setShowViewModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md" className="z-50">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <HiTrash className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
              Delete this message?
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              This action cannot be undone. The message will be permanently removed.
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <Button color="failure" onClick={handleDelete}>Yes, Delete</Button>
            <Button color="gray" onClick={() => setShowModal(false)}>Cancel</Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}