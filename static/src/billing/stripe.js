// Create a Stripe client
var stripe = Stripe('@@stripe_public_key');

// Create an instance of Elements
var elements = stripe.elements();

// Create references to the main form and its submit button.
const form = document.getElementById('payment-form');
const submitButton = document.getElementById('pay-button');


// Custom styling can be passed to options when creating an Element.
// (Note that this demo uses a wider set of styles than the guide below.)
var style = {
  base: {
    color: '#343434',
    lineHeight: '22px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',

    fontSmoothing: 'antialiased',
    fontSize: '18px',
    '::placeholder': {
      color: '#aab7c4'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
};

// Create a Card Element and pass some custom styles to it.
const card = elements.create('card', {
  style: style,
});

// Mount the Card Element on the page.
card.mount('#card-element');

// Monitor change events on the Card Element to display any errors.
card.addEventListener('change', ({
  error
}) => {
  const cardErrors = document.getElementById('card-errors');
  cardErrors.textContent = error ? error.message : '';
  cardErrors.classList.toggle('visible', error);
  // Reenable the Pay button.
  submitButton.disabled = false;
});


/**
 * Handle the form submission.
 *
 * This creates an order and either sends the card information from the Element
 * alongside it, or creates a Source and start a redirect to complete the purchase.
 *
 * Please note this form is not submitted when the user chooses the "Pay" button
 * or Apple Pay since they provide name and shipping information directly.
 */

// Listen to changes to the user-selected country.
form
  .querySelector('select[name=country]')
  .addEventListener('change', event => {
    event.preventDefault();
    const country = event.target.value;
    const zipLabel = form.querySelector('label.zip');
    // Only show the state input for the United States.
    zipLabel.parentElement.classList.toggle('with-state', country === 'US');
    // Update the ZIP label to make it more relevant for each country.
    form.querySelector('label.zip span').innerText =
      country === 'US' ?
      'ZIP' :
      country === 'UK' ? 'Postcode' : 'Postal Code';
    event.target.parentElement.className = `field ${country}`;
  });

// Submit handler for our payment form.
form.addEventListener('submit', async event => {
  event.preventDefault();

  // Retrieve the user information from the form.
  const name = form.querySelector('input[name=name]').value;
  const country = form.querySelector('select[name=country] option:checked')
    .value;
  const email = form.querySelector('input[name=email]').value;
  const billing = {
    "name": name,
    "address_line1": form.querySelector('input[name=address]').value,
    "address_city": form.querySelector('input[name=city]').value,
    "address_state": form.querySelector('input[name=state]').value,
    "address_zip": form.querySelector('input[name=postal_code]').value,
    "address_country": country,
  };
  // Disable the Pay button to prevent multiple click events.
  submitButton.disabled = true;
  submitButton.style.opacity = 0.5;
  submitButton.textContent = "Processing payment...";

  // Create a Stripe source from the card information and the owner name.
  const token = await stripe.createToken(card, billing);
  console.log(token);

  if (token.token) {
    // determine the host
    // this points us to the right billing api
    
    var host = function(currentHost) {
      if (currentHost.includes("www")) {
        return currentHost.replace("www", "api");
      }

      return "api." + currentHost;
    }(window.location.host);


    // send the token and other params
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', 'https://' + host + '/submit_billing');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
      if (xhr.status === 200) {

        console.log(xhr.response);

        var response = JSON.parse(xhr.response);

        if (response.hasOwnProperty("success")) {
          submitButton.textContent = "Success";
          submitButton.style.backgroundColor = "#5bc894";
          submitButton.style.opacity = 1.0;

          const tierCard = document.getElementById('tier-card');
          tierCard.classList.toggle("visuallyhidden");

          const checkout = document.getElementById('checkout');
          checkout.classList.toggle("visuallyhidden");

          const success = document.getElementById('success');
          success.style = "display: grid;";

          setTimeout(function () {
            tierCard.style = "display: none;";
            checkout.style = "display: none;";
            window.scrollTo(0,0);
          }, 20);

        } else {
          const cardErrors = document.getElementById('card-errors');
          cardErrors.textContent = "Error sending payment info. Please contact support@krypt.co to resolve this issue.";
          cardErrors.classList.toggle('visible', true);
          submitButton.textContent = "Submit Payment";
          submitButton.style.opacity = 1.0;
          submitButton.disabled = false;
        }
      } else {
        const cardErrors = document.getElementById('card-errors');
        cardErrors.textContent = "Error sending payment info: status " + xhr.status + ". Please try again";
        cardErrors.classList.toggle('visible', true);
        submitButton.textContent = "Submit Payment";
        submitButton.style.opacity = 1.0;
        submitButton.disabled = false;
      }
    };

    var adminID = getParameterByName("aid");
    if (!adminID) {
      console.log("missing admin id param");
    }

    var teamID = getParameterByName("tid");
    if (!teamID) {
      console.log("missing team id param");
    }


    xhr.send(JSON.stringify({
      "stripe_token": token.token.id,
      "tier": "pro",
      "aid": adminID,
      "tid": teamID,
      "payer_email": email
    }));
  } else {
    const cardErrors = document.getElementById('card-errors');
    cardErrors.textContent = token.error ? token.error.message : '';
    cardErrors.classList.toggle('visible', token.error);
    submitButton.textContent = "Submit Payment";
    submitButton.style.opacity = 1.0;
    submitButton.disabled = false;
  }
});


// Select the default country from the config on page load.
const countrySelector = document.getElementById('country');
countrySelector.querySelector(`option[value=US]`).selected =
  'selected';
countrySelector.className = `field US`;

// helper functions
//https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
function copyTextToClipboard(text) {
	var textArea = document.createElement("textarea");

	// Place in top-left corner of screen regardless of scroll position.
	textArea.style.position = 'fixed';
	textArea.style.top = 0;
	textArea.style.left = 0;

	// Ensure it has a small width and height. Setting to 1px / 1em
	// doesn't work as this gives a negative w/h on some browsers.
	textArea.style.width = '2em';
	textArea.style.height = '2em';

	// We don't need padding, reducing the size if it does flash render.
	textArea.style.padding = 0;

	// Clean up any borders.
	textArea.style.border = 'none';
	textArea.style.outline = 'none';
	textArea.style.boxShadow = 'none';

	// Avoid flash of white box if rendered for any reason.
	textArea.style.background = 'transparent';


	textArea.value = text;

	document.body.appendChild(textArea);

	textArea.select();

	try {
		var successful = document.execCommand('copy');
	} catch (err) {
		console.log('unable to copy');
	}

	document.body.removeChild(textArea);
}
