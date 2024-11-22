import * as Yup from 'yup';

const productEditSchema = Yup.object().shape({
  product_name: Yup.string().required('Tên sản phẩm là bắt buộc.').min(3, 'Tên sản phẩm phải ít nhất 3 ký tự.'),
  product_quantity: Yup.number()
    .required('Số lượng sản phẩm là bắt buộc.')
    .typeError('Số lượng sản phẩm phải là một số.')
    .integer('Số lượng sản phẩm phải là số nguyên.')
    .min(1, 'Số lượng sản phẩm phải lớn hơn 0.'),
  product_price: Yup.number().required('Giá sản phẩm là bắt buộc.').typeError('Giá sản phẩm phải là một số.').min(1, 'Giá sản phẩm phải lớn hơn 0.'),
  product_description: Yup.string().required('Mô tả sản phẩm là bắt buộc.').max(500, 'Mô tả sản phẩm không được vượt quá 500 ký tự.'),
  // product_category: Yup.array().min(1, 'Phải chọn ít nhất một danh mục sản phẩm.').required('Danh mục sản phẩm là bắt buộc.'),
  product_category: Yup.array().notRequired(),
  product_image: Yup.mixed<File | string>()
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

export default productEditSchema;
