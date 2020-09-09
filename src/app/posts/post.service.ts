import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[] = [];
  private postSubject = new BehaviorSubject<Post[]>([]);
  constructor(private http: HttpClient) {}

  addPost(post: Post): void {
    this.http
      .post<{ message: string }>(`http://localhost:3000/api/posts`, post)
      .subscribe((res) => {
        console.log(res.message);
        this.posts.push(post);
        this.postSubject.next([...this.posts]);
      });
  }

  getPosts(): Observable<Post[]> {
    this.http
      .get<{ message: string; data: Post[] }>(`http://localhost:3000/api/posts`)
      .subscribe((response) => {
        this.posts = response.data;
        this.postSubject.next([...this.posts]);
      });
    return this.postSubject.asObservable();
  }
}
