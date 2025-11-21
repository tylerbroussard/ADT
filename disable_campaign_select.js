const button = document.getElementById('comboboxButton_newCallCampaigns');
const buttonText = document.getElementById('comboboxButtonText_newCallCampaigns');

function updateButtonState() {
  if (buttonText && buttonText.textContent.trim() === 'Outbound') {
    button.disabled = true;
    button.setAttribute('aria-disabled', 'true');
    console.log('Button disabled');
  } else {
    button.disabled = false;
    button.setAttribute('aria-disabled', 'false');
    console.log('Button enabled');
  }
}

updateButtonState();

const observer = new MutationObserver(updateButtonState);
observer.observe(buttonText, { childList: true, characterData: true, subtree: true });
