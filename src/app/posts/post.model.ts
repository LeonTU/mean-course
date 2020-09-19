export interface Post {
  id?: string,
  title: string,
  content: string,
  imagePath?: string,
  image?: File,
  creator?: string,
}

export interface Post_MongoDB {
  _id: string,
  title: string,
  content: string,
  imagePath: string,
  creator?: string,
}

export interface Post_List {
  totalPosts: number,
  posts: Post[] | Post_MongoDB[],
}
