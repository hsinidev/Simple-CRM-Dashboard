
import React, { useState, ReactNode } from 'react';
import SeoArticle from '../utils/SeoArticle';

const CosmicBackground = () => (
  <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
    <style>
      {`
        @keyframes move-bg {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-bg {
          background: linear-gradient(-45deg, #0f0c29, #302b63, #24243e, #0f0c29, #1a2a6c, #b21f1f, #fdbb2d);
          background-size: 400% 400%;
          animation: move-bg 30s ease infinite;
        }
      `}
    </style>
    <div className="animated-bg w-full h-full"></div>
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
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <header className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </header>
        <main className="p-6 overflow-y-auto text-gray-300">
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
        return <p>This Simple CRM Dashboard is a lightweight, responsive application designed to help individuals and small businesses manage customer relationships. It leverages browser Local Storage for data persistence, ensuring your data stays private and on your own device. Built with React, TypeScript, and Tailwind CSS by HSINI MOHAMED.</p>;
      case "Contact":
        return (
          <div>
            <p className="mb-4">For inquiries, please reach out via the following channels:</p>
            <ul className="list-disc list-inside">
              <li>Website: <a href="https://doodax.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">doodax.com</a></li>
              <li>Email: <a href="mailto:hsini.web@gmail.com" className="text-blue-400 hover:underline">hsini.web@gmail.com</a></li>
              <li>GitHub: <a href="https://github.com/hsinidev" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">github.com/hsinidev</a></li>
            </ul>
          </div>
        );
      case "Guide":
        return <SeoArticle />;
      case "Privacy Policy":
        return <p>Your privacy is paramount. This application stores all data exclusively in your web browser's Local Storage. No data is ever transmitted to or stored on any external server. We do not collect, share, or use your information for any purpose. Clearing your browser's cache may delete your stored CRM data.</p>;
      case "Terms of Service":
        return <p>This software is provided "as is", without warranty of any kind, express or implied. By using this tool, you agree that the developer is not liable for any data loss or damages that may occur. You are responsible for backing up your own data.</p>;
      case "DMCA":
        return <p>All content and code are original works. If you believe any content infringes on your copyright, please contact us via the provided email with a valid DMCA complaint, and we will address it promptly.</p>;
      default:
        return null;
    }
  };


  return (
    <div className="relative min-h-screen flex flex-col font-sans text-white">
      <CosmicBackground />
      <header className="bg-black bg-opacity-30 backdrop-blur-sm sticky top-0 z-40">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="font-bold text-2xl">CRM Dashboard</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navLinks.map(link => (
                  <button key={link} onClick={() => setActiveModal(link)} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    {link}
                  </button>
                ))}
              </div>
            </div>
             <div className="md:hidden">
              <select 
                onChange={(e) => setActiveModal(e.target.value)} 
                className="bg-gray-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                value={activeModal || ''}
              >
                <option value="" disabled>Menu</option>
                {navLinks.map(link => <option key={link} value={link}>{link}</option>)}
              </select>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-black bg-opacity-30 backdrop-blur-sm mt-auto py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p className="mb-2">
            <a href="https://github.com/hsinidev" target="_blank" rel="noopener noreferrer" className="font-bold text-[#FFD700] hover:underline">Powered by HSINI MOHAMED</a>
          </p>
          <p className="text-sm">
            <a href="https://doodax.com" target="_blank" rel="noopener noreferrer" className="hover:underline">doodax.com</a> | <a href="mailto:hsini.web@gmail.com" className="hover:underline">hsini.web@gmail.com</a>
          </p>
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
