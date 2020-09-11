import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routs: Routes = [
  { path: '', component: PostListComponent },
  { path: 'create', component: PostCreateComponent },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routs),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
