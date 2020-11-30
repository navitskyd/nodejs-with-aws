import { Component, OnInit } from '@angular/core';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UploadService } from '../services/upload.service';
import { FormControl, Validators } from '@angular/forms';

type FileToUpload = { data: File, inProgress: boolean, progress: number };

@Component({
  selector: 'app-upload-button',
  templateUrl: './upload-button.component.html',
  styleUrls: ['./upload-button.component.scss']
})
export class UploadButtonComponent implements OnInit {
  private UIMessageSubject: BehaviorSubject<string> = new BehaviorSubject('');

  public readonly UIMessage: Observable<string> = this.UIMessageSubject.asObservable();

  description = new FormControl('', [Validators.required]);

  fileToUpload: FileToUpload;

  constructor(private uploadService: UploadService) {
  }

  ngOnInit(): void {
  }

  uploadFile(file: FileToUpload) {
    if (!this.description.valid) {
      this.UIMessageSubject.next('Failed: please set a description');
      return;
    }
    const formData = new FormData();
    formData.append('uploadFile', file.data, file.data.name);
    formData.append('description', this.description.value);
    file.inProgress = true;
    return this.uploadService.upload(formData).pipe(
      map(event => {
        this.setUIMessage('Uploading...');
        if (event.type === HttpEventType.Response) {
            return event;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error)
        this.setUIMessage(`An error occured with the upload: ${error.status}: ${error.statusText}`);
        file.inProgress = false;
        return of(`${file.data.name} upload failed: ${error.error}`);
      })).subscribe((event: any) => {
        if (typeof (event) === 'object') {
          this.setUIMessage('Upload succeeded');
        }
        return of('Upload success');
      });
  }


  onFileChanged(event) {
    this.fileToUpload = null;

    for (const file of event.target.files) {
      if ((file.type === 'image/jpeg' || file.type === 'image/png')
        && file.size <= 500000) {
        // confirm file recieved
        this.setUIMessage('File ready to upload');
        this.fileToUpload = { data: file, inProgress: false, progress: 0 };
      }
      else {
        this.setUIMessage('Please upload a JPEG/PNG below 500Kb');
      }
    }
  }

  setUIMessage(str: string) {
    this.UIMessageSubject.next(str);
  }
}
