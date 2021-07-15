class Person {
	#privateKey;

	constructor() {
		this.publicKey = {};
		this.#privateKey = {};
	}

	encrypt(msg) {
		msg.encrypt(this.#privateKey);
	}

	decrypt(msg) {
		msg.decrypt(this.#privateKey);
	}
}

class Message {
	#msg;
	#locks = [];

	constructor(msg) {
		this.#msg = msg;
	}

	readMessage() {
		if (this.#locks.length < 1) {
			return this.#msg;
		}
		return null;
	}

	encrypt(key) {
		this.#locks.push(key);
	}

	decrypt(key) {
		const index = this.#locks.indexOf(key);
		if (index >= 0) {
			this.#locks.splice(index, 1);
		}
	}
}

function main() {
	const alice = new Person();
	const bob = new Person();

	const message = new Message("Hello world!");

	// Alice encrypts the message with her private and Bob's public key, then sends it to Bob
	alice.encrypt(message);
	message.encrypt(bob.publicKey);

	// Bob receives the message, decrypts it with his public key, encrypts it with his private key, then sends it back to Alice
	message.decrypt(bob.publicKey);
	bob.encrypt(message);

	// Alice receives it, decrypts it with her private key, encrypts it with her public key, then sends it to Bob
	// After this point, the message is only encrypted with her public and Bob's private key
	alice.decrypt(message);
	message.encrypt(alice.publicKey);

	// So, Bob just decrypts the message
	bob.decrypt(message);
	message.decrypt(alice.publicKey);

	console.log(message.readMessage());
}

main();