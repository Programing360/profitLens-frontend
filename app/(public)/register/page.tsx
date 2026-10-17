import AuthLayout from "@/src/components/auth/auth-layout";
import RegisterForm from "@/src/components/auth/register-form";

export default function RegisterPage() {
  return (
    <AuthLayout
      mode="register"
      title="Create your account"
      description="Join ProfitLens AI and start making smarter financial decisions."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
