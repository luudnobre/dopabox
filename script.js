let balance = 0;
let rewards = [];
let history = [];

const balanceEl = document.getElementById('dopamina-balance');
const rewardListEl = document.getElementById('reward-list');
const historyListEl = document.getElementById('history-list');

const successSound = document.getElementById('sound-success');
const errorSound = document.getElementById('sound-error');
const rewardSound = document.getElementById('sound-reward');

function updateBalanceUI() {
  balanceEl.innerText = balance;
  localStorage.setItem('dopamina-balance', balance);
}

function saveRewards() {
  localStorage.setItem('dopamina-rewards', JSON.stringify(rewards));
}

function saveHistory() {
  localStorage.setItem('dopamina-history', JSON.stringify(history));
}

function loadFromStorage() {
  balance = parseInt(localStorage.getItem('dopamina-balance')) || 0;
  rewards = JSON.parse(localStorage.getItem('dopamina-rewards')) || [];
  history = JSON.parse(localStorage.getItem('dopamina-history')) || [];

  updateBalanceUI();
  renderRewards();
  renderHistory();
}

function depositDopamina() {
  const activity = document.getElementById('deposit-activity').value;
  const value = parseInt(document.getElementById('deposit-value').value);

  if (!activity || isNaN(value) || value <= 0) {
    errorSound.play();
    return alert('❌ Atividade e valor válidos são necessários!');
  }

  balance += value;
  updateBalanceUI();
  successSound.play();
  alert(`🎉 Você ganhou ${value} dopaminas por: ${activity}`);

  const entry = {
    activity,
    value,
    timestamp: new Date().toLocaleString()
  };

  history.push(entry);
  saveHistory();
  renderHistory();
}

function addHistoryToUI(entry, index) {
  const li = document.createElement('li');
  li.innerHTML = `🟢 ${entry.timestamp}: ${entry.activity} (+${entry.value} 💰)
    <button onclick="deleteHistory(${index})">🗑️</button>`;
  historyListEl.appendChild(li);
}

function renderHistory() {
  historyListEl.innerHTML = '';
  history.forEach((entry, i) => addHistoryToUI(entry, i));
}

function deleteHistory(index) {
  if (confirm("Deseja remover esta atividade do histórico?")) {
    history.splice(index, 1);
    saveHistory();
    renderHistory();
  }
}

function addReward() {
  const activity = document.getElementById('reward-activity').value;
  const cost = parseInt(document.getElementById('reward-cost').value);

  if (!activity || isNaN(cost) || cost <= 0) {
    errorSound.play();
    return alert('❌ Recompensa e valor válidos são necessários!');
  }

  const reward = { activity, cost, redeemed: false };
  rewards.push(reward);
  saveRewards();
  renderRewards();
}

function renderRewards() {
  rewardListEl.innerHTML = '';
  rewards.forEach((reward, i) => addRewardToUI(reward, i));
}

function addRewardToUI(reward, index) {
  const li = document.createElement('li');

  const redeemBtn = reward.redeemed
    ? `<button disabled>Liberado ✅</button>`
    : `<button onclick="redeemReward(${reward.cost}, ${index}, this)">Pagar 🤑</button>`;

  li.innerHTML = `
    ${reward.activity} - ${reward.cost} 💰
    ${redeemBtn}
    <button onclick="deleteReward(${index})">🗑️</button>
  `;

  rewardListEl.appendChild(li);
}

function redeemReward(cost, index, btn) {
  if (balance < cost) {
    errorSound.play();
    return alert('😢 Saldo insuficiente!');
  }

  balance -= cost;
  rewards[index].redeemed = true;
  updateBalanceUI();
  saveRewards();
  rewardSound.play();

  alert('🎁 Atividade liberada! Aproveite!');
  btn.disabled = true;
  btn.innerText = 'Liberado ✅';
}

function deleteReward(index) {
  if (confirm("Tem certeza que deseja excluir esta recompensa?")) {
    rewards.splice(index, 1);
    saveRewards();
    renderRewards();
  }
}

loadFromStorage();
