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
                             <div class="points-spent">Points Spent: <span id="pointsSpent${treeName}">${treeData.pointsSpent}</span></div>
                             <div class="someClassName">Avatar: <img src={treeData.imageUrl} alt="Avatar Image" /> </div>`;
    const rows = {};
    treeData.talents.forEach(talent => {
      if (!rows[talent.row]) {
        rows[talent.row] = document.createElement('div');
        rows[talent.row].className = 'row';
      }
      rows[talent.row].appendChild(createTalentElement(talent, treeName));
    });

    Object.keys(rows).forEach(rowNumber => {
      const row = rows[rowNumber];
      const requirement = document.createElement('div');
      requirement.className = 'row-requirement';
      requirement.textContent = `Requires ${rowRequirements[rowNumber]} points in this tree`;
      row.insertBefore(requirement, row.firstChild); 
      treeElement.append(row);
      // This adds the requirement text above the row
    });

    talentTreesElement.appendChild(treeElement);
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
