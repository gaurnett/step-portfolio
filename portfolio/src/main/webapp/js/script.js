// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

window.onload = function () {
    filterGallery('all');
    getUser();
    createMap();
};

/** Gets the current user */
function getUser() {
    return fetch('/userapi')
        .then((response) => response.json())
        .then((user) => {
            setUpNavBar(user);

            // If we are on the comments page, set up the forms and load the comments
            if (document.URL.includes('comments.html')) {
                setUpForms(user);
                listComments(user);
            }
        });
}

function setUpNavBar(user) {
    let loginButton = document.getElementById('loginButton');
    let nameElement = document.getElementById('nameElement');
    let logoutButton = document.getElementById('logoutButton');

    // Show/hide specific navbar buttons based on users being signed in out not
    if (user.isUserSignedIn) {
        nameElement.classList.remove('hide-element');
        logoutButton.classList.remove('hide-element');
        nameElement.firstElementChild.innerText = user.name;
        logoutButton.firstElementChild.setAttribute('href', user.link);
    } else {
        loginButton.classList.remove('hide-element');
        loginButton.firstElementChild.setAttribute('href', user.link);
    }
}

/** Creates a map and adds it to the page. */
function createMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 30, lng: -20 },
        zoom: 2.5,
    });

    addLandmark(map, 37.7749, -122.4194, 'San Francisco', 'San Francisco');

    addLandmark(map, 34.0522, -118.2437, 'Los Angeles', 'Los Angeles');

    addLandmark(map, 43.6532, -79.3832, 'Toronto', 'Toronto');

    addLandmark(map, 43.4643, -80.5204, 'Waterloo', 'Waterloo');

    addLandmark(map, 24.4539, 54.3773, 'Abu Dhabi', 'Abu Dhabi');

    addLandmark(map, 40.7128, -74.006, 'New York', 'New York');

    addLandmark(map, 42.4072, -71.3824, 'Massachusetts', 'Massachusetts');

    addLandmark(map, 18.1096, -77.2975, 'Jamaica', 'Jamaica');

    addLandmark(map, 27.6648, -81.5158, 'Florida', 'Florida');
}

/** Adds a marker that shows an info window when clicked. */
function addLandmark(map, lat, lng, title, description) {
    const marker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
        title: title,
    });

    const infoWindow = new google.maps.InfoWindow({ content: description });
    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });
}

/** Sets up the forms on the comments page. */
function setUpForms(user) {
    let formSection = document.getElementById('form-section');
    let loginSection = document.getElementById('login-section');

    // Show/hide the form and sign in button based on users being signed in out not
    if (user.isUserSignedIn) {
        formSection.classList.remove('hide-element');
    } else {
        let signInButton = document.getElementById('gSignInButton');
        signInButton.setAttribute('href', user.link);
        loginSection.classList.remove('hide-element');
    }
}

/*
    Filters the gallery based on the menu clicked by the user
*/
function filterGallery(galleryFilter) {
    let documents = document.getElementsByClassName('gallery');

    for (let index = 0; index < documents.length; index++) {
        /*
            Hides all images before showing the filtered ones.
        */
        documents[index].classList.remove('show-element');

        /*
            If the user clicks on a filter button, say california, it runs through all the images in the 
            documents array and if a document's class name includes the filter, it shows the image.
            If the all button is clicked, all images are shown
        */
        if (
            galleryFilter == 'all' ||
            documents[index].classList.contains(galleryFilter)
        ) {
            documents[index].classList.add('show-element');
        }
    }
}

function truthLieClicked(truth) {
    if (truth == 'truth') {
        alert('Truth!');
    } else {
        alert('Lie! Try again ...');
    }
}

/** Fetches the list of comments from the Servlet */
function listComments(user) {
    fetch('/list-comments')
        .then((response) => response.json())
        .then((comments) => {
            const commentListElement = document.getElementById('comments-list');
            const commentList = [];
            comments.forEach((comment) => {
                commentList.push(createCommentElement(comment, user));
            });
            commentList.forEach((commentElement) =>
                commentListElement.appendChild(commentElement)
            );
        });
}

/** Creates an element that represents a comment, including its delete button. */
function createCommentElement(comment, user) {
    const commentElement = document.createElement('li');
    commentElement.classList.add(
        'list-group-item',
        'flex-column',
        'align-items-start'
    );

    const projectElement = document.createElement('div');
    projectElement.classList.add('d-flex', 'w-100', 'justify-content-between');

    const projectText = document.createElement('h5');
    projectText.classList.add('mb-1');
    projectText.innerHTML = comment.project;

    const date = new Date(comment.timestamp);
    const dateText = document.createElement('small');
    dateText.innerText = date.toLocaleDateString();

    projectElement.appendChild(projectText);
    projectElement.appendChild(dateText);

    const commentText = document.createElement('p');
    commentText.classList.add('mb-1');
    commentText.innerText = comment.comment;

    const nameText = document.createElement('small');
    nameText.innerText = 'by ' + comment.posterName;

    const emailText = document.createElement('small');
    emailText.innerText = ' : ' + comment.posterEmail;

    const deleteButtonATag = document.createElement('a');
    const deleteButtonElement = document.createElement('i');
    deleteButtonElement.classList.add('fa', 'fa-trash');
    deleteButtonATag.appendChild(deleteButtonElement);
    deleteButtonATag.addEventListener('click', () => {
        deleteComment(comment);
        commentElement.remove();
    });

    if (!user.isUserSignedIn || comment.posterID != user.id) {
        deleteButtonATag.classList.add('hide-element');
    }

    commentElement.appendChild(projectElement);
    commentElement.appendChild(commentText);
    commentElement.appendChild(nameText);
    commentElement.appendChild(emailText);
    commentElement.appendChild(deleteButtonATag);
    return commentElement;
}

/** Deletes a comment based on ID */
function deleteComment(comment) {
    const params = new URLSearchParams();
    params.append('id', comment.id);
    fetch('/delete-comment', { method: 'POST', body: params });
}
