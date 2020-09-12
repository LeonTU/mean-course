import { PostService } from './../post.service';
import { Post } from './../post.model';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  editMode: boolean;
  post: Post;
  private id: string;

  constructor(private postService: PostService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.editMode = !!this.id;
    if (this.editMode) {
      this.postService.getPost(this.id).subscribe((post: Post) => {
        this.post = post;
      });
    }
  }

  onCreateOrEditPost(form: NgForm) {
    if (form.valid) {
      const enteredPostValue: Post = {
        title: form.value.title,
        content: form.value.content
      };
      if (this.editMode) {
        enteredPostValue.id = this.id;
        this.postService.updatePost(enteredPostValue);
      } else {
        this.postService.addPost(enteredPostValue);
      }
      form.resetForm();
    }
  }
}
