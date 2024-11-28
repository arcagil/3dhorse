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
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
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
        
        this.createBody();
        this.createHead();
        this.createLegs();
        
        this.scene.add(this.horseMesh);
        this.camera.position.z = 10;
    }

    createBody() {
        const geometry = new THREE.BoxGeometry(2, 1, 1.5);
        const material = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
        this.bodyParts.body = new THREE.Mesh(geometry, material);
        this.horseMesh.add(this.bodyParts.body);
    }

    createHead() {
        const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.5);
        const material = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
        this.bodyParts.head = new THREE.Mesh(geometry, material);
        this.bodyParts.head.position.set(1.2, 0.2, 0);
        this.horseMesh.add(this.bodyParts.head);
    }

    createLegs() {
        const legGeometry = new THREE.BoxGeometry(0.2, 1, 0.2);
        const legMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
        this.bodyParts.legs = [];
        
        const legPositions = [
            [-0.6, -1, 0.4],  // Front left
            [-0.6, -1, -0.4], // Front right
            [0.6, -1, 0.4],   // Back left
            [0.6, -1, -0.4]   // Back right
        ];

        legPositions.forEach(position => {
            const leg = new THREE.Mesh(legGeometry, legMaterial);
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
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(10, 20, 10);
        this.scene.add(ambientLight);
        this.scene.add(directionalLight);
    }

    updateHorsePosition() {
        // Add gentle bobbing motion
        const time = Date.now() * 0.001;
        this.horseMesh.position.y = Math.sin(time * 2) * 0.1;
        
        // Add slight rotation
        this.horseMesh.rotation.y = Math.sin(time) * 0.1;

        // Animate legs
        this.bodyParts.legs.forEach((leg, index) => {
            const offset = index * Math.PI / 2; // Phase offset for each leg
            leg.position.y = -1 + Math.sin(time * 4 + offset) * 0.1;
        });
    }
}

// Initialize when loaded
window.onload = () => {
    const horseRenderer = new HorseRenderer();
    horseRenderer.animate();
};
