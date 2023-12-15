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
    treeElement.innerHTML = `<h2 class="tree-title">${treeData.title}</h2>
                             <p class="tree-description">${treeData.description}</p>
                             <div class="points-spent">Points Spent: <span id="pointsSpent${treeName}">${treeData.pointsSpent}</span></div>`;

    const rows = {};
    treeData.talents.forEach(talent => {
      if (!rows[talent.row]) {
        rows[talent.row] = document.createElement('div');
        rows[talent.row].className = 'row';
      }
      rows[talent.row].appendChild(createTalentElement(talent, treeName));
    });

    Object.keys(rows).forEach(row => {
      treeElement.appendChild(rows[row]);
    });

    talentTreesElement.appendChild(treeElement);
  });
}

// Function to create a DOM element for a talent
function createTalentElement(talent, treeName) {
  const container = document.createElement('div');
  container.className = 'talent';
  const image = document.createElement('img');
  image.src = talent.imageUrl;
  image.alt = talent.name;
  image.addEventListener('click', () => allocatePoint(talent, treeName));
  container.appendChild(image);

  var talentImage = document.createElement('img');
  talentImage.src = talent.imageUrl;
  talentImage.alt = talent.name;
  talentImage.title = talent.description; // Tooltip

  const name = document.createElement('p');
  name.textContent = talent.name;
  container.appendChild(name);

  const points = document.createElement('p');
  points.textContent = `Points: ${talent.points}/${talent.maxPoints}`;
  points.id = `points${treeName}${talent.id}`;
  container.appendChild(points);

  // Points display
  var pointsDisplay = document.createElement('p');
  pointsDisplay.id = 'points' + treeName + talent.id;
  pointsDisplay.textContent = `Points: ${talent.points}/${talent.maxPoints}`;
  container.appendChild(pointsDisplay);

  return container;
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
}

// Call this function to initialize the talent trees on page load
document.addEventListener('DOMContentLoaded', () => {
  loadTalentTrees();
});

