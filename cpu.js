let uShort = a => (a % 65536 + 65536) % 65536;
let sShort = a => uShort(a - 32768) - 32768;

let as = Array(65536).fill(0);
[
	0b1000000000010010,
	0b1011000000000001
].forEach((e, i) => as[i] = e);

let reg = [0, 0, 0, 0]; // registers

function calcMath(c) {
	let f = (c >> 4) & 15;

	if (f < 4) {
		let z;
		switch (c % 4) {
			case 0:
				z = 0; break;
			case 1:
				z = reg[1]; break;
			case 2:
				z = reg[0]; break;
			case 3:
				z = reg[2]; break;
			default:
				throw 'z address calcs no good';
		}
		if (c & 4) z = ~z;

		switch (f) {
			case 0:
				return z;
			case 1:
				return z + 1;
			case 2:
			case 3:
				console.warn("bin dec unfinished"); break;
			default:
				throw 'z opcode calcs no good';
		}
	}
	else {
		let x = reg[1];
		let y = (c & 1) ? reg[2] : reg[0];
		if (c & 2) x = ~x;
		if (c & 4) y = ~y;

		if (f & 8)
			switch (f) {
				case 4:
					return x | y;
				case 5:
					return x ^ y;
				case 6:
					return x + y;
				case 7:
					console.warn("no instruction!"); break;
				//case 8:
				//	return x % y;
				//case 9:
				//	return y % x;
				default:
					switch ((f >> 1) % 4) {
						//case 2:

						//case 3:

						//case 4:

						default:
							throw 'xy opcode calcs no good';
					}
			}
	}
	throw "no return was hit, operation wasn't executed";
}

function instruction(c) {
	if (c & 0x8000) {
		let math = calcMath(c); // ===================================================needs to become signed short here
		if (c & 8) math = ~math;

		if (c & 0x400) {
			if (c & (1 << (13 + //change the 12 later
				(math > 0) - (math < 0) // math <=> 0
			))) c = reg[0];
		}
		else {
			reg[(c >> 12) & 7] = math;
			return;
		}
	} else
		reg[0] = c;
	reg[4]++;
}

function tick() {
	//std::string file;
	//function(short[65536]{1,2,3});
	//std::cout << r_cast<short[65536]>(file.data());

	//std::cout << std::string(reinterpret_cast<char*>(as.data()), 131072); //as to string
	for (let i = 0; i < 64; i++) {
		reg[2] = as[reg[0]];
		instruction(as[reg[3]]);
	}
	console.log(reg);
}
setInterval(tick, .001);