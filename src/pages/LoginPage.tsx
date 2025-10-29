import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import rakaminLogo from "@/assets/Logo_Rakamin.svg";
import { ErrorAlert, InputField } from "@/components/shared/ui";
import { useAuth } from "@/contexts/authContext";
import { useState, useEffect } from "react";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { login, isLoading, user } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);

  const handleSubmit = async () => {
    setError("");

    try {
      await login(email, password);
    } catch (err) {
      setError("Email atau password salah");

    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen w-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="flex flex-col  justify-center max-w-md w-full">
        <div className="mb-6">
          <img src={rakaminLogo} alt="Rakamin Logo" className="w-44 h-auto" />
        </div>
        
        <div className="bg-white rounded-lg shadow-sm w-full p-6">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900">
              Masuk ke Rakamin
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Belum punya akun? <a href="#" className="text-blue-500 hover:underline">Daftar menggunakan email</a>
            </p>
          </div>

          {error && <ErrorAlert message={error} />}

          <div className="space-y-4">
            <InputField
              label="Alamat email"
              type="email"
              value={email}
              onChange={setEmail}
              onKeyPress={handleKeyPress}
              placeholder="Masukkan email"
            />

            <InputField
              label="Kata sandi"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={setPassword}
              onKeyPress={handleKeyPress}
              placeholder="Masukkan kata sandi"
              rightIcon={showPassword ? 
                <EyeOff className="h-5 w-5 text-gray-400" /> : 
                <Eye className="h-5 w-5 text-gray-400" />
              }
              onRightIconClick={togglePasswordVisibility}
            />
              <div className="flex justify-end my-2">
                <a href="#" className="text-sm text-gray-600 hover:underline">Lupa kata sandi?</a>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium py-2.5 px-4 rounded-lg transition-colors"
            >
              {isLoading ? "Loading..." : "Masuk"}
            </button>

              <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3 font-medium">
              Demo Credentials:
            </p>
            <div className="space-y-2 text-xs">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="font-semibold text-blue-900">
                  Admin: admin@company.com / admin123
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="font-semibold text-green-900">
                  Client: client@email.com / client123
                </p>
              </div>
            </div>
          </div>
          </div>

        
        </div>
      </div>

  );
};

export default LoginPage;
