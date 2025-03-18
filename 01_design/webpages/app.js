// app.js
const ALLOWED_TYPES = ['application/binary', 'text/plain', 'text/html', 'text/html; charset=utf-8'];

async function renderFile() {
  try {
    const fileId = window.location.hash.substring(1);
    /* https://drive.google.com/file/d/1WadgUShc0RUkO8ZedN5Pyv_23diP3Qgo/view?usp=sharing
       https://drive.usercontent.google.com/uc?id=1WadgUShc0RUkO8ZedN5Pyv_23diP3Qgo&export=download

      `https://drive.usercontent.google.com/download?id=${fileId}&export=download&authuser=0`
      `https://drive.usercontent.google.com/uc?id=${fileId}&export=download`,
      `https://drive.usercontent.google.com/uc?id=${fileId}&embedded=true`,
    */
    const response = await fetch(
      `https://drive.usercontent.google.com/download?id=${fileId}&export=download&authuser=0`,
       { mode: 'cors' }
    );

    if (!ALLOWED_TYPES.includes(response.headers.get('Content-Type'))) {
      throw new Error('Unsupported file type');
    }

    const content = await response.text();
    console.debug({content});
    const sanitized = DOMPurify.sanitize(content);
    
    const blob = new Blob([sanitized], {type: 'text/html'});
    const url = URL.createObjectURL(blob);
    
    const iframe = document.createElement('iframe');
    iframe.sandbox = 'allow-same-origin';
    iframe.src = url;
    document.body.appendChild(iframe);

    // Cleanup blob URL after load
    iframe.addEventListener('load', () => URL.revokeObjectURL(url));
  } catch (err) {
    console.error('Render failed:', err);
  }
}

renderFile();
