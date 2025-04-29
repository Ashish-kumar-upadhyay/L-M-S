import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { bookAPI, userAPI } from "../utils/api";
import { 
  FiBook, 
  FiBookmark, 
  FiClock, 
  FiUser, 
  FiCalendar, 
  FiDollarSign, 
  FiBookOpen, 
  FiActivity,
  FiClipboard,
  FiCheckCircle
} from 'react-icons/fi';

interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  publishedDate: string;
}

interface BorrowedBook {
  _id: string;
  book: Book;
  borrowDate: string;
  returnDate: string;
  isReturned: boolean;
}

const MemberDashboard: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [books, setBooks] = useState<Book[]>([]);
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [pendingReturns, setPendingReturns] = useState<BorrowedBook[]>([]);
  const [historyBooks, setHistoryBooks] = useState<BorrowedBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user's books and borrowing data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        // In a real app, you would have API endpoints for these
        // For now we'll simulate with the book API
        const booksResponse = await bookAPI.getAllBooks();
        setBooks(booksResponse.data || []);

        // Simulate borrowing data until you have real endpoints
        const sampleBorrowedBooks = booksResponse.data
          .slice(0, 3)
          .map((book: Book) => ({
            _id: book._id,
            book: book,
            borrowDate: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            returnDate: new Date(Date.now() + Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            isReturned: false
          }));
        
        setBorrowedBooks(sampleBorrowedBooks);
        setPendingReturns(sampleBorrowedBooks.filter((book: BorrowedBook) => 
          new Date(book.returnDate) < new Date()
        ));

        const sampleHistory = booksResponse.data
          .slice(3, 8)
          .map((book: Book) => ({
            _id: book._id,
            book: book,
            borrowDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            returnDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            isReturned: true
          }));
        
        setHistoryBooks(sampleHistory);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load your library information");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Calculate fine amount
  const calculateFine = (returnDate: string): number => {
    const currentDate = new Date();
    const dueDate = new Date(returnDate);
    
    if (currentDate <= dueDate) return 0;
    
    const daysLate = Math.floor((currentDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysLate * 10; // ₹10 per day
  };

  // Total fine amount
  const totalFine = pendingReturns.reduce((sum, book) => sum + calculateFine(book.returnDate), 0);

  // Stats
  const stats = {
    totalBooks: borrowedBooks.length,
    booksReturned: historyBooks.length,
    overdueBooks: pendingReturns.length,
    fineAmount: totalFine
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#10190D] to-[#1a2c15] pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Member Dashboard</h1>
          <p className="text-gray-300">
            Welcome back, <span className="font-semibold">{user?.username || 'Member'}</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-6 py-4 rounded-lg mb-8">
            <p>{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-60">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          <>
            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300">Books Borrowed</p>
                    <p className="text-3xl font-bold text-white">{stats.totalBooks}</p>
                  </div>
                  <div className="bg-[#E9534B]/20 p-3 rounded-full">
                    <FiBook className="h-6 w-6 text-[#E9534B]" />
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300">Books Returned</p>
                    <p className="text-3xl font-bold text-white">{stats.booksReturned}</p>
                  </div>
                  <div className="bg-green-500/20 p-3 rounded-full">
                    <FiCheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300">Overdue Books</p>
                    <p className="text-3xl font-bold text-white">{stats.overdueBooks}</p>
                  </div>
                  <div className="bg-yellow-500/20 p-3 rounded-full">
                    <FiClock className="h-6 w-6 text-yellow-500" />
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300">Total Fine</p>
                    <p className="text-3xl font-bold text-white">₹{stats.fineAmount}</p>
                  </div>
                  <div className="bg-purple-500/20 p-3 rounded-full">
                    <FiDollarSign className="h-6 w-6 text-purple-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation tabs */}
            <div className="border-b border-white/20 mb-8">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 font-medium text-sm flex items-center space-x-2 border-b-2 px-1 ${
                    activeTab === 'overview'
                      ? 'border-[#E9534B] text-[#E9534B]'
                      : 'border-transparent text-gray-300 hover:text-white'
                  }`}
                >
                  <FiActivity className="h-5 w-5" />
                  <span>Overview</span>
                </button>

                <button
                  onClick={() => setActiveTab('borrowed')}
                  className={`py-4 font-medium text-sm flex items-center space-x-2 border-b-2 px-1 ${
                    activeTab === 'borrowed'
                      ? 'border-[#E9534B] text-[#E9534B]'
                      : 'border-transparent text-gray-300 hover:text-white'
                  }`}
                >
                  <FiBookOpen className="h-5 w-5" />
                  <span>Borrowed Books</span>
                </button>

                <button
                  onClick={() => setActiveTab('history')}
                  className={`py-4 font-medium text-sm flex items-center space-x-2 border-b-2 px-1 ${
                    activeTab === 'history'
                      ? 'border-[#E9534B] text-[#E9534B]'
                      : 'border-transparent text-gray-300 hover:text-white'
                  }`}
                >
                  <FiClipboard className="h-5 w-5" />
                  <span>History</span>
                </button>
              </nav>
            </div>

            {/* Tab content */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
              {/* Overview tab */}
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-6">Your Library Overview</h2>
                  
                  {/* Add profile info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/5 rounded-lg p-4 flex flex-col space-y-2">
                      <div className="flex items-center text-gray-300 mb-1">
                        <FiUser className="mr-2" />
                        <span>Account</span>
                      </div>
                      <h3 className="text-white text-lg">{user?.username}</h3>
                      <p className="text-gray-400">{user?.email}</p>
                      <Link 
                        to="/profile" 
                        className="text-[#E9534B] hover:text-[#d4483f] text-sm mt-2"
                      >
                        View Profile
                      </Link>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4 flex flex-col space-y-2">
                      <div className="flex items-center text-gray-300 mb-1">
                        <FiBookmark className="mr-2" />
                        <span>Membership</span>
                      </div>
                      <h3 className="text-white text-lg">Active Member</h3>
                      <p className="text-gray-400">Since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4 flex flex-col space-y-2">
                      <div className="flex items-center text-gray-300 mb-1">
                        <FiCalendar className="mr-2" />
                        <span>Next Due Date</span>
                      </div>
                      {borrowedBooks.length > 0 ? (
                        <>
                          <h3 className="text-white text-lg">
                            {new Date(borrowedBooks.sort((a, b) => 
                              new Date(a.returnDate).getTime() - new Date(b.returnDate).getTime()
                            )[0].returnDate).toLocaleDateString()}
                          </h3>
                          <p className="text-gray-400">
                            Book: {borrowedBooks.sort((a, b) => 
                              new Date(a.returnDate).getTime() - new Date(b.returnDate).getTime()
                            )[0].book.title}
                          </p>
                        </>
                      ) : (
                        <p className="text-white">No books borrowed</p>
                      )}
                    </div>
                  </div>

                  {/* Recent/Overdue */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent borrowings */}
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4">Recent Borrowings</h3>
                      {borrowedBooks.length > 0 ? (
                        <div className="space-y-4">
                          {borrowedBooks.slice(0, 3).map((book) => (
                            <div key={book._id} className="bg-white/5 rounded-lg p-4 flex justify-between items-center">
                              <div>
                                <h4 className="text-white font-medium">{book.book.title}</h4>
                                <p className="text-gray-400 text-sm">By {book.book.author}</p>
                                <p className="text-xs text-gray-500">
                                  Borrowed: {new Date(book.borrowDate).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-white">Due: {new Date(book.returnDate).toLocaleDateString()}</p>
                                {new Date(book.returnDate) < new Date() && (
                                  <p className="text-xs text-red-400">
                                    Fine: ₹{calculateFine(book.returnDate)}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400">No books borrowed yet</p>
                      )}
                    </div>

                    {/* Overdue books */}
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4">Overdue Books</h3>
                      {pendingReturns.length > 0 ? (
                        <div className="space-y-4">
                          {pendingReturns.map((book) => (
                            <div key={book._id} className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex justify-between items-center">
                              <div>
                                <h4 className="text-white font-medium">{book.book.title}</h4>
                                <p className="text-gray-400 text-sm">By {book.book.author}</p>
                                <p className="text-xs text-gray-500">
                                  Due: {new Date(book.returnDate).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-red-300">
                                  {Math.floor((new Date().getTime() - new Date(book.returnDate).getTime()) / (1000 * 60 * 60 * 24))} days overdue
                                </p>
                                <p className="text-xs text-red-400">
                                  Fine: ₹{calculateFine(book.returnDate)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400">No overdue books</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Borrowed books tab */}
              {activeTab === 'borrowed' && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-6">Your Borrowed Books</h2>
                  
                  {borrowedBooks.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-700">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                              Title
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                              Author
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                              Borrow Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                              Return Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                              Fine
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                          {borrowedBooks.map((book) => (
                            <tr key={book._id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-white">{book.book.title}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-300">{book.book.author}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-300">{new Date(book.borrowDate).toLocaleDateString()}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-300">{new Date(book.returnDate).toLocaleDateString()}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {new Date(book.returnDate) < new Date() ? (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-500/20 text-red-300">
                                    Overdue
                                  </span>
                                ) : (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-500/20 text-green-300">
                                    Active
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-300">
                                  {calculateFine(book.returnDate) > 0 ? 
                                    `₹${calculateFine(book.returnDate)}` : 
                                    '—'}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-white/5 rounded-lg p-8 text-center">
                      <FiBookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-white mb-1">No books borrowed</h3>
                      <p className="text-gray-400 mb-6">You haven't borrowed any books yet</p>
                      <Link 
                        to="/books" 
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#E9534B] hover:bg-[#d4483f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E9534B]"
                      >
                        Browse Books
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* History tab */}
              {activeTab === 'history' && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-6">Your Borrowing History</h2>
                  
                  {historyBooks.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-700">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                              Title
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                              Author
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                              Borrowed On
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                              Returned On
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                          {historyBooks.map((book) => (
                            <tr key={book._id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-white">{book.book.title}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-300">{book.book.author}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-300">{new Date(book.borrowDate).toLocaleDateString()}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-300">{new Date(book.returnDate).toLocaleDateString()}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-500/20 text-gray-300">
                                  Returned
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-white/5 rounded-lg p-8 text-center">
                      <FiClipboard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-white mb-1">No history found</h3>
                      <p className="text-gray-400">You haven't borrowed and returned any books yet</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MemberDashboard;
