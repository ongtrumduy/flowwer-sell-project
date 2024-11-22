import * as Yup from 'yup';

const categoryEditSchema = Yup.object().shape({
  category_name: Yup.string()
    .required('Tên danh mục là bắt buộc')
    .min(3, 'Tên danh mục phải có ít nhất 3 ký tự')
    .max(50, 'Tên danh mục không được vượt quá 50 ký tự'),
  category_description: Yup.string()
    .required('Mô tả danh mục là bắt buộc')
    .min(3, 'Mô tả danh mục phải có ít nhất 3 ký tự')
    .max(500, 'Mô tả danh mục không được vượt quá 500 ký tự'),
});

export default categoryEditSchema;
