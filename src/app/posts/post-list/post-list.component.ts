import { AuthService } from './../../auth/auth.service';
import { PostService } from './../post.service';
import { Post, Post_List } from './../post.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[];
  totalPosts: number;
  pageSize: number = 2;
  currentPage: number = 1;
  pageSizeOptions: number[] = [1, 2, 5, 10];

  private postsLeftInCurrentPage: number;
  private postsSub: Subscription;
  constructor(private postService: PostService, private authService: AuthService) { }

  ngOnInit(): void {
    this.postsSub = this.postService.getPosts(this.pageSize, this.currentPage).subscribe((postList: Post_List) => {
      this.posts = postList.posts;
      this.totalPosts = postList.totalPosts;
      this.postsLeftInCurrentPage = postList.posts.length;
    });
  }

  onDelete(id: string) {
    this.postService.deletePost(id).subscribe(() => {
      if (this.currentPage > 1 && (Math.ceil(this.totalPosts / this.pageSize) === this.currentPage) && this.postsLeftInCurrentPage == 1) {
        this.currentPage--;
      }
      this.postService.getPosts(this.pageSize, this.currentPage);
    });
  }

  onChangedPage(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.postService.getPosts(this.pageSize, this.currentPage);
  }

  isAuthorized(creator: string): boolean {
    return creator === this.authService.getUserId();
  }


  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }
}
