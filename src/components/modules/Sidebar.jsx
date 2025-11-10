import React from 'react';
import { FileText, HelpCircle, Smartphone, AlertTriangle, Settings, Truck } from 'lucide-react';
import { Link, useParams, useLocation } from 'react-router-dom';

const Sidebar = ({ collapsed }) => {
  const { id } = useParams();
  const location = useLocation();

  // FIX: The isActive function now checks for inclusion of the specific path segment.
  const isActive = (path) => location.pathname.includes(path);

  // Reusable Link/Item styling class (now applied to the <Link> component)
  const itemClassName = (pathSegment) => `
    px-4 py-3.5 flex items-center transition-all text-sm 
    ${isActive(pathSegment) ? "bg-gray-700 border-l-blue-600 font-medium" : "hover:bg-gray-700 hover:border-l-blue-600"}
    border-l-3 border-transparent cursor-pointer no-underline text-white w-full
  `;
  
  // Reusable icon class
  const iconClassName = `${collapsed ? 'mx-auto' : 'mr-3'} opacity-80 w-5 text-center`;

  return (
    <div className={`${collapsed ? 'w-16' : 'w-60'} bg-gray-800 text-white flex-shrink-0 shadow-lg h-screen fixed top-0 left-0 overflow-y-auto transition-all duration-300 pt-16`}>
      <ul className="m-0 p-0 list-none">

        {/* Dashboard */}
        <li className="border-l-3 border-transparent">
          <Link to={`/dashboard/${id}`} className={itemClassName(`/dashboard/${id}`)}>
            <span className={iconClassName}>
              <FileText size={16} />
            </span>
            {!collapsed && "Dashboard"}
          </Link>
        </li>
        
        {/* Unidentified Event */}
        <li className="border-l-3 border-transparent">
          <Link to={`/dashboard/${id}/UnidentifiedEvents`} className={itemClassName('UnidentifiedEvents')}>
            <span className={iconClassName}>
              <HelpCircle size={16} />
            </span>
            {!collapsed && "Unidentified Event"}
          </Link>
        </li>
        
        {/* Devices */}
        <li className="border-l-3 border-transparent">
          {/* FIX: Changed isActive check from 'Devices' to 'DeviceManagement' */}
          <Link to={`/dashboard/${id}/DeviceManagement`} className={itemClassName('DeviceManagement')}>
            <span className={iconClassName}>
              <Smartphone size={16} />
            </span>
            {!collapsed && "Devices"}
          </Link>
        </li>
        
        {/* Errors */}
        <li className="border-l-3 border-transparent">
          {/* FIX: Changed isActive check from 'Errors' to 'ErrorsManagement' */}
          <Link to={`/dashboard/${id}/ErrorsManagement`} className={itemClassName('ErrorsManagement')}>
            <span className={iconClassName}>
              <AlertTriangle size={16} />
            </span>
            {!collapsed && "Errors"}
          </Link>
        </li>
        
        {/* Manage */}
        <li className="border-l-3 border-transparent">
          {/* FIX: Changed isActive check from 'Manage' to 'CompanyManagement' */}
          <Link to={`/dashboard/${id}/CompanyManagement`} className={itemClassName('CompanyManagement')}>
            <span className={iconClassName}>
              <Settings size={16} />
            </span>
            {!collapsed && "Manage"}
          </Link>
        </li>
        
        {/* DOT */}
        <li className="border-l-3 border-transparent">
          {/* Using a clear path check for DOT */}
          <Link to={`/dashboard/${id}/DOT`} className={itemClassName('/DOT')}>
            <span className={iconClassName}>
              <Truck size={16} />
            </span>
            {!collapsed && "DOT"}
          </Link>
        </li>
        
        
      </ul>
    </div>
  );
};

export default Sidebar;


