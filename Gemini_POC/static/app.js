// Animate landing → main UI with fade-out
window.addEventListener('load', () => {
  setTimeout(() => {
    const landing = document.getElementById('landingScreen');
    landing.style.opacity = '0';
    landing.style.pointerEvents = 'none';

    setTimeout(() => {
      landing.classList.add('hidden');
      document.getElementById('mainContainer').classList.remove('hidden');
    }, 500); // wait for fade to complete
  }, 3500); // initial wait before hiding landing
});

// Submit handler
document.getElementById('submitBtn').addEventListener('click', async () => {
  const full_name = document.getElementById('full_name').value.trim();
  const country = document.getElementById('country').value.trim();
  const dob = document.getElementById('dob').value.trim();
  const city = document.getElementById('city').value.trim();

  if (!full_name || !country || !dob || !city) {
    alert("Please fill all fields.");
    return;
  }

  document.getElementById('loadingOverlay').classList.add('show');

  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name, country, dob, city })
    });

    const data = await response.json();
    const outputs = data.sas_response.outputs;

    const getVal = (key) => {
  const val = outputs.find(o => o.name === key);
  return (val && val.value !== undefined && val.value !== null) ? val.value : '';
};


    const riskLevel = getVal('Output_RiskTypeLevel');
    document.getElementById('outputName').innerText = getVal('Output_Name');
    document.getElementById('outputRiskTypeLevel').innerText = riskLevel;
    document.getElementById('outputRiskTypeLevel').className = `risk-level-badge ${riskLevel}`;

    document.getElementById('outputCountryName').innerText = getVal('Output_Country_Name');
    document.getElementById('outputScore').innerText = getVal('Output_Score');
    document.getElementById('outputSummary').innerText = getVal('Output_Summary');
    document.getElementById('outputRiskNarrative').innerText = getVal('Output_RiskNarrative');
    document.getElementById('outputCategory').innerText = getVal('Output_Category');
    document.getElementById('outputConfidence').innerText = getVal('Output_Confidence');
    document.getElementById('outputKeywords').innerText = getVal('Output_Keywords');

    const sourcesRaw = getVal('Output_Source');
    const sourceList = sourcesRaw.split(/\s*,\s*/).filter(s => s);
    const sourceLinks = sourceList.map(link => `<li><a href="${link}" target="_blank">${link}</a></li>`).join('');
    document.getElementById('outputSource').innerHTML = `<ul>${sourceLinks}</ul>`;

    document.getElementById('formContainer').classList.add('hidden');
    document.getElementById('outputContainer').classList.remove('hidden');
  } catch (error) {
    alert("Something went wrong. Please try again.");
    console.error(error);
  } finally {
    document.getElementById('loadingOverlay').classList.remove('show');
  }
});

// Toggle source view
document.getElementById('viewSourcesBtn').addEventListener('click', () => {
  document.getElementById('outputSource').classList.toggle('hidden');
});

// Back button
document.getElementById('backBtn').addEventListener('click', () => {
  document.getElementById('outputContainer').classList.add('hidden');
  document.getElementById('formContainer').classList.remove('hidden');
});
