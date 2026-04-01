const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ================= SCHEMA =================
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    dob: { type: String },
    address: { type: String },
    course: { type: String },
    password: { type: String, required: true },
    role: { type: String, default: "user" } // admin or user
});

// MODEL
const User = mongoose.model('User', userSchema);

// ================= DB CONNECTION =================
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));


// ================= ROUTES =================

// 🔹 REGISTER
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password, dob, address, course } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            dob,
            address,
            course
        });

        await user.save();

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 🔹 LOGIN
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        res.json({
            message: "Login successful",
            user
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 🔹 GET ALL USERS (Admin)
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 🔹 UPDATE USER (User Dashboard - cannot change email)
app.put('/api/user/:id', async (req, res) => {
    try {
        const { name, dob, address, course } = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, dob, address, course },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Profile updated", user });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 🔹 ADMIN UPDATE ANY USER
app.put('/api/admin/update/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User updated", user });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 🔹 DELETE USER (Admin)
app.delete('/api/admin/delete/:id', async (req, res) => {
    try {
        const result = await User.findByIdAndDelete(req.params.id);

        if (!result) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 🔹 RESET PASSWORD (Admin)
app.put('/api/admin/reset-password/:id', async (req, res) => {
    try {
        const defaultPassword = await bcrypt.hash("123456", 10);

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { password: defaultPassword },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Password reset to 123456" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// ================= SERVER =================
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});