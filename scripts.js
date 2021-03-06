var na = document.getElementById("nax");
var nb = document.getElementById("nby");
var nc = document.getElementById("nc");
var ans = document.getElementById("answer");

na.oninput = numChanged;
nb.oninput = numChanged;
nc.oninput = numChanged;

calc();

function numChanged(e){
	var el = e.target.value.length;
	e.target.style.width = (2+((el>3) ? (0.6*(el-3)) : 0)) + "em";

	calc();
}

function calc(){
	var signs = [a,b,c].map(Math.sign);
	var a = Math.abs(Math.floor(parseInt(na.value)));
	var b = Math.abs(Math.floor(parseInt(nb.value)));
	var c = Math.floor(parseInt(nc.value));
	if (isNaN(a+b+c)) return;
	var eea = [], swap = (a<b);

	if (swap){
		eea[0] = [b, 0, 1, 0];
		eea[1] = [a, Math.floor(b/a), 0, 1];
	} else{
		eea[0] = [a, 0, 1, 0];
		eea[1] = [b, Math.floor(a/b), 0, 1];
	}

	/* change for to unite with swap  and remove q from here ^ */ 

	for (var i=2; i<1000; i++){
		eea[i] = [];
		eea[i][0] = eea[i-2][0] % (eea[i-1][0]*eea[i-1][1]);
		eea[i][1] = (eea[i][0]!=0) ? Math.floor(eea[i-1][0]/eea[i][0]) : "-";
		eea[i][2] = eea[i-2][2] - (eea[i-1][2] * eea[i-1][1]);
		eea[i][3] = eea[i-2][3] - (eea[i-1][3] * eea[i-1][1]);

		if (eea[i][0] == 0) break;
	}
	fillTable(eea);

	var x0, y0,
		xi = eea[i-1][2],
		yi = eea[i-1][3],
		gcd = eea[i-1][0];

	if (c % gcd != 0){
		ans.innerHTML = "No solution. " + gcd + " is not a divisor of " + c+"!";
		return;
	}

	if (swap){
		var tmp = xi;
		xi = yi;
		yi = tmp;
	}

	x0 = (c/gcd)*xi;
	y0 = (c/gcd)*yi;

	ans.innerHTML = a+"("+xi+")"+" + "+b+"("+yi+")"+" = "+gcd;
	ans.innerHTML += "<br/>"+a+"("+x0+")"+" + "+b+"("+y0+")"+" = "+c/gcd;
	ans.innerHTML += "<br/>x<sub>0</sub>="+x0+", y<sub>0</sub>="+y0;
	ans.innerHTML += "<br/>x = "+x0+" + "+(b/gcd)+"t<br/>y = "+y0+" - "+(a/gcd)+"t";

	// do the translation :D
}


function fillTable(info){
	var tr, td, tab = document.getElementById("tab");
	while(tab.rows.length > 0) tab.deleteRow(0);

	var titles = "irqxy";
	tr = tab.insertRow();
	for (var i=0; i<titles.length; i++){
		td = tr.insertCell();
		td.innerHTML = titles[i] + ((i>0) ? "<sub>i</sub>" : "");
	}

	for (var i=0; i<info.length; i++){
		tr = tab.insertRow();
		td = tr.insertCell();
		td.innerHTML = i;
		for (var j=0; j<4; j++){
			td = tr.insertCell();
			td.innerHTML = info[i][j];
		}
	}

}