interface UserResponse {
  avatar_url: string | null;
  _id: string;
  name: string;
  email: string;
}

export interface CommentResponse {
  _id: string;
  comment_title: string;
  comment_content: string;
  comment_rating: string; // Assuming the timestamp format as string
  comment_image_list: string[];
  productId_document: string;
  userId_document: UserResponse;
  createdAt: string; // Timestamp string
  updatedAt: string; // Timestamp string
  __v: number;
}

export interface CommentResponseData {
  message: string;
  reasonStatusCode: string;
  statusCode: number;
  metaData: CommentResponseMetadata;
}

export interface CommentResponseMetadata {
  commentList: CommentResponse[];
  totalComments: number;
}
