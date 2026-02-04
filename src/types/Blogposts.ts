export type Blogposts = {
  id: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  title: string | null;
  content: string | null;
  images: string[] | null;

  user_profiles?: {
    firstName: string;
    lastName: string;
    email?: string;
  } | null;
};
