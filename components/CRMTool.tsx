import React, { useState, useEffect, useMemo, useRef } from 'react';
import { LocalStorageManager } from '../utils/LocalStorageManager';

// --- TypeScript Definitions ---
declare const XLSX: any; // For Excel library loaded from CDN

// --- Type Definitions ---
enum ContactStatus {
  Lead = 'Lead',
  Active = 'Active',
  Complete = 'Complete'
}

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  status: ContactStatus;
  tasks: Task[];
}

// --- Initial Data ---
const getInitialContacts = (): Contact[] => [
  { id: '1', name: 'Innovate Corp', email: 'contact@innovate.com', status: ContactStatus.Active, tasks: [{id: 't1', text: 'Follow up on Q4 proposal', completed: false}]},
  { id: '2', name: 'Synergy Solutions', email: 'sales@synergy.io', status: ContactStatus.Lead, tasks: []},
  { id: '3', name: 'Apex Industries', email: 'support@apex.net', status: ContactStatus.Complete, tasks: [{id: 't2', text: 'Finalize service agreement', completed: true}]},
  { id: '4', name: 'Quantum Dynamics', email: 'info@quantum.dev', status: ContactStatus.Lead, tasks: []},
  { id: '5', name: 'Stellar Ventures', email: 'invest@stellar.vc', status: ContactStatus.Active, tasks: [{id: 't3', text: 'Schedule kick-off meeting', completed: false}, {id: 't4', text: 'Onboard team to platform', completed: false}]},
];

const STORAGE_KEY = 'crm_contacts_data';

// --- Helper Functions & Components ---
const statusColors: Record<ContactStatus, string> = {
  [ContactStatus.Lead]: 'bg-blue-500',
  [ContactStatus.Active]: 'bg-green-500',
  [ContactStatus.Complete]: 'bg-gray-500',
};

interface StatCardProps {
    title: string;
    value: number;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color }) => (
    <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg text-center transition-colors duration-300">
        <p className="text-sm text-gray-400 font-medium">{title}</p>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
);


