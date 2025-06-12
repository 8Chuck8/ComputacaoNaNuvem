
import { create } from 'zustand';

// Pega a URL da API do ficheiro .env (ex: VITE_API_URL=https://computacaonanuvem.onrender.com/)
const API_URL = import.meta.env.VITE_API_URL;

export const useAuthApi = create((set) => ({
  user: null,

  setUsers: (user) => set({ user }),

  login: async (email, password) => {
    console.log("EMAIL", email);
    console.log("PASSWORD", password);

    const res = await fetch(${API_URL}/api/users/login, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
      set({ user: data.data });
    }
    return data;
  },

  register: async (newUser) => {
    if (!newUser.username  !newUser.email  !newUser.password) {
      return { success: false, message: "Please provide all fields" };
    }

    const res = await fetch(${API_URL}/api/users, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newUser),
    });

    const data = await res.json();
    set((state) => ({ user: [...(state.user || []), data.data] }));
    return { success: true, data: newUser, message: "User created successfully" };
  }
}));
https://mega.nz/file/VRwGwJBA#BNhx1J_mO7q1AGoRboIyLLvuJ4xuEpWDJg59FS3jGik
3.77 MB file on MEGA
Imagem
Phen1x — 14:59
Imagem
Kanekas
[TIT]
 — 15:18
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
Kanekas
[TIT]
 — 15:37
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuthApi } from "../api/auth.api";

const Register = (props) => {
Expandir
message.txt
4 KB
﻿
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuthApi } from "../api/auth.api";

const Register = (props) => {
    const navigate = useNavigate();

    const [confirmPassword, setConfirmPassword] = useState('');
    const [data, setData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'user',
    });

    const { register } = useAuthApi();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (data.email === '' || data.password === '' || data.username === '') {
            toast.error('Please provide all fields');
            return;
        }

        if (data.password !== confirmPassword) {
            toast.error('The passwords must be identical');
            return;
        }

        try {
            const res = await register(data);

            if (res.success) {
                props.setUser(res.data); // define o utilizador atual
                localStorage.setItem('user', JSON.stringify(res.data)); // opcional: manter login
                toast.success('User successfully registered and logged in');
                navigate('/'); // redireciona para a homepage
            } else {
                toast.error(res.message || 'Registration failed');
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        }
    };

    return (
        <form onSubmit={handleRegister} className="login-form mx-auto d-flex flex-column gap-3 mt-5">
            <h1 className="h3 mb-3 fw-normal">Please sign up</h1>

            <div className="form-floating">
                <input
                    type="text"
                    className="form-control"
                    id="username"
                    placeholder="Username"
                    value={data.username}
                    onChange={(e) => setData({ ...data, username: e.target.value })}
                />
                <label htmlFor="username">Username</label>
            </div>
            <div className="form-floating">
                <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="name@example.com"
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                />
                <label htmlFor="email">Email address</label>
            </div>
            <div className="form-floating">
                <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    value={data.password}
                    onChange={(e) => setData({ ...data, password: e.target.value })}
                />
                <label htmlFor="password">Password</label>
            </div>
            <div className="form-floating">
                <input
                    type="password"
                    className="form-control"
                    id="confirm_password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <label htmlFor="confirm_password">Confirm password</label>
            </div>

            <Link to="/login">Already have an account? Log in</Link>

            <button className="btn btn-primary w-100 py-2" type="submit">Sign up</button>
        </form>
    );
};

export default Register;
