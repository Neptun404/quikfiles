'use strict';

const fileDLForm = document.querySelector('.download-form');

console.log(document.querySelector('.download-form__submit-btn'));
document
  .querySelector('.download-form__submit-btn')
  .addEventListener('click', async (e) => {
    e.preventDefault();

    const fileID = document
      .getElementById('file-id')
      .value.toLocaleLowerCase()
      .trim();
    if (fileID.length < 1) alert('Empty file ID');

    const response = await fetch(`/file/download/${fileID}`);
    if (response.status === 404)
      return alert('File does not exist or ID is invalid');

    const { name, link } = await response.json();
    console.table({
      name,
      link,
    });

    window.location.href = link
  });
