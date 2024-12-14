import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Alert, 
  IconButton, 
  InputAdornment 
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import useAuth from '../../hooks/useAuth';
import { useNavigate, useLocation, Link } from 'react-router-dom';

// Định nghĩa kiểu an toàn hơn
interface LocationState {
  from?: { pathname: string };
}

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  // Sử dụng type assertion an toàn
  const from = (location.state as LocationState)?.from?.pathname || '/';

  const initialValues = { email: '', password: '' };
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Email không hợp lệ')
      .required('Bắt buộc')
      .trim(),
    password: Yup.string()
      .min(6, 'Ít nhất 6 ký tự')
      .required('Bắt buộc')
  });

  const handleSubmit = async (values: typeof initialValues, { setSubmitting, setStatus }: any) => {
    try {
      setSubmitting(true);
      const success = await login(values.email.trim(), values.password);
      
      if (success) {
        navigate(from, { replace: true });
      } else {
        setStatus({ error: 'Email hoặc mật khẩu không chính xác' });
      }
    } catch (error) {
      setStatus({ error: 'Đã xảy ra lỗi. Vui lòng thử lại.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box 
        sx={{ 
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Đăng Nhập
        </Typography>
        <Formik 
          initialValues={initialValues} 
          validationSchema={validationSchema} 
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting, status }) => (
            <Form style={{ width: '100%', marginTop: 16 }}>
              {status && status.error && (
                <Alert 
                  severity="error" 
                  sx={{ width: '100%', marginBottom: 2 }}
                >
                  {status.error}
                </Alert>
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                autoFocus
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Mật Khẩu"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <Typography 
                variant="body2" 
                align="right" 
                sx={{ 
                  width: '100%', 
                  marginTop: 1,
                  marginBottom: 2 
                }}
              >
                <Link to="/forgot-password">Quên mật khẩu?</Link>
              </Typography>
              <Button 
                type="submit" 
                fullWidth 
                variant="contained" 
                color="primary" 
                disabled={isSubmitting}
                sx={{ 
                  marginTop: 2,
                  marginBottom: 2,
                  padding: '12px',
                }}
              >
                {isSubmitting ? 'Đang đăng nhập...' : 'Đăng Nhập'}
              </Button>
              <Typography variant="body2" align="center">
                Bạn chưa có tài khoản? <Link to="/register">Đăng ký</Link>
              </Typography>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default Login;