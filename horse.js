class HorseRenderer {
    constructor() {
        try {
            console.log('Initializing 3D Horse...');
            this.initScene();
            console.log('Scene initialized');
            this.setupLighting();
            console.log('Lighting setup complete');
            this.createHorse();
            console.log('Horse model created');
            console.log('Initialization complete - starting animation');
            this.animate();
        } catch (error) {
            console.error('Error initializing 3D Horse:', error);
            throw error;
        }
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue background
        
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(8, 4, 8); // Position camera further back and higher
        this.camera.lookAt(0, 0, 0);
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);

        // Initialize controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    createHorse() {
        this.horseMesh = new THREE.Group();
        this.bodyParts = {};
        
        this.createGround();
        this.createBody();
        this.createHead();
        this.createLegs();
        
        // Position horse above ground
        this.horseMesh.position.y = 1;
        
        this.scene.add(this.horseMesh);
    }

    createGround() {
        const groundGeometry = new THREE.PlaneGeometry(20, 20);
        const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x355E3B }); // Forest green
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.position.y = -2.5;
        this.ground.receiveShadow = true;
        this.scene.add(this.ground);
    }

    createBody() {
        // Main body
        const bodyGeometry = new THREE.BoxGeometry(3, 1.2, 1);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x8B4513,
            shininess: 30,
            aoMapIntensity: 1.0,
            roughness: 0.8
        });
        this.bodyParts.body = new THREE.Mesh(bodyGeometry, material);
        this.bodyParts.body.castShadow = true;
        this.horseMesh.add(this.bodyParts.body);

        // Neck
        const neckGeometry = new THREE.BoxGeometry(0.8, 1, 0.6);
        const neck = new THREE.Mesh(neckGeometry, material);
        neck.position.set(1.5, 0.5, 0);
        neck.rotation.z = -Math.PI / 6; // Angle the neck upward
        neck.castShadow = true;
        this.bodyParts.neck = neck;
        this.horseMesh.add(neck);
    }

    createHead() {
        const material = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
        
        // Head
        const headGeometry = new THREE.BoxGeometry(1, 0.6, 0.4);
        this.bodyParts.head = new THREE.Mesh(headGeometry, material);
        this.bodyParts.head.position.set(2.2, 1.0, 0);
        this.bodyParts.head.rotation.z = -Math.PI / 12;
        this.bodyParts.head.castShadow = true;
        this.horseMesh.add(this.bodyParts.head);

        // Ears
        const earGeometry = new THREE.BoxGeometry(0.15, 0.3, 0.1);
        const leftEar = new THREE.Mesh(earGeometry, material);
        const rightEar = new THREE.Mesh(earGeometry, material);
        
        leftEar.position.set(2.4, 1.4, 0.15);
        rightEar.position.set(2.4, 1.4, -0.15);
        
        leftEar.rotation.z = -Math.PI / 6;
        rightEar.rotation.z = -Math.PI / 6;
        
        leftEar.castShadow = true;
        rightEar.castShadow = true;
        
        this.bodyParts.ears = [leftEar, rightEar];
        this.horseMesh.add(leftEar);
        this.horseMesh.add(rightEar);
    }

    createLegs() {
        const legGeometry = new THREE.BoxGeometry(0.3, 1.5, 0.3);
        const legMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x8B4513,
            shininess: 30,
            aoMapIntensity: 1.0,
            roughness: 0.8
        });
        this.bodyParts.legs = [];
        
        const legPositions = [
            [-1.0, -1.5, 0.3],  // Front left
            [-1.0, -1.5, -0.3], // Front right
            [1.0, -1.5, 0.3],   // Back left
            [1.0, -1.5, -0.3]   // Back right
        ];

        // Create tail
        const tailGeometry = new THREE.BoxGeometry(0.2, 0.8, 0.2);
        const tail = new THREE.Mesh(tailGeometry, legMaterial);
        tail.position.set(-1.4, 0.2, 0);
        tail.rotation.z = Math.PI / 6; // Angle the tail upward
        tail.castShadow = true;
        this.bodyParts.tail = tail;
        this.horseMesh.add(tail);

        legPositions.forEach(position => {
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            leg.castShadow = true;
            leg.position.set(...position);
            this.bodyParts.legs.push(leg);
            this.horseMesh.add(leg);
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.updateHorsePosition();
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    setupLighting() {
        // Ambient light for general illumination
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        // Main directional light with shadows
        const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
        mainLight.position.set(5, 10, 5);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        // Configure shadow camera
        mainLight.shadow.camera.near = 0.5;
        mainLight.shadow.camera.far = 50;
        mainLight.shadow.camera.left = -10;
        mainLight.shadow.camera.right = 10;
        mainLight.shadow.camera.top = 10;
        mainLight.shadow.camera.bottom = -10;
        mainLight.shadow.bias = -0.001;
        this.scene.add(mainLight);

        // Fill light from the opposite side
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-5, 5, -5);
        this.scene.add(fillLight);
    }

    updateHorsePosition() {
        const time = Date.now() * 0.001;
        
        // Maintain base height and add gentle bobbing
        const baseHeight = 2; // Raised height to account for longer legs
        this.horseMesh.position.y = baseHeight + Math.sin(time * 1.5) * 0.05;
        
        // Subtle body rotation for natural movement
        this.horseMesh.rotation.x = Math.sin(time * 1.5) * 0.02;
        this.horseMesh.rotation.z = Math.sin(time * 1.5) * 0.01;

        // Animate tail
        // Animate tail
        if (this.bodyParts.tail) {
            this.bodyParts.tail.rotation.z = Math.PI / 6 + Math.sin(time * 3) * 0.2;
            this.bodyParts.tail.rotation.y = Math.sin(time * 2) * 0.1;
        }

        // Animate ears
        if (this.bodyParts.ears) {
            this.bodyParts.ears.forEach((ear, index) => {
                const offset = index * Math.PI; // Opposite movement for each ear
                ear.rotation.z = -Math.PI / 6 + Math.sin(time * 2 + offset) * 0.1;
                ear.rotation.y = Math.sin(time * 3 + offset) * 0.1;
            });
        }
        
        // Animate legs with a walking motion
        this.bodyParts.legs.forEach((leg, index) => {
            const isLeft = index % 2 === 0;
            const isFront = index < 2;
            const phaseOffset = (isLeft ? 0 : Math.PI) + (isFront ? 0 : Math.PI / 2);
            const baseY = -1;
            const swingAngle = Math.sin(time * 2 + phaseOffset) * 0.2;
            
            // Get the original position for this leg
            const [baseX, _, baseZ] = legPositions[index];
            
            // Move legs in an elliptical pattern
            leg.position.y = baseY + Math.abs(Math.sin(time * 2 + phaseOffset)) * 0.2;
            leg.position.x = baseX;
            leg.position.z = baseZ + Math.cos(time * 2 + phaseOffset) * 0.1;
            leg.rotation.x = swingAngle;
        });
    }
}

// Initialize when loaded
window.onload = () => {
    const horseRenderer = new HorseRenderer();
    horseRenderer.animate();
};
