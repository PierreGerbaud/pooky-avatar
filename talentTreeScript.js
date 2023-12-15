<script>
  var talentTrees = {
    ScoreFocus: {
      title: 'Football only',
      description: 'More impact of score prediction, less impact of boosters.',
      pointsSpent: 0,
      talents: [
        { id: '1', 
          name: 'Aggression', 
          points: 0, 
          maxPoints: 5, 
          imageUrl: 'path_to_image1', 
          description: 'Increases attack power.', 
          row: 1 
        },
        // ... more talents for tree1
      ],
    },
    
    BoosterConsistency: {
      title: 'Booster control',
      description: 'Gain more control over your boosters.',
      pointsSpent: 0,
      talents: [
        { id: '2', 
          name: 'Aggression', 
          points: 0, 
          maxPoints: 5, 
          imageUrl: 'path_to_image1', 
          description: 'Increases attack power.', 
          row: 1 
        },        // ... more talents for tree2
      ],
    },

    Explosiveness: {
      title: 'Explosive effects',
      description: 'Embrace more randomness and spikes!',
      pointsSpent: 0,
      talents: [
        { id: '3', 
          name: 'Aggression', 
          points: 0, 
          maxPoints: 5, 
          imageUrl: 'path_to_image1', 
          description: 'Increases attack power.', 
          row: 1 
        },        // ... more talents for tree3
      ],
    },


    // Add more trees (tree2, tree3, etc.) as needed 
  };

  function calculatePlayerLevel() {
    return Object.values(talentTrees).reduce((sum, tree) => sum + tree.pointsSpent, 0);
  }

  function calculateXP(level) {
    let xp = 0;
    for (let k = 0; k < level; k++) {
      xp += 10 * Math.pow(1.1, k);
    }
    return xp;
  }

  function updatePlayerInfo() {
    const level = calculatePlayerLevel();
    const xp = calculateXP(level);
    document.getElementById('playerLevel').textContent = level;
    document.getElementById('playerXP').textContent = xp.toFixed(0);
  }

  function allocatePoint(talentId, treeName) {
    var talent = talentTrees[treeName].talents.find(t => t.id === talentId);
    if (talent && talent.points < talent.maxPoints) {
      talent.points++;
      talentTrees[treeName].pointsSpent++;
      updatePlayerInfo();
      updateTreePoints(treeName);
      document.getElementById('points' + treeName + talentId).textContent = talent.points;
    }
  }

  function removePoint(event, talentId, treeName) {
    event.preventDefault();
    var talent = talentTrees[treeName].talents.find(t => t.id === talentId);
    if (talent && talent.points > 0) {
      talent.points--;
      talentTrees[treeName].pointsSpent--;
      updatePlayerInfo();
      updateTreePoints(treeName);
      document.getElementById('points' + treeName + talentId).textContent = talent.points;
    }
  }

  function updateDescription(talentId, treeName, newDescription) {
    var talent = talentTrees[treeName].talents.find(t => t.id === talentId);
    if (talent) {
      talent.description = newDescription;
    }
  }

  function updateTreePoints(treeName) {
    const pointsSpent = talentTrees[treeName].pointsSpent;
    document.getElementById('treePoints' + treeName).textContent = `Points Spent: ${pointsSpent}`;
  }

  function createTalentElement(talent, treeName) {
    var container = document.createElement('div');
    container.className = 'talent';
    container.innerHTML = `
      <img src="${talent.imageUrl}" alt="${talent.name}" 
           onclick="allocatePoint('${talent.id}', '${treeName}')" 
           oncontextmenu="removePoint(event, '${talent.id}', '${treeName}')">
      <p>${talent.name}</p>
      <p>Points: <span id="points${treeName}${talent.id}">${talent.points}</span>/${talent.maxPoints}</p>
      <p><input type="text" value="${talent.description}" onchange="updateDescription('${talent.id}', '${treeName}', this.value)"></p>
    `;
    return container;
  }

  function renderTalentTrees() {
    var talentTreesElement = document.getElementById('talentTrees');
    talentTreesElement.innerHTML = '';
    Object.keys(talentTrees).forEach(treeName => {
      var treeData = talentTrees[treeName];
      var treeElement = document.createElement('div');
      treeElement.className = 'talent-tree';
      treeElement.innerHTML = `<h2 class="tree-title">${treeData.title}</h2>
                               <p class="tree-description">${treeData.description}</p>
                               <div id="treePoints${treeName}">Points Spent: ${treeData.pointsSpent}</div>`;
      
      var rows = {};
      treeData.talents.forEach(talent => {
        rows[talent.row] = rows[talent.row] || document.createElement('div');
        rows[talent.row].className = 'row';
        rows[talent.row].appendChild(createTalentElement(talent, treeName));
      });

      Object.keys(rows).forEach(row => {
        treeElement.appendChild(rows[row]);
      });

      talentTreesElement.appendChild(treeElement);
    });
  }

  function addTalentToTree(treeName, talent) {
    if (talentTrees[treeName]) {
      talentTrees[treeName].talents.push(talent);
      talentTrees[treeName].pointsSpent += talent.points; // Update pointsSpent
      renderTalentTrees();
      updatePlayerInfo(); // Update player info after adding a talent
    } else {
      alert("Tree name does not exist. Please enter a valid tree name.");
    }
  }

  function createTalentFromInputs() {
    const treeName = document.getElementById('inputTreeName').value;
    const id = document.getElementById('inputId').value;
    const name = document.getElementById('inputName').value;
    const maxPoints = parseInt(document.getElementById('inputMaxPoints').value, 10);
    const imageUrl = document.getElementById('inputImageUrl').value;
    const description = document.getElementById('inputDescription').value;
    const row = parseInt(document.getElementById('inputRow').value, 10);

    return { id, name, points: 0, maxPoints, imageUrl, description, row };
  }

  function addTalent() {
    const talent = createTalentFromInputs();
    const treeName = document.getElementById('inputTreeName').value;
    addTalentToTree(treeName, talent);
  }


  function renderTalentEditTable() {
    const table = document.getElementById('talentEditTable');
    let rows = `<tr>
                  <th>Tree Name</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Max Points</th>
                  <th>Image URL</th>
                  <th>Description</th>
                  <th>Row</th>
                  <th>Action</th>
                </tr>`;

    Object.keys(talentTrees).forEach((treeName) => {
      talentTrees[treeName].talents.forEach((talent, index) => {
        rows += `<tr>
                  <td>${treeName}</td>
                  <td>${talent.id}</td>
                  <td><input type="text" value="${talent.name}" onchange="updateTalentProperty('${treeName}', ${index}, 'name', this.value)"></td>
                  <td><input type="number" value="${talent.maxPoints}" onchange="updateTalentProperty('${treeName}', ${index}, 'maxPoints', parseInt(this.value))"></td>
                  <td><input type="text" value="${talent.imageUrl}" onchange="updateTalentProperty('${treeName}', ${index}, 'imageUrl', this.value)"></td>
                  <td><input type="text" value="${talent.description}" onchange="updateTalentProperty('${treeName}', ${index}, 'description', this.value)"></td>
                  <td><input type="number" value="${talent.row}" onchange="updateTalentProperty('${treeName}', ${index}, 'row', parseInt(this.value))"></td>
                  <td><button onclick="removeTalent('${treeName}', ${index})">Remove</button></td>
                </tr>`;
      });
    });

    table.innerHTML = rows;
  }

  function updateTalentProperty(treeName, talentIndex, property, newValue) {
    talentTrees[treeName].talents[talentIndex][property] = newValue;
    renderTalentTrees();
  }

  function removeTalent(treeName, talentIndex) {
    talentTrees[treeName].talents.splice(talentIndex, 1);
    renderTalentTrees(); // Re-render the talent trees
    renderTalentEditTable(); // Re-render the edit table
  }

  function addNewTalentRow() {
    const table = document.getElementById('talentEditTable');
    const newRow = table.insertRow(-1);
    newRow.innerHTML = `
      <td><input type="text" value="tree1"></td>
      <td><input type="text"></td>
      <td><input type="text"></td>
      <td><input type="number" value="5"></td>
      <td><input type="text"></td>
      <td><input type="text"></td>
      <td><input type="number" value="1"></td>
      <td><button onclick="saveNewTalent(this)">Save</button></td>
    `;
  }

  function saveNewTalent(buttonElement) {
    const row = buttonElement.parentNode.parentNode;
    const inputs = row.getElementsByTagName('input');
    const newTalent = {
      id: inputs[1].value,
      name: inputs[2].value,
      points: 0,
      maxPoints: parseInt(inputs[3].value, 10) || 0,
      imageUrl: inputs[4].value,
      description: inputs[5].value,
      row: parseInt(inputs[6].value, 10) || 0
    };
    const treeName = inputs[0].value;
    if (!(treeName in talentTrees)) {
      alert("Tree name does not exist. Please enter a valid tree name.");
      return;
    }
    addTalentToTree(treeName, newTalent);
    row.remove(); // Remove the row after saving the new talent
  }

  renderTalentTrees();
  renderTalentEditTable();
</script>