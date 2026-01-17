# 🚗 Virtual World - Self-Driving Car Simulation

A self-driving car simulation built entirely with vanilla JavaScript and HTML5 Canvas - **no external libraries**. This project features a custom neural network implementation, a world editor for creating custom environments, and real-time visualization of the AI's decision-making process.

## 🌟 Features

### Self-Driving Car System
- **Custom Neural Network**: Built from scratch without any ML libraries
- **Sensor System**: Ray-casting sensors to detect obstacles and road boundaries
- **Real-time Learning**: Multiple cars train simultaneously using genetic algorithms
- **Visual Neural Network Editor**: Interactive visualization and editing of neural network connections
- **Decision Boundary Visualization**: See how the AI makes driving decisions
- **Mini-map**: Bird's eye view of the car's position in the world
- **Pedestrian Detection**: AI cars detect and respond to pedestrians crossing streets
- **Dijkstra Pathfinding**: Shortest path calculation using priority queue implementation for navigation
- **Dynamic Target System**: Cars navigate to target points using optimized path planning
- **Collision Detection**: Advanced polygon-based collision detection for cars and obstacles

### World Editor
- **Interactive Map Builder**: Create custom road networks and environments
- **Multiple Editor Modes**:
  - Graph Editor (road network creation)
  - Stop Sign Editor
  - Traffic Light Editor
  - Crossing/Crosswalk Editor
  - Parking Spot Editor
  - Start/Target Position Editor
  - Yield Sign Editor
- **Environmental Elements**: Add buildings, trees, and water features
- **Save/Load System**: Save custom worlds and load them later
- **OpenStreetMap Integration**: Import real-world map data

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A local web server (e.g., Live Server for VS Code, Python's `http.server`, or Node's `http-server`)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/virtual_world.git
cd virtual_world
```

2. Start a local web server:

**Using Python:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Using Node.js:**
```bash
npx http-server -p 8000
```

**Using VS Code Live Server:**
- Install the Live Server extension
- Right-click on `index.html` and select "Open with Live Server"

3. Open your browser and navigate to:
   - Car Simulation: `http://localhost:8000/CAR/index.html`
   - World Editor: `http://localhost:8000/WORLD/` (if available)

## 🎮 Usage

### Car Simulation

#### Controls
- **💾 Save**: Save the best performing car's neural network
- **⬇️ Download**: Download the trained model as a `.car` file
- **📁 Load**: Load a previously saved car model
- **🗑️ Discard**: Delete the saved model and start fresh
- **💀 Kill**: Damage the current best car (useful for testing)
- **Neural Network Editor Controls**:
  - **0️⃣ Zero All**: Reset all network connections to zero
  - **✅ Mark All**: Select all connections
  - **❌ Remove**: Delete selected connections

#### How It Works
1. Multiple cars spawn and begin driving simultaneously
2. Each car has a neural network that controls steering and throttle
3. Cars use ray-casting sensors to detect obstacles
4. The best-performing car (travels farthest without crashing) is highlighted
5. Neural networks mutate between generations for evolution

### World Editor

Create custom environments for your self-driving cars:
1. **Build Roads**: Click to place road points, connect them to form a network
2. **Add Markings**: Place stop signs, traffic lights, crosswalks, and parking spots
3. **Decorate**: Add buildings, trees, and water features
4. **Save**: Export your world to use in the car simulation
5. **Load**: Import existing worlds or real-world data from OpenStreetMap

## 📁 Project Structure

```
CAR/
├── car.js                    # Car physics and behavior
├── controls.js               # Keyboard/AI controls
├── sensor.js                 # Ray-casting sensor implementation
├── network.js                # Neural network implementation
├── visualizer.js             # Neural network visualization
├── decisionBoundary.js       # Decision boundary visualization
├── miniMap.js                # Bird's eye view mini-map with path display
├── pedestrian.js             # Pedestrian AI and behavior
├── main.js                   # Main application logic
├── index.html                # Entry point
├── style.css                 # Styling
├── utils.js                  # Utility functions (lerp, distance, etc.)
└── new_nn/
    ├── nn.js                 # Enhanced neural network
    └── nnEditor.js           # Interactive NN editor

WORLD/
├── js/
│   ├── world.js              # World generation and rendering
│   ├── viewport.js           # Camera/viewport controls
│   ├── grid.js               # Grid system
│   ├── editors/              # Various editor modes
│   │   ├── graphEditor.js    # Road network editor
│   │   ├── crossingEditor.js # Crosswalk placement
│   │   ├── lightEditor.js    # Traffic light editor
│   │   ├── stopEditor.js     # Stop sign editor
│   │   ├── parkingEditor.js  # Parking spot editor
│   │   ├── startEditor.js    # Starting position editor
│   │   ├── targetEditor.js   # Target/goal editor
│   │   └── yieldEditor.js    # Yield sign editor
│   ├── items/                # Buildings, trees, water
│   ├── markings/             # Road markings (signs, lights, etc.)
│   │   ├── crossing.js       # Crosswalk implementation
│   │   ├── light.js          # Traffic light logic
│   │   ├── stop.js           # Stop sign
│   │   ├── parking.js        # Parking spots
│   │   ├── start.js          # Start positions
│   │   ├── target.js         # Goal/target markers
│   │   └── yield.js          # Yield signs
│   ├── math/                 # Graph algorithms and utilities
│   │   ├── graph.js          # Graph data structure & Dijkstra's algorithm
│   │   ├── osm.js            # OpenStreetMap data parser
│   │   └── utils.js          # Math utilities (vectors, intersections)
│   └── primitives/           # Geometric primitives
│       ├── point.js          # Point class
│       ├── segment.js        # Line segment class
│       ├── polygon.js        # Polygon class
│       └── envelope.js       # Envelope (offset polygon) class
└── saves/                    # Saved world files
```

