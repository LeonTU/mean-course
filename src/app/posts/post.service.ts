import { Post, Post_MongoDB, Post_List } from './post.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private url: string = `http://localhost:3000/api/posts`;
  private posts: Post[] = [];
  private postSubject = new BehaviorSubject<Post_List>({ posts: [], totalPosts: 0 });
  constructor(private http: HttpClient, private router: Router) { }

  addPost(post: Post): void {
    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', post.image, post.title);
    this.http
      .post<{ message: string, post: Post_MongoDB; }>(this.url, postData)
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  getPost(id: string): Observable<Post> {
    return this.http.get<{ message: string, data: Post_MongoDB; }>(`${this.url}/${id}`).pipe(map((resData): Post => {
      console.log(resData);
      return {
        id: resData.data._id,
        title: resData.data.title,
        content: resData.data.content,
        imagePath: resData.data.imagePath
      };
    }));
  }

  getPosts(pageSize: number, currentPage: number): Observable<Post_List> {
    const query: string = (pageSize > 0 && currentPage > 0) ?
      `?pageSize=${pageSize}&currentPage=${currentPage}` : '';
    this.http
      .get<{ message: string, data: Post_MongoDB[], totalPosts: number; }>(this.url + query)
      .pipe(
        map((resData): Post_List => {
          const postList: Post_List = {
            posts: resData.data.map((post: Post_MongoDB): Post => {
              return {
                id: post._id,
                title: post.title,
                content: post.content,
                imagePath: post.imagePath,
                creator: post.creator
              };
            }),
            totalPosts: resData.totalPosts
          };
          return postList;
        })
      )
      .subscribe((postList: Post_List) => {
        this.posts = postList.posts;
        this.postSubject.next({ posts: [...this.posts], totalPosts: postList.totalPosts });
      });
    return this.postSubject.asObservable();
  }

  updatePost(post: Post, image: File | string): void {
    let postData;
    if (typeof (image) === 'object') {
      postData = new FormData();
      postData.append('_id', post.id);
      postData.append('title', post.title);
      postData.append('content', post.content);
      postData.append('image', image, post.title);
    } else {
      postData = {
        _id: post.id,
        title: post.title,
        content: post.content,
        imagePath: image
      };
    }
    this.http.put<{ message: string; }>(`${this.url}/${post.id}`, postData).subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  deletePost(id: string): Observable<{ message: string; }> {
    return this.http.delete<{ message: string; }>(`${this.url}/${id}`);
  }
}
