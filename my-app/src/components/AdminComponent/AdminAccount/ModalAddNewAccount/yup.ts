import * as Yup from 'yup';

const accountAddSchema = Yup.object().shape({
  account_name: Yup.string()
    .required('Tên tài khoản là bắt buộc')
    .min(3, 'Tên tài khoản phải có ít nhất 3 ký tự')
    .max(50, 'Tên tài khoản không được vượt quá 50 ký tự'),
  account_email: Yup.string()
    .required('Email là bắt buộc')
    .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, 'Email phải là Gmail và có định dạng hợp lệ'),
  account_phone_number: Yup.string()
    .required('Số điện thoại là bắt buộc')
    .matches(/^(\+?\d{1,3}[- ]?)?\d{10}$/, 'Số điện thoại phải hợp lệ và có 10 chữ số'),
  account_address: Yup.string().required('Địa chỉ là bắt buộc').min(10, 'Địa chỉ phải có ít nhất 10 ký tự'),
  account_role: Yup.array().required('Quyền tài khoản là bắt buộc'),
  account_avatar: Yup.mixed<File | string>()
    .nullable() // Chấp nhận `null` làm giá trị hợp lệ
    .notRequired() // Không bắt buộc nếu edit
    .test('fileType', 'File phải là ảnh (jpg, png)', (value) => {
      if (typeof value === 'string') {
        return true;
      }
      if (!value) return false; // Không có giá trị => invalid
      if (value === null) return false; // Giá trị null => invalid
      return ['image/jpeg', 'image/png'].includes(value.type); // Kiểm tra loại file
    }),
});

export default accountAddSchema;
