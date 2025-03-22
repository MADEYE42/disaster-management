'use client';
import { useState, FormEvent } from 'react';
import toast from 'react-hot-toast';

interface Props {
  user: { [key: string]: any };
  onLogout: () => void;
}

export default function ProfileDropdown({ user, onLogout }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(user);

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if (res.ok) {
      toast.success('Profile updated successfully');
      setIsOpen(false);
    } else {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-white"
      >
        {user.name || user.agencyName}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded shadow-lg p-4">
          <form onSubmit={handleUpdate}>
            {Object.keys(formData).map(key => (
              key !== 'id' && key !== 'password' && (
                <input
                  key={key}
                  type="text"
                  value={formData[key]}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  placeholder={key}
                  className="block w-full mb-2 p-2 border"
                />
              )
            ))}
            <button type="submit" className="bg-blue-500 text-white p-2 w-full mb-2">
              Update
            </button>
            <button 
              type="button"
              onClick={onLogout}
              className="bg-red-500 text-white p-2 w-full"
            >
              Logout
            </button>
          </form>
        </div>
      )}
    </div>
  );
}