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
  if (fileSelectInput.files.length < 1) return; // Check if user selected a file

  const fileObj = fileSelectInput.files[0];
  SelectedFile.name = fileObj.name;
  SelectedFile.file = fileObj;
  document.querySelector('.selected-file__name').textContent =
    SelectedFile.name;

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

  const host = '/file/upload';

  try {
    const response = await fetch(host, {
      body: formData,
      method: 'post',
      // mode: 'no-cors',
    });

    const body = await response.json();

    if (response.status === 413) {
      alert('File is too larger than 1mb');
      return;
    }

    prompt(
      `
    Upload Completed
    Please note down the file ID below
  `,
      body.fileID
    );
  } catch (error) {
    alert(error);
  }
}
