import Names from "./Names.js";

class DragAndDropImages {

    static images = [];

    static initialize() {
        const imageContainers = document.getElementsByClassName("image-container");

        for (let i = 0; i < imageContainers.length; i++) {
            const imageContainer = imageContainers[i];
            DragAndDropImages.loadImage(imageContainer);
            imageContainer.ondrop = DragAndDropImages.dropHandler;
            imageContainer.ondragover = DragAndDropImages.dragOverHandler;
        }
    }

    static getImage(indexString) {
        const index = parseInt(indexString);
        return DragAndDropImages.images[index];
    }

    static loadImage(imageContainer) {
        const index = Array.from(imageContainer.parentNode.children).indexOf(imageContainer);

        fetch(`/img/${Names.project()}_${index}`)
            .then(res => res.blob())
            .then(blob => {
                const img = URL.createObjectURL(blob);
                DragAndDropImages.images[index] = img;
                imageContainer.style.backgroundImage = `url("${img}")`;
            });

    }

    static dragOverHandler(event) {
        event.preventDefault();
    }


    static dropHandler(event) {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        const formData = new FormData()
        formData.append("file", file);
        const index = Array.from(event.target.parentNode.children).indexOf(event.target);
        fetch(`/api/image/${Names.project()}/${index}`,
            {
                method: "POST",
                body: formData
            });
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            DragAndDropImages.images[index] = fileReader.result;
            event.target.style.backgroundImage = `url("${fileReader.result}")`;
        };
    }

}

export default DragAndDropImages