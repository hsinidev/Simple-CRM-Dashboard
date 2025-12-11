
import React, { useState, ReactNode } from 'react';
import SeoArticle from '../utils/SeoArticle';

const CosmicBackground = () => (
  <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden bg-black">
    <style>
      {`
        @keyframes drift {
          0% { transform: translate(0, 0); }
          50% { transform: translate(-5%, -5%); }
          100% { transform: translate(0, 0); }
        }
        @keyframes nebula-pulse {
          0% { opacity: 0.4; }
          50% { opacity: 0.7; }
          100% { opacity: 0.4; }
        }
        .star-field {
          background-image: 
            radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 40px 70px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 50px 160px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 90px 40px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 130px 80px, #ffffff, rgba(0,0,0,0));
          background-repeat: repeat;
          background-size: 200px 200px;
          opacity: 0.3;
          animation: drift 60s linear infinite;
        }
        .nebula {
          background: 
            radial-gradient(circle at 50% 50%, rgba(76, 29, 149, 0.4), transparent 60%),
            radial-gradient(circle at 80% 20%, rgba(124, 58, 237, 0.3), transparent 50%),
            radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.3), transparent 50%);
          filter: blur(40px);
          animation: nebula-pulse 10s ease-in-out infinite alternate;
        }
      `}
    </style>
    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-[#1a1a2e] to-black"></div>
    <div className="absolute inset-0 nebula"></div>
    <div className="absolute inset-0 star-field"></div>
  </div>
);

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-all scale-100">
        <header className="flex justify-between items-center p-5 border-b border-gray-700 bg-gray-800/50 rounded-t-xl">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
        </header>
        <main className="p-8 overflow-y-auto text-gray-300 leading-relaxed space-y-4">
          {children}
        </main>
      </div>
    </div>
  );
};


interface ThemeLayoutProps {
  children: ReactNode;
}