// --- Main CRM Component ---
const CRMTool: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isContactModalOpen, setContactModalOpen] = useState(false);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [currentContactForTasks, setCurrentContactForTasks] = useState<Contact | null>(null);
  const [newTaskText, setNewTaskText] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | ContactStatus>('All');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedContacts = LocalStorageManager.getItem<Contact[]>(STORAGE_KEY);
    if (storedContacts && storedContacts.length > 0) {
      setContacts(storedContacts);
    } else {
      const initialData = getInitialContacts();
      setContacts(initialData);
      LocalStorageManager.setItem(STORAGE_KEY, initialData);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      LocalStorageManager.setItem(STORAGE_KEY, contacts);
    }
  }, [contacts, isLoading]);

  const filteredContacts = useMemo(() => {
    if (filterStatus === 'All') {
      return contacts;
    }
    return contacts.filter(contact => contact.status === filterStatus);
  }, [contacts, filterStatus]);
  
  const stats = useMemo(() => {
    const total = contacts.length;
    const lead = contacts.filter(c => c.status === ContactStatus.Lead).length;
    const active = contacts.filter(c => c.status === ContactStatus.Active).length;
    const complete = contacts.filter(c => c.status === ContactStatus.Complete).length;
    return { total, lead, active, complete };
  }, [contacts]);

  const openAddModal = () => {
    setEditingContact(null);
    setContactModalOpen(true);
  };

  const openEditModal = (contact: Contact) => {
    setEditingContact(contact);
    setContactModalOpen(true);
  };

  const openTaskModal = (contact: Contact) => {
    setCurrentContactForTasks(contact);
    setTaskModalOpen(true);
  };
  
  const handleSaveContact = (contactData: Omit<Contact, 'id' | 'tasks'>) => {
    if (editingContact) {
      setContacts(contacts.map(c => c.id === editingContact.id ? { ...editingContact, ...contactData } : c));
    } else {
      const newContact: Contact = {
        ...contactData,
        id: new Date().toISOString(),
        tasks: [],
      };
      setContacts([newContact, ...contacts]);
    }
    setContactModalOpen(false);
  };

  const handleDeleteContact = (contactId: string) => {
    if(window.confirm('Are you sure you want to delete this contact?')) {
        setContacts(contacts.filter(c => c.id !== contactId));
    }
  };

  const handleAddTask = () => {
    if (!newTaskText.trim() || !currentContactForTasks) return;
    const newTask: Task = {
      id: new Date().toISOString(),
      text: newTaskText.trim(),
      completed: false,
    };
    const updatedContacts = contacts.map(c => 
      c.id === currentContactForTasks.id ? { ...c, tasks: [...c.tasks, newTask] } : c
    );
    setContacts(updatedContacts);
    setCurrentContactForTasks(prev => prev ? { ...prev, tasks: [...prev.tasks, newTask] } : null);
    setNewTaskText('');
  };

  const handleToggleTask = (taskId: string) => {
    if (!currentContactForTasks) return;
    const updatedTasks = currentContactForTasks.tasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    const updatedContacts = contacts.map(c => 
      c.id === currentContactForTasks.id ? { ...c, tasks: updatedTasks } : c
    );
    setContacts(updatedContacts);
    setCurrentContactForTasks(prev => prev ? { ...prev, tasks: updatedTasks } : null);
  };

  const handleDeleteTask = (taskId: string) => {
     if (!currentContactForTasks) return;
     const updatedTasks = currentContactForTasks.tasks.filter(t => t.id !== taskId);
     const updatedContacts = contacts.map(c => c.id === currentContactForTasks.id ? { ...c, tasks: updatedTasks } : c);
     setContacts(updatedContacts);
     setCurrentContactForTasks(prev => prev ? {...prev, tasks: updatedTasks} : null);
  };

  const handleExport = () => {
    const dataToExport = contacts.map(({ id, name, email, status }) => ({ id, name, email, status }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Contacts");
    XLSX.writeFile(wb, "CRM_Contacts.xlsx");
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = e.target?.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json: any[] = XLSX.utils.sheet_to_json(worksheet);

            const validStatuses = Object.values(ContactStatus);
            const importedContacts: Contact[] = json
                .filter(row => row.name && row.email && row.status && validStatuses.includes(row.status as ContactStatus))
                .map((row, index) => ({
                    id: `${row.email}-${Date.now()}-${index}`,
                    name: String(row.name),
                    email: String(row.email),
                    status: row.status as ContactStatus,
                    tasks: [],
                }));
            
            if (importedContacts.length === 0) {
                alert("No valid contacts found. Ensure columns 'name', 'email', and 'status' (Lead, Active, Complete) exist.");
                return;
            }

            setContacts(prevContacts => {
                const existingEmails = new Set(prevContacts.map(c => c.email));
                const uniqueNewContacts = importedContacts.filter(nc => !existingEmails.has(nc.email));
                
                if(uniqueNewContacts.length === 0) {
                     alert("All contacts in the file already exist in the CRM.");
                } else {
                     alert(`${uniqueNewContacts.length} new contacts imported. ${importedContacts.length - uniqueNewContacts.length} duplicates were ignored.`);
                }

                return [...prevContacts, ...uniqueNewContacts];
            });

        } catch (error) {
            console.error("Error importing file:", error);
            alert("Failed to import file. Please ensure it is a valid Excel file.");
        } finally {
            if(event.target) event.target.value = '';
        }
    };
    reader.readAsBinaryString(file);
  };
  
  const filterOptions: ('All' | ContactStatus)[] = ['All', ContactStatus.Lead, ContactStatus.Active, ContactStatus.Complete];


  if (isLoading) {
    return <div className="text-center text-xl">Loading CRM data...</div>;
  }
  
  return (
    <div className="bg-black bg-opacity-20 backdrop-blur-md p-6 rounded-lg shadow-2xl">
      <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold">Client Relationship Manager</h1>
            <p className="text-sm text-gray-400 mt-1">A friendly dashboard to centralize your contacts and tasks.</p>
        </div>
        <div className="flex flex-wrap gap-2">
            <button onClick={handleExport} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">Export Excel</button>
            <button onClick={() => fileInputRef.current?.click()} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">Import Excel</button>
            <button onClick={openAddModal} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">Add New Contact</button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Contacts" value={stats.total} color="text-indigo-400" />
        <StatCard title="Leads" value={stats.lead} color="text-blue-400" />
        <StatCard title="Active Clients" value={stats.active} color="text-green-400" />
        <StatCard title="Completed" value={stats.complete} color="text-gray-400" />
      </div>

       <div className="flex flex-wrap gap-2 items-center justify-between mb-6">
        <div className="flex flex-wrap gap-2 items-center">
            <span className="self-center text-sm font-medium text-gray-300 mr-2">Filter by status:</span>
            {filterOptions.map(option => (
                <button
                    key={option}
                    onClick={() => setFilterStatus(option)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                        filterStatus === option
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                    {option}
                </button>
            ))}
        </div>
        <p className="text-xs text-gray-500 mt-1">Data is saved locally in your browser.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContacts.map(contact => (
          <div key={contact.id} className="bg-gray-800 bg-opacity-70 p-5 rounded-lg shadow-lg flex flex-col justify-between transform hover:-translate-y-1 transition-transform duration-300 ease-in-out">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-white">{contact.name}</h3>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full text-white ${statusColors[contact.status]}`}>
                  {contact.status}
                </span>
              </div>
              <p className="text-gray-400 mt-1 break-all">{contact.email}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
               <button onClick={() => openTaskModal(contact)} className="text-sm text-indigo-400 hover:underline">
                View Tasks ({contact.tasks.length})
              </button>
              <div className="space-x-2">
                <button onClick={() => openEditModal(contact)} className="text-sm text-gray-400 hover:text-white">Edit</button>
                <button onClick={() => handleDeleteContact(contact.id)} className="text-sm text-red-500 hover:text-red-400">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredContacts.length === 0 && (
          <div className="text-center py-10 text-gray-400 col-span-1 md:col-span-2 lg:col-span-3">
              <p className="text-lg">No Contacts Found</p>
              <p className="text-sm mt-1">{contacts.length > 0 ? "No contacts match the current filter." : "Click 'Add New Contact' to get started!"}</p>
          </div>
      )}

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImport}
        className="hidden"
        accept=".xlsx, .xls, .csv"
      />

      <ContactModal 
        isOpen={isContactModalOpen}
        onClose={() => setContactModalOpen(false)}
        onSave={handleSaveContact}
        contact={editingContact}
      />
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        contact={currentContactForTasks}
        newTaskText={newTaskText}
        setNewTaskText={setNewTaskText}
        onAddTask={handleAddTask}
        onToggleTask={handleToggleTask}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
};

// --- Sub-Components: Modals ---
interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (contactData: Omit<Contact, 'id' | 'tasks'>) => void;
    contact: Contact | null;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, onSave, contact }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<ContactStatus>(ContactStatus.Lead);

    useEffect(() => {
        if (contact) {
            setName(contact.name);
            setEmail(contact.email);
            setStatus(contact.status);
        } else {
            setName('');
            setEmail('');
            setStatus(ContactStatus.Lead);
        }
    }, [contact, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, email, status });
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-4">{contact ? 'Edit Contact' : 'Add New Contact'}</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
                                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                            </div>
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-300">Status</label>
                                <select id="status" value={status} onChange={(e) => setStatus(e.target.value as ContactStatus)} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                                    {Object.values(ContactStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-700 px-6 py-3 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">Cancel</button>
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    contact: Contact | null;
    newTaskText: string;
    setNewTaskText: (text: string) => void;
    onAddTask: () => void;
    onToggleTask: (taskId: string) => void;
    onDeleteTask: (taskId: string) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, contact, newTaskText, setNewTaskText, onAddTask, onToggleTask, onDeleteTask }) => {
    if (!isOpen || !contact) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
                <header className="p-4 border-b border-gray-700">
                  <h2 className="text-xl font-bold text-white">Tasks for {contact.name}</h2>
                </header>

                <main className="p-6 flex-grow overflow-y-auto">
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={newTaskText}
                            onChange={(e) => setNewTaskText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && onAddTask()}
                            placeholder="Add a new task..."
                            className="flex-grow bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button onClick={onAddTask} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg">Add</button>
                    </div>
                    <ul className="space-y-3">
                        {contact.tasks.length > 0 ? (
                            contact.tasks.map(task => (
                                <li key={task.id} className="flex items-center justify-between bg-gray-700 p-3 rounded-md">
                                    <div className="flex items-center">
                                        <input type="checkbox" checked={task.completed} onChange={() => onToggleTask(task.id)} className="h-5 w-5 rounded text-indigo-600 bg-gray-800 border-gray-600 focus:ring-indigo-500"/>
                                        <span className={`ml-3 ${task.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>{task.text}</span>
                                    </div>
                                    <button onClick={() => onDeleteTask(task.id)} className="text-red-500 hover:text-red-400 text-lg">&times;</button>
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-400 text-center">No tasks yet.</p>
                        )}
                    </ul>
                </main>
                 <footer className="bg-gray-700 px-6 py-3 flex justify-end">
                    <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">Close</button>
                </footer>
            </div>
        </div>
    );
};

export default CRMTool;