## 🧠 Neural Network Architecture

The neural network is a custom implementation featuring:
- **Input Layer**: Sensor readings (ray distances to obstacles)
- **Hidden Layer(s)**: Configurable number of neurons
- **Output Layer**: 4 outputs (forward, reverse, left, right)
- **Activation Function**: Custom activation with bias
- **Training Method**: Genetic algorithm with mutation

## 🚶 Pedestrian Detection System

The simulation includes intelligent pedestrian behavior:
- **Autonomous Pedestrians**: NPCs that wait at crosswalks and cross streets realistically
- **Car Detection**: Pedestrians check if cars are stopped before crossing (detection radius: 200 units)
- **State Machine**: Three states - waiting at edge, crossing, and waiting at other side
- **Smart Timing**: Pedestrians require cars to stop for ~100ms before crossing
- **Safety Checks**: Continuous monitoring to ensure safe crossing conditions
- **Bi-directional Movement**: Pedestrians cross in both directions with wait times between crossings

The AI must learn to detect and yield to pedestrians, adding realistic complexity to the driving challenge.

## 🗺️ Pathfinding & Navigation

### Dijkstra's Algorithm Implementation
The project includes a custom implementation of Dijkstra's shortest path algorithm:
- **Priority Queue**: Efficient min-heap-based priority queue for optimal performance
- **Graph-Based Roads**: Road network represented as graph with points and segments
- **Dynamic Path Generation**: Real-time shortest path calculation from car to target
- **One-Way Support**: Handles directional road segments for realistic traffic flow
- **Path Visualization**: Shows the calculated shortest path on the mini-map

### How It Works
1. Car's current position is projected onto the nearest road segment
2. Target position is projected onto its nearest road segment
3. Dijkstra's algorithm finds the shortest path through the road network
4. Path is used to guide the car and provide visual feedback
5. Road borders are generated along the path to constrain the car's movement
🔧 Technical Highlights

### Custom Implementations (No Libraries!)
- **Graph Theory**: Graph data structure with adjacency relationships
- **Dijkstra's Algorithm**: Priority queue-based shortest path finding
- **Ray Casting**: Custom sensor implementation for obstacle detection
- **Polygon Geometry**: Intersection tests, contains-point checks, offset polygons
- **Vector Math**: 2D vector operations (add, subtract, dot product, cross product, normalize)
- **Genetic Algorithm**: Mutation-based neural network evolution
- **State Machines**: For pedestrian behavior and traffic systems
- **Spatial Hashing**: Efficient collision detection optimization

### Performance Optimizations
- Viewport culling for efficient rendering
- Spatial partitioning for collision detection
- Priority queue for Dijkstra's algorithm (O(E log V) complexity)
- Canvas layer separation for static and dynamic elements

## 🤝 Contributing

Contributions are welcome! Here are some ideas:
- Add more complex road scenarios (roundabouts, highways)
- Implement additional neural network architectures (LSTM, CNN)
- Improve the genetic algorithm (crossover, tournament selection)
- Add multiplayer/comparison mode
- Create more world editor features
- Add weather conditions and time-of-day effects
- Implement traffic rules enforcement scoring
- Add more pedestrian behaviors and interaction
- `angle`: Turning speed

### Neural Network Configuration
Modify in [main.js](CAR/main.js):
- Number of cars training simultaneously
- Network layer sizes
- Mutation rate for genetic algorithm

### World Generation
Adjust in [world.js](WORLD/js/world.js):
- `roadWidth`: Width of roads
- `buildingWidth`: Size of buildings
- `treeSize`: Size of trees
- `spacing`: Space between objects

## 🤝 Contributing

Contributions are welcome! Here are some ideas:
- Add more complex road scenarios
- Implement additional neural network architectures
- Improve the genetic algorithm
- Add multiplayer/comparison mode
- Create more world editor features

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Inspired by the challenges of autonomous vehicle development
- Built as an educational project to understand neural networks and simulation
- Special thanks to the JavaScript and HTML5 Canvas communities

## 📧 Contact

Feel free to reach out with questions, suggestions, or just to share your trained models!

---

**Happy Training! 🚗💨**
