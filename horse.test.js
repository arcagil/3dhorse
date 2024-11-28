import { HorseRenderer } from './horse';

describe('HorseRenderer', () => {
    let renderer;
    
    afterEach(() => {
        // Clean up
        jest.resetAllMocks();
        if (renderer && renderer.renderer && renderer.renderer.domElement) {
            renderer.renderer.domElement.remove();
        }
    });

    beforeEach(() => {
        // Mock window dimensions
        global.innerWidth = 1024;
        global.innerHeight = 768;
        
        // Mock THREE global object since we're in Node environment
        global.THREE = {
            Scene: jest.fn(() => ({
                add: jest.fn(),
                children: [],
                remove: jest.fn()
            })),
            WebGLRenderer: jest.fn(() => ({
                setSize: jest.fn(),
                domElement: document.createElement('canvas')
            })),
            PerspectiveCamera: jest.fn(),
            BoxGeometry: jest.fn(),
            MeshPhongMaterial: jest.fn(),
            Mesh: jest.fn(),
            Group: jest.fn(),
            OrbitControls: jest.fn(() => ({
                enableDamping: false,
                dampingFactor: 0,
                update: jest.fn()
            })),
            AmbientLight: jest.fn(),
            DirectionalLight: jest.fn(() => ({
                position: { set: jest.fn() }
            }))
        };
        renderer = new HorseRenderer();
    });

    test('should initialize scene, camera and renderer', () => {
        expect(renderer.scene).toBeDefined();
        expect(renderer.camera).toBeDefined();
        expect(renderer.renderer).toBeDefined();
    });

    test('should create horse mesh', () => {
        expect(renderer.horseMesh).toBeDefined();
        expect(renderer.horseMesh).toBeInstanceOf(THREE.Group);
    });

    test('should create horse body parts', () => {
        expect(renderer.bodyParts).toBeDefined();
        expect(renderer.bodyParts.body).toBeDefined();
        expect(renderer.bodyParts.head).toBeDefined();
        expect(renderer.bodyParts.legs).toBeDefined();
        expect(renderer.bodyParts.legs.length).toBe(4);
    });

    test('should position camera correctly', () => {
        expect(renderer.camera.position.z).toBeGreaterThan(0);
    });

    test('should have animation methods', () => {
        expect(typeof renderer.animate).toBe('function');
        expect(typeof renderer.updateHorsePosition).toBe('function');
    });

    test('should update horse position', () => {
        const initialY = renderer.horseMesh.position.y;
        renderer.updateHorsePosition();
        expect(renderer.horseMesh.position.y).not.toBe(initialY);
    });

    test('should initialize controls', () => {
        expect(renderer.controls).toBeDefined();
    });

    test('should handle window resize', () => {
        const event = new Event('resize');
        window.dispatchEvent(event);
        expect(renderer.camera.aspect).toBe(window.innerWidth / window.innerHeight);
    });

    test('should setup lighting correctly', () => {
        expect(renderer.scene.add).toHaveBeenCalledTimes(4); // Horse mesh + 2 lights
        const lights = renderer.scene.children.filter(
            child => child instanceof THREE.AmbientLight || child instanceof THREE.DirectionalLight
        );
        expect(lights.length).toBe(2);
    });
});
