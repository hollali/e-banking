"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import CustomInput from "./customInput";
import { authFormSchema, signUpStepSchemas } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/actions/auth.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PaystackLink from "./PaystackLink";
import { DatePicker } from "./DatePicker";
import { format } from "date-fns";

const STEP_LABELS = ["Personal Info", "Address", "Account Setup"];

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [authError, setAuthError] = useState<string | null>(null);

  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(authFormSchema(type)),
    defaultValues: {
      email: "",
    },
  });

  const handleNext = async () => {
    if (type !== "sign-up") return;
    const stepSchema = signUpStepSchemas[currentStep - 1];
    const values = form.getValues();
    const result = stepSchema.safeParse(values);
    if (!result.success) {
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          form.setError(err.path[0] as any, { message: err.message });
        }
      });
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      if (type === "sign-up") {
        const userData = {
          firstName: data.firstName!,
          lastName: data.lastName!,
          address: data.address!,
          city: data.city!,
          postalCode: data.postalCode!,
          dateOfBirth: data.dateOfBirth!,
          ssn: data.ssn!,
          email: data.email!,
          password: data.password!,
        };
        const newUser = await signUp(userData);
        if (newUser && 'error' in newUser) {
          setAuthError(newUser.error);
        } else if (newUser) {
          router.push("/");
        }
      }
      if (type === "sign-in") {
        const response = await signIn({
          email: data.email,
          password: data.password,
        });
        if (response && 'error' in response) {
          setAuthError(response.error);
        } else if (response) {
          router.push("/");
        }
      }
    } catch (error) {
      setAuthError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isSignUp = type === "sign-up";

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="cursor-pointer flex items-center gap-1">
          <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="Horizon logo"
          />
          <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
            Horizon
          </h1>
        </Link>
        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user ? "Link Account" : type === "sign-in" ? "Sign In" : "Sign Up"}
            <p className="text-16 font-normal text-gray-600">
              {user
                ? "Link your account to get started"
                : isSignUp
                  ? STEP_LABELS[currentStep - 1]
                  : "Please enter your details"}
            </p>
          </h1>
        </div>
      </header>
      {user ? (
        <div className="flex flex-col gap-4">
          <PaystackLink user={user} />
        </div>
      ) : (
        <>
          {authError && (
            <div className="w-full p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-14">
              {authError}
            </div>
          )}
          {isSignUp && (
            <div className="flex items-center justify-between gap-2 mb-2">
              {STEP_LABELS.map((label, index) => {
                const step = index + 1;
                const isCompleted = currentStep > step;
                const isActive = currentStep === step;
                return (
                  <React.Fragment key={label}>
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                          isCompleted
                            ? "bg-green-500 text-white"
                            : isActive
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {isCompleted ? "✓" : step}
                      </div>
                      <span
                        className={`text-xs hidden sm:block ${
                          isActive ? "text-blue-600 font-medium" : "text-gray-500"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                    {index < STEP_LABELS.length - 1 && (
                      <div
                        className={`h-0.5 flex-1 mt-[-16px] sm:mt-0 ${
                          isCompleted ? "bg-green-500" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {isSignUp && currentStep === 1 && (
                <>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <CustomInput
                      control={form.control}
                      name="firstName"
                      label="First Name"
                      placeholder="Enter your First Name"
                    />
                    <CustomInput
                      control={form.control}
                      name="lastName"
                      label="Last Name"
                      placeholder="Enter your Last Name"
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <div className="form-item">
                        <label className="form-label">Date of Birth</label>
                        <div className="flex w-full flex-col">
                          <DatePicker
                            value={field.value ? new Date(field.value) : undefined}
                            onChange={(date) =>
                              field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                            }
                            placeholder="Select your date of birth"
                          />
                          {form.formState.errors.dateOfBirth && (
                            <p className="form-message mt-2">
                              {form.formState.errors.dateOfBirth.message}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  />
                </>
              )}

              {isSignUp && currentStep === 2 && (
                <>
                  <CustomInput
                    control={form.control}
                    name="address"
                    label="Address"
                    placeholder="Enter your specific Address"
                  />
                  <div className="flex flex-col sm:flex-row gap-4">
                    <CustomInput
                      control={form.control}
                      name="city"
                      label="City / Town"
                      placeholder="Example Accra"
                    />
                    <CustomInput
                      control={form.control}
                      name="postalCode"
                      label="Postal Code"
                      placeholder="Example: GA100"
                    />
                  </div>
                </>
              )}

              {isSignUp && currentStep === 3 && (
                <>
                  <CustomInput
                    control={form.control}
                    name="ssn"
                    label="Identification Number"
                    placeholder="Example: GHA-000000000-0"
                  />
                  <CustomInput
                    control={form.control}
                    name="email"
                    label="Email"
                    placeholder="Enter your email"
                  />
                  <CustomInput
                    control={form.control}
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                  />
                </>
              )}

              {!isSignUp && (
                <>
                  <CustomInput
                    control={form.control}
                    name="email"
                    label="Email"
                    placeholder="Enter your email"
                  />
                  <CustomInput
                    control={form.control}
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                  />
                </>
              )}

              <div className="flex flex-col gap-4">
                {isSignUp && currentStep < 3 && (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="form-btn"
                  >
                    Next
                  </Button>
                )}
                {isSignUp && currentStep === 3 && (
                  <Button type="submit" disabled={isLoading} className="form-btn">
                    {isLoading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" /> &nbsp;
                        Loading...
                      </>
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                )}
                {!isSignUp && (
                  <Button type="submit" disabled={isLoading} className="form-btn">
                    {isLoading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" /> &nbsp;
                        Loading...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                )}
                {!isSignUp && (
                  <Link href="/forgot-password" className="text-14 text-blue-600 text-center hover:underline">
                    Forgot your password?
                  </Link>
                )}
                {isSignUp && currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="w-full"
                  >
                    Back
                  </Button>
                )}
              </div>
            </form>
          </Form>
          <footer className="flex justify-center gap-1">
            <p className="text-14 font-normal text-gray-600">
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="form-link"
            >
              {type === "sign-in" ? "Sign Up" : "Sign In"}
            </Link>
          </footer>
        </>
      )}
    </section>
  );
};

export default AuthForm;
