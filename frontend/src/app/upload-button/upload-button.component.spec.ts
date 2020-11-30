import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { UploadButtonComponent } from './upload-button.component';

describe('UploadButtonComponent', () => {
  let component: UploadButtonComponent;
  let fixture: ComponentFixture<UploadButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ UploadButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onFileChanged function', () => {

    beforeEach(() => {

    });
    it('should set up file to upload and display ready message if valid file', () => {
      const mockFile = new File([''], 'filename', { type: 'image/jpeg' });
      const mockEvt = { target: { files: [mockFile] } };

      component.onFileChanged(mockEvt as any);
      component.UIMessage.subscribe((val) => expect(val).toEqual('File ready to upload'));
      expect(component.fileToUpload).toEqual({ data: mockFile, inProgress: false, progress: 0 });
    });
    it('should set error message if value invalid', () => {
      const mockFile = new File([''], 'filename', { type: 'text/html' });
      const mockEvt = { target: { files: [mockFile] } };

      component.onFileChanged(mockEvt as any);
      component.UIMessage.subscribe((val) => expect(val).toEqual('Please upload a JPEG/PNG below 500Kb'));

    });
  });

  describe('uploadFile function', () => {
    type FileToUpload = { data: File, inProgress: boolean, progress: number };
    let file: File;
    let fileToUpload: FileToUpload;

    beforeEach(() => {
      file = new File(['sample'], 'sample.jpeg', { type: 'image/jpeg' });
      fileToUpload = {data: file, inProgress: false, progress: 0};
    });

    it('should send file data to upload service if valid', fakeAsync(() => {
      component.description.setValue('test');
      component.uploadFile(fileToUpload);
      component.UIMessage.subscribe((val) => expect(val).toEqual('Uploading...'));
    }));

    it('should set error if missing description', fakeAsync(() => {
      component.uploadFile(fileToUpload);
      component.UIMessage.subscribe((val) => expect(val).toEqual('Failed: please set a description'));
    }));



  });
});
