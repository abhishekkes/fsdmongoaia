import { useState } from "react";
import API from "./API";
import './dashboard.css'

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [form, setForm] = useState(user);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const updateProfile = async () => {
    await API.put(`/user/${user._id}`, form);
    alert("Profile Updated");
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
  <div className="dashboard">
    <h2>User Dashboard</h2>

    <input name="name" value={form.name} onChange={handleChange} />
    <input value={form.email} disabled />
    <input name="dob" value={form.dob} onChange={handleChange} />
    <input name="address" value={form.address} onChange={handleChange} />
    <input name="course" value={form.course} onChange={handleChange} />

    <div className="btn-group">
      <button onClick={updateProfile}>Update</button>
      <button onClick={logout}>Logout</button>
    </div>
  </div>
);
}