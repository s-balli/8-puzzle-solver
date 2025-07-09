var ThreeDManager = {
    enabled: false,
    scene: null,
    camera: null,
    renderer: null,
    cubes: [],
    
    init: function() {
        this.create3DPanel();
        this.bindEvents();
    },
    
    create3DPanel: function() {
        var panel = document.createElement('div');
        panel.id = 'threeDPanel';
        panel.className = 'threed-panel';
        panel.style.display = 'none';
        
        panel.innerHTML = `
            <div class="threed-header">
                <h3>3D Visualization</h3>
                <button id="close3D">×</button>
            </div>
            <div class="threed-content">
                <div id="threeDContainer" class="threed-container"></div>
                <div class="threed-controls">
                    <button id="rotate3D">Rotate</button>
                    <button id="reset3D">Reset View</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
    },
    
    bindEvents: function() {
        var threeDCheckbox = document.getElementById('threeDVisualization');
        var closeButton = document.getElementById('close3D');
        var rotateButton = document.getElementById('rotate3D');
        var resetButton = document.getElementById('reset3D');
        
        if (threeDCheckbox) {
            threeDCheckbox.addEventListener('change', this.toggle.bind(this));
        }
        
        if (closeButton) {
            closeButton.addEventListener('click', this.hide.bind(this));
        }
        
        if (rotateButton) {
            rotateButton.addEventListener('click', this.toggleRotation.bind(this));
        }
        
        if (resetButton) {
            resetButton.addEventListener('click', this.resetView.bind(this));
        }
    },
    
    toggle: function() {
        var checkbox = document.getElementById('threeDVisualization');
        this.enabled = checkbox.checked;
        
        if (this.enabled) {
            this.show();
            this.init3D();
        } else {
            this.hide();
            this.cleanup3D();
        }
        
        localStorage.setItem('threeDVisualization', this.enabled);
    },
    
    show: function() {
        var panel = document.getElementById('threeDPanel');
        if (panel) {
            panel.style.display = 'block';
        }
    },
    
    hide: function() {
        var panel = document.getElementById('threeDPanel');
        if (panel) {
            panel.style.display = 'none';
        }
        
        var checkbox = document.getElementById('threeDVisualization');
        if (checkbox) {
            checkbox.checked = false;
        }
        
        this.enabled = false;
        localStorage.setItem('threeDVisualization', false);
    },
    
    init3D: function() {
        var container = document.getElementById('threeDContainer');
        if (!container) return;
        
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(75, 300 / 200, 0.1, 1000);
        this.camera.position.set(5, 5, 5);
        this.camera.lookAt(0, 0, 0);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(300, 200);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        container.appendChild(this.renderer.domElement);
        
        // Add lights
        var ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 10);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        
        // Add controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.25;
        
        // Initialize puzzle
        this.create3DPuzzle();
        
        // Start animation loop
        this.animate();
    },
    
    create3DPuzzle: function() {
        this.cubes = [];
        var size = PuzzleManager.getBoardSize();
        var maxTiles = PuzzleManager.getMaxTileNumber();
        
        for (var i = 1; i <= maxTiles; i++) {
            var geometry = new THREE.BoxGeometry(0.8, 0.8, 0.2);
            var material = new THREE.MeshLambertMaterial({ color: 0x4CAF50 });
            var cube = new THREE.Mesh(geometry, material);
            
            // Add text
            var canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;
            var context = canvas.getContext('2d');
            context.font = '48px Arial';
            context.fillStyle = 'white';
            context.textAlign = 'center';
            context.fillText(i.toString(), 32, 40);
            
            var texture = new THREE.CanvasTexture(canvas);
            var textMaterial = new THREE.MeshBasicMaterial({ map: texture });
            cube.material = [
                new THREE.MeshLambertMaterial({ color: 0x4CAF50 }),
                new THREE.MeshLambertMaterial({ color: 0x4CAF50 }),
                new THREE.MeshLambertMaterial({ color: 0x4CAF50 }),
                new THREE.MeshLambertMaterial({ color: 0x4CAF50 }),
                textMaterial,
                new THREE.MeshLambertMaterial({ color: 0x4CAF50 })
            ];
            
            cube.castShadow = true;
            cube.receiveShadow = true;
            
            this.scene.add(cube);
            this.cubes.push(cube);
        }
        
        // Add base platform
        var platformGeometry = new THREE.BoxGeometry(size + 0.5, size + 0.5, 0.1);
        var platformMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 });
        var platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.position.y = -0.2;
        platform.receiveShadow = true;
        this.scene.add(platform);
        
        this.update3DPositions();
    },
    
    update3DPositions: function() {
        if (!this.enabled || !this.cubes.length) return;
        
        var state = game.state;
        var size = PuzzleManager.getBoardSize();
        var offset = (size - 1) / 2;
        
        for (var i = 0; i < state.length; i++) {
            var value = state[i];
            if (value === '0') continue;
            
            var tileNumber = parseInt(value, 16) || parseInt(value, 10);
            var cube = this.cubes[tileNumber - 1];
            
            if (cube) {
                var row = Math.floor(i / size);
                var col = i % size;
                
                cube.position.x = col - offset;
                cube.position.z = row - offset;
                cube.position.y = 0;
            }
        }
    },
    
    animate: function() {
        if (!this.enabled || !this.renderer) return;
        
        requestAnimationFrame(this.animate.bind(this));
        
        if (this.controls) {
            this.controls.update();
        }
        
        this.renderer.render(this.scene, this.camera);
    },
    
    toggleRotation: function() {
        if (!this.scene) return;
        
        this.scene.rotation.y += 0.5;
    },
    
    resetView: function() {
        if (!this.camera || !this.controls) return;
        
        this.camera.position.set(5, 5, 5);
        this.camera.lookAt(0, 0, 0);
        this.controls.reset();
    },
    
    cleanup3D: function() {
        if (this.renderer) {
            var container = document.getElementById('threeDContainer');
            if (container && this.renderer.domElement) {
                container.removeChild(this.renderer.domElement);
            }
        }
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.cubes = [];
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check if Three.js is available
    if (typeof THREE !== 'undefined') {
        ThreeDManager.init();
        
        // Load saved setting
        var saved3D = localStorage.getItem('threeDVisualization') === 'true';
        var checkbox = document.getElementById('threeDVisualization');
        if (checkbox) {
            checkbox.checked = saved3D;
            ThreeDManager.enabled = saved3D;
            if (saved3D) {
                ThreeDManager.show();
                ThreeDManager.init3D();
            }
        }
    } else {
        // Disable 3D option if Three.js is not available
        var checkbox = document.getElementById('threeDVisualization');
        if (checkbox) {
            checkbox.disabled = true;
            checkbox.parentElement.style.opacity = '0.5';
            checkbox.parentElement.title = 'Three.js library not available';
        }
    }
});