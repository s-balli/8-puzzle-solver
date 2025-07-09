# 8-Puzzle Solver - Enhanced Edition 🧩

Advanced 8-puzzle solver with enhanced heuristics, educational features, and performance analysis.

## ✨ Features

### 🔍 Search Algorithms
- **Breadth-First Search** - Complete, optimal solution guarantee
- **Depth-First Search** - Memory efficient exploration
- **Uniform Cost Search** - Cost-based optimal pathfinding
- **Iterative Deepening** - Best of both BFS and DFS
- **Greedy Best-First** - Heuristic-guided fast solutions
- **A* Search** - Optimal solutions with heuristic guidance

### 🎯 Advanced Heuristics
- **Manhattan Distance** - Sum of horizontal and vertical tile distances
- **Euclidean Distance** - Straight-line geometric distance calculation
- **Misplaced Tiles** - Count of incorrectly positioned tiles
- **Linear Conflict** - Manhattan + conflict resolution penalty
- **Walking Distance** - Advanced row/column conflict detection
- **Corner Tiles** - Structure-aware corner position penalties
- **Max Heuristic** - Combination of multiple heuristic functions

### 📊 Analysis & Visualization
- **Real-time Performance Metrics** - Live algorithm execution statistics
- **Interactive Search Tree** - Visual exploration of search space
- **Performance Analysis Dashboard** - Memory usage and timing data
- **Real-time Graphs** - Dynamic visualization of search progress
- **Solution Replay** - Animated step-by-step solution playback

### 🎓 Educational Features
- **Algorithm & Heuristic Guide** - Interactive learning system with 3 tabs:
  - **🔍 Algorithm Tab** - Detailed algorithm explanations, steps, pros/cons
  - **🎯 Heuristic Tab** - Mathematical formulas, examples, characteristics
  - **📊 Comparison Tab** - Algorithm vs heuristic performance comparison
- **Smart Recommendations** - Context-aware algorithm/heuristic suggestions
- **Step-by-step Explanations** - Real-time search process visualization
- **Interactive Examples** - Live demonstration of concepts

### 🎨 User Experience
- **Multi-Theme System** - Light, Dark, and High Contrast themes
- **Modern Custom State Input** - 3-method puzzle configuration:
  - **Visual Editor** - Click-to-edit interactive tiles
  - **Text Input** - Direct string input with validation
  - **Preset Library** - Difficulty-graded puzzle configurations
- **Responsive Design** - Optimized for all screen sizes
- **Sound Effects** - Audio feedback for interactions
- **Keyboard Shortcuts** - Efficient navigation and control

## 📋 Requirements

### System Requirements
- **Python 3.6+** - Required for development server
- **Node.js 14+** - For package management
- **Modern Browser** - Chrome, Firefox, Safari, Edge

### Dependencies
```bash
npm install
```

## 🚀 Quick Start

### Development Server
```bash
npm install
npm run dev
```

### Simple Static Server
```bash
npm run serve
```

### Production Build
```bash
npm run build
npm run preview
```

## 🎮 Usage

1. **Choose Algorithm** - Select from breadth-first, A*, greedy, etc.
2. **Select Heuristic** - Pick from Manhattan, Linear Conflict, Walking Distance, etc.
3. **Configure Limits** - Set iteration, depth, and time constraints
4. **Input Puzzle State** - Use randomize or custom state input:
   - **Visual Editor** - Click tiles to edit values
   - **Text Input** - Enter 9-digit string (e.g., "012345678")
   - **Presets** - Choose from difficulty-graded configurations
5. **Enable Features** - Toggle Performance Analysis, Real-time Graphs, Education Mode
6. **Search** - Find optimal solution with chosen algorithm/heuristic
7. **Analyze** - View performance metrics and educational insights

## 📈 Performance Features

### Real-time Metrics Dashboard
- **Execution Time** - Algorithm runtime measurement
- **Nodes Expanded** - Search space exploration tracking
- **Memory Usage** - Resource consumption monitoring
- **Solution Quality** - Path cost and length analysis
- **Iteration Count** - Step-by-step progress tracking
- **Frontier Size** - Queue/stack size visualization

### Live Performance Graphs
- **Dynamic Charts** - Real-time visualization of search progress
- **Memory Usage Graphs** - Live memory consumption tracking
- **Expansion Rate** - Node expansion speed analysis

## 🎓 Educational Features

### Interactive Algorithm & Heuristic Guide
- **3-Tab Learning System**:
  - **🔍 Algorithm Tab** - Detailed explanations, steps, pros/cons
  - **🎯 Heuristic Tab** - Mathematical formulas, examples, characteristics
  - **📊 Comparison Tab** - Performance comparison with recommendations

