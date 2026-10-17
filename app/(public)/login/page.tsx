import AuthLayout from "@/src/components/auth/auth-layout";
import LoginForm from "@/src/components/auth/login-form";

const page = () => {
  return (
    <AuthLayout
      mode="login"
      title="Welcome back"
      description="Sign in to access your financial dashboard."
    >
      {/* Login form এখানে থাকবে */}
      <LoginForm />
    </AuthLayout>
  );
};

export default page;
