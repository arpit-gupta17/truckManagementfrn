import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Copy, FileText, File, Printer, Settings, Search } from 'lucide-react';
import { fetchUserFromCookie } from '../../utils/auth';
import { Map } from 'lucide-react';

const ManageCompany = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetchUserFromCookie().then(setUser);

    const fetchCompanies = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/company/getCompanies', { credentials: 'include' });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to fetch companies');
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setCompanies(data);
        } else {
          console.warn('Data is not an array:', data);
          setCompanies([]);  // fallback
        }
      } catch (error) {
        console.error("Failed to fetch companies:", error);
        setCompanies([]);  // ensure it’s an array even if there's an error
      }
    };

    fetchCompanies();
  }, []);



  const handleCompanySelect = async (company) => {
    try {
      const res = await fetch('http://localhost:5000/api/company/select', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company_id: company.company_id,
          companyName: company.companyname,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to select company');

      console.log("Company selected:", data.message);
      navigate(`/dashboard/${company.id}`);
    } catch (err) {
      console.error("Error selecting company:", err.message);
      alert(`❌ ${err.message}`);
    }
  };



  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-semibold text-gray-900">XpertLogs</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/ManageCompany" className="text-gray-700 hover:text-blue-600">Home</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Refresh</a>
              <div className="flex items-center space-x-2 border border-gray-300 rounded px-2 py-1">
                {/* <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">J</div> */}

                <span className="text-gray-700">{user?.username || "Loading..."}</span>

                <ChevronDown className="h-5 w-5 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-600 mb-6">
          <a href="#" className="text-blue-600 hover:text-blue-800">Home</a>
          <span className="mx-2">/</span>
          <span>Manage Company</span>
        </div>

        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Manage Company</h1>
          <button
            onClick={() => navigate('/AddCompany')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <span className="mr-2">+</span>
            Add Company
          </button>
        </div>

        {/* Content Card */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Card Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex space-x-2">
              <button className="flex items-center text-gray-700 hover:text-blue-600 border border-gray-300 rounded-md px-3 py-1">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </button>
              <button className="flex items-center text-gray-700 hover:text-blue-600 border border-gray-300 rounded-md px-3 py-1">
                <FileText className="h-4 w-4 mr-2" />
                CSV
              </button>
              <button className="flex items-center text-gray-700 hover:text-blue-600 border border-gray-300 rounded-md px-3 py-1">
                <File className="h-4 w-4 mr-2" />
                Excel
              </button>
              <button className="flex items-center text-gray-700 hover:text-blue-600 border border-gray-300 rounded-md px-3 py-1">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </button>
              <div className="relative">
                <button className="flex items-center text-gray-700 hover:text-blue-600 border border-gray-300 rounded-md px-3 py-1">
                  <Settings className="h-4 w-4 mr-2" />
                  Column visibility
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Table */}
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">Company Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">DOT Number</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">Created By</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">Status</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleCompanySelect(company)}
                >
                  <td className="px-6 py-4 text-gray-900 border-b">{company.companyname}</td>
                  <td className="px-6 py-4 text-gray-700 border-b">{company.dot_number}</td>
                  <td className="px-6 py-4 text-gray-700 border-b">{company.createdby_username}</td>
                  <td className="px-6 py-4 border-b">
                    <span className="inline-flex items-center">
                      <span className={`h-2 w-2 rounded-full mr-2 ${company.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span className="text-gray-700">{company.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-blue-600 hover:underline border-b">
                    View
                  </td>
                </tr>
              ))}

            </tbody>
          </table>



          {/* Card Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Showing 1 to 10 of 400 entries
            </div>
            <div className="flex space-x-1">
              <button className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <button className="px-3 py-1 rounded-md bg-blue-600 text-white">1</button>
              <button className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">2</button>
              <button className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">3</button>
              <button className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">4</button>
              <button className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">5</button>
              <span className="px-3 py-1">...</span>
              <button className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">40</button>
              <button className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCompany;