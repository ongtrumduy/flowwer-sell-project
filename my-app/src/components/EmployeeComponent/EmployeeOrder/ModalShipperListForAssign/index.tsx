import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import OrderApiService from '@services/api/order';
import {
  InterfaceShipperDetailItem_ForEmployee,
  InterfaceShipperListMetaData_ForEmployee,
} from '@services/api/order/type';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@utils/constant';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

//  Component Popup Shipper
const AssignShipperPopup = ({
  openAssignShipperPopup,
  handleCloseAssignShipperPopup,
  selectedOrderId,
  selectedOrderCode,
}: {
  openAssignShipperPopup: boolean;
  handleCloseAssignShipperPopup: () => void;
  selectedOrderId: string;
  selectedOrderCode: string;
}) => {
  const [shipperInformationList, setShipperInformationList] = useState<
    InterfaceShipperDetailItem_ForEmployee[]
  >([]);

  const [searchName, setSearchName] = useState('');

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useState({
    searchName: '',
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
    orderStatus: 'ALL',
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

  //  Fetch danh sách shipper và số lượng đơn đang giao
  useEffect(() => {
    if (openAssignShipperPopup) {
      OrderApiService.getShipperDataList_ForEmployee({
        limit: searchParams.limit,
        page: searchParams.page,
        searchName: searchParams.searchName,
      })
        .then((data) => {
          const returnData = data as InterfaceShipperListMetaData_ForEmployee;

          setShipperInformationList(returnData.shipperData);
        })
        .catch((error) => {
          console.log('30 error =================>', error);
        });
    }
  }, [
    openAssignShipperPopup,
    searchParams.limit,
    searchParams.page,
    searchParams.searchName,
  ]);

  const handleAssignShipper = ({ shipperId }: { shipperId: string }) => {
    OrderApiService.assignShipperToDeliver_ForEmployee({
      shipperId,
      orderId: selectedOrderId,
    })
      .then(() => {
        handleCloseAssignShipperPopup();

        navigate(0);
      })
      .catch((error: unknown) => {
        console.log('61 error =================>', {
          error,
          shipperId,
          selectedOrderId,
        });
      });
  };

  return (
    <Dialog
      open={openAssignShipperPopup}
      fullWidth
      maxWidth="xl"
      onClose={(event, reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
          handleCloseAssignShipperPopup();
        }
      }}
    >
      <DialogTitle>
        <h4>Danh sách Người giao hàng</h4>
        <h4>Có thể chỉ định cho Mã đơn hàng {selectedOrderCode}</h4>
      </DialogTitle>

      <DialogContent>
        <div
          style={{
            background: '#fff',
            margin: '20px',
            width: 'calc(100% - 100px)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              padding: '0 0 32px 0',
            }}
          >
            <TextField
              label="Tên người giao hàng"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              variant="outlined"
              fullWidth
              sx={{ maxWidth: '400px', marginRight: '40px' }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              sx={{ maxWidth: '200px' }}
            >
              Tìm kiếm
            </Button>
          </Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>
                  Tên người giao
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Địa chỉ</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Số điện thoại</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>
                  Số đơn đang giao
                </TableCell>{' '}
                <TableCell sx={{ fontWeight: 'bold' }}>
                  Số đơn được chỉ định chờ giao
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shipperInformationList.map((shipper) => (
                <TableRow key={shipper.shipperId}>
                  <TableCell>{shipper.shipper_name}</TableCell>
                  <TableCell>{shipper.shipper_address}</TableCell>
                  <TableCell>{shipper.shipper_phone_number}</TableCell>
                  <TableCell>{shipper.currentOrders}</TableCell>
                  <TableCell>{shipper.currentAssignedOrders}</TableCell>

                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        handleAssignShipper({ shipperId: shipper.shipperId })
                      }
                    >
                      Chỉ định
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseAssignShipperPopup} color="secondary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignShipperPopup;
