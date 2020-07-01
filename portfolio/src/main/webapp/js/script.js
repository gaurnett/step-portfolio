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

/*
    Filters the gallery based on the tab clicked. filterGallery() adds or removes show-gallery-img class 
    from each of the images in order to show or hide it.
*/
filterGallery('all');
function filterGallery(galleryFilter) {
    let documents = document.getElementsByClassName('gallery');

    if (galleryFilter == 'all') galleryFilter = '';

    for (let index = 0; index < documents.length; index++) {
        documents[index].className = documents[index].className.replace(
            'show-gallery-img',
            ''
        );
        if (documents[index].className.includes(galleryFilter)) {
            documents[index].className += ' show-gallery-img';
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
function listComments() {
    fetch('/list-comments')
        .then((response) => response.json())
        .then((comments) => {
            console.log(comments);
            const commentListElement = document.getElementById('comments-list');
            comments.forEach((comment) => {
                commentListElement.appendChild(createCommentElement(comment));
            });
        });
}

/** Creates an element that represents a comment, including its delete button. */
function createCommentElement(comment) {
    const commentElement = document.createElement('li');
    commentElement.classList.add(
        'list-group-item',
        'flex-column',
        'align-items-start'
    );

    const projectElement = document.createElement('div');
    projectElement.classList.add('d-flex', 'w-100', 'justify-content-between');

    const projectHeading = document.createElement('h5');
    projectHeading.classList.add('mb-1');
    projectHeading.innerHTML = comment.project;

    const date = new Date(comment.timestamp);
    const timestamp = document.createElement('small');
    timestamp.innerText = date.toLocaleDateString();

    projectElement.appendChild(projectHeading);
    projectElement.appendChild(timestamp);

    const comment = document.createElement('p');
    comment.classList.add('mb-1');
    comment.innerText = comment.comment;

    const name = document.createElement('small');
    name.innerText = 'by ' + comment.name;

    const breakElement = document.createElement('br');

    const deleteButtonElement = document.createElement('button');
    deleteButtonElement.classList.add('btn', 'btn-danger');
    deleteButtonElement.innerText = 'Delete';
    deleteButtonElement.addEventListener('click', () => {
        deleteComment(comment);
        commentElement.remove();
    });

    commentElement.appendChild(projectElement);
    commentElement.appendChild(comment);
    commentElement.appendChild(name);
    commentElement.appendChild(breakElement);
    commentElement.appendChild(deleteButtonElement);
    return commentElement;
}

/** Deletes a comment based on ID */
function deleteComment(comment) {
    const params = new URLSearchParams();
    params.append('id', comment.id);
    fetch('/delete-comment', { method: 'POST', body: params });
}
