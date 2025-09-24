// Function to show an error message in the form
// It finds the error message div in the form and sets its text content

export function displayMessage(message: string, div: HTMLDivElement, type?: "failure" | "success"){
	if (!div)
		return;
	const classesToRemove = ["font-press-start", "text-xl", "text-white", "text-red-400", "text-green-400", "hidden"];
	div.textContent = message;
	div.classList.remove(...classesToRemove);
	div.classList.add("font-press-start", "text-xl");
	if (!type){
		div.classList.add("text-white");
	} else if (type == "failure"){
		div.classList.add("text-red-400");
	} else {
		div.classList.add("text-green-400");
	}
	setTimeout(() => {
		div.classList.remove(...classesToRemove);
      	div.classList.add("hidden");
    }, 2500);
}

export function showError(message: string, form: HTMLFormElement): void {
  const errorDiv = form.querySelector('#error-message');
  if (errorDiv) {
	errorDiv.textContent = message;
	errorDiv.classList.remove("hidden");
	errorDiv.classList.add("font-press-start", "text-xl", "text-red-400");
	setTimeout(()=>{
		errorDiv.classList.add("hidden");
	}, 2500);
  }
}

// Function to show an error message in the div
// It finds the error message div in the div and sets its text content
export function showErrorInDiv(message: string, div: HTMLDivElement): void {
	const errorDiv = div.querySelector('#error-message');
	
	if (errorDiv) {
		errorDiv.classList.remove("hidden");
	  	errorDiv.textContent = message;
		setTimeout(() => {
      		errorDiv.classList.add("hidden");
    	}, 5000);
  }
}

// Function to show a success message in the form
// It finds the success message div in the form and sets its text content
export function showSuccess(message: string, form: HTMLFormElement): void {
  const successDiv = form.querySelector('#success-message');
  if (successDiv) {
	successDiv.textContent = message;
	successDiv.classList.add("font-press-start", "text-xl", "text-green-400");
  }
}

// Function to show a success message in the div
// It finds the success message div in the div and sets its text content
export function showSuccessInDiv(message: string, div: HTMLDivElement): void {
	const successDiv = div.querySelector('#success-message');
	
	if (successDiv) {
		successDiv.classList.remove("hidden");
		successDiv.textContent = message;
		setTimeout(() => {
      		successDiv.classList.add("hidden");
    	}, 5000);
  	}
}

export function switchFromDiv1ToDiv2(div1: HTMLDivElement, div2: HTMLDivElement){
	div1?.classList.add('hidden');
	div2?.classList.remove('hidden');
}