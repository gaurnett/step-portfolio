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
    var documents = document.getElementsByClassName("gallery");
    
    if (galleryFilter == "all")
        galleryFilter = "";
    
    for (var index = 0; index < documents.length; index++) {
        documents[index].className = documents[index].className.replace("show-gallery-img", "");
        if (documents[index].className.includes(galleryFilter)) {
            documents[index].className += " show-gallery-img"
        }
    }
}

function truthLieClicked(truth) {
    if (truth == "truth") {
        alert("Truth!");
    } else {
        alert("Lie! Try again ...");
    }
}