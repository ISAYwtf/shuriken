(() => {
    let container, camera, scene, renderer, object, success = false;

    const render = () => {

        if (!success) {
            container.querySelector(".loader").textContent = "Загрузка...";
            return;
        }
        container.querySelector(".loader").style.display = 'none';

        object.rotation.z += 0.01;

        camera.lookAt(scene.position);
        renderer.render(scene, camera);

    };

    const chooseTexture = (target) => {
        switch (target) {
            case "diffuse":
                return 'model/textures/diffuse.png';
            case "emission":
                return 'model/textures/emission.png';
            case "normal":
                return 'model/textures/normal.png';
            case "specular":
                return 'model/textures/specular.png';
            default:
                return 'model/textures/diffuse.png';
        }
    }

    const init3d = () => {

        container = document.querySelector("#canvas-3d");

        camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 1, 2000);
        camera.position.z = 0;
        camera.position.x = 0;
        camera.position.y = 0;

        // scene

        scene = new THREE.Scene();

        const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 0.8);
        camera.add(pointLight);
        scene.add(camera);

        // manager

        const loadModel = () => {

            object.traverse(child => {

                if (child.isMesh) child.material.map = texture;

            });

            object.position.x = -2.5;
            object.position.z = -13;
            object.rotation.x = 90 * Math.PI / 180;
            scene.add(object);

        };

        const manager = new THREE.LoadingManager(loadModel);

        manager.onProgress = (item, loaded, total) => {

            console.log(item, loaded, total);

        };

        // texture


        const textureLoader = new THREE.TextureLoader(manager);
        let texture;

        const optionsTexture = document.querySelector("#selectTexture");

        texture = textureLoader.load(chooseTexture(optionsTexture.value));

        optionsTexture.addEventListener("change", e => texture = textureLoader.load(chooseTexture(e.target.value)));

        // model

        const onProgress = xhr => {

            if (xhr.lengthComputable) {

                const percentComplete = xhr.loaded / xhr.total * 100;
                console.log(`model ${Math.round(percentComplete, 2)}% downloaded`);

                if (percentComplete === 100) {
                    success = true;
                }

            }

        };

        const onError = () => success = false;

        const loader = new THREE.OBJLoader(manager);
        loader.load('Model/Shuriken.obj', obj => object = obj, onProgress, onError);

        //

        const optionsBack = document.querySelector("#selectBack");
        let backColor;

        backColor = '#3e0f0f';

        optionsBack.addEventListener("change", (e) => {
            backColor = e.target.value;
            renderer.setClearColor(backColor);
        })

        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
        renderer.setClearColor(backColor);
        container.appendChild(renderer.domElement);


    };

    const animate = () => {

        requestAnimationFrame(animate);
        render();

    };

    init3d();
    animate();
})()
