import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Input, Label } from '@/shared/ui';
import { authStore } from '../model/authStore';
import { ROUTES } from '@/shared/config/routes';
import { toast } from 'sonner';
import { Box, Eye, EyeOff, ArrowRight } from 'lucide-react';

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await authStore.login(username, password);
      toast.success('Login successful!');
      navigate(ROUTES.DASHBOARD);
    } catch {
      toast.error('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1f2e] via-[#1a1f2e] to-[#2E74B5] p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center justify-center w-14 h-14 bg-[#2E74B5] rounded-xl mb-4">
              <Box className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">AssetManager</h1>
            <p className="text-sm text-gray-500 mt-1">Enterprise Resource Portal</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                Email or Employee ID
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="e.g. name@company.com or 12345"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-11 bg-gray-50 border-gray-200 focus:bg-white"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <button
                  type="button"
                  className="text-xs text-[#2E74B5] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 bg-gray-50 border-gray-200 focus:bg-white pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-[#2E74B5] hover:bg-[#245d91] text-white font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logging in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Log In
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-8">
            Internal Corporate Asset Portal. Authorized Personnel Only.
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          © 2025 AssetManager. All rights reserved.
        </p>
      </div>
    </div>
  );
}
