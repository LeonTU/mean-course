import { PostService } from './../post.service';
import { Post } from './../post.model';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  constructor(private postService: PostService) { }

  ngOnInit(): void {
  }

  onCreatePost(form: NgForm) {
    if (form.valid) {
      const newPost: Post = {
        title: form.value.title,
        content: form.value.content
      };
      this.postService.addPost(newPost);
      form.resetForm();
    }
  }
}
