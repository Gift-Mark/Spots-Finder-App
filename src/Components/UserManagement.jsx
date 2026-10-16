import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTrash, faUserShield, faUser } from '@fortawesome/free-solid-svg-icons';

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  // Fetch users on mount safely (linter-safe)
  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      try {
        if (isMounted) setLoading(true);
        const response = await fetch('/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        const userList = Array.isArray(data) ? data : data.data || data.users || [];
        
        if (isMounted) {
          setUsers(userList);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to fetch users:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const reloadUsers = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      const userList = Array.isArray(data) ? data : data.data || data.users || [];
      setUsers(userList);
    } catch (err) {
      console.error('Failed to reload users:', err);
    }
  };

  // Toggle user role (Promote/Demote)
  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

    try {
      await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ role: newRole })
      });
      alert('User role updated successfully!');
      reloadUsers();
    } catch {
      alert('Failed to update user role.');
    }
  };

  // Delete user account
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user account?')) return;
    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('User deleted successfully.');
      reloadUsers();
    } catch {
      alert('Failed to delete user.');
    }
  };

  // Filter users based on search & role selection
  const filteredUsers = users.filter((u) => {
    const name = `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.username || '';
    const email = u.email || '';
    const role = (u.role || 'user').toLowerCase();

    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || role === roleFilter.toLowerCase();

    return matchesSearch && matchesRole;
  });

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1E293B' }}>User Directory & Permissions</h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748B' }}>Manage registered platform accounts, permissions, and security roles.</p>
        </div>

        {/* Search & Role Filter */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <FontAwesomeIcon icon={faSearch} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94A3B8' }} />
            <input 
              type="text"
              placeholder="Search name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '10px 14px 10px 36px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#F8FAFC',
                fontSize: '13px',
                outline: 'none',
                width: '240px',
                color: '#0F172A'
              }}
            />
          </div>

          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#F8FAFC',
              fontSize: '13px',
              color: '#0F172A',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="All">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E2E8F0', color: '#64748B', fontSize: '12px', fontWeight: '700' }}>
              <th style={{ padding: '12px' }}>USER NAME</th>
              <th style={{ padding: '12px' }}>EMAIL ADDRESS</th>
              <th style={{ padding: '12px' }}>ROLE</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#64748B' }}>Loading platform users...</td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#64748B' }}>No users match your criteria.</td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const userId = user._id || user.id;
                const role = user.role || 'user';
                const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'Unnamed User';

                return (
                  <tr key={userId} style={{ borderBottom: '1px solid #F1F5F9', fontSize: '14px', color: '#0F172A' }}>
                    <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#FFEDD5', color: '#C2410C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>
                        {fullName.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: '600' }}>{fullName}</span>
                    </td>

                    <td style={{ padding: '12px', color: '#475569', fontSize: '13px' }}>
                      {user.email}
                    </td>

                    <td style={{ padding: '12px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: role === 'admin' ? '#DBEAFE' : '#F1F5F9',
                        color: role === 'admin' ? '#1D4ED8' : '#475569'
                      }}>
                        <FontAwesomeIcon icon={role === 'admin' ? faUserShield : faUser} style={{ fontSize: '10px' }} />
                        {role.toUpperCase()}
                      </span>
                    </td>

                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={() => handleToggleRole(userId, role)}
                          style={{ background: '#F1F5F9', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', color: '#334155', fontSize: '12px', fontWeight: '600' }}
                        >
                          {role === 'admin' ? 'Demote to User' : 'Make Admin'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(userId)}
                          style={{ background: '#FEE2E2', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', color: '#DC2626' }}
                          title="Delete User"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;