//  'use client';

// import { useRouter } from 'next/navigation';
// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import * as yup from 'yup';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { useNotificationContext } from '@/context/useNotificationContext';
// import useQueryParams from '@/hooks/useQueryParams';

// const useSignIn = () => {
//   const [loading, setLoading] = useState(false);
//   const { push } = useRouter();
//   const { showNotification } = useNotificationContext();
//   const queryParams = useQueryParams();

//   const loginFormSchema = yup.object({
//     email: yup.string().email('Please enter a valid email').required('Please enter your email'),
//     password: yup.string().required('Please enter your password'),
//   });

//   const { control, handleSubmit } = useForm({
//     resolver: yupResolver(loginFormSchema),
//     defaultValues: {
//       email: '', // Removed hardcoded credentials
//       password: '',
//     },
//   });

//   const login = handleSubmit(async (values) => {
//     setLoading(true);
    
//     try {
//       const response = await fetch('http://localhost:5000/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email: values.email, password: values.password }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         showNotification({ message: 'Login successful! Redirecting...', variant: 'success' });
//         push('/dashboards/analytics');
//       } else {
//         showNotification({ message: data.error || 'Login failed', variant: 'danger' });
//       }
//     } catch (error) {
//       showNotification({ message: 'Something went wrong. Try again.', variant: 'danger' });
//     } finally {
//       setLoading(false);
//     }
//   });

//   return { loading, login, control };
// };

// export default useSignIn;


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
      email: 'dbproductions@gmail.com',
      password: 'dbpro'
    }
  });
  const login = handleSubmit(async (values) => {
    setLoading(true);
    console.log(process.env.NEXT_PUBLIC_API);
    
  
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API+"/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email, password: values.password }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
    
        localStorage.removeItem("role");
        localStorage.removeItem("admin_unique_id");
        localStorage.removeItem("instructor_unique_id");
  
        localStorage.setItem("role", data.role);
  
        if (data.role === "admin") {
          localStorage.setItem("admin_unique_id", data.unique_id);
        } else if (data.role === "instructors") {
          localStorage.setItem("instructor_unique_id", data.unique_id);
        }
  
        showNotification({
          message: "Successfully logged in. Redirecting....",
          variant: "success",
        });
        push("/dashboards/analytics"); 
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