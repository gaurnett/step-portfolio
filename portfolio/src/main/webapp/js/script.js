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
    Filters the gallery based on the menu clicked by the user
*/
function filterGallery(galleryFilter) {
    let documents = document.getElementsByClassName('gallery');

    for (let index = 0; index < documents.length; index++) {
        /*
            Hides all images before showing the filtered ones.
        */
        documents[index].classList.remove('show-gallery-img');

        /*
            If the user clicks on a filter button, say california, it runs through all the images in the 
            documents array and if a document's class name includes the filter, it shows the image.
            If the all button is clicked, all images are shown
        */
        if (
            galleryFilter == 'all' ||
            documents[index].classList.contains(galleryFilter)
        ) {
            documents[index].classList.add('show-gallery-img');
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
            const commentListElement = document.getElementById('comments-list');
            const commentList = [];
            comments.forEach((comment) => {
                commentList.push(createCommentElement(comment));
            });
            commentList.forEach((commentElement) =>
                commentListElement.appendChild(commentElement)
            );
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
    nameText.innerText = 'by ' + comment.name;

    const deleteButtonElement = document.createElement('i');
    deleteButtonElement.classList.add('fa', 'fa-trash');
    deleteButtonElement.addEventListener('click', () => {
        deleteComment(comment);
        commentElement.remove();
    });

    commentElement.appendChild(projectElement);
    commentElement.appendChild(commentText);
    commentElement.appendChild(nameText);
    commentElement.appendChild(deleteButtonElement);
    return commentElement;
}

/** Deletes a comment based on ID */
function deleteComment(comment) {
    const params = new URLSearchParams();
    params.append('id', comment.id);
    fetch('/delete-comment', { method: 'POST', body: params });
}
