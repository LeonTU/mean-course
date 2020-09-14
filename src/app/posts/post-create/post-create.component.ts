import { mimeType } from './mime-type.validator';
import { PostService } from './../post.service';
import { Post } from './../post.model';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  editMode: boolean;
  postForm: FormGroup;
  imagePreview: string;
  private id: string;

  constructor(private postService: PostService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.postForm = new FormGroup(
      {
        title: new FormControl('', {validators: [Validators.required, Validators.minLength(3)], updateOn: 'change'}),
        content: new FormControl('', Validators.required),
        image: new FormControl(null, {
          validators: Validators.required,
          asyncValidators: mimeType
        })
      }
    );
    this.id = this.route.snapshot.paramMap.get('id');
    this.editMode = !!this.id;
    if (this.editMode) {
      this.postService.getPost(this.id).subscribe((post: Post) => {
        this.postForm.setValue({
          title: post.title,
          content: post.content,
          image: post.imagePath
        });
        this.imagePreview = post.imagePath;
      });
    }
  }

  onCreateOrEditPost() {
    if (this.postForm.valid) {
      const enteredPostValue: Post = {
        title: this.postForm.value.title,
        content: this.postForm.value.content,
      };
      if (this.editMode) {
        enteredPostValue.id = this.id;
        this.postService.updatePost(enteredPostValue, this.postForm.value.image);
      } else {
        enteredPostValue.image = this.postForm.value.image;
        this.postService.addPost(enteredPostValue);
      }
      this.postForm.reset();
    }
  }

  onFilePicked(event: Event) {
    const file: File = (event.target as HTMLInputElement).files[0];
    if (file) {
      this.postForm.patchValue({ image: file });
      this.postForm.get('image').updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      }
      reader.readAsDataURL(file);
    }
  }
}
