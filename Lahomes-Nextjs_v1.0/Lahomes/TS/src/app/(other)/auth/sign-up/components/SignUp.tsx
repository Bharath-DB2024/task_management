"use client";  // Ensure this is a Client Component

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import logoDark from '@/assets/images/logo-dark.png';
import LogoLight from '@/assets/images/logo-light.png';
import TextFormInput from '@/components/from/TextFormInput';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Card, CardBody, Col, Container, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const SignUp = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Define schema for validation
  const messageSchema = yup.object({
    name: yup.string().required('Please enter Name'),
    email: yup.string().email('Invalid email format').required('Please enter Email'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Please enter password'),
  });

  const { handleSubmit, control } = useForm({
    resolver: yupResolver(messageSchema),
  });

  // Handle form submission
  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Registration failed');
      }

      alert('Registration successful! Please log in.');
      router.push('/auth/sign-in');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5">
      <Container>
        <Row className="justify-content-center">
          <Col xl={5}>
            <Card className="auth-card">
              <CardBody className="px-3 py-5">
                <div className="mx-auto mb-4 text-center auth-logo">
                  <Link href="/dashboards/analytics" className="logo-dark">
                    <Image src={logoDark} height={32} alt="logo dark" />
                  </Link>
                  <Link href="/dashboards/analytics" className="logo-light">
                    <Image src={LogoLight} height={28} alt="logo light" />
                  </Link>
                </div>
                <h2 className="fw-bold text-uppercase text-center fs-18">Free Account</h2>
                <p className="text-muted text-center mt-1 mb-4">
                  New to our platform? Sign up now! It only takes a minute.
                </p>
                <div className="px-4">
                  <form onSubmit={handleSubmit(onSubmit)} className="authentication-form">
                    <div className="mb-3">
                      <TextFormInput control={control} name="name" placeholder="Enter your Name" className="bg-light bg-opacity-50 border-light py-2" label="Name" />
                    </div>
                    <div className="mb-3">
                      <TextFormInput control={control} name="email" placeholder="Enter your email" className="bg-light bg-opacity-50 border-light py-2" label="Email" />
                    </div>
                    <div className="mb-3">
                      <TextFormInput control={control} name="password" placeholder="Enter your password" className="bg-light bg-opacity-50 border-light py-2" label="Password" type="password" />
                    </div>
                    
                    {/* Show API error message */}
                    {error && <p className="text-danger text-center">{error}</p>}

                    <div className="mb-1 text-center d-grid">
                      <button className="btn btn-danger py-2" type="submit" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Account'}
                      </button>
                    </div>
                  </form>
                </div>
              </CardBody>
            </Card>
            <p className="mb-0 text-center text-white">
              I already have an account{' '}
              <Link href="/auth/sign-in" className="text-reset text-unline-dashed fw-bold ms-1">
                Sign In
              </Link>
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SignUp;