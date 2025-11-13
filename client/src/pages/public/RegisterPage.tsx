import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RegisterForm from "@/components/auth/RegisterForm";
import { Film } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/50">
      <div className="w-full max-w-md space-y-6 ml-8 md:ml-12 lg:ml-16">
        {/* Logo/Brand */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
              <Film className="h-6 w-6 text-primary-foreground" />
            </div>
          </Link>
          <h2 className="mt-4 text-3xl font-bold">Create Account</h2>
          <p className="mt-2 text-muted-foreground">
            Join us and start booking your favorite movies
          </p>
        </div>

        {/* Register Card */}
        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
        </Card>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Footer Links */}
        <div className="text-center space-y-2">
          <Link
            to="/"
            className="block text-sm text-muted-foreground hover:text-foreground"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
