"use client"
import { User, Mail, Lock, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import ApiClient from "@/utils/apiCalling";
import { email, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserStore } from "@/store/userStore";

// Define validation schemas
const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    rememberMe: z.boolean().optional()
});

const signupSchema = loginSchema.extend({
    name: z.string().min(2, "Name must be at least 2 characters")
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

const LoginModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const { user, authStatus, authToken } = useUserStore();
    const setUser = useUserStore((state) => state.setUser);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(authMode === 'login' ? loginSchema : signupSchema),
        mode: "onChange"
    });

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        setApiError(null);

        try {
            const apiClient = new ApiClient();
            if (authMode === "login") {
                const res = await apiClient.post("/auth/login", data) as any;
                const resData = res.data.data;
                console.log(resData);

                setUser(
                    {
                        id: resData.user._id,
                        email: resData.user.email ?? "",
                        name: resData.user.name ?? "",
                        role: resData.user.role,
                        accessToken: resData.accessToken,
                        refreshToken: resData.refreshToken
                    },
                    resData.accessToken
                );
                // TODO: remove this 
                localStorage.setItem("authToken", resData.accessToken);
                // Handle successful login
                onClose();
                reset();
            } else {
                await apiClient.post("/auth/signup", data);
                // Handle successful signup
                onClose();
                reset();
            }
        } catch (error: any) {
            setApiError(error.response?.data?.message || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAuthModeChange = () => {
        setAuthMode(authMode === 'login' ? 'signup' : 'login');
        reset();
        setApiError(null);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                onClose();
                reset();
                setApiError(null);
            }
        }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-slate-800">
                        {authMode === 'login' ? 'Login' : 'Create Account'}
                    </DialogTitle>
                    <DialogDescription>
                        {authMode === 'login' ? 'Sign in to your account' : 'Create a new account'}
                    </DialogDescription>
                </DialogHeader>

                {apiError && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                        {apiError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {authMode === 'signup' && (
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    {...register("name")}
                                    type="text"
                                    placeholder="Your name"
                                    className="pl-10"
                                    disabled={isLoading}
                                />
                            </div>
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>
                            )}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input
                                {...register("email")}
                                type="email"
                                placeholder="your.email@example.com"
                                className="pl-10"
                                disabled={isLoading}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input
                                {...register("password")}
                                type="password"
                                placeholder="••••••••"
                                className="pl-10"
                                disabled={isLoading}
                            />
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>
                        )}
                    </div>

                    {authMode === 'login' && (
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    {...register("rememberMe")}
                                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-slate-300 rounded"
                                    disabled={isLoading}
                                />
                                <span className="ml-2 text-sm text-slate-600">Remember me</span>
                            </label>
                            <a href="#" className="text-sm text-red-600 hover:text-red-700">Forgot password?</a>
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {authMode === 'login' ? 'Logging in...' : 'Creating account...'}
                            </>
                        ) : (
                            authMode === 'login' ? 'Login' : 'Create Account'
                        )}
                    </Button>

                    <div className="text-center text-sm text-slate-600">
                        {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                        <button
                            type="button"
                            className="text-red-600 hover:text-red-700 font-medium"
                            onClick={handleAuthModeChange}
                            disabled={isLoading}
                        >
                            {authMode === 'login' ? 'Sign up' : 'Login'}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default LoginModal;