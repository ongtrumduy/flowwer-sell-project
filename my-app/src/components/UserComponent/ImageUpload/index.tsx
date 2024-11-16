import { Container } from '@mui/material';
import CloudinaryUploadApiService from '@services/api/cloudinary_upload';
import { InterfaceCloudinaryUploadMetaData } from '@services/api/cloudinary_upload/type';
import { ChangeEvent, FormEvent, useState } from 'react';

function ImageUpload() {
  const [image, setImage] = useState<File | null>(null); // Đổi kiểu từ FileList sang File cho ảnh đơn
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [responsePreviewUrl, setResponsePreviewUrl] = useState<string>('');

  // Cập nhật ảnh khi người dùng chọn
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file && !file.type.startsWith('image/')) {
      alert('Please upload a valid image file.');
      return;
    }
    setImage(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Gửi ảnh lên server khi submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!image) return;

    const formData = new FormData();
    formData.append('avatar_name', image);

    try {
      setUploadStatus('Uploading...');
      const response =
        (await CloudinaryUploadApiService.uploadProfileAvatarImage({
          formData,
        })) as InterfaceCloudinaryUploadMetaData;

      console.log('36 show response =====>', { response });

      if (response.imageUrl) {
        setUploadStatus('Upload successful!');
        setResponsePreviewUrl(response.imageUrl);
      } else {
        setUploadStatus('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Upload failed');
    }

    //   setUploadStatus('Uploading...');

    //   fetch('http://localhost:8000/upload', {
    //     method: 'POST',
    //     body: formData, // Gửi FormData lên server
    //   })
    //     .then((response) => response.json())
    //     .then((data) => console.log(data))
    //     .catch((error) => console.error('Error:', error));
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ maxWidth: '1200px !important', marginTop: 4 }}
    >
      <h2>Upload Image</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button type="submit">Upload</button>
      </form>
      {previewUrl && (
        <div>
          <h3>Image Preview:</h3>
          <img src={previewUrl} alt="Preview" style={{ maxWidth: '300px' }} />
        </div>
      )}

      <p>{uploadStatus}</p>

      {responsePreviewUrl && (
        <div>
          <h3>Response Image Preview:</h3>
          <img
            src={responsePreviewUrl}
            alt="Response Preview"
            style={{ maxWidth: '300px' }}
          />
        </div>
      )}
    </Container>
  );
}

export default ImageUpload;
