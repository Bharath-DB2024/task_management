'use client';

import logoDark from '@/assets/images/logo.svg';
import LogoLight from '@/assets/images/logo.svg';
import TextFormInput from '@/components/from/TextFormInput';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { Button, Card, CardBody, Col, Container, Row } from 'react-bootstrap';
import useSignIn from './useSignIn';


const SignIn = () => {
  useEffect(() => {
    document.body.classList.add('authentication-bg');
    return () => {
      document.body.classList.remove('authentication-bg');
    };
  }, []);

 
  const {
    loading,
    login,
    control
  } = useSignIn();
  return <div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5">
      <Container>
        <Row className="justify-content-center">
          <Col xl={5}>
            <Card className="auth-card">
              <CardBody className="px-3 py-5">
                <div className="mx-auto mb-4 text-center auth-logo">
                  <div href="/dashboards/analytics" className="logo-dark">
                    <Image src={logoDark} height={52} alt="logo dark" />
                  </div>
                  <div className="logo-light">
                    <Image src={LogoLight} height={38} alt="logo light" />
                  </div>
                </div>
                <h2 className="fw-bold text-uppercase text-center fs-18">Sign In</h2>
                <p className="text-muted text-center mt-1 mb-4">Enter your email and password to access your panel.</p>
                <div className="px-4">
                  <form className="authentication-form" onSubmit={login}>
                    <div className="mb-3">
                      <TextFormInput control={control} name="email" placeholder="Enter your email" className="bg-light bg-opacity-50 border-light py-2" label="Email" />
                    </div>
                    <div className="mb-3">
                   
                      <TextFormInput control={control} name="password" placeholder="Enter your password" className="bg-light bg-opacity-50 border-light py-2" label="Password" />
                    </div>
                  
                    <div className="mb-1 text-center d-grid">
                      <button disabled={loading} className="btn btn-danger py-2 fw-medium" type="submit">
                        Sign In
                      </button>
                    </div>
                  </form>
                  
                </div>
              </CardBody>
            </Card>
           
          </Col>
        </Row>
      </Container>
    </div>;
};
export default SignIn;