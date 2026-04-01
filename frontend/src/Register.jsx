import { useState } from "react";
import API from "./API";
import { useNavigate } from "react-router-dom";
import './form.css';
export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "", email: "", password: "",
    dob: "", address: "", course: ""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/register", form);
    alert("Registered Successfully");
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>

      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" onChange={handleChange} />
      <input name="dob" type="date" onChange={handleChange} />
      <input name="address" placeholder="Address" onChange={handleChange} />
      <input name="course" placeholder="Course" onChange={handleChange} />

      <button>Register</button>
    </form>
  );
}