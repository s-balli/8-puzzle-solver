# 8-Puzzle Solver Enhanced 🧩

Advanced 8-puzzle solver with comprehensive search algorithms, heuristic functions, educational features, and performance analysis tools.

https://8-puzzle.yapay.us/

## 🎮 Demo

![8-Puzzle Solver Demo](demo.gif)

*Interactive demo showing the main features of the application*


This project is an enhanced version of [https://deniz.co/8-puzzle-solver](https://deniz.co/8-puzzle-solver).


## ✨ Features

### 🔍 Search Algorithms
- **Breadth-First Search** - Optimal solution guarantee with complete exploration
- **Depth-First Search** - Memory efficient depth-first exploration
- **Uniform Cost Search** - Cost-based optimal pathfinding
- **Iterative Deepening** - Combines benefits of BFS and DFS
- **Greedy Best-First** - Heuristic-guided fast solutions
- **A* Search** - Optimal solutions with admissible heuristics

### 🎯 Heuristic Functions
- **Manhattan Distance** - Sum of horizontal and vertical distances
- **Euclidean Distance** - Straight-line geometric distance
- **Misplaced Tiles** - Count of incorrectly positioned tiles
- **Linear Conflict** - Manhattan distance + conflict penalty
- **Walking Distance** - Advanced conflict detection algorithm
- **Corner Tiles** - Structure-aware corner positioning
- **Max Heuristic** - Combination of multiple heuristics

### 📊 Performance Analysis
- **Real-time Metrics** - Live algorithm execution statistics
- **Performance Dashboard** - Comprehensive timing and memory data
- **Real-time Graphs** - Dynamic visualization of search progress
- **Node Expansion Tracking** - Frontier and expanded node monitoring

### 🎓 Educational Features
- **Interactive Tutorial System** - Three difficulty levels:
  - **Beginner**: Breadth-First Search basics
  - **Intermediate**: A* algorithm with Manhattan heuristic
  - **Advanced**: Heuristic comparison with randomizable states
- **Algorithm Guide** - Detailed explanations with pros/cons
- **Heuristic Guide** - Mathematical formulas and examples
- **Performance Comparison** - Algorithm vs heuristic analysis
- **Real-time Explanations** - Step-by-step search process insights

### 🎨 User Interface
- **Multi-Theme System** - Light, Dark, and High Contrast modes
- **Custom State Input** - Manual puzzle configuration
- **Solution Navigation** - Step-by-step solution playback
- **Interactive Board** - Click-to-move tile interface
- **Multi-language Support** - Turkish and English translations
- **Sound Effects** - Audio feedback for interactions
- **Accessibility Features** - Screen reader support and keyboard navigation

### ⌨️ Keyboard Shortcuts
- **Space** - Toggle search (start/stop)
- **Enter** - Start search
- **Escape** - Stop search
- **R** - Randomize puzzle
- **S** - Step through search
- **C** - Open custom input
- **P** - Toggle performance mode
- **V** - Toggle real-time graphs
- **E** - Toggle education mode
- **T** - Cycle themes
- **H / ?** - Show help dialog
- **Arrow Keys** - Navigate solution steps

## 🚀 Quick Start

### Running the Application

#### Option 1: Direct File Access (Recommended for Development)
```bash
# Simply open the HTML file in your browser
open src/index.html
# or double-click on src/index.html
```

#### Option 2: HTTP Server (Recommended for Production)
```bash
# Simple Python server
python3 -m http.server 3000 --directory src

# Or using npm scripts
npm run serve
```

### Browser Requirements
- Modern browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- No additional installations required
- **Offline Support**: Works without internet connection

## 🎮 Usage

1. **Select Algorithm** - Choose from 6 search algorithms
2. **Pick Heuristic** - Select heuristic function (for informed search)
3. **Set Limits** - Configure iteration, depth, and time constraints
4. **Input Puzzle** - Randomize or enter custom 9-digit state
5. **Enable Features** - Toggle performance analysis, graphs, education mode
6. **Start Search** - Find solution and analyze results
7. **Review Solution** - Navigate through solution steps

## 📈 Algorithm Details

### Heuristic Formulas

**Manhattan Distance:**
```
h(n) = Σ |current_row - goal_row| + |current_col - goal_col|
```

**Linear Conflict:**
```
h(n) = Manhattan + 2 × conflicts
```

**Walking Distance:**
```
h(n) = Manhattan + 2 × (vertical_conflicts + horizontal_conflicts)
```

## 📁 Project Structure

```
src/
├── index.html              # Main application
├── favicon.png             # Site icon
├── css/
│   ├── main.css           # Application styles
│   └── vis.min.css        # Visualization styles
└── js/
    ├── vendor/            # Third-party libraries
    │   ├── lodash.min.js
    │   ├── vis.min.js
    │   └── body-scroll-lock.min.js
    ├── app.js             # Main application logic
    ├── game.js            # Game state and heuristics
    ├── search.js          # Search algorithms
    ├── board.js           # Board visualization
    ├── education.js       # Educational features
    ├── performance.js     # Performance tracking
    ├── graphs.js          # Real-time charts
    ├── keyboard.js        # Keyboard shortcuts
    ├── sound.js           # Audio feedback
    ├── i18n.js            # Internationalization
    ├── accessibility.js   # Accessibility features
    └── translations.js    # Language translations
```

## 🎯 Educational Use Cases

- **Computer Science Education** - Interactive algorithm learning
- **AI Research** - Search strategy comparison and analysis
- **Algorithm Visualization** - Step-by-step process understanding
- **Performance Analysis** - Resource usage and optimization study

## 🎨 Accessibility

- **High Contrast Theme** - Maximum visibility for visual impairments
- **Keyboard Navigation** - Full functionality without mouse
- **Screen Reader Support** - ARIA labels and semantic HTML
- **Sound Feedback** - Audio cues for interactions

## 🔧 Technical Features

- **Vanilla JavaScript** - No framework dependencies
- **CSS Custom Properties** - Dynamic theming system
- **Local Storage** - Settings persistence
- **Responsive Design** - Mobile and desktop compatible
- **Performance Optimized** - Efficient data structures and caching

## 🐛 Troubleshooting

### Common Issues
- **Unsolvable Puzzle**: Ensure valid initial state (even inversion count)
- **Slow Performance**: Reduce iteration limits or use simpler heuristics
- **Browser Issues**: Enable JavaScript and use modern browser

### Error Messages
- **"Invalid state format"** - Enter 9-digit string with digits 0-8
- **"Iteration limit reached"** - Increase limit or try different algorithm
- **"Time limit reached"** - Increase timeout or use faster algorithm

## 📄 License

ISC License - Open source and free to use.

## 🙏 Credits

- **Original Project**: [Deniz Gürkaynak](https://github.com/dgurkaynak/8-puzzle-solver) - Base 8-puzzle solver implementation
- **Enhanced Version**: Performance optimizations, security improvements, Turkish language support, and comprehensive documentation

---

**Interactive 8-puzzle solver with educational focus** 🎓

*Enhanced with performance optimizations, security improvements, and comprehensive documentation*
