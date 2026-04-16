import { useState } from 'react';
import { Mail, Phone, MapPin, Briefcase, Calendar, X, ExternalLink, Plus, Trash2, UserPlus } from 'lucide-react';
import { useUIStore } from '../store/uiStore';

const INITIAL_MEMBERS = [
  {
    id: '1',
    name: 'Alex Rivera',
    role: 'Lead Architect',
    email: 'alex.rivera@monolith.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    bio: 'Passionate about sustainable urban design and brutalist aesthetics. Over 15 years of experience in high-rise residential projects.',
    avatar: 'https://picsum.photos/seed/alex/200/200',
    joinedDate: 'Jan 2020',
    projects: 12,
  },
  {
    id: '2',
    name: 'Sarah Chen',
    role: 'Senior Designer',
    email: 'sarah.chen@monolith.com',
    phone: '+1 (555) 987-6543',
    location: 'San Francisco, CA',
    bio: 'Specializing in interior spatial flow and minimalist material palettes. Believes that every detail serves a structural purpose.',
    avatar: 'https://picsum.photos/seed/sarah/200/200',
    joinedDate: 'Mar 2021',
    projects: 8,
  },
  {
    id: '3',
    name: 'Marcus Thorne',
    role: 'Structural Engineer',
    email: 'marcus.t@monolith.com',
    phone: '+1 (555) 456-7890',
    location: 'Chicago, IL',
    bio: 'Expert in complex steel structures and seismic retrofitting. Ensuring the monolith stands the test of time and nature.',
    avatar: 'https://picsum.photos/seed/marcus/200/200',
    joinedDate: 'Nov 2019',
    projects: 15,
  },
];

