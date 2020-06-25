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

filterGallery('all');
function filterGallery(galleryFilter) {
    var documents, index;
    documents = document.getElementsByClassName("gallery");
    
    if (galleryFilter == "all")
        galleryFilter = "";
    
    for (index = 0; index < documents.length; index++) {
        removeClassName(documents[index], "show-gallery-img");
        if (documents[index].className.includes(galleryFilter)) {
            addClassName(documents[index], "show-gallery-img");
        }
    }
}

function addClassName(element, className) {
  element.className += " " + className;
}

function removeClassName(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);     
    }
  }
  element.className = arr1.join(" ");
}