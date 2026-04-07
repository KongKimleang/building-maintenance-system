import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../../components/Navbar';
import { getCurrentUser } from '../../services/api';

function formatDate(value) {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleString();
}

function getRoleMeta(role) {
  if (role === 'admin') {
    return { title: 'Administrator Profile', subtitle: 'System Administration' };
  }
  if (role === 'technician') {
    return { title: 'Technician Profile', subtitle: 'Maintenance Operations' };
  }
  return { title: 'Resident Profile', subtitle: 'Property Services' };
}

function getNavLinks(role) {
  if (role === 'admin') {
    return [
      { label: 'Dashboard', path: '/admin/dashboard' },
      { label: 'All Requests', path: '/admin/requests' },
      { label: 'Users', path: '/admin/users' },
      { label: 'History', path: '/admin/history' },
    ];
  }

  if (role === 'technician') {
    return [
      { label: 'Dashboard', path: '/technician/dashboard' },
      { label: 'My Tasks', path: '/technician/tasks' },
      { label: 'History', path: '/technician/history' },
    ];
  }

  return [
    { label: 'Dashboard', path: '/resident/dashboard' },
    { label: 'Submit Request', path: '/resident/submit-request' },
    { label: 'My Requests', path: '/resident/my-requests' },
    { label: 'History', path: '/resident/history' },
  ];
}

function getDashboardLink(role) {
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'technician') return '/technician/dashboard';
  return '/resident/dashboard';
}

export default function ProfilePage({ role }) {
  const [profile, setProfile] = useState(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const roleMeta = getRoleMeta(role);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await getCurrentUser();
        setProfile(data.user || {});
      } catch (err) {
        setError(err.message || 'Failed to load profile details');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const initials = useMemo(() => {
    const first = profile.firstName?.[0] || '';
    const last = profile.lastName?.[0] || '';
    return `${first}${last}`.toUpperCase() || 'U';
  }, [profile.firstName, profile.lastName]);

  const profileRows = [
    { label: 'Full Name', value: `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'N/A' },
    { label: 'Email', value: profile.email || 'N/A' },
    { label: 'Phone', value: profile.phone || 'N/A' },
    { label: 'Role', value: profile.role || role },
    { label: 'Username', value: profile.username || 'N/A' },
    { label: 'Last Login', value: formatDate(profile.lastLogin) },
    { label: 'Account Created', value: formatDate(profile.createdAt) },
  ];

  if (profile.role === 'resident' || profile.role === 'staff' || role === 'resident') {
    profileRows.push({ label: 'Floor', value: profile.floor || 'N/A' });
    profileRows.push({ label: 'Unit', value: profile.unit || 'N/A' });
    if (profile.role === 'staff') {
      profileRows.push({ label: 'Position', value: profile.position || 'N/A' });
    }
  }

  if (profile.role === 'technician' || role === 'technician') {
    profileRows.push({ label: 'Specialization', value: profile.specialization || 'N/A' });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        userInfo={{
          name:
            `${profile.firstName || ''} ${profile.lastName || ''}`.trim() ||
            'User',
          subtitle: roleMeta.subtitle,
          dashboardLink: getDashboardLink(role),
          role,
        }}
        navLinks={getNavLinks(role)}
      />

      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <section className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
          <div className="h-28 bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500" />
          <div className="px-6 pb-6 -mt-12">
            <div className="h-24 w-24 rounded-2xl bg-white border border-gray-200 shadow-md flex items-center justify-center text-2xl font-bold text-primary">
              {initials}
            </div>
            <div className="mt-4">
              <h1 className="text-3xl font-bold text-gray-900">{roleMeta.title}</h1>
              <p className="text-gray-600 mt-1">Manage your account information</p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
          {loading ? (
            <p className="text-gray-600">Loading profile...</p>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-3 rounded-md">Error: {error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profileRows.map((row) => (
                <div key={row.label} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {row.label}
                  </p>
                  <p className="text-base text-gray-900 mt-1 break-words">{row.value}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
