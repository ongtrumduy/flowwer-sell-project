import { Box, Button, Card, CardContent, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import AccountApiService from '@services/api/account';
import { InterfaceAccountDetailItemMetaData, InterfaceAccountItem, InterfaceAccountMetaData } from '@services/api/account/type';
import { DEFAULT_LIMIT, DEFAULT_MAX_PRICE, DEFAULT_MIN_PRICE, DEFAULT_PAGE } from '@utils/constant';
import { EnumRole } from '@utils/type';
import React, { useEffect, useState } from 'react';
import AdminPaginationAccountList from './AdminPaginationAccountList';
import ModalAddNewAccount from './ModalAddNewAccount';
import ModalDeleteAccount from './ModalDeleteAccount';
import ModalEditAccount from './ModalEditAccount';

const AdminAccount: React.FC = () => {
  // =============================================================================
  // =============================================================================
  const [accountList, setAccountList] = useState<InterfaceAccountItem[]>([]);
  const [searchParams, setSearchParams] = useState({
    searchName: '',
    selectedCategory: '',
    priceRange: [DEFAULT_MIN_PRICE, DEFAULT_MAX_PRICE],
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
    isPendingCall: false,
  });
  const [totalSearchCount, setTotalSearchCount] = useState(0);
  const [roleList, setRoleList] = useState<{ roleName: string; roleId: string }[]>([]);
  const [accountDetail, setAccountDetail] = useState<InterfaceAccountItem>({
    account_name: '',
    account_email: '',
    account_phone_number: '',
    account_avatar: '',
    account_address: '',
    accountId: '',
    account_role: [],
  });

  const [openAddNewPopup, setOpenAddNewPopup] = useState(false);
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [openDeletePopup, setOpenDeletePopup] = useState(false);

  const [deleteAccountId, setDeleteAccountId] = useState('');

  //============================================================================
  //============================================================================
  const handlePageChange = ({ page }: { page: number }) => {
    setSearchParams((searchParams) => {
      return { ...searchParams, page };
    });
  };

  const handleOpenAddNewPopup = () => {
    setOpenAddNewPopup(true);
  };

  const handleOpenEditPopup = ({ accountId }: { accountId: string | undefined }) => {
    if (accountId) {
      AccountApiService.getAccountItemDetail({ accountId })
        .then((data) => {
          const accountDetail = data as InterfaceAccountDetailItemMetaData;

          setAccountDetail(accountDetail.accountDetail);
        })
        .then(() => {
          setOpenEditPopup(true);
        });
    }
  };

  const handleOpenDeletePopup = ({ accountId }: { accountId: string | undefined }) => {
    if (accountId) {
      setOpenDeletePopup(true);
      setDeleteAccountId(accountId);
    }
  };

  const handleCloseAddNewPopup = () => {
    setOpenAddNewPopup(false);
  };

  const handleCloseEditPopup = () => {
    setOpenEditPopup(false);
  };

  const handleCloseDeletePopup = () => {
    setOpenDeletePopup(false);
  };

  // =============================================================================
  // =============================================================================

  const handleGetAccountList = () => {
    AccountApiService.getAllAccountList(searchParams)
      .then((data) => {
        const accountList = data as InterfaceAccountMetaData;

        setAccountList(accountList.accounts[0].data);
        setTotalSearchCount(accountList.accounts[0].overview[0].totalSearchCount);
      })
      .catch(() => {})
      .finally(() => {
        setSearchParams((searchParams) => {
          return { ...searchParams, isPendingCall: false };
        });
      });
  };

  // =============================================================================
  // =============================================================================
  useEffect(() => {
    handleGetAccountList();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(searchParams)]);

  useEffect(() => {
    setRoleList(() => {
      return [...Object.values(EnumRole).map((role) => ({ roleId: role, roleName: role }))];
    });
  }, []);

  //============================================================================
  //============================================================================
  return (
    <>
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Quản lý Tài khoản
        </Typography>

        <Card>
          <CardContent>
            <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={handleOpenAddNewPopup}>
              Thêm mới Tài khoản
            </Button>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {/* <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell> */}
                    <TableCell sx={{ fontWeight: 'bold' }}>Tên</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Ảnh đại diện</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Số điện thoại</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Địa chỉ</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Vai trò</TableCell>
                    {/* <TableCell sx={{ fontWeight: 'bold' }}>Ngày sinh</TableCell> */}
                    {/* <TableCell sx={{ fontWeight: 'bold' }}>Giới tính</TableCell> */}
                    <TableCell sx={{ fontWeight: 'bold' }}>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accountList.map((account) => (
                    <TableRow key={account.accountId}>
                      {/* <TableCell>{account.accountId}</TableCell> */}
                      <TableCell>{account.account_name}</TableCell>
                      <TableCell>{account.account_email}</TableCell>

                      <TableCell>
                        <img src={account.account_avatar as string} alt="" width={100} height={100} />
                      </TableCell>
                      <TableCell>{account.account_phone_number}</TableCell>
                      <TableCell>{account.account_address}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, flexDirection: 'column' }}>
                          {account.account_role && account.account_role.length ? (
                            (account.account_role as string[]).map((value) => {
                              const role = roleList?.find((item) => item.roleId === value);
                              return <Chip key={value} label={role?.roleName || value} />;
                            })
                          ) : (
                            <Chip key={EnumRole.GUEST} label={EnumRole.GUEST} />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Button variant="outlined" color="primary" onClick={() => handleOpenEditPopup({ accountId: account?.accountId })} sx={{ mr: 1 }}>
                          Sửa
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={() => handleOpenDeletePopup({ accountId: account?.accountId })}>
                          Xóa
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 4 }}>
              <AdminPaginationAccountList totalPages={Math.ceil(totalSearchCount / DEFAULT_LIMIT)} onPageChange={handlePageChange} />
            </Box>
          </CardContent>
        </Card>
      </Box>
      {/* // ============================================================================= */}
      <ModalAddNewAccount
        openAddNewPopup={openAddNewPopup}
        handleDialogClose={handleCloseAddNewPopup}
        roleList={roleList}
        // handleSubmit={handleSubmit}
        // handleAddAccount={handleAddAccount}
        // control={control}
        // errors={errors}
        setOpenAddNewPopup={setOpenAddNewPopup}
        // handleGetAccountList={handleGetAccountList}
      />
      {/* // ============================================================================= */}
      <ModalEditAccount
        openEditPopup={openEditPopup}
        handleCloseEditPopup={handleCloseEditPopup}
        roleList={roleList}
        // handleSubmit={handleSubmit}
        // handleEditAccount={handleEditAccount}
        // control={control}
        accountDetail={accountDetail}
        // reset={reset}
        setOpenEditPopup={setOpenEditPopup}
      />
      {/* // ============================================================================= */}
      <ModalDeleteAccount
        openDeletePopup={openDeletePopup}
        handleCloseDeletePopup={handleCloseDeletePopup}
        // handleDeleteAccount={handleDeleteAccount}
        deleteAccountId={deleteAccountId}
        setOpenDeletePopup={setOpenDeletePopup}
      />
      {/* // ============================================================================= */}
    </>
  );
};

export default AdminAccount;
