var trash = document.getElementsByClassName("fa-trash");


Array.from(trash).forEach(function(element) {
  element.addEventListener('click', function() {
    const name = this.parentNode.parentNode.childNodes[1].innerText
    const msg = this.parentNode.parentNode.childNodes[3].innerText
    fetch('messages', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'name': name,
        'msg': msg
      })
    }).then(function(response) {
      window.location.reload()
    })
  });
});