const interactive = () => {

    let container, camera, scene, renderer, object,
        mouseDown = false, success = false,
        mouseX = 0, mouseY = 0, pMouseX = 0, pMouseY = 0,
        windowHalfX = window.innerWidth / 2,
        windowHalfY = window.innerHeight / 2;

    const onWindowResize = () => {
        if (!success) return;

        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    };

    const onDocumentMouseDown = e => {
        pMouseX = e.clientX;
        pMouseY = e.clientY;

        mouseDown = true;
    }

    const onDocumentMouseUp = e => mouseDown = false;

    const onDocumentMouseMove = e => {
        if (!mouseDown || !success) return;

        mouseX = -(e.clientX - pMouseX) * 0.5;
        mouseY = (e.clientY - pMouseY) * 0.5;

        pMouseX = e.clientX;
        pMouseY = e.clientY;

        object.rotation.z += mouseX * Math.PI / 180;
        object.rotation.x += mouseY * Math.PI / 180;
    };

    const onDocumentMouseWheel = (e) => {
        e.preventDefault();
        if (!success) return;

        let delta = e.deltaY || e.detail || e.wheelDelta;

        delta *= 0.008;

        object.position.z += delta;
    }

    const render = () => {
        if (!success) return;

        camera.lookAt(scene.position);

        renderer.render(scene, camera);

    };

    const init = () => {

        container = document.querySelector('#canvas-3d-interactive');

        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
        camera.position.z = 10;
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

            object.position.x = 0;
            object.position.y = 0;
            object.position.z = 0;
            object.rotation.x = 90 * Math.PI / 180;

            scene.add(object);

        };

        const manager = new THREE.LoadingManager(loadModel);

        manager.onProgress = (item, loaded, total) => {

            console.log(item, loaded, total);

        };


        // model

        const onProgress = xhr => {

            if (xhr.lengthComputable) {

                const percentComplete = xhr.loaded / xhr.total * 100;
                console.log(`model ${Math.round(percentComplete, 2)}% downloaded`);

                if (percentComplete === 100) success = true;
            }
        };

        const onError = () => success = false;

        const loader = new THREE.OBJLoader(manager);
        loader.load('Model/Shuriken.obj', obj => object = obj, onProgress, onError);
        // texture

        const textureLoader = new THREE.TextureLoader(manager);
        const texture = textureLoader.load('model/textures/diffuse.png');

        //

        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0xffffff);
        container.appendChild(renderer.domElement);

        container.addEventListener('mousedown', onDocumentMouseDown);
        container.addEventListener('mouseup', onDocumentMouseUp);

        container.addEventListener('mousemove', onDocumentMouseMove);

        if ('onwheel' in document) {
            // IE9+, FF17+, Ch31+
            container.addEventListener("wheel", onDocumentMouseWheel);
        } else if ('onmousewheel' in document) {
            // устаревший вариант события
            container.addEventListener("mousewheel", onDocumentMouseWheel);
        } else {
            // Firefox < 17
            container.addEventListener("MozMousePixelScroll", onDocumentMouseWheel);
        }

        //

        window.addEventListener('resize', onWindowResize, false);

    };

    const animate = () => {

        requestAnimationFrame(animate);
        render();

    };

    init();
    animate();

};

interactive();
