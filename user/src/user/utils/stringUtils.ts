// Function to append an error message to a base message
// If the base message is empty, it returns the new message
// Otherwise, it appends the new message to the base message with a newline
export function appendString(base: string, message: string): string {
	return base ? base + "\n" + message : message;
}
