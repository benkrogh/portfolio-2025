import { useState } from 'react';

interface PasswordProtectionProps {
  children: React.ReactNode;
}

export default function PasswordProtection({ children }: PasswordProtectionProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    // Simple client-side check
    if (inputPassword === 'bkwork2025') {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
    setIsLoading(false);
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FCF9F4] px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-[2rem] font-normal text-gray-900 font-mono tracking-[-0.02em]">
            Protected Content
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please enter the password to view this case study.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <input
              type="password"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              className="appearance-none relative block w-full h-12 px-3 border border-[#D6D2CB] placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:border-[#EC6A5C] focus:ring-1 focus:ring-[#EC6A5C] focus:z-10 sm:text-sm transition-all duration-200 ease-in-out hover:border-gray-400 transform focus:scale-[1.02]"
              placeholder="Enter password"
              disabled={isLoading}
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm text-center">
              Incorrect password. Please try again.
            </p>
          )}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center items-center h-12 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-[#17120A] hover:bg-[#524D47] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EC6A5C] disabled:opacity-50 transition-all duration-200 hover:-translate-y-[2px] cursor-arrow"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 