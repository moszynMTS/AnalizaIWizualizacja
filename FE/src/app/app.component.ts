import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl, Title } from '@angular/platform-browser';
import { ApiCaller } from '../apiCaller';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  form: FormGroup;

  topics = [
    { id: 1, image: 'assets/images/img1.jpg', name: 'Temat 1' },
    { id: 2, image: 'assets/images/img2.jpg', name: 'Temat 2' },
    { id: 3, image: 'assets/images/img3.jpg', name: 'Temat 3' }
  ];

  selectedFileName: string | null = null;
  selectedFilePreview: SafeUrl | null = null;

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private apiCaller: ApiCaller,
    private titleService: Title
  ) {
    this.form = this.fb.group({
      id: [null, Validators.required],
      file: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle(environment.name);
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      this.form.patchValue({ file });
      this.form.get('file')?.updateValueAndValidity();
      this.selectedFileName = file.name;
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.selectedFilePreview = this.sanitizer.bypassSecurityTrustUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      this.selectedFileName = null;
      this.selectedFilePreview = null;
    }
  }

  analyze(): void {
    if (this.form.invalid) return;
    const formData = new FormData();
    formData.append('id', this.form.get('id')?.value);
    formData.append('file', this.form.get('file')?.value);
    this.apiCaller.uploadPhotos(formData).subscribe(
      (response) => {
        console.log('SUCCESS', response);
      },
      (error) => {
        console.log('FAIL', error);
      }
    );
  }
  
}