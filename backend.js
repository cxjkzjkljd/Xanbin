async function createPaste() {
    const title = document.getElementById('paste-title').value;
    const content = document.getElementById('paste-content').value;
    const username = 'User1';  // Replace with dynamic user info
  
    const response = await fetch('http://localhost:5000/paste', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content, username }),
    });
  
    const result = await response.json();
    alert(result.message);
  }  