export default function Team() {
  const { searchQuery } = useUIStore();
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [memberToDelete, setMemberToDelete] = useState(null);

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    email: '',
    location: '',
  });

  const handleAddMember = (e) => {
    e.preventDefault();
    const member = {
      id: Math.random().toString(36).substr(2, 9),
      name: newMember.name,
      role: newMember.role,
      email: newMember.email,
      phone: '+1 (555) 000-0000',
      location: newMember.location,
      bio: 'New team member joining the Monolith architectural vision.',
      avatar: `https://picsum.photos/seed/${newMember.name}/200/200`,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      projects: 0,
    };
    setMembers([...members, member]);
    setIsAddingMember(false);
    setNewMember({ name: '', role: '', email: '', location: '' });
  };

  const handleUpdateMember = (e) => {
    e.preventDefault();
    if (!editingMember) return;
    setMembers(members.map(m => m.id === editingMember.id ? editingMember : m));
    setSelectedMember(editingMember);
    setEditingMember(null);
  };

  const handleDeleteMember = (id, e) => {
    e.stopPropagation();
    setMemberToDelete(id);
  };

  const confirmDelete = () => {
    if (memberToDelete) {
      setMembers(members.filter(m => m.id !== memberToDelete));
      if (selectedMember?.id === memberToDelete) setSelectedMember(null);
      setMemberToDelete(null);
    }
  };

  return (
    <section className="p-10 flex-1 flex flex-col gap-10 overflow-hidden relative">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-extrabold text-primary tracking-tight font-headline">Team Members</h2>
          <p className="text-on-surface-variant font-medium mt-2 opacity-70">Collaborators across all active projects.</p>
        </div>
        <button 
          onClick={() => setIsAddingMember(true)}
          className="bg-primary text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary-container transition-all shadow-lg shadow-primary/20"
        >
          <UserPlus size={20} />
          Add Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 overflow-y-auto pr-2 scrollbar-hide">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            onClick={() => setSelectedMember(member)}
            className="bg-white p-8 rounded-[2.5rem] shadow-[0_8px_24px_rgba(0,23,54,0.04)] border border-transparent hover:border-primary/10 transition-all cursor-pointer group relative"
          >
            <button 
              onClick={(e) => handleDeleteMember(member.id, e)}
              className="absolute top-6 right-6 p-2 text-on-surface-variant/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 z-10"
            >
              <Trash2 size={18} />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-24 h-24 rounded-3xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg">
                  <Briefcase size={14} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-primary mb-1">{member.name}</h3>
              <p className="text-sm font-bold text-on-surface-variant/60 uppercase tracking-widest mb-4">{member.role}</p>
              
              <div className="flex gap-2 mb-6">
                <div className="px-4 py-2 bg-surface-container-low rounded-full text-[10px] font-bold text-primary">
                  {member.projects} Projects
                </div>
                <div className="px-4 py-2 bg-surface-container-low rounded-full text-[10px] font-bold text-primary">
                  {member.joinedDate}
                </div>
              </div>

              <button className="w-full py-3 bg-surface-container-high text-primary rounded-2xl font-bold text-sm hover:bg-primary hover:text-white transition-all">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Member Modal */}
      {isAddingMember && (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <form onSubmit={handleAddMember} className="p-10">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-extrabold text-primary">Add Member</h3>
                <button 
                  type="button"
                  onClick={() => setIsAddingMember(false)}
                  className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 block mb-2">Full Name</label>
                  <input 
                    type="text"
                    required
                    className="w-full bg-surface-container-low border-none rounded-2xl p-4 text-primary font-bold focus:ring-2 focus:ring-primary/10"
                    placeholder="Enter name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 block mb-2">Role</label>
                  <input 
                    type="text"
                    required
                    className="w-full bg-surface-container-low border-none rounded-2xl p-4 text-primary font-bold focus:ring-2 focus:ring-primary/10"
                    placeholder="e.g. Senior Designer"
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 block mb-2">Email</label>
                  <input 
                    type="email"
                    required
                    className="w-full bg-surface-container-low border-none rounded-2xl p-4 text-primary font-bold focus:ring-2 focus:ring-primary/10"
                    placeholder="email@company.com"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 block mb-2">Location</label>
                  <input 
                    type="text"
                    required
                    className="w-full bg-surface-container-low border-none rounded-2xl p-4 text-primary font-bold focus:ring-2 focus:ring-primary/10"
                    placeholder="e.g. London, UK"
                    value={newMember.location}
                    onChange={(e) => setNewMember({ ...newMember, location: e.target.value })}
                  />
                </div>
              </div>
              
              <button 
                type="submit"
                className="w-full mt-10 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-container transition-all shadow-lg shadow-primary/20"
              >
                Create Member Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {editingMember && (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-[120] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <form onSubmit={handleUpdateMember} className="p-10">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-extrabold text-primary">Edit Member</h3>
                <button 
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 block mb-2">Full Name</label>
                  <input 
                    type="text"
                    required
                    className="w-full bg-surface-container-low border-none rounded-2xl p-4 text-primary font-bold focus:ring-2 focus:ring-primary/10"
                    value={editingMember.name}
                    onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 block mb-2">Role</label>
                  <input 
                    type="text"
                    required
                    className="w-full bg-surface-container-low border-none rounded-2xl p-4 text-primary font-bold focus:ring-2 focus:ring-primary/10"
                    value={editingMember.role}
                    onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 block mb-2">Email</label>
                  <input 
                    type="email"
                    required
                    className="w-full bg-surface-container-low border-none rounded-2xl p-4 text-primary font-bold focus:ring-2 focus:ring-primary/10"
                    value={editingMember.email}
                    onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 block mb-2">Location</label>
                  <input 
                    type="text"
                    required
                    className="w-full bg-surface-container-low border-none rounded-2xl p-4 text-primary font-bold focus:ring-2 focus:ring-primary/10"
                    value={editingMember.location}
                    onChange={(e) => setEditingMember({ ...editingMember, location: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 block mb-2">Biography</label>
                  <textarea 
                    className="w-full bg-surface-container-low border-none rounded-2xl p-4 text-on-surface-variant text-sm focus:ring-2 focus:ring-primary/10 min-h-[100px]"
                    value={editingMember.bio}
                    onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                  />
                </div>
              </div>
              
              <button 
                type="submit"
                className="w-full mt-10 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-container transition-all shadow-lg shadow-primary/20"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {memberToDelete && (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-[130] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 p-10 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Trash2 size={32} />
            </div>
            <h3 className="text-xl font-extrabold text-primary mb-2">Remove Member?</h3>
            <p className="text-on-surface-variant/60 text-sm mb-8 leading-relaxed">
              This action cannot be undone. All associated project data for this member will be archived.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setMemberToDelete(null)}
                className="flex-1 py-4 rounded-2xl font-bold text-on-surface-variant hover:bg-surface-container-high transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-200"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Member Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="relative h-48 bg-primary-container overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-12 pb-12 -mt-16 relative">
              <div className="flex items-end gap-8 mb-8">
                <img
                  src={selectedMember.avatar}
                  alt={selectedMember.name}
                  className="w-32 h-32 rounded-[2.5rem] border-8 border-white shadow-2xl object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="pb-4">
                  <h3 className="text-3xl font-extrabold text-primary mb-1">{selectedMember.name}</h3>
                  <p className="text-sm font-bold text-on-surface-variant/60 uppercase tracking-widest">{selectedMember.role}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40 mb-3">Biography</h4>
                    <p className="text-on-surface-variant leading-relaxed text-sm">{selectedMember.bio}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="px-4 py-2 bg-surface-container-low rounded-xl text-xs font-bold text-primary">Urbanism</span>
                    <span className="px-4 py-2 bg-surface-container-low rounded-xl text-xs font-bold text-primary">Steel Design</span>
                    <span className="px-4 py-2 bg-surface-container-low rounded-xl text-xs font-bold text-primary">Sustainability</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40 mb-3">Contact Information</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-on-surface-variant">
                      <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
                        <Mail size={18} />
                      </div>
                      <span className="text-sm font-medium">{selectedMember.email}</span>
                    </div>
                    <div className="flex items-center gap-4 text-on-surface-variant">
                      <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
                        <Phone size={18} />
                      </div>
                      <span className="text-sm font-medium">{selectedMember.phone}</span>
                    </div>
                    <div className="flex items-center gap-4 text-on-surface-variant">
                      <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
                        <MapPin size={18} />
                      </div>
                      <span className="text-sm font-medium">{selectedMember.location}</span>
                    </div>
                    <div className="flex items-center gap-4 text-on-surface-variant">
                      <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
                        <Calendar size={18} />
                      </div>
                      <span className="text-sm font-medium">Joined {selectedMember.joinedDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-outline-variant/10 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <span className="text-2xl">{selectedMember.projects}</span>
                    <span className="text-xs uppercase tracking-widest opacity-40">Active Projects</span>
                  </div>
                  <button 
                    onClick={() => setEditingMember(selectedMember)}
                    className="px-6 py-3 bg-surface-container-high text-primary rounded-2xl font-bold hover:bg-primary hover:text-white transition-all ml-4"
                  >
                    Edit Profile
                  </button>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary-container transition-all shadow-lg shadow-primary/20">
                  Contact Member
                  <ExternalLink size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
