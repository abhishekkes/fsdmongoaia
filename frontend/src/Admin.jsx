import { useEffect, useState } from "react";
import API from "./API";
import './admin.css';
export default function Admin() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await API.get("/users");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    await API.delete(`/admin/delete/${id}`);
    fetchUsers();
  };

  const resetPassword = async (id) => {
    await API.put(`/admin/reset-password/${id}`);
    alert("Password reset");
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div>
      <h2>Admin Panel</h2>

      <button onClick={logout}>Logout</button>

      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <button onClick={() => deleteUser(u._id)}>Delete</button>
                <button onClick={() => resetPassword(u._id)}>Reset</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}