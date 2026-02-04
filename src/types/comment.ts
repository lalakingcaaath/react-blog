export type Comments = {
  id: number;
  created_at: string;
  comment: string;
  post_id: number;
  user_id: string;
  comment_image: string;

  user_profiles?: {
    firstName: string;
    lastName: string;
  } | null;
};
