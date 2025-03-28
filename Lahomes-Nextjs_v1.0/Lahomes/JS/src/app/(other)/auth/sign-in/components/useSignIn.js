'use client';


import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNotificationContext } from '@/context/useNotificationContext';
import useQueryParams from '@/hooks/useQueryParams';

const useSignIn = () => {
  
  const [loading, setLoading] = useState(false);
  const {
    push
  } = useRouter();
  const {
    showNotification
  } = useNotificationContext();
  const queryParams = useQueryParams();
  const loginFormSchema = yup.object({
    email: yup.string().email('Please enter a valid email').required('Please enter your email'),
    password: yup.string().required('Please enter your password')
  });
  const {
    control,
    handleSubmit
  } = useForm({
    resolver: yupResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });


  const login = handleSubmit(async (values) => {
    setLoading(true);
  
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email, password: values.password }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        ["user_name","role", "admin_unique_id", "instructor_unique_id", "student_unique_id"].forEach(item =>
          localStorage.removeItem(item)
        );
        localStorage.setItem("role", data.role);
        localStorage.setItem("user_name",data.name);

        switch (data.role) {
          case "admin":
            localStorage.setItem("admin_unique_id", data.unique_id);
            push("/dashboards/analytics");
            break;
          case "instructors":
            localStorage.setItem("instructor_unique_id", data.instructor_unique_id);
            push("/dashboard/analytics");
            break;
          case "students":
            localStorage.setItem("student_unique_id", data.student_unique_id);
            push("/Dashboard/analytics");
            break;
          default:
            console.warn("Unknown role:", data.role);
        }
  
        showNotification({
          message: "Successfully logged in. Redirecting....",
          variant: "success",
        });
      } else {
        showNotification({
          message: data.error || "Login failed",
          variant: "danger",
        });
      }
    } catch (error) {
      showNotification({
        message: "Something went wrong. Try again.",
        variant: "danger",
      });
    } finally {
      setLoading(false);
    }
  });
  


  
  return {
    loading,
    login,
    control
  };
};


export default useSignIn;