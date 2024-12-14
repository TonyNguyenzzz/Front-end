// src/pages/Home/Home.tsx
import React, { useMemo, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Snackbar,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
  Alert,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import paymentsData from '../../data/paymentsData';
import apartmentsDataSource from '../../data/apartmentsData';
import residentsData from '../../data/residentsData';
import Notifications from '../Notifications/Notifications';
import quickActionsData from '../../data/quickActionsData';
import ChangePasswordDialog from '../ChangePasswordDialog/ChangePasswordDialog'; // Import dialog đổi mật khẩu

interface Apartment {
  id: number;
  number: string;
  status: string;
}

interface Payment {
  id: number;
  resident: string;
  date: string;
  amount: number;
}

const SummaryCards: React.FC<{ data: { title: string; value: number }[] }> = ({ data }) => (
  <Grid container spacing={3} mb={3}>
    {data.map((item) => (
      <Grid item xs={12} sm={6} md={4} key={item.title}>
        <Card sx={{ minWidth: 200, backgroundColor: '#f5f5f5' }}>
          <CardContent>
            <Typography variant="h6">{item.title}</Typography>
            <Typography variant="h4">{item.value}</Typography>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
);

const PaymentsList: React.FC<{ payments: Payment[] }> = ({ payments }) => {
  if (payments.length === 0) {
    return <Typography variant="body1">Không tìm thấy kết quả thanh toán</Typography>;
  }

  return (
    <Box>
      {payments.map((payment) => (
        <Box key={payment.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body1">{payment.resident}</Typography>
          <Typography variant="body1">{payment.date}</Typography>
          <Typography variant="body1">{payment.amount.toLocaleString()} VND</Typography>
        </Box>
      ))}
    </Box>
  );
};

const ApartmentList: React.FC<{
  apartments: Apartment[];
  onDelete: (id: number) => void;
}> = ({ apartments, onDelete }) => {
  if (apartments.length === 0) {
    return <Typography variant="body1">Không tìm thấy căn hộ</Typography>;
  }

  return (
    <Grid container spacing={3}>
      {apartments.map((apartment) => (
        <Grid item xs={12} sm={6} md={4} key={apartment.id}>
          <Card>
            <CardContent>
              <Typography variant="h6">{apartment.number}</Typography>
              <Typography variant="body2">{apartment.status}</Typography>
              <Button
                variant="outlined"
                color="error"
                onClick={() => onDelete(apartment.id)}
                sx={{ mt: 2 }}
              >
                Xóa
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

const Home: React.FC = () => {
  const navigate = useNavigate();

  const [apartmentsData, setApartmentsData] = useState<Apartment[]>(apartmentsDataSource);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchPaymentTerm, setSearchPaymentTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [apartmentToDelete, setApartmentToDelete] = useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // State cho pop-up đổi mật khẩu và cập nhật thông tin cá nhân
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [updateInfoOpen, setUpdateInfoOpen] = useState(false);

  const summaryData = useMemo(
    () => [
      { title: 'Cư Dân', value: residentsData.length },
      { title: 'Căn Hộ', value: apartmentsData.length },
      { title: 'Thanh Toán', value: paymentsData.length },
    ],
    [apartmentsData]
  );

  const recentPayments = useMemo(() => paymentsData.slice(-5).reverse(), []);
  const filteredPayments = useMemo(() => {
    if (!searchPaymentTerm.trim()) return recentPayments;
    return recentPayments.filter((payment) =>
      payment.resident.toLowerCase().includes(searchPaymentTerm.toLowerCase())
    );
  }, [recentPayments, searchPaymentTerm]);

  const filteredApartments: Apartment[] = useMemo(
    () =>
      apartmentsData.filter((apartment) =>
        apartment.number.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm, apartmentsData]
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handlePaymentSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchPaymentTerm(event.target.value);
  };

  const handleDeleteDialogOpen = (id: number) => {
    setApartmentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setApartmentToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleDelete = () => {
    if (apartmentToDelete !== null) {
      setLoading(true);
      setTimeout(() => {
        setApartmentsData((prev) => prev.filter((a) => a.id !== apartmentToDelete));
        setLoading(false);
        setDeleteDialogOpen(false);
        setSnackbarOpen(true);
      }, 1000);
    }
  };

  // Xử lý khi bấm vào Quick Action
  const handleQuickAction = (action: string) => {
    switch (action) {
      case '/payments':
        navigate('/payments'); // Chuyển đến trang thanh toán
        break;
      case '/repairs':
        navigate('/repairs'); // Chuyển đến trang sửa chữa
        break;
      case '/change-password':
        setChangePasswordOpen(true); // Mở pop-up đổi mật khẩu
        break;
      case '/update-info':
        setUpdateInfoOpen(true); // Mở pop-up cập nhật thông tin
        break;
      case '/residence-history':
        navigate('/residence-history'); // Chuyển đến trang lịch sử cư trú
        break;
      default:
        navigate('/'); 
        break;
    }
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Trang Chủ
      </Typography>

      <Box mb={3}>
        <Grid container spacing={3} alignItems="stretch">
          {quickActionsData.map((action) => (
            <Grid item xs={12} sm={6} md={2.4} key={action.id} sx={{ minWidth: 150 }}>
              <Card sx={{ height: '100%' }}>
                <CardActionArea onClick={() => handleQuickAction(action.action)} sx={{ height: '100%' }}>
                  <CardContent
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="h6" sx={{ wordBreak: 'break-word' }}>
                      {action.title}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <SummaryCards data={summaryData} />

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Tìm kiếm căn hộ"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <ApartmentList apartments={filteredApartments} onDelete={handleDeleteDialogOpen} />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Tìm kiếm thanh toán"
            variant="outlined"
            fullWidth
            value={searchPaymentTerm}
            onChange={handlePaymentSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Thanh Toán Gần Đây
              </Typography>
              <PaymentsList payments={filteredPayments} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box mb={3}>
        <Notifications />
      </Box>

      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Xóa Căn Hộ</DialogTitle>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Hủy
          </Button>
          <Button onClick={handleDelete} color="error" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Xóa'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sử dụng ChangePasswordDialog */}
      <ChangePasswordDialog open={changePasswordOpen} onClose={() => setChangePasswordOpen(false)} />

      {/* Dialog cập nhật thông tin cá nhân */}
      <Dialog open={updateInfoOpen} onClose={() => setUpdateInfoOpen(false)}>
        <DialogTitle>Cập Nhật Thông Tin Cá Nhân</DialogTitle>
        <DialogContent>
          <TextField label="Tên" fullWidth sx={{ mb: 2 }} />
          <TextField label="Email" fullWidth sx={{ mb: 2 }} />
          <TextField label="Số Điện Thoại" fullWidth sx={{ mb: 2 }} />
          {/* Thêm các trường thông tin cá nhân khác tùy ý */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateInfoOpen(false)}>Hủy</Button>
          <Button onClick={() => setUpdateInfoOpen(false)} color="primary">Lưu</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Căn hộ đã được xóa"
      />
    </Container>
  );
};

export default React.memo(Home);
