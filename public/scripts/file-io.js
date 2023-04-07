export function readQuestions(path) {
  // https://stackoverflow.com/a/46568146
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', path);
    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        console.log(data);
        resolve(data);
      } else {
        console.error('Error:', xhr.statusText);
        reject();
      }
    };
    xhr.onerror = () => {
      console.error('Error:', xhr.statusText);
      reject();
    };
    xhr.send();
  });
}