/*
import React from 'react';
import { FileText, HelpCircle, Smartphone, AlertTriangle, Settings, Truck } from 'lucide-react';
import { Link, useParams, useLocation } from 'react-router-dom';

const Sidebar = ({ collapsed }) => {
  const { id } = useParams();
  const location = useLocation();

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className={`${collapsed ? 'w-16' : 'w-60'} bg-gray-800 text-white flex-shrink-0 shadow-lg h-screen fixed top-0 left-0 overflow-y-auto transition-all duration-300 pt-16`}>
      <ul className="m-0 p-0 list-none">
        <li className={`px-4 py-3.5 flex items-center transition-all text-sm 
            ${isActive(`/dashboard/${id}`) ? "bg-gray-700 border-l-blue-600 font-medium" : "hover:bg-gray-700 hover:border-l-blue-600"}
            border-l-3 border-transparent cursor-pointer`}>
          <Link to={`/dashboard/${id}`} className="flex items-center text-inherit no-underline w-full">
            <span className={`${collapsed ? 'mx-auto' : 'mr-3'} opacity-80 w-5 text-center`}>
              <FileText size={16} />
            </span>
            {!collapsed && "Dashboard"}
          </Link>
        </li>
        <li className={`px-4 py-3.5 flex items-center transition-all text-sm 
            ${isActive('UnidentifiedEvents') ? "bg-gray-700 border-l-blue-600 font-medium" : "hover:bg-gray-700 hover:border-l-blue-600"}
            border-l-3 border-transparent cursor-pointer`}>
          <Link to={`/dashboard/${id}/UnidentifiedEvents`} className="flex items-center text-inherit no-underline w-full">
            <span className={`${collapsed ? 'mx-auto' : 'mr-3'} opacity-80 w-5 text-center`}>
              <HelpCircle size={16} />
            </span>
            {!collapsed && "Unidentified Event"}
          </Link>
        </li>
        <li className={`px-4 py-3.5 flex items-center transition-all text-sm 
            ${isActive('Devices') ? "bg-gray-700 border-l-blue-600 font-medium" : "hover:bg-gray-700 hover:border-l-blue-600"}
            border-l-3 border-transparent cursor-pointer`}>
          <Link to={`/dashboard/${id}/DeviceManagement`} className="flex items-center text-inherit no-underline w-full">
            <span className={`${collapsed ? 'mx-auto' : 'mr-3'} opacity-80 w-5 text-center`}>
              <Smartphone size={16} />
            </span>
            {!collapsed && "Devices"}
          </Link>
        </li>
        <li className={`px-4 py-3.5 flex items-center transition-all text-sm 
            ${isActive('Errors') ? "bg-gray-700 border-l-blue-600 font-medium" : "hover:bg-gray-700 hover:border-l-blue-600"}
            border-l-3 border-transparent cursor-pointer`}>
          <Link to={`/dashboard/${id}/ErrorsManagement`} className="flex items-center text-inherit no-underline w-full">
            <span className={`${collapsed ? 'mx-auto' : 'mr-3'} opacity-80 w-5 text-center`}>
              <AlertTriangle size={16} />
            </span>
            {!collapsed && "Errors"}
          </Link>
        </li>
        <li className={`px-4 py-3.5 flex items-center transition-all text-sm 
            ${isActive('Manage') ? "bg-gray-700 border-l-blue-600 font-medium" : "hover:bg-gray-700 hover:border-l-blue-600"}
            border-l-3 border-transparent cursor-pointer`}>
          <Link to={`/dashboard/${id}/CompanyManagement`} className="flex items-center text-inherit no-underline w-full">
            <span className={`${collapsed ? 'mx-auto' : 'mr-3'} opacity-80 w-5 text-center`}>
              <Settings size={16} />
            </span>
            {!collapsed && "Manage"}
          </Link>
        </li>
        <li className={`px-4 py-3.5 flex items-center transition-all text-sm 
            ${isActive('DOT') ? "bg-gray-700 border-l-blue-600 font-medium" : "hover:bg-gray-700 hover:border-l-blue-600"}
            border-l-3 border-transparent cursor-pointer`}>
          <Link to={`/dashboard/${id}/DOT`} className="flex items-center text-inherit no-underline w-full">
            <span className={`${collapsed ? 'mx-auto' : 'mr-3'} opacity-80 w-5 text-center`}>
              <Truck size={16} />
            </span>
            {!collapsed && "DOT"}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;*/