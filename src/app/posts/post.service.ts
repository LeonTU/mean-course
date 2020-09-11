import { Post, Post_MongoDB } from './post.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private url: string = `http://localhost:3000/api/posts`;
  private posts: Post[] = [];
  private postSubject = new BehaviorSubject<Post[]>([]);
  constructor(private http: HttpClient) {}

  addPost(post: Post): void {
    this.http
      .post<{ message: string, postId: string }>(this.url, post)
      .subscribe((res) => {
        console.log(res.message);
        post.id = res.postId;
        this.posts.push(post);
        this.postSubject.next([...this.posts]);
      });
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
              content: post.content
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

  deletePost(id: string) {
    this.http.delete(`${this.url}/${id}`).subscribe(() => {
      this.posts = this.posts.filter((post: Post) => post.id !== id);
      this.postSubject.next([...this.posts]);
    });
  }
}
