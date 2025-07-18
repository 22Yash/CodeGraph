import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Welcome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromURL = params.get("token");
    const savedToken = localStorage.getItem("token");
    const token = tokenFromURL || savedToken;

    if (token) {
      try {
        const decoded = jwtDecode(token);

        if (decoded?.exp && decoded.exp * 1000 < Date.now()) {
          console.warn("Token expired");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/");
          return;
        }

        if (decoded?.userId) {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(decoded));
          navigate("/dashboard");
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/");
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-gray-700">
      <h2 className="text-lg font-semibold mb-2">Processing authentication...</h2>
      <p className="text-sm text-gray-500">Please wait while we redirect you to your dashboard.</p>
    </div>
  );
};

export default Welcome;
