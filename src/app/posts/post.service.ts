import { Post, Post_MongoDB } from './post.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private url: string = `http://localhost:3000/api/posts`;
  private posts: Post[] = [];
  private postSubject = new BehaviorSubject<Post[]>([]);
  constructor(private http: HttpClient, private router: Router) {}

  addPost(post: Post): void {
    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', post.image, post.title);
    this.http
      .post<{ message: string, post: Post_MongoDB }>(this.url, postData)
      .subscribe((res) => {
        console.log(res.message);
        const post: Post = {
          id: res.post._id,
          title: res.post.title,
          content: res.post.content,
          imagePath: res.post.imagePath,
        };
        this.posts.push(post);
        this.postSubject.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  getPost(id: string): Observable<Post> {
    return this.http.get<{message: string, data: Post_MongoDB}>(`${this.url}/${id}`).pipe(map((resData): Post => {
      console.log(resData)
      return {
        id: resData.data._id,
        title: resData.data.title,
        content: resData.data.content,
        imagePath: resData.data.imagePath
      };
    }));
  }

  getPosts(): Observable<Post[]> {
    this.http
      .get<{message: string, data: Post_MongoDB[]}>(this.url)
      .pipe(
        map((resData): Post[] => {
          return resData.data.map((post: Post_MongoDB): Post => {
            return {
              id: post._id,
              title: post.title,
              content: post.content,
              imagePath: post.imagePath
            };
          });
        })
      )
      .subscribe((posts: Post[]) => {
        this.posts = posts;
        this.postSubject.next([...this.posts]);
      });
    return this.postSubject.asObservable();
  }

  updatePost(post: Post, image: File | string) {
    let postData;
    if (typeof(image) === 'object') {
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
    this.http.put(`${this.url}/${post.id}`, postData).subscribe(() => {
      // const postRef = this.posts.find(p => p.id === post.id);
      // postRef.title = postForUpdate.title;
      // postRef.content = postForUpdate.content;
      this.router.navigate(['/']);
    });
  }

  deletePost(id: string) {
    this.http.delete(`${this.url}/${id}`).subscribe(() => {
      this.posts = this.posts.filter((post: Post) => post.id !== id);
      this.postSubject.next([...this.posts]);
    });
  }
}
