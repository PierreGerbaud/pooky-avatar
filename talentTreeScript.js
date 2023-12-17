// Define row requirements outside of functions so it's accessible everywhere
const rowRequirements = { 1: 0, 2: 5, 3: 10, 4: 15, 5: 20 }; // Extend as needed

// Initialize an empty object to hold the talent tree data
let talentTrees = {};

// Function to fetch and load the talent tree configuration
function loadTalentTrees() {
  fetch('talentTreeConfig.json')
    .then(response => response.json())
    .then(data => {
      talentTrees = data;
      renderTalentTrees();
    })
    .catch(error => console.error('Error loading the talent tree configuration:', error));
}

// Function to render all talent trees
function renderTalentTrees() {
  const talentTreesElement = document.getElementById('talentTrees');
  talentTreesElement.innerHTML = ''; // Clear existing trees

  Object.keys(talentTrees).forEach(treeName => {
    const treeData = talentTrees[treeName];
    const treeElement = document.createElement('div');
    treeElement.className = 'talent-tree';

    // Header elements
    treeElement.innerHTML = `
      <h2 class="tree-title">${treeData.title}</h2>
      <p class="tree-description">${treeData.description}</p>
      <div class="points-spent">Points Spent: <span id="pointsSpent${treeName}">${treeData.pointsSpent}</span></div>
    `;

    // Separator before talents
    const playerLevelSeparator = document.createElement('div');
    playerLevelSeparator.className = 'player-level-separator';
    treeElement.appendChild(playerLevelSeparator);

    const rows = {};
    treeData.talents.forEach(talent => {
      if (!rows[talent.row]) {
        rows[talent.row] = document.createElement('div');
        rows[talent.row].className = 'row';
      }
      rows[talent.row].appendChild(createTalentElement(talent, treeName));
    });

    Object.keys(rows).forEach(rowKey => {
      // Create and prepend the points required label to each row
      const pointsRequiredLabel = document.createElement('div');
      pointsRequiredLabel.className = 'points-required';
      pointsRequiredLabel.textContent = `Requires ${rowRequirements[rowKey]} points in this tree`;
      rows[rowKey].prepend(pointsRequiredLabel);

      treeElement.appendChild(rows[rowKey]); // Append each row to the tree
    });

    talentTreesElement.appendChild(treeElement); // Append the tree to the main element
  });
}

function createTalentElement(talent, treeName) {
  const container = document.createElement('div');
  container.className = 'talent';

  const image = document.createElement('img');
  image.src = talent.imageUrl;
  image.alt = talent.name;
  image.title = talent.description; // Tooltip for the description
  image.addEventListener('click', () => allocatePoint(talent.id, treeName));
  image.addEventListener('contextmenu', (event) => {
    event.preventDefault(); // Prevent the default context menu
    removePoint(talent.id, treeName); // Call removePoint on right click
  });
  container.appendChild(image);

  const name = document.createElement('p');
  name.className = 'talent-name'; // Add this line
  name.textContent = talent.name;
  container.appendChild(name);

  const points = document.createElement('p');
  points.id = `points${treeName}${talent.id}`;
  points.textContent = `Points: ${talent.points}/${talent.maxPoints}`;
  container.appendChild(points);
  return container;
}

// Add this new function to handle point removal
function removePoint(talentId, treeName) {
  let talent = talentTrees[treeName].talents.find(t => t.id === talentId);
  if (talent.points > 0) {
    talent.points--;
    talentTrees[treeName].pointsSpent--;
    updatePointsDisplay(talent, treeName);
    updateTreePointsSpent(treeName);
  }
}

function calculateXPForLevel(level) {
    if (level === 0) return 0;
    let xp = 10;
    for (let i = 1; i < level; i++) {
        xp *= 1.1;
        xp = Math.round(xp);
    }
    return xp;
}

// Function to handle point allocation
function allocatePoint(talentId, treeName) {
  let talent = talentTrees[treeName].talents.find(t => t.id === talentId);
  if (talent.points < talent.maxPoints && canAllocatePoints(talent, treeName)) {
    talent.points++;
    talentTrees[treeName].pointsSpent++;
    updatePointsDisplay(talent, treeName);
    updateTreePointsSpent(treeName);
  }
}

// Function to check if points can be allocated based on row requirements
function canAllocatePoints(talent, treeName) {
  const requiredPoints = rowRequirements[talent.row];
  return talentTrees[treeName].pointsSpent >= requiredPoints;
}

// Function to update the points display for a talent
function updatePointsDisplay(talent, treeName) {
  const talentPointsElement = document.getElementById(`points${treeName}${talent.id}`);
  talentPointsElement.textContent = `Points: ${talent.points}/${talent.maxPoints}`;
}

// Function to update the points spent display for a tree
function updateTreePointsSpent(treeName) {
  const pointsSpentElement = document.getElementById(`pointsSpent${treeName}`);
  pointsSpentElement.textContent = talentTrees[treeName].pointsSpent;
  updatePlayerLevel();
}

function updatePlayerLevel() {
    const totalPointsSpent = Object.values(talentTrees).reduce((total, tree) => total + tree.pointsSpent, 0);
    const playerLevelElement = document.getElementById('playerLevel');
    playerLevelElement.textContent = totalPointsSpent;

    // Update the XP display
    const playerXPElement = document.getElementById('playerXP');
    playerXPElement.textContent = calculateXPForLevel(totalPointsSpent);
}

function calculateXPForLevel(level) {
    let xp = 0;
    for (let i = 1; i <= level; i++) {
        xp += 10 * Math.pow(1.1, i - 1); // Incremental XP based on level
    }
    return Math.floor(xp);
}

// Call this function to initialize the talent trees on page load
document.addEventListener('DOMContentLoaded', () => {
  loadTalentTrees();
});
