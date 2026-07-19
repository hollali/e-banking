import AuthForm from '@/components/authForm';

const ForgotPassword = () => {
  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            Forgot Password
          </h1>
          <p className="text-16 font-normal text-gray-600">
            Enter your email address and we will send you a link to reset your password.
          </p>
        </div>
      </header>
      <ForgotPasswordForm />
    </section>
  );
};

const ForgotPasswordForm = () => {
  return (
    <form className="space-y-8">
      <div className="flex flex-col gap-4">
        <div>
          <label className="form-label">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="input-class"
          />
        </div>
        <button type="submit" className="form-btn">
          Send Reset Link
        </button>
      </div>
      <footer className="flex justify-center gap-1">
        <p className="text-14 font-normal text-gray-600">
          Remember your password?
        </p>
        <a href="/sign-in" className="form-link">
          Sign In
        </a>
      </footer>
    </form>
  );
};

export default ForgotPassword;
