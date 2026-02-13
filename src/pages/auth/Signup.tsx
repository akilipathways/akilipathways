import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { UserRole } from '@/types';
import { AlertCircle, User, GraduationCap, School } from 'lucide-react';

export function Signup() {
    const navigate = useNavigate();
    const [step, setStep] = useState<1 | 2>(1);
    const [role, setRole] = useState<UserRole>('STUDENT');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRoleSelect = (selectedRole: UserRole) => {
        setRole(selectedRole);
        setStep(2);
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // 1. Sign up the user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        role: role,
                    },
                },
            });

            if (authError) throw authError;

            if (authData.user) {
                // 2. Create the profile record
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert({
                        id: authData.user.id,
                        role: role,
                        full_name: formData.fullName,
                        email: formData.email,
                        // Add other role-specific defaults if needed
                    });

                if (profileError) {
                    // If profile creation fails, we might want to cleanup the auth user or show a specific error
                    console.error('Profile creation error:', profileError);
                    throw new Error('Failed to create user profile');
                }

                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-8">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center text-primary-blue">
                        {step === 1 ? 'Choose Account Type' : 'Create Account'}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {step === 1
                            ? 'Select how you will be using Akili Pathways'
                            : `Sign up as a ${role.toLowerCase().replace('_', ' ')}`}
                    </CardDescription>
                </CardHeader>

                {step === 1 ? (
                    <CardContent className="grid gap-4">
                        <div
                            className="flex items-center space-x-4 p-4 border rounded-lg cursor-pointer hover:border-primary-blue hover:bg-blue-50 transition-all"
                            onClick={() => handleRoleSelect('STUDENT')}
                        >
                            <div className="bg-primary-blue/10 p-2 rounded-full">
                                <GraduationCap className="h-6 w-6 text-primary-blue" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Student</h3>
                                <p className="text-sm text-slate-500">I am a Grade 6-9 student</p>
                            </div>
                        </div>

                        <div
                            className="flex items-center space-x-4 p-4 border rounded-lg cursor-pointer hover:border-secondary-teal hover:bg-teal-50 transition-all"
                            onClick={() => handleRoleSelect('PARENT')}
                        >
                            <div className="bg-secondary-teal/10 p-2 rounded-full">
                                <User className="h-6 w-6 text-secondary-teal" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Parent</h3>
                                <p className="text-sm text-slate-500">I want to track my child's progress</p>
                            </div>
                        </div>

                        <div
                            className="flex items-center space-x-4 p-4 border rounded-lg cursor-pointer hover:border-accent-orange hover:bg-orange-50 transition-all"
                            onClick={() => handleRoleSelect('TEACHER')}
                        >
                            <div className="bg-accent-orange/10 p-2 rounded-full">
                                <School className="h-6 w-6 text-accent-orange" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Teacher</h3>
                                <p className="text-sm text-slate-500">I am an educator or school admin</p>
                            </div>
                        </div>
                    </CardContent>
                ) : (
                    <form onSubmit={handleSignup}>
                        <CardContent className="space-y-4">
                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-2" />
                                    {error}
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input
                                    id="fullName"
                                    placeholder="John Doe"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <div className="flex gap-4 w-full">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setStep(1)}
                                    disabled={loading}
                                >
                                    Back
                                </Button>
                                <Button className="flex-1" type="submit" disabled={loading}>
                                    {loading ? 'Creating Account...' : 'Sign Up'}
                                </Button>
                            </div>
                            <div className="text-center text-sm text-slate-500">
                                Already have an account?{' '}
                                <Link to="/login" className="text-primary-blue hover:underline">
                                    Sign in
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                )}
            </Card>
        </div>
    );
}
