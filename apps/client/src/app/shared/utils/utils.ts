import { FormControl } from '@angular/forms';

export function toFormData<T>( formValue: T ) {
  const formData = new FormData();

  for ( const key of Object.keys(formValue) ) {
    const value = formValue[key];
    value && formData.append(key, value);
  }

  return formData;
}

export function getUserName(username: string, first_name: string, last_name: string): string {
  if (first_name) {
    return `${first_name}${last_name ? ' ' + last_name : ''}`;
  }
  return username;
}

export function getScrollbarWidth() {
  return window.innerWidth - document.documentElement.clientWidth;
}

function getExt(fileName: string): string {
  return (fileName.split('.')).slice(-1)[0];
}

export function checkFileTypes(types: string[]) {
  return function (control: FormControl) {
    const files: FileList | File = control.value;
    return checkFileTypesHandler(types, files);
  };
}

export function checkFileTypesHandler(types: string[], files: FileList | File) {
  const results = [];

  if(files instanceof FileList) {
    for (let file in files) {
      if(typeof files[file] === 'object') {
        const checkResult: boolean = !types.includes(files[file].type);
        results.push(checkResult);
      }
    }
  } else if(files instanceof File) {
    const checkResult: boolean = !types.includes(files.type);
    results.push(checkResult);
  }

  if ( results.includes(true) ) {
    return {
      requiredFileType: true
    };
  }

  return null;
}

export function bytesToSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
}

export function checkFileSize(size: number) {
  return function(control: FormControl) {
    const files: FileList = control.value;
    return checkFileSizeHandler(size, files);
  }
}

export function checkFileSizeHandler(size: number, files: FileList) {
  const results = [];

  for (let file in files) {
    if(typeof files[file] === 'object') {
      const fileSize = files[file].size;
      const checkResult: boolean = fileSize > size * 1000000;
      results.push(checkResult);
    }
  }

  if ( results.includes(true) ) {
    return {
      maxFileSize: true
    };
  }

  return null;
}

export function getBase64(file: File): Promise<string | ArrayBuffer> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      res(e.target.result);
    };
    reader.readAsDataURL(file);
  });
}
