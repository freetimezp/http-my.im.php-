document.querySelector('.sitemap-button').onclick = (e) => {
    e.preventDefault();
    Ajax({type: 'POST'})
        .then((res) => {
            console.log('success - ' + res);
        })
        .catch((res) => {
            console.log('error - ' + res);
        });
}