### Smart Learning Features
- **Context-aware Recommendations** - Best algorithm/heuristic combinations
- **Interactive Examples** - Live demonstration of concepts
- **Performance Characteristics** - Complexity, optimality, memory usage analysis
- **Step-by-step Process** - Real-time search visualization with explanations

## 🔧 Technical Details

### Modern Build System
- **Vite** - Fast development and building
- **ES Modules** - Modern JavaScript architecture
- **Hot Reload** - Instant development feedback

### Browser Compatibility
- **Modern Browsers** - Chrome, Firefox, Safari, Edge
- **Mobile Support** - Touch-friendly interface
- **Progressive Enhancement** - Graceful degradation

## 📁 Project Structure

```
8-puzzle-solver/
├── src/
│   ├── index.html          # Main HTML file
│   ├── css/
│   │   └── main.css        # Styling and themes
│   └── js/
│       ├── app.js          # Main application logic
│       ├── game.js         # Game state management
│       ├── search.js       # Search algorithms
│       ├── puzzle.js       # Puzzle operations
│       ├── board.js        # Board visualization
│       ├── visualization.js # Tree visualization
│       ├── education.js    # Educational features
│       ├── performance.js  # Performance tracking
│       ├── accessibility.js # Accessibility features
│       ├── keyboard.js     # Keyboard shortcuts
│       ├── sound.js        # Audio feedback
│       └── utils.js        # Utility functions
├── package.json
├── gulpfile.js
└── README.md
```

## 📝 Algorithm Details

### Heuristic Functions

#### Manhattan Distance
```
h(n) = Σ |current_row - goal_row| + |current_col - goal_col|
```

#### Linear Conflict
```
h(n) = Manhattan + 2 × conflicts
```

#### Walking Distance
```
h(n) = Manhattan + 2 × (vertical_conflicts + horizontal_conflicts)
```

## 🎯 Use Cases

- **Computer Science Education** - Interactive algorithm and heuristic learning
- **Research & Analysis** - Comprehensive performance comparison tools
- **Puzzle Solving** - Optimal solution finding with detailed explanations
- **AI Development** - Search strategy testing and optimization
- **Accessibility Learning** - High contrast mode for visual impairments

## 🎨 Theme System

### Available Themes
- **☀️ Light Mode** - Clean, bright interface
- **🌙 Dark Mode** - Easy on the eyes for extended use
- **⚡ High Contrast** - Accessibility-focused with maximum contrast

### Accessibility Features
- **High Contrast Theme** - Black background with white text and borders
- **Bold Typography** - Enhanced readability in high contrast mode
- **Color-coded Status** - Green/yellow/red indicators for different states
- **Keyboard Navigation** - Full accessibility support

## ⚙️ Configuration

### Available Settings
- **Theme Selection** - Light, Dark, High Contrast modes
- **Animation Speed** - Slow (1.5s), Normal (0.5s), Fast (0.15s)
- **Text Size** - Small, Normal, Large, Extra Large
- **Sound Effects** - Toggle audio feedback on/off
- **Performance Tracking** - Enable/disable metrics collection

### Keyboard Shortcuts
- **Space** - Start/pause search
- **Enter** - Execute search
- **Escape** - Cancel operation
- **Arrow Keys** - Navigate interface elements
- **Tab** - Cycle through controls

## 🐛 Troubleshooting

### Common Issues

#### Server Won't Start
```bash
# Check Python version
python3 --version

# Try alternative port
python3 -m http.server 8080 --directory src
```

#### Performance Issues
- Reduce animation speed to "Fast"
- Disable real-time graphs for complex searches
- Use simpler heuristics for large search spaces

#### Browser Compatibility
- Ensure JavaScript is enabled
- Update to latest browser version
- Clear browser cache and cookies

### Error Messages
- **"Unsolvable puzzle"** - Check if initial state is valid
- **"Memory limit exceeded"** - Reduce search limits or use iterative algorithms
- **"Timeout reached"** - Increase time limits or try faster algorithms

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/8-puzzle-solver.git`
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`
5. Make your changes
6. Test thoroughly
7. Submit a pull request

### Code Style
- Use ES6+ features
- Follow existing naming conventions
- Add comments for complex algorithms
- Maintain responsive design principles

### Testing
- Test on multiple browsers
- Verify accessibility features
- Check performance with various puzzle configurations
- Validate educational content accuracy

## 📄 License

ISC License - Open source and free to use.

---

**Enhanced with advanced heuristics and modern tooling** 🚀