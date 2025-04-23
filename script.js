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

  rewards.forEach(addRewardToUI);
  history.forEach(addHistoryToUI);
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
  addHistoryToUI(entry);
}

function addHistoryToUI(entry) {
  const li = document.createElement('li');
  li.textContent = `🟢 ${entry.timestamp}: ${entry.activity} (+${entry.value} 💰)`;
  historyListEl.appendChild(li);
}

function addReward() {
  const activity = document.getElementById('reward-activity').value;
  const cost = parseInt(document.getElementById('reward-cost').value);

  if (!activity || isNaN(cost) || cost <= 0) {
    errorSound.play();
    return alert('❌ Recompensa e valor válidos são necessários!');
  }

  const reward = { activity, cost };
  rewards.push(reward);
  saveRewards();
  addRewardToUI(reward);
}

function addRewardToUI({ activity, cost }) {
  const li = document.createElement('li');
  li.innerHTML = `${activity} - ${cost} 💰 <button onclick="redeemReward(${cost}, this)">Pagar 🤑</button>`;
  rewardListEl.appendChild(li);
}

function redeemReward(cost, btn) {
  if (balance < cost) {
    errorSound.play();
    return alert('😢 Saldo insuficiente!');
  }

  balance -= cost;
  updateBalanceUI();
  rewardSound.play();
  alert('🎁 Atividade liberada! Aproveite!');
  btn.disabled = true;
  btn.innerText = 'Liberado ✅';
}

loadFromStorage();
