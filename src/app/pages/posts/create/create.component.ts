import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PostService } from 'src/app/post.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export default class CreateComponent {
  router = inject(Router);
  postService = inject(PostService);
  formBuilder = inject(FormBuilder);

  // body = this.formBuilder.control('');

  // form = this.formBuilder.group({
  //   title: this.formBuilder.control('Title 1'),
  //   description: this.formBuilder.control(''),
  //   body: this.body,
  //   tags: this.formBuilder.array([])
  // });

  form = this.formBuilder.group({
    title: this.formBuilder.control('Title 1', [Validators.required]),
    description: this.formBuilder.control(''),
    // body: this.formBuilder.control('', [ Validators.required, Validators.minLength(10) ]),
    body: this.formBuilder.control(
      '',
      Validators.compose([Validators.required, Validators.minLength(10)])
    ),

    tags: this.formBuilder.array([
      this.formBuilder.control('HTML'),
      this.formBuilder.control('CSS'),
      this.formBuilder.control('JavaScript'),
    ]),
  });

  get postBody() {
    return this.form.get('body') as FormControl;
  }

  get postTags() {
    return this.form.get('tags') as FormArray;
  }

  addTag(tag: string) {
    // console.log(tag);
    this.postTags.push(this.formBuilder.control(tag));
  }

  removeTag(index: number) {
    this.postTags.removeAt(index);
  }

  createPost() {
    if (this.form.invalid) {
      return;
    }
    console.log(this.form.value);
    const data = {
      title: this.form.value.title || '',
      description: this.form.value.description || '',
      body: this.form.value.body || '',
      tagList: (this.form.value.tags || []) as string[],
    };
    this.postService.createArticle(data).subscribe(() => {
      this.router.navigateByUrl('/');
    });
  }
}
