import { Box, Button, Modal, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import OrderApiService from '@services/api/order';
import { InterfaceShipperDetailItem_ForAdmin, InterfaceShipperListMetaData_ForAdmin } from '@services/api/order/type';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@utils/constant';
import { useEffect, useState } from 'react';

// Component Popup Shipper
const AssignShipperPopup = ({
  openAssignShipperPopup,
  handleCloseAssignShipperPopup,
  orderId,
}: {
  openAssignShipperPopup: boolean;
  handleCloseAssignShipperPopup: () => void;
  orderId: string;
}) => {
  const [shipperInformationList, setShipperInformationList] = useState<InterfaceShipperDetailItem_ForAdmin[]>([]);

  const [searchName, setSearchName] = useState('');

  const [searchParams, setSearchParams] = useState({
    searchName: '',
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
    isPendingCall: false,
  });

  const handleSearch = () => {
    handleSearchOrder({ searchName });
  };

  const handleSearchOrder = ({ searchName }: { searchName: string }) => {
    setSearchParams((searchParams) => {
      return {
        ...searchParams,
        searchName,
        isPendingCall: true,
      };
    });
  };

  // Fetch danh sách shipper và số lượng đơn đang giao
  useEffect(() => {
    if (openAssignShipperPopup) {
      OrderApiService.getShipperDataList_ForAdmin({ limit: searchParams.limit, page: searchParams.page, searchName: searchParams.searchName })
        .then((data) => {
          const returnData = data as InterfaceShipperListMetaData_ForAdmin;

          setShipperInformationList(returnData.shipperData);
        })
        .catch((error) => {
          console.log('30 error =================>', error);
        });
    }
  }, [openAssignShipperPopup, searchParams.limit, searchParams.page, searchParams.searchName]);

  const handleAssignShipper = ({ shipperId }: { shipperId: string }) => {
    // OrderApiService.assignShipperToDeliver_ForAdmin({ shipperId, orderId })
    //   .then(() => {})
    //   .catch((error) => {});
    console.log('61 error =================>', shipperId, orderId);
  };

  return (
    <Modal open={openAssignShipperPopup} onClose={handleCloseAssignShipperPopup}>
      <div style={{ padding: 20, background: '#fff', margin: '5% auto', width: '50%' }}>
        <h2>Danh sách Shipper</h2>
        <Box>
          <TextField
            label="Tên sản phẩm"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            variant="outlined"
            fullWidth
            sx={{ maxWidth: '400px' }}
          />
          <Button variant="contained" color="primary" onClick={handleSearch} sx={{ maxWidth: '200px' }}>
            Tìm kiếm
          </Button>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên người giao</TableCell>
              <TableCell>Địa chỉ</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Số đơn đang giao</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shipperInformationList.map((shipper) => (
              <TableRow key={shipper.shipperId}>
                <TableCell>{shipper.shipper_name}</TableCell>
                <TableCell>{shipper.shipper_address}</TableCell>
                <TableCell>{shipper.shipper_phone_number}</TableCell>
                <TableCell>{shipper.currentOrders}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleAssignShipper({ shipperId: shipper.shipperId })}>
                    Chỉ định
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Modal>
  );
};

export default AssignShipperPopup;
