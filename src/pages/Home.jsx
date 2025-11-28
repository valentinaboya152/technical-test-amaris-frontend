import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <main 
      className="min-vh-100 d-flex justify-content-center align-items-center p-4"
      style={{
        background: "linear-gradient(to bottom right, #f8f9fa, #e9ecef)"
      }}
    >
      <div className="w-100" style={{ maxWidth: "420px" }}>
        <div className="bg-white border rounded shadow p-4 text-center">
          
          {/* ICONO */}
          <div className="mb-4">
            <div 
              className="rounded-circle d-flex justify-content-center align-items-center mx-auto mb-3"
              style={{
                width: "70px",
                height: "70px",
                background: "#0d6efd"
              }}
            >
              <span className="fs-2 fw-bold text-white">💰</span>
            </div>

            <h1 className="fw-bold">LegendBank</h1>
            <p className="text-muted">Manage your fund subscriptions</p>
          </div>

          {/* BOTONES */}
          <div className="d-grid gap-3">
            <Link to="/register" className="btn btn-primary py-2 fw-semibold">
              Create Account
            </Link>

            <Link to="/login" className="btn btn-outline-secondary py-2 fw-semibold">
              Sign In
            </Link>
          </div>

          <p className="text-muted mt-4" style={{ fontSize: "0.75rem" }}>
            Secure • Professional • Reliable
          </p>
        </div>
      </div>
    </main>
  );
}
