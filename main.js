//setup before functions
let myInput = document.querySelector('.search');
let typingTimer;
let doneTypingInterval = 500;
let searchElement = document.querySelector('.items');
let sorryItemElement = '<div class="sorry-wrapper"><i class="fas fa-truck-loading"></i><a href="#" class="sorry-msg">Sorry, we couldn\'t find anything :(</a><div>';
let loadingItemElement = '<div class="loading"><i class="fas fa-spinner"></i> Loading...</div>';

// Ataching event listener
// keyup event would be better, but it doesn't recognize backspace because backspace it's not printable key
myInput.addEventListener('keydown', () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(searchBodyTitle, doneTypingInterval);
});


async function searchBodyTitle() {
    const query = myInput.value;
    // early return
    if (query === '') {
        clearItems();
        return;
    }

    try {
        startLoading();
        const result = await fetch(`https://jsonplaceholder.typicode.com/posts?q=${query}`);
        const data = await result.json();
        const posts = data.map(post => {
            return {
                title: post.title,
                body: post.body
            }
        });
        finishLoading();
        if (posts.length === 0) {
            searchElement.innerHTML += sorryItemElement;
        } else {
            posts.forEach(post => {
                // using slice for output, because some of body is too long
                let slicedTitle = post.title.slice(0, 30);
                let slicedBody = `${post.body.slice(0, 30)} ...`;

                let helper_title = slicedTitle.split(' ');
                let helper_body = slicedBody.split(' ');

                let post_helper = query.split(' ');

                // finding which word matches with user input(title)
                for (let i = 0; i < helper_title.length; i++) {
                    for (let k = 0; k < post_helper.length; k++) {
                        if (helper_title[i] == post_helper[k].trim()) {
                            helper_title[i] = `<b style="color:black;">${helper_title[i]}</b>`;
                        }
                    }
                }
                // finding which word matches with user input(body)
                for (let i = 0; i < helper_body.length; i++) {
                    for (let k = 0; k < post_helper.length; k++) {
                        if (helper_body[i] == post_helper[k].trim()) {
                            helper_body[i] = `<b style="color:black;">${helper_body[i]}</b>`;
                        }
                    }
                }

                // removing comma(,) between words
                helper_title = helper_title.join(' ');
                helper_body = helper_body.join(' ');

                // creating html for searched word
                newElement(helper_title, helper_body);
            });
        }
        return data;
    } catch (error) {
        finishLoading();
        console.log(error);
    }
}

function clearItems() {
    searchElement.innerHTML = '';
}

function newElement(title, body) {
    let newElement = `<a href="#" class="item-options"><span class="dropdown-title">${title}</span><span class="dropdown-body">${body}</span></a>`;
    searchElement.innerHTML += newElement;
}

function startLoading() {
    clearItems();
    searchElement.innerHTML += loadingItemElement;
}

function finishLoading() {
    clearItems();
}