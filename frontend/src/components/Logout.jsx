import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('user');
        props.setUser(null);
        navigate('/');
    }, []);

    return null;
}

export default Logout;