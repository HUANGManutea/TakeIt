function Circularlist(){
	this.list =  [];
	for (var i = 0; i < arguments.length; i++) {
		this.list.push(arguments[i]);
	}
}

Circularlist.prototype.get = function(index){
	var realIndex;
	if(index==0){
		return this.list[0];
	}else{
		if(index>0){

		realIndex = index % this.list.length;
		return this.list[realIndex];

		}else{

			realIndex = (-index-1)% this.list.length;
			var templist = [];
			for (var i = 0; i < this.list.length; i++) {
				templist[i] = this.list[i];
			}
			templist.reverse();
			return templist[realIndex];
		}
	}
}

Circularlist.prototype.first = function(){
	return this.list[0];
}

Circularlist.prototype.last = function(){
	return this.list[this.list.length-1];
}

Circularlist.prototype.push = function(element){
	return this.list.push(element);
}

Circularlist.prototype.pop = function(){
	return this.list.pop();
}

Circularlist.prototype.toString = function(){
	var res = "";
	for (var i = 0; i < this.list.length; i++) {
		res += this.list[i];
	}
	return res;
}

Circularlist.prototype.length = function(){
	return this.list.length;
}

Circularlist.prototype.next = function(element){
	var curindex = this.list.indexOf(element);
	if(curindex!=this.list.length){
		return this.get(curindex+1);
	}else{
		return this.first();
	}
}

Circularlist.prototype.pred = function(element){
	var curindex = this.list.indexOf(element);
	if(curindex!=0){
		return this.get(curindex-1);
	}else{
		return this.last();
	}
}

Circularlist.prototype.isNear = function (insideList,outsideList){
	return (outsideList==this.pred(insideList)||outsideList==this.next(insideList));
}

/*
function test(){
	var circtest = new Circularlist("a","b","c","d","e");
	console.log("first "+ circtest.first());
	console.log("last "+ circtest.last());
	console.log("init "+circtest.toString());
	console.log("length "+circtest.length());
	circtest.push("f");
	console.log("push f => "+circtest.toString());
	circtest.pop();
	console.log("pop => "+circtest.toString());
	console.log("get 2 => "+circtest.get(2));
	console.log("get -2 => "+circtest.get(-2));
	console.log("next to c => "+circtest.next("c"));
	console.log("pred to c => "+circtest.pred("c"));
	console.log("next to e => "+circtest.next("e"));
	console.log("pred to a => "+circtest.pred("a"));
	console.log("e isNear a > "+(circtest.isNear("a","e")));
	console.log("null isNear a > "+(circtest.isNear("a",null)));
	console.log("d isNear a > "+(circtest.isNear("a","d")));
}

test();*/
