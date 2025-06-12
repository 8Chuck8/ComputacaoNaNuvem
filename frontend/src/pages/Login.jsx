import { useState } from "react";
import { useAuthApi } from "../api/auth.api";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';

const Login = (props) => {
  const navigate = useNavigate();
  const { login } = useAuthApi();

  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    const { email, password } = data;

    if (!email || !password) {
      toast.error('Please provide all fields');
      return;
    }

    try {
      const res = await login(email, password);
      if (res.success) {
        const userData = res.data;
        props.setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));

        navigate('/');
        toast.success('User successfully logged in');
      } else {
        toast.error('The email or password is incorrect');
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <form onSubmit={handleLogin} className="login-form mx-auto d-flex flex-column gap-3 mt-5">
        <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

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

        <Link to='/register'>Don't have an account yet?</Link>

        <button className="btn btn-primary w-100 py-2" type="submit">Sign in</button>
      </form>
    </>
  );
};

export default Login;
