import EditAccountModal from '@components/ModalComponent/EditAccountModal';
import { Account } from '@components/type';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

const accountsData = [
  {
    id: 1,
    username: 'johndoe',
    email: 'johndoe@example.com',
    role: 'Admin',
    status: 'Active',
  },
  {
    id: 2,
    username: 'janedoe',
    email: 'janedoe@example.com',
    role: 'User',
    status: 'Inactive',
  },
  // ... các tài khoản khác
];

const AdminAccount: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenEditDialog = (account: Account) => {
    setCurrentAccount(account);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setCurrentAccount(null);
  };

  const handleEditAccountChange = (field: string, value: string) => {
    setCurrentAccount({ ...currentAccount, [field]: value } as Account | null);
  };

  const handleSaveEdit = () => {
    console.log('Updated account data:', currentAccount);
    handleCloseEditDialog();
  };

  const filteredAccounts = accountsData.filter(
    (account) =>
      account.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Account Management
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            variant="outlined"
            placeholder="Search by username or email"
            value={searchTerm}
            onChange={handleSearchChange}
            fullWidth
            InputProps={{
              startAdornment: <SearchIcon />,
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAccounts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>{account.id}</TableCell>
                      <TableCell>{account.username}</TableCell>
                      <TableCell>{account.email}</TableCell>
                      <TableCell>{account.role}</TableCell>
                      <TableCell>{account.status}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenEditDialog(account)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={() =>
                            console.log(`Delete ${account.username}`)
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredAccounts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>

      {/* Popup chỉnh sửa tài khoản */}
      <EditAccountModal
        openEditDialog={openEditDialog}
        handleCloseEditDialog={handleCloseEditDialog}
        currentAccount={currentAccount}
        handleEditAccountChange={handleEditAccountChange}
        handleSaveEdit={handleSaveEdit}
      ></EditAccountModal>
    </Box>
  );
};

export default AdminAccount;
