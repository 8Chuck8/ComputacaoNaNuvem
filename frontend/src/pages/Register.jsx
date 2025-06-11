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

    const {register} = useAuthApi();

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
            props.setUser(res.data);

            toast.success('User successfully registered');
            navigate('/');
        } catch (error) {
            toast.error('Something went wrong pleas try again');
        }
    }

    return <>
            <form onSubmit={handleRegister} className="login-form mx-auto d-flex flex-column gap-3 mt-5">
                <h1 className="h3 mb-3 fw-normal">Please sign up</h1>

                <div className="form-floating">
                    <input
                        type="username"
                        className="form-control"
                        id="username"
                        placeholder="name@example.com"
                        value={data.username}
                        onChange={(e) => setData({...data, username: e.target.value})}
                    />
                    <label htmlFor="email">Username</label>
                </div>
                <div className="form-floating">
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="name@example.com"
                        value={data.email}
                        onChange={(e) => setData({...data, email: e.target.value})}
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
                        onChange={(e) => setData({...data, password: e.target.value})}
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
                <Link to='/login'>Don't have an account yet?</Link>

                <button className="btn btn-primary w-100 py-2" type="submit">Sign up</button>
            </form>
        </>
}

export default Register;