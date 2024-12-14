// src/pages/Register/Register.tsx
import React from 'react';
import { Container, Typography, TextField, Button, Box, Alert } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import useAuth from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const initialValues = { name: '', email: '', password: '', confirmPassword: '' };
  const validationSchema = Yup.object({
    name: Yup.string().required('Bắt buộc'),
    email: Yup.string().email('Email không hợp lệ').required('Bắt buộc'),
    password: Yup.string().min(6, 'Ít nhất 6 ký tự').required('Bắt buộc'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Mật khẩu không khớp')
      .required('Bắt buộc'),
  });

  const handleSubmit = (values: typeof initialValues, { setSubmitting, setStatus }: any) => {
    const success = register({
      name: values.name,
      email: values.email,
      password: values.password,
    });
    setTimeout(() => {
      if (success) {
        navigate('/login');
      } else {
        setStatus({ error: 'Email đã được sử dụng' });
      }
      setSubmitting(false);
    }, 500);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom align="center">
          Đăng Ký
        </Typography>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting, status }) => (
            <Form>
              {status && status.error && <Alert severity="error">{status.error}</Alert>}
              <TextField
                margin="dense"
                fullWidth
                label="Tên"
                name="name"
                type="text"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
              />
              <TextField
                margin="dense"
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
              <TextField
                margin="dense"
                fullWidth
                label="Mật Khẩu"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />
              <TextField
                margin="dense"
                fullWidth
                label="Xác Nhận Mật Khẩu"
                name="confirmPassword"
                type="password"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                helperText={touched.confirmPassword && errors.confirmPassword}
              />
              <Button type="submit" fullWidth variant="contained" color="primary" disabled={isSubmitting} sx={{ mt: 3, mb: 2 }}>
                Đăng Ký
              </Button>
              <Typography variant="body2" align="center">
                Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
              </Typography>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default Register;
