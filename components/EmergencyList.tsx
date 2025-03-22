import { Role } from '@/lib/types';
import { toast } from 'react-hot-toast';

interface Emergency {
  id: string;
  title: string;
  description: string;
  user: string;
  status: string;
  volunteers: string[];
  timestamp: string;
}

interface EmergencyListProps {
  emergencies: Emergency[];
  role: Role;
  onAccept?: (emergencyId: string, volunteerName: string) => void;
  onDecline?: (emergencyId: string, volunteerName: string) => void;
  volunteerName?: string;
}

export default function EmergencyList({ emergencies, role, onAccept, onDecline, volunteerName }: EmergencyListProps) {
  const handleAccept = (emergencyId: string) => {
    if (onAccept && volunteerName) {
      onAccept(emergencyId, volunteerName);
      toast.success('You have accepted the emergency.');
    }
  };

  const handleDecline = (emergencyId: string) => {
    if (onDecline && volunteerName) {
      onDecline(emergencyId, volunteerName);
      toast.success('You have declined the emergency.');
    }
  };

  // Defensive check to ensure emergencies is an array
  if (!Array.isArray(emergencies)) {
    return <p className="text-gray-600">No emergencies available.</p>;
  }

  return (
    <div className="space-y-4">
      {emergencies.length === 0 ? (
        <p className="text-gray-600">No emergencies available.</p>
      ) : (
        emergencies.map((emergency) => {
          const hasAccepted = volunteerName && emergency.volunteers.includes(volunteerName);

          return (
            <div
              key={emergency.id}
              className="p-4 bg-white rounded-lg shadow-md border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-800">{emergency.title}</h3>
              <p className="text-gray-600 mt-1">{emergency.description}</p>
              <div className="mt-2 text-sm text-gray-500">
                <p>
                  <strong>Status:</strong>{' '}
                  <span
                    className={`${
                      emergency.status === 'accepted' ? 'text-green-600' : 'text-yellow-600'
                    } capitalize`}
                  >
                    {emergency.status}
                  </span>
                </p>
                <p>
                  <strong>Posted on:</strong> {new Date(emergency.timestamp).toLocaleString()}
                </p>
                <p>
                  <strong>Accepted by:</strong>{' '}
                  {emergency.volunteers.length > 0
                    ? emergency.volunteers.join(', ')
                    : 'No volunteers yet'}
                </p>
              </div>

              {role === 'volunteer' && (
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleAccept(emergency.id)}
                    disabled={!!hasAccepted}
                    className={`px-4 py-2 rounded-lg text-white ${
                      hasAccepted
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-500'
                    } transition-colors duration-200`}
                  >
                    {hasAccepted ? 'Accepted' : 'Accept'}
                  </button>
                  <button
                    onClick={() => handleDecline(emergency.id)}
                    disabled={!hasAccepted}
                    className={`px-4 py-2 rounded-lg text-white ${
                      !hasAccepted
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-500'
                    } transition-colors duration-200`}
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}