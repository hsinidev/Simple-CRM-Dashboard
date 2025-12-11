
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
  [ContactStatus.Lead]: 'bg-blue-500 shadow-blue-500/50',
  [ContactStatus.Active]: 'bg-green-500 shadow-green-500/50',
  [ContactStatus.Complete]: 'bg-purple-500 shadow-purple-500/50',
};

interface StatCardProps {
    title: string;
    value: number;
    color: string;
    icon?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color, icon }) => (
    <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 p-4 rounded-xl text-center transition-all duration-300 hover:bg-gray-700/50 hover:scale-105 hover:shadow-lg">
        <p className="text-sm text-gray-400 font-medium uppercase tracking-wide">{title}</p>
        <div className="flex items-center justify-center mt-2">
            <span className={`text-4xl font-extrabold ${color} drop-shadow-md`}>{value}</span>
        </div>
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
    return <div className="text-center text-xl text-white animate-pulse">Initializing Dashboard...</div>;
  }
  
  return (
    <div className="max-w-7xl mx-auto">
        <div className="bg-gray-900/60 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700/50">
        <div className="flex flex-wrap gap-4 justify-between items-center mb-8 pb-6 border-b border-gray-700/50">
            <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">My Contacts</h1>
                <p className="text-sm text-gray-400 mt-2">Manage your professional relationships efficiently.</p>
            </div>
            <div className="flex flex-wrap gap-3">
                <button onClick={handleExport} className="bg-gray-700/50 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-xl border border-gray-600 transition-all shadow-sm">Export Excel</button>
                <button onClick={() => fileInputRef.current?.click()} className="bg-gray-700/50 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-xl border border-gray-600 transition-all shadow-sm">Import Excel</button>
                <button onClick={openAddModal} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-2 px-6 rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5">Add New Contact</button>
            </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard title="Total Contacts" value={stats.total} color="text-indigo-400" />
            <StatCard title="Leads" value={stats.lead} color="text-blue-400" />
            <StatCard title="Active Clients" value={stats.active} color="text-green-400" />
            <StatCard title="Completed" value={stats.complete} color="text-purple-400" />
        </div>

        <div className="flex flex-wrap gap-4 items-center justify-between mb-6 bg-gray-800/40 p-4 rounded-xl border border-gray-700/30">
            <div className="flex flex-wrap gap-2 items-center">
                <span className="self-center text-sm font-medium text-gray-300 mr-2">Filter by status:</span>
                {filterOptions.map(option => (
                    <button
                        key={option}
                        onClick={() => setFilterStatus(option)}
                        className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all ${
                            filterStatus === option
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600 hover:text-white'
                        }`}
                    >
                        {option}
                    </button>
                ))}
            </div>
            <p className="text-xs text-gray-500 flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                Saved locally
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContacts.map(contact => (
            <div key={contact.id} className="group bg-gray-800/40 hover:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-gray-600 shadow-lg flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1">
                <div>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-100 group-hover:text-blue-300 transition-colors">{contact.name}</h3>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full text-white shadow-sm ${statusColors[contact.status]}`}>
                    {contact.status}
                    </span>
                </div>
                <p className="text-gray-400 text-sm break-all flex items-center gap-2">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    {contact.email}
                </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-700/50 flex justify-between items-center">
                <button onClick={() => openTaskModal(contact)} className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                    Tasks 
                    <span className="bg-gray-700 text-white px-1.5 py-0.5 rounded-md text-[10px]">{contact.tasks.length}</span>
                </button>
                <div className="flex space-x-3">
                    <button onClick={() => openEditModal(contact)} className="text-xs font-semibold text-gray-400 hover:text-white transition-colors">Edit</button>
                    <button onClick={() => handleDeleteContact(contact.id)} className="text-xs font-semibold text-red-500 hover:text-red-400 transition-colors">Delete</button>
                </div>
                </div>
            </div>
            ))}
        </div>
        {filteredContacts.length === 0 && (
            <div className="text-center py-16 text-gray-400 border-2 border-dashed border-gray-700 rounded-xl bg-gray-800/20">
                <svg className="w-12 h-12 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                <p className="text-lg font-medium">No Contacts Found</p>
                <p className="text-sm opacity-70">{contacts.length > 0 ? "Adjust your filters to see more." : "Click 'Add New Contact' to get started!"}</p>
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md transform transition-all scale-100">
                <form onSubmit={handleSubmit}>
                    <div className="p-8">
                        <h2 className="text-2xl font-bold mb-6 text-white text-center">{contact ? 'Edit Contact' : 'Create New Contact'}</h2>
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="name" className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Full Name</label>
                                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="block w-full bg-gray-800 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"/>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Email Address</label>
                                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="block w-full bg-gray-800 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"/>
                            </div>
                            <div>
                                <label htmlFor="status" className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Status</label>
                                <div className="relative">
                                    <select id="status" value={status} onChange={(e) => setStatus(e.target.value as ContactStatus)} className="block w-full bg-gray-800 border border-gray-600 rounded-lg py-3 px-4 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
                                        {Object.values(ContactStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800/50 px-8 py-4 rounded-b-2xl flex justify-end space-x-3 border-t border-gray-700">
                        <button type="button" onClick={onClose} className="text-gray-400 hover:text-white font-medium py-2 px-4 transition-colors">Cancel</button>
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5">Save Contact</button>
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
                <header className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-800/50 rounded-t-2xl">
                  <div>
                    <h2 className="text-xl font-bold text-white">Tasks & Notes</h2>
                    <p className="text-sm text-gray-400">For {contact.name}</p>
                  </div>
                  <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </header>

                <main className="p-6 flex-grow overflow-y-auto">
                    <div className="flex gap-2 mb-6">
                        <input
                            type="text"
                            value={newTaskText}
                            onChange={(e) => setNewTaskText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && onAddTask()}
                            placeholder="Type a new task..."
                            className="flex-grow bg-gray-800 border border-gray-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-500"
                        />
                        <button onClick={onAddTask} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors">Add</button>
                    </div>
                    <ul className="space-y-3">
                        {contact.tasks.length > 0 ? (
                            contact.tasks.map(task => (
                                <li key={task.id} className="group flex items-center justify-between bg-gray-800/50 p-3 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-all">
                                    <div className="flex items-center">
                                        <input type="checkbox" checked={task.completed} onChange={() => onToggleTask(task.id)} className="h-5 w-5 rounded text-indigo-600 bg-gray-900 border-gray-600 focus:ring-indigo-500 cursor-pointer"/>
                                        <span className={`ml-3 ${task.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>{task.text}</span>
                                    </div>
                                    <button onClick={() => onDeleteTask(task.id)} className="text-gray-600 group-hover:text-red-500 transition-colors p-1 rounded hover:bg-red-500/10">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                </li>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No tasks assigned yet.</p>
                            </div>
                        )}
                    </ul>
                </main>
            </div>
        </div>
    );
};

export default CRMTool;
