import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[] = [];
  private postSubject = new BehaviorSubject<Post[]>([]);
  constructor() { }

  addPost(post: Post): void {
    this.posts.push(post);
    this.postSubject.next([...this.posts]);
  }

  getPosts(): Observable<Post[]> {
    return this.postSubject.asObservable();
  }
}