const ThemeLayout: React.FC<ThemeLayoutProps> = ({ children }) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const navLinks = ["About", "Contact", "Guide", "Privacy Policy", "Terms of Service", "DMCA"];

  const getModalContent = (modalName: string) => {
    switch (modalName) {
      case "About":
        return (
          <div className="space-y-4">
            <p>Welcome to the Simple CRM Dashboard, a cutting-edge, browser-based solution designed to empower freelancers, consultants, and small business owners. In an era where data privacy and speed are paramount, this application offers a unique proposition: powerful customer relationship management without the cloud overhead.</p>
            <p>Developed by HSINI MOHAMED, this tool represents a commitment to clean code, responsive design, and user-centric functionality. It leverages the latest web technologies, including React 19, TypeScript, and Tailwind CSS, to deliver a seamless experience across all devices.</p>
            <h3 className="text-xl font-bold text-white mt-4">Core Philosophy</h3>
            <p>We believe that managing your business shouldn't be complicated. By utilizing Local Storage, we ensure that your data remains strictly yours—stored on your device, accessible instantly, and never shared with third-party servers without your explicit action.</p>
          </div>
        );
      case "Contact":
        return (
          <div className="space-y-4">
            <p className="text-lg">We value your feedback and inquiries. Whether you have a technical question, a feature suggestion, or a partnership proposal, please don't hesitate to reach out.</p>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mt-4">
              <h3 className="text-xl font-bold text-white mb-4">Contact Information</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="font-semibold w-24 text-blue-400">Website:</span> 
                  <a href="https://doodax.com" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline transition-colors">doodax.com</a>
                </li>
                <li className="flex items-center">
                  <span className="font-semibold w-24 text-blue-400">Email:</span> 
                  <a href="mailto:hsini.web@gmail.com" className="hover:text-white hover:underline transition-colors">hsini.web@gmail.com</a>
                </li>
                <li className="flex items-center">
                  <span className="font-semibold w-24 text-blue-400">GitHub:</span> 
                  <a href="https://github.com/hsinidev" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline transition-colors">github.com/hsinidev</a>
                </li>
              </ul>
            </div>
            <p className="text-sm text-gray-500 mt-4">We aim to respond to all inquiries within 24-48 business hours.</p>
          </div>
        );
      case "Guide":
        return <SeoArticle />;
      case "Privacy Policy":
        return (
          <div className="space-y-4 text-sm">
             <p><strong>Last Updated: October 27, 2023</strong></p>
             <p>At Simple CRM Dashboard (accessible via doodax.com), one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Simple CRM Dashboard and how we use it.</p>
             <h3 className="text-lg font-bold text-white">1. Data Storage Policy</h3>
             <p>This application operates on a "Local-First" architecture. All data entered into the CRM (Contacts, Tasks, Notes) is stored exclusively in your web browser's Local Storage (localStorage API). We do not operate a backend server that stores your personal CRM data. No data is transmitted to us.</p>
             <h3 className="text-lg font-bold text-white">2. Information Collection</h3>
             <p>Since we do not host a backend database for user data, we do not collect, sell, trade, or rent your personal identification information to others.</p>
             <h3 className="text-lg font-bold text-white">3. Third-Party Libraries</h3>
             <p>We use standard web libraries (like React and Tailwind CSS) via CDNs. These requests are standard web traffic and are subject to the privacy policies of the respective CDN providers.</p>
             <h3 className="text-lg font-bold text-white">4. User Rights</h3>
             <p>You retain full ownership of your data. You can delete your data at any time by clearing your browser cache or using the delete features within the application.</p>
             <p>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at hsini.web@gmail.com.</p>
          </div>
        );
      case "Terms of Service":
        return (
          <div className="space-y-4 text-sm">
            <h3 className="text-lg font-bold text-white">1. Acceptance of Terms</h3>
            <p>By accessing and using this website (doodax.com), you accept and agree to be bound by the terms and provision of this agreement.</p>
            <h3 className="text-lg font-bold text-white">2. Use License</h3>
            <p>Permission is granted to use the Simple CRM Dashboard for personal or commercial contact management purposes. This software is provided "as is".</p>
            <h3 className="text-lg font-bold text-white">3. Disclaimer</h3>
            <p>The materials on Simple CRM Dashboard are provided on an 'as is' basis. The developer makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
            <h3 className="text-lg font-bold text-white">4. Limitations</h3>
            <p>In no event shall simple CRM Dashboard or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on this website.</p>
            <h3 className="text-lg font-bold text-white">5. Data Responsibility</h3>
            <p>You are solely responsible for backing up your data. Since data is stored locally, clearing your browser cache will result in permanent data loss unless you have exported your data using the provided Export feature.</p>
          </div>
        );
      case "DMCA":
        return (
          <div className="space-y-4">
             <p>We respect the intellectual property rights of others. It is our policy to respond to any claim that Content posted on the Service infringes on the copyright or other intellectual property rights of any person or entity.</p>
             <p>If you are a copyright owner, or authorized on behalf of one, and you believe that the copyrighted work has been copied in a way that constitutes copyright infringement, please submit your claim via email to <strong>hsini.web@gmail.com</strong>, with the subject line: "Copyright Infringement" and include in your claim a detailed description of the alleged infringement.</p>
             <p><strong>Contact for DMCA Notices:</strong><br/>Email: hsini.web@gmail.com<br/>Website: doodax.com</p>
          </div>
        );
      default:
        return null;
    }
  };


  return (
    <div className="relative min-h-screen flex flex-col font-sans text-gray-100 selection:bg-purple-500 selection:text-white">
      <CosmicBackground />
      
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/20 backdrop-blur-md supports-[backdrop-filter]:bg-black/20">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <span className="font-bold text-white text-lg">C</span>
              </div>
              <span className="font-bold text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">CRM Dashboard</span>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-1">
                {navLinks.map(link => (
                  <button 
                    key={link} 
                    onClick={() => setActiveModal(link)} 
                    className="px-4 py-2 rounded-full text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                  >
                    {link}
                  </button>
                ))}
              </div>
            </div>
            
             <div className="md:hidden">
              <select 
                onChange={(e) => setActiveModal(e.target.value)} 
                className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 outline-none focus:ring-2 focus:ring-purple-500"
                value={activeModal || ''}
              >
                <option value="" disabled>Menu</option>
                {navLinks.map(link => <option key={link} value={link}>{link}</option>)}
              </select>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {children}
      </main>

      <footer className="mt-auto py-8 border-t border-white/10 bg-black/40 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-400">© {new Date().getFullYear()} Simple CRM Dashboard. All rights reserved.</p>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-2">
              <p className="text-sm font-medium text-gray-300">
                Powered by <span className="text-white font-bold">HSINI MOHAMED</span>
              </p>
              <div className="flex gap-4 text-sm text-gray-400">
                <a href="https://github.com/hsinidev" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">GitHub</a>
                <span>•</span>
                <a href="https://doodax.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">doodax.com</a>
                <span>•</span>
                <a href="mailto:hsini.web@gmail.com" className="hover:text-purple-400 transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      <Modal 
        isOpen={!!activeModal} 
        onClose={() => setActiveModal(null)}
        title={activeModal || ''}
      >
        {activeModal && getModalContent(activeModal)}
      </Modal>
    </div>
  );
};

export default ThemeLayout;
