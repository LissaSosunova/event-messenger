class TransferService {
	constructor () {
		this.data = {}
	}
	setData (params) {
		this.data[params.name] = params.data;
	}
	getData (name) {
		return this.data[name];
	}
}
const transfer = new TransferService ();
module.exports = transfer;