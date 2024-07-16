'use strict';
const fileSelectInput = document.getElementById('file-select');

const sections = (() => {
  return {
    fileSelect: document.querySelector('.hero__file-select'),
    fileSelected: document.querySelector('.hero__file-selected'),
  };
})();

if (fileSelectInput === undefined) {
  alert('File select button not found!');
  console.error('File select button not found');
}

const SelectedFile = (() => {
  return new (class SelectedFile {
    constructor() {
      this.name = null;
      this.file = null;
    }
  })();
})();

fileSelectInput.addEventListener('input', async (_) => {
  if (fileSelectInput.files < 1) return; // Check if user selected a file

  const fileObj = fileSelectInput.files[0];
  SelectedFile.name = fileObj.name;
  SelectedFile.file = fileObj;

  // If a file is selected
  // 1. Hide file select section
  // 2. Show file selected section
  sections.fileSelect.classList.add('hero__file-select--disabled');
  sections.fileSelected.classList.remove('hero__file-selected--disabled');
});

/**
 * Upload given file to server
 * @param {File} file file object from file input
 */
async function uploadFile(file) {
  const { name, size } = SelectedFile;

  const formData = new FormData();
  formData.append('file', SelectedFile.file);
  formData.append('name', SelectedFile.name);

  const host = 'http://127.0.0.1:3000/file/upload';
  const response = await fetch(host, {
    body: 'formData',
    method: 'post',
    mode: 'no-cors',
  });

  // Continue here after implementing server side file uploading
}
